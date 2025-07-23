<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Servicio de autenticación para WorldSkills 2025
 * Maneja registro, login, tokens y validaciones
 */
class AuthService
{
    /**
     * Registrar nuevo usuario
     */
    public function register(array $data): array
    {
        // Validar que el email no exista
        if (User::where('email', $data['email'])->exists()) {
            throw ValidationException::withMessages([
                'email' => ['El email ya está registrado']
            ]);
        }

        // Crear usuario
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'email_verified_at' => now(), // Auto-verificar para MVP
        ]);

        // Asignar rol por defecto
        $user->assignRole('user');

        // Generar token
        $token = $user->createToken('auth-token', ['*'], now()->addMinutes(config('sanctum.expiration', 60)))->plainTextToken;

        return [
            'user' => $user->fresh()->load('roles'),
            'token' => $token
        ];
    }

    /**
     * Login de usuario
     */
    public function login(array $credentials): ?array
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return null;
        }

        // Verificar si el usuario está activo
        if (!$user->active) {
            throw ValidationException::withMessages([
                'email' => ['La cuenta está desactivada']
            ]);
        }

        // Revocar tokens anteriores si se requiere login único
        if (config('auth.single_session', false)) {
            $user->tokens()->delete();
        }

        // Crear nuevo token
        $token = $user->createToken(
            'auth-token',
            ['*'],
            now()->addMinutes(config('sanctum.expiration', 60))
        )->plainTextToken;

        // Actualizar último login
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => request()->ip()
        ]);

        return [
            'user' => $user->fresh()->load('roles'),
            'token' => $token
        ];
    }

    /**
     * Refresh token del usuario
     */
    public function refreshToken(User $user): array
    {
        // Revocar token actual
        $user->currentAccessToken()->delete();

        // Crear nuevo token
        $token = $user->createToken(
            'auth-token',
            ['*'],
            now()->addMinutes(config('sanctum.expiration', 60))
        )->plainTextToken;

        return [
            'token' => $token
        ];
    }

    /**
     * Validar fuerza de contraseña
     */
    public function validatePasswordStrength(string $password): bool
    {
        // Mínimo 8 caracteres, al menos una mayúscula, minúscula y número
        return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/', $password);
    }

    /**
     * Generar código de verificación
     */
    public function generateVerificationCode(): string
    {
        return sprintf('%06d', mt_rand(100000, 999999));
    }

    /**
     * Verificar código 2FA (simulado)
     */
    public function verify2FA(User $user, string $code): bool
    {
        // En implementación real, verificar con Google Authenticator o similar
        return $code === $user->two_factor_code;
    }
}

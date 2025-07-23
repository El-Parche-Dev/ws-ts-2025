# 💻 EJERCICIO 2: Authentication System - Laravel Sanctum

## Implementación MVP - 45 minutos

### 📋 **DESCRIPCIÓN**

Implementar sistema completo de autenticación API usando Laravel Sanctum con registro, login, logout y protección de endpoints.

---

## 🎯 **REQUERIMIENTOS**

### **FASE CORE ✅ (30 minutos)**

- ✅ Laravel Sanctum configurado
- ✅ Registro y login con tokens
- ✅ Middleware de autenticación
- ✅ Endpoints protegidos funcionando

### **FASE ENHANCED ⚡ (15 minutos)**

- ⚡ Rate limiting en auth endpoints
- ⚡ Middleware de roles (admin/user)
- ⚡ Logout desde todos los dispositivos
- ⚡ User profile management

---

## 🏗️ **PASO A PASO**

### **1. Instalar y Configurar Sanctum**

```bash
# Instalar Sanctum
composer require laravel/sanctum

# Publicar configuración
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Ejecutar migrations
php artisan migrate

# Agregar HasApiTokens al User model
```

### **2. Configurar Models y Migrations**

**User Model Enhanced:**

```php
<?php
// app/Models/User.php - ACTUALIZAR

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'email_verified_at',
        'avatar',
        'phone',
        'is_active'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    // TODO: Implementar métodos de roles
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    // TODO: Método para crear token con nombre personalizado
    public function createApiToken(string $name = 'API Token', array $abilities = ['*']): string
    {
        return $this->createToken($name, $abilities)->plainTextToken;
    }

    // TODO: Scope para usuarios activos
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
```

**User Migration Enhanced:**

```php
<?php
// database/migrations/xxxx_xx_xx_add_fields_to_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // TODO: Agregar campos adicionales
            $table->enum('role', ['admin', 'user'])->default('user')->after('email');
            $table->string('avatar')->nullable()->after('password');
            $table->string('phone', 20)->nullable()->after('avatar');
            $table->boolean('is_active')->default(true)->after('phone');
            $table->softDeletes();

            // Índices
            $table->index(['role', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'avatar', 'phone', 'is_active']);
            $table->dropSoftDeletes();
        });
    }
};
```

### **3. Crear Auth Controller**

```bash
# Crear controlador de autenticación
php artisan make:controller Api/AuthController

# Crear Form Requests
php artisan make:request Auth/RegisterRequest
php artisan make:request Auth/LoginRequest
php artisan make:request Auth/UpdateProfileRequest

# Crear Resource
php artisan make:resource UserResource
```

**AuthController Template:**

```php
<?php
// app/Http/Controllers/Api/AuthController.php - IMPLEMENTAR

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            // TODO: Crear usuario
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role ?? 'user', // Default user
                'phone' => $request->phone,
                'is_active' => true
            ]);

            // TODO: Crear token
            $token = $user->createApiToken('Registration Token');

            return response()->json([
                'message' => 'User registered successfully',
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'Bearer'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Authenticate user and return token
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // TODO: Buscar usuario
        $user = User::active()->where('email', $request->email)->first();

        // TODO: Verificar credenciales
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // TODO: Revocar tokens existentes si solo se permite una sesión
        if ($request->single_session) {
            $user->tokens()->delete();
        }

        // TODO: Crear nuevo token
        $tokenName = $request->device_name ?? 'API Token';
        $token = $user->createApiToken($tokenName);

        return response()->json([
            'message' => 'Login successful',
            'user' => new UserResource($user),
            'token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    /**
     * Get authenticated user profile
     */
    public function user(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /**
     * Update user profile
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        try {
            $user = $request->user();

            // TODO: Actualizar datos del usuario
            $user->update($request->validated());

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => new UserResource($user->fresh())
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Profile update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout user (revoke current token)
     */
    public function logout(Request $request): JsonResponse
    {
        // TODO: Revocar token actual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Logout from all devices
     */
    public function logoutAll(Request $request): JsonResponse
    {
        // TODO: Revocar todos los tokens
        $deletedTokens = $request->user()->tokens()->count();
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out from all devices',
            'revoked_tokens' => $deletedTokens
        ]);
    }

    /**
     * Get user's active sessions (tokens)
     */
    public function sessions(Request $request): JsonResponse
    {
        $tokens = $request->user()->tokens()->get()->map(function ($token) {
            return [
                'id' => $token->id,
                'name' => $token->name,
                'last_used_at' => $token->last_used_at,
                'created_at' => $token->created_at,
                'is_current' => $token->id === request()->user()->currentAccessToken()->id
            ];
        });

        return response()->json([
            'sessions' => $tokens,
            'total' => $tokens->count()
        ]);
    }

    /**
     * Revoke specific token/session
     */
    public function revokeSession(Request $request, int $tokenId): JsonResponse
    {
        $user = $request->user();
        $token = $user->tokens()->find($tokenId);

        if (!$token) {
            return response()->json([
                'message' => 'Session not found'
            ], 404);
        }

        $token->delete();

        return response()->json([
            'message' => 'Session revoked successfully'
        ]);
    }
}
```

### **4. Crear Form Requests**

**RegisterRequest:**

```php
<?php
// app/Http/Requests/Auth/RegisterRequest.php - IMPLEMENTAR

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // TODO: Definir reglas de validación
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
            'phone' => 'nullable|string|max:20',
            'role' => 'sometimes|in:admin,user',
            'single_session' => 'boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'email.required' => 'El email es obligatorio.',
            'email.unique' => 'Este email ya está registrado.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
        ];
    }
}
```

**LoginRequest:**

```php
<?php
// app/Http/Requests/Auth/LoginRequest.php - IMPLEMENTAR

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'password' => 'required|string',
            'device_name' => 'nullable|string|max:255',
            'single_session' => 'boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'El email es obligatorio.',
            'email.email' => 'Debe ser un email válido.',
            'password.required' => 'La contraseña es obligatoria.',
        ];
    }
}
```

### **5. Crear Middleware Personalizado**

```bash
# Crear middleware para roles
php artisan make:middleware AdminMiddleware
php artisan make:middleware EnsureUserIsActive
```

**AdminMiddleware:**

```php
<?php
// app/Http/Middleware/AdminMiddleware.php - IMPLEMENTAR

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // TODO: Verificar que el usuario esté autenticado
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        // TODO: Verificar que sea admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }

        return $next($request);
    }
}
```

---

## 🎯 **DESAFÍOS A RESOLVER**

### **Desafío 1: UserResource Completo**

```php
<?php
// app/Http/Resources/UserResource.php - IMPLEMENTAR

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'is_active' => $this->is_active,
            'email_verified_at' => $this->email_verified_at,

            // TODO: Incluir información adicional solo para admins
            'permissions' => $this->when($this->isAdmin(), [
                'can_create_products' => true,
                'can_manage_users' => true,
                'can_view_analytics' => true
            ]),

            // TODO: Metadata
            'meta' => [
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'last_login' => $this->tokens()->latest('last_used_at')->first()?->last_used_at
            ]
        ];
    }
}
```

### **Desafío 2: Configurar Rate Limiting**

```php
<?php
// app/Providers/RouteServiceProvider.php - ACTUALIZAR

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

public function boot(): void
{
    // TODO: Configurar rate limiting para auth
    RateLimiter::for('auth', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip());
    });

    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    // Rate limiting más estricto para operaciones sensibles
    RateLimiter::for('sensitive', function (Request $request) {
        return Limit::perMinute(3)->by($request->user()?->id ?: $request->ip());
    });
}
```

### **Desafío 3: Configurar Routes Protegidas**

```php
<?php
// routes/api.php - ACTUALIZAR

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // TODO: Auth routes con rate limiting
    Route::middleware('throttle:auth')->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register']);
        Route::post('/auth/login', [AuthController::class, 'login']);
    });

    // TODO: Public endpoints
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    // TODO: Protected routes (requieren autenticación)
    Route::middleware('auth:sanctum')->group(function () {

        // Auth management
        Route::get('/auth/user', [AuthController::class, 'user']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/logout-all', [AuthController::class, 'logoutAll']);
        Route::get('/auth/sessions', [AuthController::class, 'sessions']);
        Route::delete('/auth/sessions/{tokenId}', [AuthController::class, 'revokeSession']);

        // Admin-only routes
        Route::middleware('admin')->group(function () {
            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{product}', [ProductController::class, 'update']);
            Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        });
    });
});
```

---

## 🧪 **TESTING DE AUTHENTICATION**

### **Endpoints para probar:**

```bash
# 1. Registro de usuario
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@test.com",
    "password": "SecurePass123!",
    "password_confirmation": "SecurePass123!",
    "phone": "+573001234567"
  }'

# 2. Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@test.com",
    "password": "SecurePass123!",
    "device_name": "Mobile App"
  }'

# 3. Obtener perfil (con token)
curl -X GET "http://localhost:8000/api/v1/auth/user" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. Crear producto (solo admin)
curl -X POST "http://localhost:8000/api/v1/products" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "price": 99.99,
    "category_id": 1,
    "stock": 10,
    "sku": "TEST-001",
    "status": "published"
  }'

# 5. Logout
curl -X POST "http://localhost:8000/api/v1/auth/logout" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ✅ **CRITERIOS DE EVALUACIÓN**

### **CORE (15 puntos)**

- [ ] Sanctum configurado correctamente (3 pts)
- [ ] Registro y login funcionando (4 pts)
- [ ] Middleware de autenticación (3 pts)
- [ ] Endpoints protegidos (3 pts)
- [ ] Logout funcionando (2 pts)

### **ENHANCED (5 puntos)**

- [ ] Rate limiting implementado (1 pt)
- [ ] Middleware de roles (admin) (2 pts)
- [ ] Gestión de sesiones múltiples (1 pt)
- [ ] Profile management (1 pt)

---

## 🚀 **RETO EXTRA**

1. **Email verification**: Verificación de email al registrarse
2. **Password reset**: Sistema de recuperación de contraseña
3. **Two-factor auth**: Autenticación de dos factores
4. **Social login**: Login con Google/Facebook
5. **Session monitoring**: Dashboard de sesiones activas

---

**¡Implementa autenticación segura con Sanctum!** 🔒

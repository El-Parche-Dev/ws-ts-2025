# 🏗️ MÓDULO 1: Arquitectura del Proyecto Final

## Duración: 90 minutos (12:00 PM - 1:30 PM)

### 📋 **OBJETIVO DEL MÓDULO**

Diseñar e implementar la arquitectura completa del proyecto final integrando todas las funcionalidades aprendidas en los días anteriores en un sistema cohesivo, escalable y mantenible.

---

## 🎯 **ENTREGABLES DEL MÓDULO**

Al finalizar este módulo tendrás:

1. ✅ **Arquitectura base** del proyecto implementada
2. ✅ **Todos los módulos integrados** (Auth, Files, Real-time, Jobs)
3. ✅ **Estructura de código** siguiendo patrones profesionales
4. ✅ **Configuration management** para múltiples environments
5. ✅ **Base de datos** con seeders de prueba

---

## 🏗️ **FASE 1: Diseño de Arquitectura (20 minutos)**

### **1.1 Arquitectura en Capas**

```
┌─────────────────────────────────────────────────┐
│                 PRESENTATION LAYER               │
│  ┌─────────────────┐  ┌─────────────────────────┐│
│  │   API Routes    │  │    WebSocket Routes     ││
│  │  (RESTful API)  │  │   (Real-time Events)    ││
│  └─────────────────┘  └─────────────────────────┘│
└─────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────┐
│                APPLICATION LAYER                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │Controllers  │ │ Middleware  │ │  Resources  ││
│  │             │ │             │ │             ││
│  └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────┐
│                 BUSINESS LAYER                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │  Services   │ │    Jobs     │ │   Events    ││
│  │             │ │             │ │             ││
│  └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────┐
│                  DATA ACCESS LAYER               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │Repositories │ │   Models    │ │   Cache     ││
│  │             │ │             │ │             ││
│  └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────┐
│                INFRASTRUCTURE LAYER              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │  Database   │ │   Storage   │ │    Queue    ││
│  │   (SQLite)  │ │  (Local/S3) │ │   (Redis)   ││
│  └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────┘
```

### **1.2 Patrones de Diseño Implementados**

```php
<?php
// Patrón Repository para Data Access
interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;
    public function create(array $data): User;
    public function updateProfile(User $user, array $data): User;
    public function getActiveUsers(): Collection;
}

// Patrón Service para Business Logic
class AuthService
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private NotificationService $notificationService
    ) {}

    public function login(array $credentials): array
    {
        // Business logic aquí
    }
}

// Patrón Observer para Events
class UserRegistered
{
    public function __construct(public User $user) {}
}

// Patrón Strategy para File Processing
interface FileProcessorInterface
{
    public function process(File $file): void;
}

class ImageProcessor implements FileProcessorInterface
{
    public function process(File $file): void
    {
        // Procesamiento específico para imágenes
    }
}
```

---

## 🚀 **FASE 2: Setup del Proyecto (30 minutos)**

### **2.1 Crear Proyecto Laravel Optimizado**

```bash
# Crear proyecto fresco
composer create-project laravel/laravel worldskills-api-platform
cd worldskills-api-platform

# Instalar dependencias esenciales
composer require laravel/sanctum
composer require laravel/horizon
composer require beyondcode/laravel-websockets
composer require intervention/image
composer require spatie/laravel-permission
composer require spatie/laravel-query-builder
composer require predis/predis

# Dependencias de desarrollo
composer require --dev laravel/telescope
composer require --dev barryvdh/laravel-debugbar
composer require --dev nunomaduro/larastan
composer require --dev friendsofphp/php-cs-fixer

# Dependencias de frontend (para testing)
npm install laravel-echo pusher-js
```

### **2.2 Configuración Base**

```bash
# Configurar Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Configurar WebSockets
php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="migrations"
php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="config"

# Configurar Horizon
php artisan vendor:publish --provider="Laravel\Horizon\HorizonServiceProvider"

# Configurar Telescope (solo desarrollo)
php artisan vendor:publish --provider="Laravel\Telescope\TelescopeServiceProvider"

# Configurar permisos
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

# Ejecutar migraciones iniciales
php artisan migrate
```

### **2.3 Estructura de Directorios Avanzada**

```bash
# Crear estructura de directorios
mkdir -p app/Services
mkdir -p app/Repositories
mkdir -p app/Repositories/Contracts
mkdir -p app/Traits
mkdir -p app/Exceptions/Custom
mkdir -p app/Helpers
mkdir -p tests/Traits
mkdir -p tests/Fixtures
mkdir -p docs/api
mkdir -p docs/architecture
```

---

## 🏗️ **FASE 3: Implementación de Servicios Core (40 minutos)**

### **3.1 Base Service Class**

```php
<?php
// app/Services/BaseService.php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

abstract class BaseService
{
    protected function executeInTransaction(callable $callback)
    {
        try {
            return DB::transaction($callback);
        } catch (\Exception $e) {
            Log::error('Service transaction failed', [
                'service' => static::class,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    protected function logActivity(string $action, array $context = []): void
    {
        Log::info("Service activity: {$action}", array_merge([
            'service' => static::class,
            'timestamp' => now()->toISOString()
        ], $context));
    }
}
```

### **3.2 AuthService Integrado**

```php
<?php
// app/Services/AuthService.php

namespace App\Services;

use App\Events\UserLoggedIn;
use App\Events\UserRegistered;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService extends BaseService
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private NotificationService $notificationService
    ) {}

    public function register(array $data): array
    {
        return $this->executeInTransaction(function () use ($data) {
            // Validar datos únicos
            if ($this->userRepository->findByEmail($data['email'])) {
                throw ValidationException::withMessages([
                    'email' => ['El email ya está registrado.']
                ]);
            }

            // Crear usuario
            $user = $this->userRepository->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'email_verified_at' => now() // Para simplificar en desarrollo
            ]);

            // Asignar rol por defecto
            $user->assignRole('user');

            // Crear token
            $token = $user->createToken('auth-token')->plainTextToken;

            // Disparar evento
            event(new UserRegistered($user));

            // Log actividad
            $this->logActivity('user_registered', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            return [
                'user' => $user->load('roles'),
                'token' => $token
            ];
        });
    }

    public function login(array $credentials): array
    {
        $user = $this->userRepository->findByEmail($credentials['email']);

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw new AuthenticationException('Credenciales inválidas.');
        }

        // Limpiar tokens anteriores si se especifica
        if (isset($credentials['single_session']) && $credentials['single_session']) {
            $user->tokens()->delete();
        }

        // Crear nuevo token
        $token = $user->createToken('auth-token', ['*'], now()->addDays(30))->plainTextToken;

        // Disparar evento
        event(new UserLoggedIn($user));

        // Log actividad
        $this->logActivity('user_logged_in', [
            'user_id' => $user->id,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);

        return [
            'user' => $user->load('roles', 'permissions'),
            'token' => $token
        ];
    }

    public function logout(User $user): void
    {
        // Revocar token actual
        $user->currentAccessToken()->delete();

        $this->logActivity('user_logged_out', [
            'user_id' => $user->id
        ]);
    }

    public function refreshToken(User $user): string
    {
        // Revocar token actual
        $user->currentAccessToken()->delete();

        // Crear nuevo token
        $token = $user->createToken('auth-token')->plainTextToken;

        $this->logActivity('token_refreshed', [
            'user_id' => $user->id
        ]);

        return $token;
    }

    public function updateProfile(User $user, array $data): User
    {
        return $this->executeInTransaction(function () use ($user, $data) {
            // Validar email único si cambió
            if (isset($data['email']) && $data['email'] !== $user->email) {
                if ($this->userRepository->findByEmail($data['email'])) {
                    throw ValidationException::withMessages([
                        'email' => ['El email ya está registrado.']
                    ]);
                }
            }

            // Actualizar contraseña si se proporciona
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            $updatedUser = $this->userRepository->updateProfile($user, $data);

            $this->logActivity('profile_updated', [
                'user_id' => $user->id,
                'updated_fields' => array_keys($data)
            ]);

            return $updatedUser;
        });
    }
}
```

### **3.3 FileService Integrado**

```php
<?php
// app/Services/FileService.php

namespace App\Services;

use App\Events\FileUploaded;
use App\Jobs\ProcessFileJob;
use App\Models\File;
use App\Models\User;
use App\Repositories\Contracts\FileRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileService extends BaseService
{
    public function __construct(
        private FileRepositoryInterface $fileRepository
    ) {}

    public function uploadFile(
        UploadedFile $uploadedFile,
        User $user,
        array $options = []
    ): File {
        return $this->executeInTransaction(function () use ($uploadedFile, $user, $options) {
            // Configuración por defecto
            $config = array_merge([
                'disk' => 'public',
                'folder' => 'uploads/' . date('Y/m/d'),
                'is_public' => true,
                'description' => null
            ], $options);

            // Generar nombre único
            $filename = Str::uuid() . '.' . $uploadedFile->getClientOriginalExtension();
            $path = $config['folder'] . '/' . $filename;

            // Subir archivo
            $storedPath = Storage::disk($config['disk'])
                ->putFileAs($config['folder'], $uploadedFile, $filename);

            if (!$storedPath) {
                throw new \Exception('Error al subir el archivo');
            }

            // Extraer metadata
            $metadata = $this->extractMetadata($uploadedFile);

            // Crear registro en base de datos
            $file = $this->fileRepository->create([
                'user_id' => $user->id,
                'original_name' => $uploadedFile->getClientOriginalName(),
                'filename' => $filename,
                'path' => $storedPath,
                'disk' => $config['disk'],
                'mime_type' => $uploadedFile->getMimeType(),
                'size' => $uploadedFile->getSize(),
                'metadata' => $metadata,
                'description' => $config['description'],
                'is_public' => $config['is_public']
            ]);

            // Disparar evento
            event(new FileUploaded($file, $user));

            // Programar procesamiento si es necesario
            if ($this->needsProcessing($file)) {
                ProcessFileJob::dispatch($file);
            }

            $this->logActivity('file_uploaded', [
                'file_id' => $file->id,
                'user_id' => $user->id,
                'filename' => $file->original_name,
                'size' => $file->size
            ]);

            return $file;
        });
    }

    public function deleteFile(File $file, User $user): bool
    {
        if ($file->user_id !== $user->id) {
            throw new \Exception('No tienes permisos para eliminar este archivo');
        }

        return $this->executeInTransaction(function () use ($file) {
            // Eliminar archivo físico
            Storage::disk($file->disk)->delete($file->path);

            // Eliminar versiones si existen
            foreach ($file->versions as $version) {
                Storage::disk($file->disk)->delete($version->path);
            }

            // Eliminar registro de base de datos
            $deleted = $file->delete();

            $this->logActivity('file_deleted', [
                'file_id' => $file->id,
                'filename' => $file->original_name
            ]);

            return $deleted;
        });
    }

    public function getUserFiles(User $user, array $filters = [])
    {
        return $this->fileRepository->getUserFiles($user->id, $filters);
    }

    public function getFileStats(User $user): array
    {
        return $this->fileRepository->getUserStats($user->id);
    }

    private function extractMetadata(UploadedFile $file): array
    {
        $metadata = [
            'original_extension' => $file->getClientOriginalExtension(),
            'uploaded_at' => now()->toISOString()
        ];

        // Metadata adicional para imágenes
        if (str_starts_with($file->getMimeType(), 'image/')) {
            try {
                $imageSize = getimagesize($file->getRealPath());
                if ($imageSize) {
                    $metadata['width'] = $imageSize[0];
                    $metadata['height'] = $imageSize[1];
                    $metadata['aspect_ratio'] = round($imageSize[0] / $imageSize[1], 2);
                }
            } catch (\Exception $e) {
                // Ignorar errores de metadata
            }
        }

        return $metadata;
    }

    private function needsProcessing(File $file): bool
    {
        // Procesar imágenes y algunos tipos de documentos
        return str_starts_with($file->mime_type, 'image/') ||
               in_array($file->mime_type, ['application/pdf']);
    }
}
```

### **3.4 NotificationService**

```php
<?php
// app/Services/NotificationService.php

namespace App\Services;

use App\Events\NotificationSent;
use App\Jobs\SendEmailNotificationJob;
use App\Models\User;

class NotificationService extends BaseService
{
    public function sendRealTimeNotification(
        User $user,
        string $title,
        string $message,
        string $type = 'info',
        array $data = []
    ): void {
        // Disparar evento en tiempo real
        event(new NotificationSent($user, $title, $message, $type, $data));

        $this->logActivity('realtime_notification_sent', [
            'user_id' => $user->id,
            'title' => $title,
            'type' => $type
        ]);
    }

    public function sendEmailNotification(
        User $user,
        string $subject,
        string $message,
        array $data = [],
        bool $immediate = false
    ): void {
        $job = SendEmailNotificationJob::dispatch($user, $subject, $message, $data);

        if (!$immediate) {
            $job->delay(now()->addMinutes(1)); // Pequeño delay para agrupar
        }

        $this->logActivity('email_notification_queued', [
            'user_id' => $user->id,
            'subject' => $subject,
            'immediate' => $immediate
        ]);
    }

    public function notifyAdmins(string $title, string $message, array $data = []): void
    {
        $admins = User::role('admin')->get();

        foreach ($admins as $admin) {
            $this->sendRealTimeNotification($admin, $title, $message, 'admin', $data);
        }

        $this->logActivity('admin_notification_sent', [
            'admin_count' => $admins->count(),
            'title' => $title
        ]);
    }
}
```

---

## 🗃️ **FASE 4: Repository Pattern Implementation**

### **4.1 Repository Contracts**

```php
<?php
// app/Repositories/Contracts/UserRepositoryInterface.php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;
    public function create(array $data): User;
    public function updateProfile(User $user, array $data): User;
    public function getActiveUsers(): Collection;
    public function getUserStats(int $userId): array;
}
```

```php
<?php
// app/Repositories/Contracts/FileRepositoryInterface.php

namespace App\Repositories\Contracts;

use App\Models\File;
use Illuminate\Database\Eloquent\Collection;

interface FileRepositoryInterface
{
    public function create(array $data): File;
    public function getUserFiles(int $userId, array $filters = []): Collection;
    public function getUserStats(int $userId): array;
    public function findByIdWithUser(int $fileId): ?File;
}
```

### **4.2 Repository Implementations**

```php
<?php
// app/Repositories/UserRepository.php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class UserRepository implements UserRepositoryInterface
{
    public function findByEmail(string $email): ?User
    {
        return Cache::remember(
            "user.email.{$email}",
            now()->addMinutes(10),
            fn () => User::where('email', $email)->first()
        );
    }

    public function create(array $data): User
    {
        $user = User::create($data);

        // Limpiar cache relacionado
        Cache::forget("user.email.{$user->email}");

        return $user;
    }

    public function updateProfile(User $user, array $data): User
    {
        $oldEmail = $user->email;

        $user->update($data);

        // Limpiar cache
        Cache::forget("user.email.{$oldEmail}");
        if (isset($data['email'])) {
            Cache::forget("user.email.{$data['email']}");
        }

        return $user->fresh();
    }

    public function getActiveUsers(): Collection
    {
        return Cache::remember(
            'users.active',
            now()->addMinutes(5),
            fn () => User::where('created_at', '>', now()->subDays(30))
                          ->orderBy('created_at', 'desc')
                          ->get()
        );
    }

    public function getUserStats(int $userId): array
    {
        return Cache::remember(
            "user.{$userId}.stats",
            now()->addMinutes(15),
            function () use ($userId) {
                $user = User::find($userId);

                return [
                    'total_files' => $user->files()->count(),
                    'total_storage_used' => $user->files()->sum('size'),
                    'files_this_month' => $user->files()
                        ->where('created_at', '>', now()->subMonth())
                        ->count(),
                    'last_activity' => $user->updated_at
                ];
            }
        );
    }
}
```

```php
<?php
// app/Repositories/FileRepository.php

namespace App\Repositories;

use App\Models\File;
use App\Repositories\Contracts\FileRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class FileRepository implements FileRepositoryInterface
{
    public function create(array $data): File
    {
        $file = File::create($data);

        // Limpiar stats cache del usuario
        Cache::forget("user.{$data['user_id']}.stats");
        Cache::forget("user.{$data['user_id']}.files");

        return $file;
    }

    public function getUserFiles(int $userId, array $filters = []): Collection
    {
        $cacheKey = "user.{$userId}.files." . md5(serialize($filters));

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($userId, $filters) {
            $query = File::where('user_id', $userId)->with('versions');

            // Aplicar filtros
            if (isset($filters['mime_type'])) {
                $query->where('mime_type', 'like', $filters['mime_type'] . '%');
            }

            if (isset($filters['processed'])) {
                $query->where('processed', $filters['processed']);
            }

            if (isset($filters['search'])) {
                $query->where('original_name', 'like', '%' . $filters['search'] . '%');
            }

            return $query->orderBy('created_at', 'desc')->get();
        });
    }

    public function getUserStats(int $userId): array
    {
        return Cache::remember(
            "user.{$userId}.file_stats",
            now()->addMinutes(15),
            function () use ($userId) {
                $files = File::where('user_id', $userId);

                return [
                    'total_files' => $files->count(),
                    'total_size' => $files->sum('size'),
                    'images_count' => $files->where('mime_type', 'like', 'image/%')->count(),
                    'processed_count' => $files->where('processed', true)->count(),
                    'by_mime_type' => $files->selectRaw('mime_type, COUNT(*) as count, SUM(size) as total_size')
                                           ->groupBy('mime_type')
                                           ->get()
                                           ->toArray()
                ];
            }
        );
    }

    public function findByIdWithUser(int $fileId): ?File
    {
        return File::with('user')->find($fileId);
    }
}
```

---

## 🔗 **FASE 5: Service Provider para Dependency Injection**

```php
<?php
// app/Providers/RepositoryServiceProvider.php

namespace App\Providers;

use App\Repositories\Contracts\FileRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\FileRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(FileRepositoryInterface::class, FileRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
```

```bash
# Registrar el provider en config/app.php
# Agregar: App\Providers\RepositoryServiceProvider::class,
```

---

## ✅ **VERIFICACIÓN DEL MÓDULO 1**

### **Checklist de Completitud:**

- [ ] Proyecto Laravel creado con todas las dependencias
- [ ] Estructura de directorios profesional implementada
- [ ] Servicios base (Auth, File, Notification) funcionando
- [ ] Repository pattern implementado con contratos
- [ ] Dependency injection configurado
- [ ] Cache strategy básico implementado
- [ ] Logging y error handling en servicios
- [ ] Patrones de diseño aplicados correctamente

### **Comandos de Verificación:**

```bash
# Verificar que todo funciona
php artisan migrate:fresh
php artisan config:clear
php artisan cache:clear
php artisan route:list
php artisan tinker

# En tinker:
# $authService = app(App\Services\AuthService::class);
# $fileService = app(App\Services\FileService::class);
# dd('Services loaded successfully');
```

---

## 🎯 **RESULTADO ESPERADO**

Al finalizar el Módulo 1, tendrás una **arquitectura sólida y escalable** con:

- ✅ **Separación clara de responsabilidades** en capas
- ✅ **Inyección de dependencias** configurada correctamente
- ✅ **Servicios integrados** listos para usar
- ✅ **Cache strategy** implementada
- ✅ **Error handling** y logging profesional
- ✅ **Fundación sólida** para el deployment y testing

**¡Excelente trabajo! Ahora tienes la base arquitectónica profesional para continuar con el deployment en el Módulo 2! 🚀**

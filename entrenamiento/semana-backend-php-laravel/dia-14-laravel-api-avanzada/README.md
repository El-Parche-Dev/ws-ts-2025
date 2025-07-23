# 🚀 DÍA 14: Laravel API Avanzada - Funcionalidades Profesionales

## 📅 **INFORMACIÓN DEL DÍA**

- **Duración**: 6 horas (12:00 PM - 6:00 PM)
- **Modalidad**: Presencial con práctica intensiva
- **Nivel**: Avanzado
- **Prerequisitos**: Días 11, 12 y 13 completados

---

## 🎯 **OBJETIVO PRINCIPAL**

Dominar funcionalidades avanzadas de Laravel API que distinguen a un desarrollador profesional en competencias WorldSkills, incluyendo manejo de archivos, colas de trabajo, WebSockets, caché y optimización de rendimiento.

---

## 📚 **CONTENIDO PROGRAMÁTICO**

### **MÓDULO 1: File Management & Storage (90 minutos)**

- ✅ Laravel Storage Disks avanzado
- ✅ Upload de archivos con validación
- ✅ Procesamiento de imágenes (resize, compression)
- ✅ Streaming de archivos grandes
- ✅ CDN integration y presigned URLs

### **MÓDULO 2: Jobs & Queues (90 minutos)**

- ✅ Queue configuration y drivers
- ✅ Job classes y dispatch patterns
- ✅ Failed jobs handling
- ✅ Queue monitoring y performance
- ✅ Batch jobs y job chaining

### **MÓDULO 3: Real-time Features (90 minutos)**

- ✅ Laravel Broadcasting basics
- ✅ WebSocket implementation
- ✅ Real-time notifications
- ✅ Event-driven architecture
- ✅ Pusher/Socket.io integration

### **MÓDULO 4: Performance & Optimization (90 minutos)**

- ✅ Database query optimization
- ✅ Eager loading strategies
- ✅ Laravel Cache patterns
- ✅ API rate limiting avanzado
- ✅ Response compression y CDN

---

## ⚡ **METODOLOGÍA MVP**

### **🔧 FASE CORE (40% del tiempo)**

- ✅ Funcionalidades básicas operativas
- ✅ Configuración mínima pero correcta
- ✅ Sin errores críticos
- ✅ Resultado inmediatamente evaluable

### **⚡ FASE ENHANCED (35% del tiempo)**

- ⚡ Validaciones robustas y manejo de errores
- ⚡ Funcionalidades secundarias importantes
- ⚡ Mejoras en experiencia de usuario
- ⚡ Optimizaciones básicas

### **✨ FASE POLISH (25% del tiempo)**

- ✨ Optimizaciones de rendimiento avanzadas
- ✨ Funcionalidades premium
- ✨ Testing comprehensivo
- ✨ Documentación y monitoreo

---

## 🏗️ **ARQUITECTURA DEL PROYECTO**

```
proyecto-api-avanzada/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── FileController.php
│   │   │   ├── NotificationController.php
│   │   │   └── AnalyticsController.php
│   │   ├── Requests/
│   │   │   ├── FileUploadRequest.php
│   │   │   └── NotificationRequest.php
│   │   └── Resources/
│   │       ├── FileResource.php
│   │       └── NotificationResource.php
│   ├── Jobs/
│   │   ├── ProcessImageJob.php
│   │   ├── SendNotificationJob.php
│   │   └── GenerateReportJob.php
│   ├── Events/
│   │   ├── FileUploaded.php
│   │   └── NotificationSent.php
│   ├── Listeners/
│   │   ├── ProcessUploadedFile.php
│   │   └── LogNotification.php
│   └── Models/
│       ├── File.php
│       ├── Notification.php
│       └── UserActivity.php
├── config/
│   ├── filesystems.php
│   ├── queue.php
│   └── broadcasting.php
├── database/
│   ├── migrations/
│   │   ├── create_files_table.php
│   │   ├── create_notifications_table.php
│   │   └── create_user_activities_table.php
│   └── seeders/
├── routes/
│   ├── api.php
│   ├── web.php
│   └── channels.php
└── tests/
    ├── Feature/
    │   ├── FileManagementTest.php
    │   ├── QueueJobsTest.php
    │   └── RealTimeTest.php
    └── Unit/
```

---

## 🛠️ **CONFIGURACIÓN INICIAL**

### **1. Dependencias Requeridas**

```bash
# Storage y File Processing
composer require league/flysystem-aws-s3-v3
composer require intervention/image

# Queue y Jobs
composer require predis/predis

# Broadcasting y WebSockets
composer require pusher/pusher-php-server
composer require beyondcode/laravel-websockets

# Performance y Monitoring
composer require laravel/telescope
composer require spatie/laravel-query-detector

# Development
composer require --dev barryvdh/laravel-debugbar
```

### **2. Configuración de Servicios**

```bash
# Publicar configuraciones
php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="migrations"
php artisan vendor:publish --provider="Laravel\Telescope\TelescopeServiceProvider"

# Migrar tablas
php artisan migrate

# Configurar storage links
php artisan storage:link
```

### **3. Variables de Entorno (.env)**

```env
# File Storage
FILESYSTEM_DISK=local
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

# Queue Configuration
QUEUE_CONNECTION=database
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Broadcasting
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your-app-id
PUSHER_APP_KEY=your-app-key
PUSHER_APP_SECRET=your-app-secret
PUSHER_APP_CLUSTER=mt1

# WebSockets
LARAVEL_WEBSOCKETS_SSL_LOCAL_CERT=
LARAVEL_WEBSOCKETS_SSL_LOCAL_PK=
LARAVEL_WEBSOCKETS_SSL_PASSPHRASE=

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis

# Performance
DB_SLOW_QUERY_TIME=100
API_RATE_LIMIT=60
```

---

## 📋 **EJERCICIOS PRÁCTICOS**

### **🎯 EJERCICIO 1: Sistema de Manejo de Archivos Avanzado**

- **Duración**: 2 horas
- **Enfoque**: Upload, processing, y storage de archivos
- **Entregables**: FileController, Image processing, S3 integration

### **🎯 EJERCICIO 2: Sistema de Colas y Jobs**

- **Duración**: 2 horas
- **Enfoque**: Background processing, job chaining, error handling
- **Entregables**: Job classes, Queue monitoring, Batch processing

### **🎯 EJERCICIO 3: Real-time Notifications & WebSockets**

- **Duración**: 2 horas
- **Enfoque**: Broadcasting, real-time updates, event architecture
- **Entregables**: Broadcasting events, WebSocket server, real-time UI

---

## 🔍 **PATRONES DE CÓDIGO AVANZADOS**

### **1. Repository Pattern con Cache**

```php
<?php
// app/Repositories/FileRepository.php
namespace App\Repositories;

use App\Models\File;
use Illuminate\Support\Facades\Cache;

class FileRepository
{
    public function findWithCache(int $id): ?File
    {
        return Cache::remember(
            "file.{$id}",
            now()->addHours(24),
            fn () => File::find($id)
        );
    }

    public function getUserFiles(int $userId, array $filters = []): Collection
    {
        $cacheKey = "user.{$userId}.files." . md5(serialize($filters));

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($userId, $filters) {
            $query = File::where('user_id', $userId);

            if (isset($filters['type'])) {
                $query->where('mime_type', 'like', $filters['type'] . '%');
            }

            if (isset($filters['size_min'])) {
                $query->where('size', '>=', $filters['size_min']);
            }

            return $query->with(['user:id,name'])
                        ->orderBy('created_at', 'desc')
                        ->get();
        });
    }
}
```

### **2. Job Pattern con Error Handling**

```php
<?php
// app/Jobs/ProcessImageJob.php
namespace App\Jobs;

use App\Models\File;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Facades\Image;

class ProcessImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 300;
    public $backoff = [10, 30, 60];

    public function __construct(
        private File $file,
        private array $sizes = ['thumbnail' => 150, 'medium' => 500, 'large' => 1024]
    ) {}

    public function handle(): void
    {
        try {
            $originalPath = $this->file->path;

            foreach ($this->sizes as $sizeName => $maxSize) {
                $this->createResizedVersion($originalPath, $sizeName, $maxSize);
            }

            $this->file->update(['processed' => true]);

        } catch (\Exception $e) {
            Log::error('Image processing failed', [
                'file_id' => $this->file->id,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        $this->file->update([
            'processed' => false,
            'processing_error' => $exception->getMessage()
        ]);
    }

    private function createResizedVersion(string $originalPath, string $sizeName, int $maxSize): void
    {
        $image = Image::make(storage_path('app/' . $originalPath));

        $image->resize($maxSize, $maxSize, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        $resizedPath = str_replace('.', "_{$sizeName}.", $originalPath);
        $image->save(storage_path('app/' . $resizedPath), 85);

        // Crear registro en base de datos para la versión redimensionada
        $this->file->versions()->create([
            'size_name' => $sizeName,
            'path' => $resizedPath,
            'width' => $image->width(),
            'height' => $image->height(),
            'file_size' => filesize(storage_path('app/' . $resizedPath))
        ]);
    }
}
```

### **3. Broadcasting Event Pattern**

```php
<?php
// app/Events/FileUploaded.php
namespace App\Events;

use App\Models\File;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FileUploaded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public File $file,
        public User $user
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('user.' . $this->user->id),
            new Channel('files.uploads')
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'file' => [
                'id' => $this->file->id,
                'name' => $this->file->original_name,
                'size' => $this->file->size,
                'type' => $this->file->mime_type,
                'url' => $this->file->url,
                'uploaded_at' => $this->file->created_at->toISOString()
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name
            ]
        ];
    }

    public function broadcastAs(): string
    {
        return 'file.uploaded';
    }
}
```

---

## 🧪 **TESTING AVANZADO**

### **Feature Test para File Upload**

```php
<?php
// tests/Feature/FileManagementTest.php
namespace Tests\Feature;

use App\Jobs\ProcessImageJob;
use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_upload_image_file(): void
    {
        Storage::fake('local');
        Queue::fake();

        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('test.jpg', 1000, 1000)->size(2048);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/files', [
                'file' => $file,
                'description' => 'Test image upload'
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('files', [
            'user_id' => $user->id,
            'original_name' => 'test.jpg',
            'mime_type' => 'image/jpeg'
        ]);

        Queue::assertPushed(ProcessImageJob::class);
        Storage::disk('local')->assertExists('uploads/' . date('Y/m/d') . '/' . $file->hashName());
    }

    public function test_file_processing_creates_multiple_sizes(): void
    {
        Storage::fake('local');

        $file = File::factory()->create([
            'mime_type' => 'image/jpeg',
            'path' => 'test/image.jpg'
        ]);

        // Simular archivo real
        Storage::put($file->path, file_get_contents(base_path('tests/fixtures/test-image.jpg')));

        $job = new ProcessImageJob($file);
        $job->handle();

        $file->refresh();

        $this->assertTrue($file->processed);
        $this->assertEquals(3, $file->versions()->count());

        $sizes = $file->versions()->pluck('size_name')->toArray();
        $this->assertContains('thumbnail', $sizes);
        $this->assertContains('medium', $sizes);
        $this->assertContains('large', $sizes);
    }
}
```

---

## 🎯 **CRONOGRAMA DETALLADO**

| **Hora**    | **Actividad**                           | **Duración** | **Enfoque**                         |
| ----------- | --------------------------------------- | ------------ | ----------------------------------- |
| 12:00-12:30 | Setup & Configuración                   | 30 min       | Dependencias, configuración inicial |
| 12:30-14:30 | **Ejercicio 1**: File Management        | 2 horas      | Upload, processing, storage         |
| 14:30-14:45 | Break                                   | 15 min       | Descanso                            |
| 14:45-16:45 | **Ejercicio 2**: Jobs & Queues          | 2 horas      | Background processing, monitoring   |
| 16:45-17:00 | Break                                   | 15 min       | Descanso                            |
| 17:00-18:00 | **Ejercicio 3**: Real-time & WebSockets | 1 hora       | Broadcasting, real-time features    |

---

## 🏆 **CRITERIOS DE EVALUACIÓN**

### **Puntuación Total: 100 puntos**

#### **File Management (35 puntos)**

- Upload seguro con validación (10 pts)
- Procesamiento de imágenes (10 pts)
- Storage configuration (8 pts)
- Error handling (7 pts)

#### **Jobs & Queues (35 puntos)**

- Job implementation (10 pts)
- Queue configuration (8 pts)
- Error handling y retry logic (10 pts)
- Performance monitoring (7 pts)

#### **Real-time Features (30 puntos)**

- Broadcasting setup (10 pts)
- WebSocket implementation (10 pts)
- Event architecture (10 pts)

---

## 🚀 **RECURSOS ADICIONALES**

### **Documentación Oficial**

- [Laravel File Storage](https://laravel.com/docs/10.x/filesystem)
- [Laravel Queues](https://laravel.com/docs/10.x/queues)
- [Laravel Broadcasting](https://laravel.com/docs/10.x/broadcasting)

### **Herramientas de Desarrollo**

- **Laravel Telescope**: Debugging y monitoring
- **Laravel Horizon**: Queue monitoring
- **Intervention Image**: Image processing
- **Pusher/Laravel WebSockets**: Real-time communication

### **Performance Tips**

- Usar lazy loading para archivos grandes
- Implementar CDN para assets estáticos
- Cache query results frecuentes
- Monitor queue performance con Horizon

---

## ✅ **ENTREGABLES DEL DÍA**

Al final del día 14, cada estudiante debe tener:

1. ✅ **Sistema completo de manejo de archivos** con upload, processing y storage
2. ✅ **Queue system funcionando** con jobs, error handling y monitoring
3. ✅ **Real-time features implementadas** con WebSockets y broadcasting
4. ✅ **Tests feature completos** para todas las funcionalidades
5. ✅ **Documentación técnica** de la implementación

---

**¡Domina las funcionalidades avanzadas de Laravel API y destácate en WorldSkills! 🚀✨**

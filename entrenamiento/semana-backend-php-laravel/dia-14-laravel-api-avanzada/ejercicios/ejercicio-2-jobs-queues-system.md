# ⚡ EJERCICIO 2: Sistema de Colas y Jobs

## Implementación MVP - 2 horas

### 📋 **DESCRIPCIÓN**

Implementar un sistema completo de colas y trabajos en segundo plano (background jobs) para procesar tareas pesadas de manera asíncrona, con manejo de errores robusto y monitoreo de rendimiento.

---

## 🎯 **REQUERIMIENTOS TÉCNICOS**

### **FASE CORE ✅ (80 minutos)**

- ✅ Configuración básica de colas con database driver
- ✅ Jobs para procesamiento de imágenes
- ✅ Jobs para envío de notificaciones
- ✅ Manejo básico de errores y reintentos
- ✅ Queue worker funcionando

### **FASE ENHANCED ⚡ (30 minutos)**

- ⚡ Jobs con chaining y batching
- ⚡ Failed jobs handling avanzado
- ⚡ Queue monitoring con métricas
- ⚡ Rate limiting y job priorities

### **FASE POLISH ✨ (10 minutos)**

- ✨ Laravel Horizon para monitoreo
- ✨ Custom queue drivers
- ✨ Job middleware personalizado
- ✨ Performance optimization

---

## 🏗️ **ESTRUCTURA DEL PROYECTO**

```php
<?php
// Estructura de archivos a crear

app/
├── Jobs/
│   ├── ProcessImageJob.php
│   ├── SendEmailNotificationJob.php
│   ├── GenerateReportJob.php
│   ├── BatchProcessFilesJob.php
│   └── CleanupTempFilesJob.php
├── Http/
│   ├── Controllers/
│   │   ├── JobController.php
│   │   └── QueueMonitorController.php
│   └── Middleware/
│       └── RateLimitJobs.php
├── Models/
│   ├── QueueJob.php
│   └── FailedJob.php
├── Services/
│   ├── QueueMonitorService.php
│   └── JobDispatcherService.php
└── Console/
    └── Commands/
        ├── ProcessQueueCommand.php
        └── CleanFailedJobsCommand.php

database/
├── migrations/
│   ├── create_jobs_table.php
│   ├── create_failed_jobs_table.php
│   └── create_job_batches_table.php
└── seeders/
    └── QueueTestSeeder.php

config/
├── queue.php
└── horizon.php
```

---

## 🔧 **PASO 1: Configuración de Colas**

### **1.1 Instalación de Dependencias**

```bash
# Instalar paquetes necesarios
composer require predis/predis
composer require laravel/horizon

# Publicar configuraciones
php artisan vendor:publish --provider="Laravel\Horizon\HorizonServiceProvider"

# Publicar migraciones de jobs
php artisan queue:table
php artisan queue:failed-table
php artisan queue:batches-table

# Ejecutar migraciones
php artisan migrate
```

### **1.2 Configuración de Queue**

```php
<?php
// config/queue.php - Actualizar configuración

return [
    'default' => env('QUEUE_CONNECTION', 'database'),

    'connections' => [
        'sync' => [
            'driver' => 'sync',
        ],

        'database' => [
            'driver' => 'database',
            'table' => 'jobs',
            'queue' => 'default',
            'retry_after' => 90,
            'after_commit' => false,
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => env('REDIS_QUEUE', 'default'),
            'retry_after' => 90,
            'block_for' => null,
            'after_commit' => false,
        ],

        // Cola de alta prioridad para trabajos críticos
        'high-priority' => [
            'driver' => 'database',
            'table' => 'jobs',
            'queue' => 'high',
            'retry_after' => 30,
            'after_commit' => false,
        ],

        // Cola para trabajos de larga duración
        'long-running' => [
            'driver' => 'database',
            'table' => 'jobs',
            'queue' => 'long',
            'retry_after' => 300,
            'after_commit' => false,
        ],
    ],

    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
        'database' => env('DB_CONNECTION', 'mysql'),
        'table' => 'failed_jobs',
    ],
];
```

### **1.3 Variables de Entorno**

```env
# Agregar al archivo .env
QUEUE_CONNECTION=database
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Horizon (opcional para POLISH)
HORIZON_DOMAIN=your-domain.com
HORIZON_PATH=horizon

# Queue settings
QUEUE_RETRY_AFTER=90
QUEUE_MAX_TRIES=3
QUEUE_BACKOFF=10,30,60
```

---

## 💼 **PASO 2: Jobs Básicos**

### **2.1 ProcessImageJob**

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
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ProcessImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 300;
    public $backoff = [10, 30, 60];
    public $maxExceptions = 2;

    public function __construct(
        public File $file,
        public array $sizes = [
            'thumbnail' => ['width' => 150, 'height' => 150],
            'medium' => ['width' => 500, 'height' => 500],
            'large' => ['width' => 1024, 'height' => 1024]
        ]
    ) {}

    public function handle(): void
    {
        if (!$this->file->is_image) {
            Log::info("Archivo {$this->file->id} no es una imagen, omitiendo procesamiento");
            return;
        }

        Log::info("Iniciando procesamiento de imagen para archivo {$this->file->id}");

        try {
            $originalPath = Storage::disk($this->file->disk)->path($this->file->path);

            if (!file_exists($originalPath)) {
                throw new \Exception("Archivo original no encontrado: {$originalPath}");
            }

            $image = Image::make($originalPath);
            $processedVersions = [];

            foreach ($this->sizes as $sizeName => $dimensions) {
                $processedVersion = $this->createResizedVersion($image, $sizeName, $dimensions);
                $processedVersions[] = $processedVersion;

                // Actualizar progreso si hay un listener
                $this->updateProgress($sizeName, $processedVersions);
            }

            // Marcar como procesado
            $this->file->update([
                'processed' => true,
                'processed_at' => now(),
                'processing_error' => null
            ]);

            // Liberar memoria
            $image->destroy();

            Log::info("Procesamiento completado para archivo {$this->file->id}", [
                'versions_created' => count($processedVersions)
            ]);

        } catch (\Exception $e) {
            Log::error("Error procesando imagen {$this->file->id}: " . $e->getMessage(), [
                'file_id' => $this->file->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::critical("Job ProcessImageJob falló definitivamente", [
            'file_id' => $this->file->id,
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts()
        ]);

        $this->file->update([
            'processed' => false,
            'processing_error' => $exception->getMessage()
        ]);
    }

    private function createResizedVersion(Image $image, string $sizeName, array $dimensions): array
    {
        // Crear copia de la imagen
        $resizedImage = clone $image;

        // Redimensionar manteniendo proporción
        $resizedImage->resize($dimensions['width'], $dimensions['height'], function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        // Generar path para la versión redimensionada
        $pathInfo = pathinfo($this->file->path);
        $resizedPath = $pathInfo['dirname'] . '/' .
                      $pathInfo['filename'] . "_{$sizeName}." .
                      $pathInfo['extension'];

        // Guardar versión redimensionada
        $fullResizedPath = Storage::disk($this->file->disk)->path($resizedPath);
        $resizedImage->save($fullResizedPath, 85);

        // Crear registro de versión en base de datos
        $version = $this->file->versions()->create([
            'size_name' => $sizeName,
            'path' => $resizedPath,
            'width' => $resizedImage->width(),
            'height' => $resizedImage->height(),
            'file_size' => filesize($fullResizedPath),
            'processing_options' => $dimensions
        ]);

        return [
            'size_name' => $sizeName,
            'path' => $resizedPath,
            'dimensions' => [
                'width' => $resizedImage->width(),
                'height' => $resizedImage->height()
            ]
        ];
    }

    private function updateProgress(string $currentSize, array $processedVersions): void
    {
        $totalSizes = count($this->sizes);
        $processedCount = count($processedVersions);
        $progressPercentage = ($processedCount / $totalSizes) * 100;

        // Aquí podrías emitir un evento para actualizar el progreso en tiempo real
        // event(new ImageProcessingProgress($this->file->id, $progressPercentage, $currentSize));
    }

    public function retryUntil(): \DateTime
    {
        return now()->addMinutes(10);
    }

    public function tags(): array
    {
        return ['image-processing', "file:{$this->file->id}", "user:{$this->file->user_id}"];
    }
}
```

### **2.2 SendEmailNotificationJob**

```php
<?php
// app/Jobs/SendEmailNotificationJob.php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendEmailNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $timeout = 30;
    public $backoff = [5, 15, 30, 60, 120];

    public function __construct(
        public User $user,
        public string $subject,
        public string $message,
        public array $data = [],
        public string $template = 'emails.notification'
    ) {}

    public function handle(): void
    {
        try {
            Log::info("Enviando notificación por email", [
                'user_id' => $this->user->id,
                'email' => $this->user->email,
                'subject' => $this->subject
            ]);

            Mail::send($this->template, array_merge($this->data, [
                'user' => $this->user,
                'subject' => $this->subject,
                'message' => $this->message
            ]), function ($mail) {
                $mail->to($this->user->email, $this->user->name)
                     ->subject($this->subject);
            });

            Log::info("Notificación enviada exitosamente", [
                'user_id' => $this->user->id,
                'email' => $this->user->email
            ]);

        } catch (\Exception $e) {
            Log::error("Error enviando notificación por email", [
                'user_id' => $this->user->id,
                'email' => $this->user->email,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::critical("Falló el envío de notificación por email", [
            'user_id' => $this->user->id,
            'email' => $this->user->email,
            'subject' => $this->subject,
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts()
        ]);

        // Aquí podrías crear un registro de notificación fallida
        // o intentar por otro medio de comunicación
    }

    public function tags(): array
    {
        return ['email', 'notification', "user:{$this->user->id}"];
    }
}
```

### **2.3 GenerateReportJob**

```php
<?php
// app/Jobs/GenerateReportJob.php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GenerateReportJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 2;
    public $timeout = 600; // 10 minutos para reportes grandes

    public function __construct(
        public User $user,
        public string $reportType,
        public array $parameters = [],
        public string $format = 'pdf'
    ) {}

    public function handle(): void
    {
        if ($this->batch()?->cancelled()) {
            Log::info("Batch cancelado, omitiendo generación de reporte");
            return;
        }

        try {
            Log::info("Iniciando generación de reporte", [
                'user_id' => $this->user->id,
                'type' => $this->reportType,
                'format' => $this->format
            ]);

            // Simular generación de reporte
            $reportData = $this->generateReportData();
            $filePath = $this->saveReport($reportData);

            // Notificar al usuario que el reporte está listo
            SendEmailNotificationJob::dispatch(
                $this->user,
                'Reporte Generado',
                "Tu reporte '{$this->reportType}' está listo para descargar.",
                [
                    'report_type' => $this->reportType,
                    'download_url' => Storage::url($filePath),
                    'generated_at' => now()->format('Y-m-d H:i:s')
                ]
            );

            Log::info("Reporte generado exitosamente", [
                'user_id' => $this->user->id,
                'file_path' => $filePath
            ]);

        } catch (\Exception $e) {
            Log::error("Error generando reporte", [
                'user_id' => $this->user->id,
                'type' => $this->reportType,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function generateReportData(): array
    {
        // Simular procesamiento pesado
        sleep(5);

        return match($this->reportType) {
            'user-activity' => $this->generateUserActivityReport(),
            'file-statistics' => $this->generateFileStatisticsReport(),
            'system-health' => $this->generateSystemHealthReport(),
            default => ['error' => 'Tipo de reporte no soportado']
        };
    }

    private function generateUserActivityReport(): array
    {
        // Simulación de datos de actividad del usuario
        return [
            'user_id' => $this->user->id,
            'total_files' => rand(50, 500),
            'total_uploads' => rand(20, 200),
            'storage_used' => rand(1000000, 10000000),
            'last_activity' => now()->subDays(rand(1, 30))->toDateString(),
            'generated_at' => now()->toISOString()
        ];
    }

    private function generateFileStatisticsReport(): array
    {
        return [
            'total_files' => rand(100, 1000),
            'by_type' => [
                'images' => rand(40, 400),
                'documents' => rand(20, 200),
                'videos' => rand(5, 50)
            ],
            'storage_breakdown' => [
                'used' => rand(1000000, 50000000),
                'available' => rand(10000000, 100000000)
            ]
        ];
    }

    private function generateSystemHealthReport(): array
    {
        return [
            'queue_status' => [
                'pending_jobs' => rand(0, 100),
                'failed_jobs' => rand(0, 10),
                'processed_today' => rand(500, 5000)
            ],
            'system_metrics' => [
                'cpu_usage' => rand(10, 80),
                'memory_usage' => rand(20, 90),
                'disk_usage' => rand(30, 85)
            ]
        ];
    }

    private function saveReport(array $data): string
    {
        $filename = "reports/{$this->reportType}_{$this->user->id}_" .
                   now()->format('Y-m-d_H-i-s') . ".json";

        Storage::disk('local')->put($filename, json_encode($data, JSON_PRETTY_PRINT));

        return $filename;
    }

    public function failed(\Throwable $exception): void
    {
        Log::critical("Falló la generación de reporte", [
            'user_id' => $this->user->id,
            'type' => $this->reportType,
            'error' => $exception->getMessage()
        ]);

        // Notificar al usuario del error
        SendEmailNotificationJob::dispatch(
            $this->user,
            'Error en Generación de Reporte',
            "Hubo un error generando tu reporte '{$this->reportType}'. Por favor, intenta de nuevo más tarde."
        );
    }

    public function tags(): array
    {
        return ['report', $this->reportType, "user:{$this->user->id}"];
    }
}
```

---

## 🎛️ **PASO 3: Controlador de Jobs**

### **3.1 JobController**

```php
<?php
// app/Http/Controllers/JobController.php

namespace App\Http\Controllers;

use App\Jobs\GenerateReportJob;
use App\Jobs\ProcessImageJob;
use App\Jobs\SendEmailNotificationJob;
use App\Models\File;
use Illuminate\Bus\Batch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;

class JobController extends Controller
{
    /**
     * Procesar imagen específica
     */
    public function processImage(Request $request, File $file): JsonResponse
    {
        if ($file->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado'
            ], 403);
        }

        if (!$file->is_image) {
            return response()->json([
                'success' => false,
                'message' => 'El archivo no es una imagen'
            ], 400);
        }

        if ($file->processed) {
            return response()->json([
                'success' => false,
                'message' => 'La imagen ya está procesada'
            ], 400);
        }

        // Configurar tamaños personalizados si se proporcionan
        $sizes = $request->input('sizes', [
            'thumbnail' => ['width' => 150, 'height' => 150],
            'medium' => ['width' => 500, 'height' => 500],
            'large' => ['width' => 1024, 'height' => 1024]
        ]);

        // Despachar job
        $job = ProcessImageJob::dispatch($file, $sizes);

        return response()->json([
            'success' => true,
            'message' => 'Procesamiento de imagen iniciado',
            'data' => [
                'file_id' => $file->id,
                'job_id' => $job->getJobId(),
                'queue' => 'default'
            ]
        ]);
    }

    /**
     * Enviar notificación por email
     */
    public function sendNotification(Request $request): JsonResponse
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
            'template' => 'nullable|string',
            'delay_minutes' => 'nullable|integer|min:0|max:1440'
        ]);

        $user = auth()->user();
        $delay = $request->input('delay_minutes', 0);

        $job = SendEmailNotificationJob::dispatch(
            $user,
            $request->input('subject'),
            $request->input('message'),
            ['sent_via' => 'api'],
            $request->input('template', 'emails.notification')
        );

        if ($delay > 0) {
            $job->delay(now()->addMinutes($delay));
        }

        return response()->json([
            'success' => true,
            'message' => $delay > 0
                ? "Notificación programada para {$delay} minutos"
                : 'Notificación enviada a cola',
            'data' => [
                'job_id' => $job->getJobId(),
                'delay_minutes' => $delay
            ]
        ]);
    }

    /**
     * Generar reporte
     */
    public function generateReport(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|in:user-activity,file-statistics,system-health',
            'format' => 'nullable|in:pdf,json,csv',
            'parameters' => 'nullable|array'
        ]);

        $user = auth()->user();

        $job = GenerateReportJob::dispatch(
            $user,
            $request->input('type'),
            $request->input('parameters', []),
            $request->input('format', 'json')
        );

        return response()->json([
            'success' => true,
            'message' => 'Generación de reporte iniciada',
            'data' => [
                'report_type' => $request->input('type'),
                'job_id' => $job->getJobId(),
                'estimated_completion' => now()->addMinutes(5)->toISOString()
            ]
        ]);
    }

    /**
     * Procesar múltiples archivos en batch
     */
    public function batchProcessFiles(Request $request): JsonResponse
    {
        $request->validate([
            'file_ids' => 'required|array|min:1|max:50',
            'file_ids.*' => 'integer|exists:files,id'
        ]);

        $user = auth()->user();
        $fileIds = $request->input('file_ids');

        // Verificar que todos los archivos pertenecen al usuario
        $files = File::whereIn('id', $fileIds)
                    ->where('user_id', $user->id)
                    ->get();

        if ($files->count() !== count($fileIds)) {
            return response()->json([
                'success' => false,
                'message' => 'Algunos archivos no fueron encontrados o no tienes acceso'
            ], 400);
        }

        // Crear batch de jobs
        $jobs = $files->filter(fn($file) => $file->is_image && !$file->processed)
                     ->map(fn($file) => new ProcessImageJob($file));

        if ($jobs->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No hay imágenes válidas para procesar'
            ], 400);
        }

        $batch = Bus::batch($jobs->toArray())
            ->name('Procesamiento de Imágenes Batch')
            ->allowFailures()
            ->then(function (Batch $batch) use ($user) {
                Log::info("Batch completado", [
                    'batch_id' => $batch->id,
                    'user_id' => $user->id,
                    'total_jobs' => $batch->totalJobs,
                    'processed_jobs' => $batch->processedJobs()
                ]);

                // Notificar al usuario
                SendEmailNotificationJob::dispatch(
                    $user,
                    'Procesamiento Batch Completado',
                    "Se procesaron {$batch->processedJobs()} de {$batch->totalJobs} imágenes."
                );
            })
            ->catch(function (Batch $batch, \Throwable $e) use ($user) {
                Log::error("Error en batch", [
                    'batch_id' => $batch->id,
                    'error' => $e->getMessage()
                ]);
            })
            ->finally(function (Batch $batch) {
                Log::info("Batch finalizado", ['batch_id' => $batch->id]);
            })
            ->dispatch();

        return response()->json([
            'success' => true,
            'message' => 'Procesamiento batch iniciado',
            'data' => [
                'batch_id' => $batch->id,
                'total_jobs' => $batch->totalJobs,
                'files_to_process' => $jobs->count()
            ]
        ]);
    }

    /**
     * Obtener estado de batch
     */
    public function batchStatus(string $batchId): JsonResponse
    {
        try {
            $batch = Bus::findBatch($batchId);

            if (!$batch) {
                return response()->json([
                    'success' => false,
                    'message' => 'Batch no encontrado'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $batch->id,
                    'name' => $batch->name,
                    'total_jobs' => $batch->totalJobs,
                    'processed_jobs' => $batch->processedJobs(),
                    'pending_jobs' => $batch->pendingJobs,
                    'failed_jobs' => $batch->failedJobs,
                    'progress_percentage' => $batch->progress(),
                    'finished' => $batch->finished(),
                    'cancelled' => $batch->cancelled(),
                    'created_at' => $batch->createdAt,
                    'finished_at' => $batch->finishedAt
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo estado del batch: ' . $e->getMessage()
            ], 500);
        }
    }
}
```

---

## 🔗 **PASO 4: Rutas API**

### **4.1 Rutas de Jobs**

```php
<?php
// routes/api.php - Agregar estas rutas

use App\Http\Controllers\JobController;

Route::middleware(['auth:sanctum'])->group(function () {
    // Jobs individuales
    Route::post('jobs/process-image/{file}', [JobController::class, 'processImage'])
         ->name('jobs.process-image');

    Route::post('jobs/send-notification', [JobController::class, 'sendNotification'])
         ->name('jobs.send-notification');

    Route::post('jobs/generate-report', [JobController::class, 'generateReport'])
         ->name('jobs.generate-report');

    // Batch jobs
    Route::post('jobs/batch-process-files', [JobController::class, 'batchProcessFiles'])
         ->name('jobs.batch-process-files');

    Route::get('jobs/batch/{batchId}/status', [JobController::class, 'batchStatus'])
         ->name('jobs.batch-status');
});
```

---

## 🖥️ **PASO 5: Comandos de Consola**

### **5.1 Comando para Procesar Cola**

```php
<?php
// app/Console/Commands/ProcessQueueCommand.php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class ProcessQueueCommand extends Command
{
    protected $signature = 'queue:work-with-monitoring
                          {--queue=default : The queue to process}
                          {--timeout=60 : The timeout for each job}
                          {--tries=3 : The number of attempts}';

    protected $description = 'Process queue jobs with enhanced monitoring';

    public function handle(): int
    {
        $queue = $this->option('queue');
        $timeout = $this->option('timeout');
        $tries = $this->option('tries');

        $this->info("Iniciando procesamiento de cola: {$queue}");
        $this->info("Timeout: {$timeout}s, Intentos: {$tries}");

        try {
            Artisan::call('queue:work', [
                '--queue' => $queue,
                '--timeout' => $timeout,
                '--tries' => $tries,
                '--verbose' => true,
                '--memory' => 512
            ]);

            $this->info("Procesamiento de cola completado");
            return 0;

        } catch (\Exception $e) {
            $this->error("Error procesando cola: " . $e->getMessage());
            return 1;
        }
    }
}
```

---

## ✅ **PASO 6: Testing**

### **6.1 Feature Test para Jobs**

```php
<?php
// tests/Feature/QueueJobsTest.php

namespace Tests\Feature;

use App\Jobs\ProcessImageJob;
use App\Jobs\SendEmailNotificationJob;
use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class QueueJobsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        Mail::fake();
    }

    public function test_process_image_job_dispatched(): void
    {
        $user = User::factory()->create();
        $file = File::factory()->create([
            'user_id' => $user->id,
            'mime_type' => 'image/jpeg'
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/jobs/process-image/{$file->id}");

        $response->assertStatus(200);
        Queue::assertPushed(ProcessImageJob::class);
    }

    public function test_notification_job_dispatched(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/jobs/send-notification', [
                'subject' => 'Test Notification',
                'message' => 'This is a test message'
            ]);

        $response->assertStatus(200);
        Queue::assertPushed(SendEmailNotificationJob::class);
    }

    public function test_batch_processing_works(): void
    {
        $user = User::factory()->create();
        $files = File::factory()->count(3)->create([
            'user_id' => $user->id,
            'mime_type' => 'image/jpeg',
            'processed' => false
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/jobs/batch-process-files', [
                'file_ids' => $files->pluck('id')->toArray()
            ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => ['batch_id', 'total_jobs']
                ]);
    }

    public function test_job_handles_failure_gracefully(): void
    {
        $user = User::factory()->create();
        $file = File::factory()->create([
            'user_id' => $user->id,
            'mime_type' => 'image/jpeg',
            'path' => 'non-existent-file.jpg'
        ]);

        $job = new ProcessImageJob($file);

        // Simular fallo del job
        try {
            $job->handle();
        } catch (\Exception $e) {
            $job->failed($e);
        }

        $file->refresh();
        $this->assertFalse($file->processed);
        $this->assertNotNull($file->processing_error);
    }
}
```

---

## 📋 **CRITERIOS DE EVALUACIÓN**

### **CORE (15 puntos)**

- [ ] Configuración básica de colas (3 pts)
- [ ] Jobs básicos funcionando (4 pts)
- [ ] Manejo de errores y reintentos (4 pts)
- [ ] API endpoints para jobs (2 pts)
- [ ] Tests feature pasan (2 pts)

### **ENHANCED (10 puntos)**

- [ ] Batch processing implementado (3 pts)
- [ ] Failed jobs handling (3 pts)
- [ ] Queue monitoring básico (2 pts)
- [ ] Job priorities (2 pts)

### **POLISH (5 puntos)**

- [ ] Laravel Horizon configurado (2 pts)
- [ ] Job middleware (2 pts)
- [ ] Performance optimization (1 pt)

---

## 🚀 **COMANDOS DE TESTING**

```bash
# Iniciar worker de cola
php artisan queue:work --verbose

# Ver jobs fallidos
php artisan queue:failed

# Reintentar jobs fallidos
php artisan queue:retry all

# Limpiar jobs fallidos
php artisan queue:flush

# Ejecutar tests
php artisan test --filter QueueJobsTest

# Monitor de colas (si tienes Horizon)
php artisan horizon
```

---

## 🎯 **ENTREGABLES**

Al completar este ejercicio debes tener:

1. ✅ **Sistema de colas configurado** con database driver
2. ✅ **Jobs funcionando** para procesamiento e imágenes y notificaciones
3. ✅ **Batch processing** para tareas múltiples
4. ✅ **Manejo robusto de errores** y reintentos
5. ✅ **API endpoints** para gestionar jobs
6. ✅ **Tests feature** completos

---

**¡Domina el procesamiento asíncrono con Laravel Queues! ⚡🚀**

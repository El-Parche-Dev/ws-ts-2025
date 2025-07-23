# 💾 EJERCICIO 1: Sistema de Manejo de Archivos Avanzado

## Implementación MVP - 2 horas

### 📋 **DESCRIPCIÓN**

Crear un sistema completo de manejo de archivos con upload seguro, procesamiento de imágenes, múltiples storages y optimización de rendimiento para API Laravel profesional.

---

## 🎯 **REQUERIMIENTOS TÉCNICOS**

### **FASE CORE ✅ (80 minutos)**

- ✅ Upload básico de archivos con validación
- ✅ Almacenamiento en local storage
- ✅ API endpoints para CRUD de archivos
- ✅ Validación de tipos y tamaños
- ✅ Manejo básico de errores

### **FASE ENHANCED ⚡ (30 minutos)**

- ⚡ Procesamiento de imágenes (resize, thumbnails)
- ⚡ Multiple storage disks (local, S3)
- ⚡ Streaming de archivos grandes
- ⚡ Metadata extraction y análisis

### **FASE POLISH ✨ (10 minutos)**

- ✨ CDN integration
- ✨ Presigned URLs para downloads
- ✨ Cache de archivos frecuentes
- ✨ Monitoring y analytics

---

## 🏗️ **ESTRUCTURA DEL PROYECTO**

```php
<?php
// Estructura de archivos a crear

app/
├── Http/
│   ├── Controllers/
│   │   └── FileController.php
│   ├── Requests/
│   │   ├── FileUploadRequest.php
│   │   └── FileUpdateRequest.php
│   └── Resources/
│       └── FileResource.php
├── Models/
│   ├── File.php
│   └── FileVersion.php
├── Jobs/
│   ├── ProcessImageJob.php
│   └── ExtractMetadataJob.php
├── Services/
│   ├── FileService.php
│   └── ImageProcessingService.php
└── Repositories/
    └── FileRepository.php

database/
├── migrations/
│   ├── create_files_table.php
│   └── create_file_versions_table.php
└── factories/
    └── FileFactory.php

routes/
└── api.php (rutas de archivos)

config/
└── filesystems.php (configuración de disks)
```

---

## 🔧 **PASO 1: Configuración Inicial**

### **1.1 Instalación de Dependencias**

```bash
# Instalar paquetes necesarios
composer require league/flysystem-aws-s3-v3
composer require intervention/image
composer require spatie/laravel-medialibrary

# Publicar configuraciones
php artisan vendor:publish --provider="Spatie\MediaLibrary\MediaLibraryServiceProvider" --tag="migrations"
```

### **1.2 Configurar Storage Disks**

```php
<?php
// config/filesystems.php - Actualizar configuración

'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app'),
        'throw' => false,
    ],

    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
        'throw' => false,
    ],

    'uploads' => [
        'driver' => 'local',
        'root' => storage_path('app/uploads'),
        'url' => env('APP_URL').'/storage/uploads',
        'visibility' => 'public',
        'throw' => false,
    ],

    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION'),
        'bucket' => env('AWS_BUCKET'),
        'url' => env('AWS_URL'),
        'endpoint' => env('AWS_ENDPOINT'),
        'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
        'throw' => false,
    ],
],
```

### **1.3 Variables de Entorno**

```env
# Agregar al archivo .env
FILESYSTEM_DISK=local
MAX_FILE_SIZE=10240
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx

# AWS S3 (opcional para ENHANCED)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name
```

---

## 🗄️ **PASO 2: Migración y Modelo**

### **2.1 Migración Files**

```php
<?php
// database/migrations/create_files_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('original_name');
            $table->string('filename')->unique();
            $table->string('path');
            $table->string('disk')->default('local');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');
            $table->json('metadata')->nullable();
            $table->string('description')->nullable();
            $table->boolean('is_public')->default(true);
            $table->boolean('processed')->default(false);
            $table->string('processing_error')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            // Índices para optimización
            $table->index(['user_id', 'created_at']);
            $table->index(['mime_type', 'processed']);
            $table->index('disk');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
```

### **2.2 Migración File Versions**

```php
<?php
// database/migrations/create_file_versions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('file_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('file_id')->constrained()->onDelete('cascade');
            $table->string('size_name'); // thumbnail, medium, large
            $table->string('path');
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedBigInteger('file_size');
            $table->json('processing_options')->nullable();
            $table->timestamps();

            // Índice único para evitar duplicados
            $table->unique(['file_id', 'size_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('file_versions');
    }
};
```

### **2.3 Modelo File**

```php
<?php
// app/Models/File.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'original_name',
        'filename',
        'path',
        'disk',
        'mime_type',
        'size',
        'metadata',
        'description',
        'is_public',
        'processed',
        'processing_error',
        'processed_at'
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_public' => 'boolean',
        'processed' => 'boolean',
        'processed_at' => 'datetime'
    ];

    protected $appends = [
        'url',
        'size_human',
        'is_image'
    ];

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(FileVersion::class);
    }

    // Accessors
    public function getUrlAttribute(): string
    {
        if ($this->disk === 's3') {
            return Storage::disk('s3')->url($this->path);
        }

        return Storage::disk($this->disk)->url($this->path);
    }

    public function getSizeHumanAttribute(): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = $this->size;

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getIsImageAttribute(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    // Métodos de negocio
    public function delete(): bool
    {
        // Eliminar archivo físico
        Storage::disk($this->disk)->delete($this->path);

        // Eliminar versiones del archivo
        foreach ($this->versions as $version) {
            Storage::disk($this->disk)->delete($version->path);
        }

        return parent::delete();
    }

    public function getDownloadUrl(): string
    {
        if ($this->disk === 's3') {
            return Storage::disk('s3')->temporaryUrl(
                $this->path,
                now()->addMinutes(5)
            );
        }

        return route('files.download', $this);
    }

    // Scopes
    public function scopeImages($query)
    {
        return $query->where('mime_type', 'like', 'image/%');
    }

    public function scopeByMimeType($query, string $mimeType)
    {
        return $query->where('mime_type', $mimeType);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeProcessed($query)
    {
        return $query->where('processed', true);
    }
}
```

### **2.4 Modelo FileVersion**

```php
<?php
// app/Models/FileVersion.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FileVersion extends Model
{
    protected $fillable = [
        'file_id',
        'size_name',
        'path',
        'width',
        'height',
        'file_size',
        'processing_options'
    ];

    protected $casts = [
        'processing_options' => 'array'
    ];

    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class);
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk($this->file->disk)->url($this->path);
    }
}
```

---

## 🎛️ **PASO 3: Validación y Requests**

### **3.1 FileUploadRequest**

```php
<?php
// app/Http/Requests/FileUploadRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FileUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $maxSize = config('filesystems.max_file_size', 10240); // 10MB por defecto
        $allowedTypes = config('filesystems.allowed_types', 'jpg,jpeg,png,gif,pdf,doc,docx');

        return [
            'file' => [
                'required',
                'file',
                'max:' . $maxSize,
                'mimes:' . $allowedTypes
            ],
            'description' => 'nullable|string|max:500',
            'is_public' => 'boolean',
            'disk' => 'nullable|string|in:local,public,s3',
            'folder' => 'nullable|string|max:100|regex:/^[a-zA-Z0-9\/_-]+$/'
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Debe seleccionar un archivo para subir.',
            'file.file' => 'El archivo subido no es válido.',
            'file.max' => 'El archivo no puede ser mayor a :max KB.',
            'file.mimes' => 'El tipo de archivo no está permitido.',
            'description.max' => 'La descripción no puede exceder 500 caracteres.',
            'folder.regex' => 'El nombre de la carpeta contiene caracteres no válidos.'
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_public' => $this->boolean('is_public', true),
            'disk' => $this->input('disk', config('filesystems.default'))
        ]);
    }
}
```

---

## 🎯 **PASO 4: Controlador Principal**

### **4.1 FileController - FASE CORE**

```php
<?php
// app/Http/Controllers/FileController.php

namespace App\Http\Controllers;

use App\Http\Requests\FileUploadRequest;
use App\Http\Resources\FileResource;
use App\Models\File;
use App\Jobs\ProcessImageJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    /**
     * Listar archivos del usuario autenticado
     */
    public function index(Request $request): JsonResponse
    {
        $query = File::where('user_id', auth()->id())
                    ->with('versions');

        // Filtros
        if ($request->filled('mime_type')) {
            $query->where('mime_type', 'like', $request->mime_type . '%');
        }

        if ($request->filled('processed')) {
            $query->where('processed', $request->boolean('processed'));
        }

        if ($request->filled('search')) {
            $query->where('original_name', 'like', '%' . $request->search . '%');
        }

        // Ordenamiento
        $orderBy = $request->get('order_by', 'created_at');
        $orderDirection = $request->get('order_direction', 'desc');
        $query->orderBy($orderBy, $orderDirection);

        // Paginación
        $files = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => FileResource::collection($files),
            'meta' => [
                'current_page' => $files->currentPage(),
                'last_page' => $files->lastPage(),
                'per_page' => $files->perPage(),
                'total' => $files->total()
            ]
        ]);
    }

    /**
     * Subir nuevo archivo
     */
    public function store(FileUploadRequest $request): JsonResponse
    {
        try {
            $uploadedFile = $request->file('file');
            $disk = $request->input('disk', 'local');
            $folder = $request->input('folder', 'uploads/' . date('Y/m/d'));

            // Generar nombre único para el archivo
            $filename = Str::uuid() . '.' . $uploadedFile->getClientOriginalExtension();
            $path = $folder . '/' . $filename;

            // Subir archivo
            $storedPath = Storage::disk($disk)->putFileAs($folder, $uploadedFile, $filename);

            if (!$storedPath) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al subir el archivo'
                ], 500);
            }

            // Extraer metadata básica
            $metadata = [
                'original_extension' => $uploadedFile->getClientOriginalExtension(),
                'uploaded_at' => now()->toISOString()
            ];

            // Si es imagen, agregar dimensiones
            if (str_starts_with($uploadedFile->getMimeType(), 'image/')) {
                try {
                    $imageSize = getimagesize($uploadedFile->getRealPath());
                    if ($imageSize) {
                        $metadata['width'] = $imageSize[0];
                        $metadata['height'] = $imageSize[1];
                    }
                } catch (\Exception $e) {
                    // Ignorar error de metadata de imagen
                }
            }

            // Crear registro en base de datos
            $file = File::create([
                'user_id' => auth()->id(),
                'original_name' => $uploadedFile->getClientOriginalName(),
                'filename' => $filename,
                'path' => $storedPath,
                'disk' => $disk,
                'mime_type' => $uploadedFile->getMimeType(),
                'size' => $uploadedFile->getSize(),
                'metadata' => $metadata,
                'description' => $request->input('description'),
                'is_public' => $request->boolean('is_public', true)
            ]);

            // Si es imagen, programar procesamiento
            if ($file->is_image) {
                ProcessImageJob::dispatch($file);
            }

            return response()->json([
                'success' => true,
                'message' => 'Archivo subido exitosamente',
                'data' => new FileResource($file)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar archivo específico
     */
    public function show(File $file): JsonResponse
    {
        // Verificar que el usuario puede ver este archivo
        if ($file->user_id !== auth()->id() && !$file->is_public) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver este archivo'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => new FileResource($file->load('versions'))
        ]);
    }

    /**
     * Actualizar archivo
     */
    public function update(Request $request, File $file): JsonResponse
    {
        // Verificar propiedad
        if ($file->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para modificar este archivo'
            ], 403);
        }

        $request->validate([
            'description' => 'nullable|string|max:500',
            'is_public' => 'boolean'
        ]);

        $file->update($request->only(['description', 'is_public']));

        return response()->json([
            'success' => true,
            'message' => 'Archivo actualizado exitosamente',
            'data' => new FileResource($file)
        ]);
    }

    /**
     * Eliminar archivo
     */
    public function destroy(File $file): JsonResponse
    {
        // Verificar propiedad
        if ($file->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar este archivo'
            ], 403);
        }

        try {
            $file->delete();

            return response()->json([
                'success' => true,
                'message' => 'Archivo eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Descargar archivo
     */
    public function download(File $file): Response
    {
        // Verificar permisos
        if ($file->user_id !== auth()->id() && !$file->is_public) {
            abort(403, 'No tienes permisos para descargar este archivo');
        }

        if (!Storage::disk($file->disk)->exists($file->path)) {
            abort(404, 'Archivo no encontrado');
        }

        return Storage::disk($file->disk)->download($file->path, $file->original_name);
    }

    /**
     * Obtener estadísticas de archivos
     */
    public function stats(): JsonResponse
    {
        $userId = auth()->id();

        $stats = [
            'total_files' => File::where('user_id', $userId)->count(),
            'total_size' => File::where('user_id', $userId)->sum('size'),
            'images_count' => File::where('user_id', $userId)->images()->count(),
            'processed_count' => File::where('user_id', $userId)->processed()->count(),
            'by_mime_type' => File::where('user_id', $userId)
                                 ->selectRaw('mime_type, COUNT(*) as count, SUM(size) as total_size')
                                 ->groupBy('mime_type')
                                 ->get()
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
```

---

## 🔗 **PASO 5: API Resource**

### **5.1 FileResource**

```php
<?php
// app/Http/Resources/FileResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'original_name' => $this->original_name,
            'filename' => $this->filename,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'size_human' => $this->size_human,
            'description' => $this->description,
            'is_public' => $this->is_public,
            'is_image' => $this->is_image,
            'processed' => $this->processed,
            'url' => $this->url,
            'download_url' => $this->getDownloadUrl(),
            'metadata' => $this->metadata,
            'versions' => $this->whenLoaded('versions', function () {
                return $this->versions->map(function ($version) {
                    return [
                        'size_name' => $version->size_name,
                        'width' => $version->width,
                        'height' => $version->height,
                        'file_size' => $version->file_size,
                        'url' => $version->url
                    ];
                });
            }),
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'processed_at' => $this->processed_at
        ];
    }
}
```

---

## 🛣️ **PASO 6: Rutas API**

### **6.1 Rutas de Files**

```php
<?php
// routes/api.php - Agregar estas rutas

use App\Http\Controllers\FileController;

Route::middleware(['auth:sanctum'])->group(function () {
    // Files CRUD
    Route::apiResource('files', FileController::class);

    // Rutas adicionales
    Route::get('files/{file}/download', [FileController::class, 'download'])
         ->name('files.download');

    Route::get('files-stats', [FileController::class, 'stats'])
         ->name('files.stats');

    // Rutas públicas para archivos públicos
    Route::get('public/files/{file}', [FileController::class, 'show'])
         ->name('files.public')
         ->withoutMiddleware(['auth:sanctum']);
});
```

---

## ✅ **PASO 7: Testing**

### **7.1 Feature Test**

```php
<?php
// tests/Feature/FileManagementTest.php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
    }

    public function test_user_can_upload_file(): void
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('test.jpg');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/files', [
                'file' => $file,
                'description' => 'Test file upload'
            ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'original_name',
                        'mime_type',
                        'size',
                        'url'
                    ]
                ]);

        $this->assertDatabaseHas('files', [
            'user_id' => $user->id,
            'original_name' => 'test.jpg'
        ]);

        Storage::disk('local')->assertExists('uploads/' . date('Y/m/d') . '/' . File::first()->filename);
    }

    public function test_user_can_list_their_files(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        File::factory()->count(3)->create(['user_id' => $user->id]);
        File::factory()->count(2)->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/files');

        $response->assertStatus(200);
        $this->assertEquals(3, count($response->json('data')));
    }

    public function test_user_can_delete_their_file(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $file = File::factory()->create(['user_id' => $user->id]);

        // Simular archivo en storage
        Storage::disk('local')->put($file->path, 'fake content');

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/files/{$file->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('files', ['id' => $file->id]);
        Storage::disk('local')->assertMissing($file->path);
    }

    public function test_user_cannot_access_others_private_files(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $privateFile = File::factory()->create([
            'user_id' => $otherUser->id,
            'is_public' => false
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/files/{$privateFile->id}");

        $response->assertStatus(403);
    }
}
```

---

## 📋 **CRITERIOS DE EVALUACIÓN**

### **CORE (15 puntos)**

- [ ] Upload básico funciona correctamente (4 pts)
- [ ] Validación de archivos implementada (3 pts)
- [ ] CRUD completo de archivos (4 pts)
- [ ] Manejo de errores básico (2 pts)
- [ ] Tests feature pasan (2 pts)

### **ENHANCED (10 puntos)**

- [ ] Procesamiento de imágenes (3 pts)
- [ ] Multiple storage disks (3 pts)
- [ ] Streaming de archivos (2 pts)
- [ ] Metadata extraction (2 pts)

### **POLISH (5 puntos)**

- [ ] CDN integration (2 pts)
- [ ] Presigned URLs (2 pts)
- [ ] Cache implementation (1 pt)

---

## 🚀 **COMANDOS DE TESTING**

```bash
# Ejecutar migraciones
php artisan migrate:fresh --seed

# Crear link simbólico para storage
php artisan storage:link

# Ejecutar tests
php artisan test --filter FileManagementTest

# Limpiar cache
php artisan cache:clear
php artisan config:clear

# Verificar configuración
php artisan config:show filesystems
```

---

## 🎯 **ENTREGABLES**

Al completar este ejercicio debes tener:

1. ✅ **Sistema completo de upload** con validación y seguridad
2. ✅ **API endpoints** para CRUD de archivos
3. ✅ **Procesamiento básico** de imágenes
4. ✅ **Tests feature** funcionando correctamente
5. ✅ **Documentación** de endpoints API

---

**¡Crea un sistema de archivos robusto y seguro para tu API Laravel! 💾🚀**

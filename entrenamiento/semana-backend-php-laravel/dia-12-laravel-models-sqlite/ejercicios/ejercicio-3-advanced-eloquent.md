# 💻 EJERCICIO 3: Advanced Eloquent - File Management System

## Implementación MVP - 45 minutos

### 📋 **DESCRIPCIÓN**

Sistema avanzado de gestión de archivos con polymorphic relationships, eager loading, collection methods y query optimization.

---

## 🎯 **REQUERIMIENTOS**

### **FASE CORE ✅ (30 minutos)**

- ✅ Polymorphic attachments system
- ✅ Query optimization (N+1 prevention)
- ✅ Custom collection methods
- ✅ Advanced scopes y filtros

### **FASE ENHANCED ⚡ (15 minutos)**

- ⚡ Global scopes automáticos
- ⚡ Model observers para cleanup
- ⚡ Cache layers
- ⚡ Analytics y reporting

---

## 🏗️ **ARQUITECTURA POLYMORPHIC**

```text
Files (attachments) pueden pertenecer a:
- Products (product_images, manuals)
- Posts (featured_image, gallery)
- Users (avatar, documents)
- Comments (attachments)
```

---

## 🏗️ **PASO A PASO**

### **1. Crear Models y Migrations**

```bash
php artisan make:model File -mf
php artisan make:model FileCategory -mf
php artisan make:migration add_attachable_to_files_table
```

### **2. Files Migration**

```php
<?php
// TODO: Implementar files migration completa

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('file_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('original_name');
            $table->string('filename'); // stored filename
            $table->string('path');
            $table->string('disk', 20)->default('public');
            $table->string('mime_type', 100);
            $table->string('extension', 10);
            $table->unsignedBigInteger('size'); // bytes
            $table->json('metadata')->nullable(); // width, height, duration, etc.
            $table->string('hash', 64)->unique(); // prevent duplicates
            $table->boolean('is_public')->default(true);
            $table->timestamp('uploaded_at');
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();

            // Polymorphic relationship
            $table->morphs('attachable'); // attachable_id, attachable_type
            $table->string('attachment_type')->nullable(); // avatar, gallery, document
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            // TODO: Índices para performance
            $table->index(['attachable_type', 'attachable_id', 'attachment_type']);
            $table->index(['mime_type', 'size']);
            $table->index(['uploaded_by', 'uploaded_at']);
            $table->index('hash');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
```

### **3. File Categories Migration**

```php
<?php
// TODO: Implementar file_categories migration

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('file_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->string('slug', 60)->unique();
            $table->text('description')->nullable();
            $table->json('allowed_types')->nullable(); // ['image/jpeg', 'image/png']
            $table->bigInteger('max_size')->nullable(); // bytes
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('file_categories');
    }
};
```

---

## 🏗️ **IMPLEMENTAR MODELS**

### **File Model Template:**

```php
<?php
// app/Models/File.php - COMPLETAR

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'file_category_id', 'original_name', 'filename', 'path', 'disk',
        'mime_type', 'extension', 'size', 'metadata', 'hash', 'is_public',
        'uploaded_at', 'uploaded_by', 'attachable_type', 'attachable_id',
        'attachment_type', 'sort_order'
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_public' => 'boolean',
        'uploaded_at' => 'datetime',
    ];

    // TODO: Implementar relationships
    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(FileCategory::class, 'file_category_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    // TODO: Implementar scopes
    public function scopeImages(Builder $query): void
    {
        $query->where('mime_type', 'LIKE', 'image/%');
    }

    public function scopeDocuments(Builder $query): void
    {
        $query->whereIn('mime_type', [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ]);
    }

    public function scopeByType(Builder $query, string $attachmentType): void
    {
        $query->where('attachment_type', $attachmentType);
    }

    public function scopePublic(Builder $query): void
    {
        $query->where('is_public', true);
    }

    public function scopeOrderedBySort(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('created_at');
    }

    // TODO: Implementar accessors
    protected function url(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->is_public
                ? Storage::disk($this->disk)->url($this->path)
                : route('files.download', $this->id)
        );
    }

    protected function sizeFormatted(): Attribute
    {
        return Attribute::make(
            get: function () {
                $units = ['B', 'KB', 'MB', 'GB'];
                $size = $this->size;

                for ($i = 0; $size > 1024 && $i < count($units) - 1; $i++) {
                    $size /= 1024;
                }

                return round($size, 1) . ' ' . $units[$i];
            }
        );
    }

    protected function isImage(): Attribute
    {
        return Attribute::make(
            get: fn () => str_starts_with($this->mime_type, 'image/')
        );
    }

    protected function isDocument(): Attribute
    {
        return Attribute::make(
            get: fn () => in_array($this->mime_type, [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain'
            ])
        );
    }

    // TODO: Methods
    public function delete(): bool
    {
        // Delete physical file
        if (Storage::disk($this->disk)->exists($this->path)) {
            Storage::disk($this->disk)->delete($this->path);
        }

        return parent::delete();
    }

    public function duplicate(): self
    {
        $duplicate = $this->replicate();
        $duplicate->hash = null; // Allow duplicate
        $duplicate->filename = 'copy_' . $this->filename;
        $duplicate->save();

        return $duplicate;
    }
}
```

### **Trait para Models con Files:**

```php
<?php
// app/Traits/HasAttachments.php - CREAR

namespace App\Traits;

use App\Models\File;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasAttachments
{
    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'attachable');
    }

    public function images(): MorphMany
    {
        return $this->morphMany(File::class, 'attachable')->images();
    }

    public function documents(): MorphMany
    {
        return $this->morphMany(File::class, 'attachable')->documents();
    }

    public function getFilesByType(string $type): MorphMany
    {
        return $this->morphMany(File::class, 'attachable')->byType($type);
    }

    // TODO: Helper methods
    public function addFile(
        string $filePath,
        string $type = null,
        array $metadata = []
    ): File {
        // Implementation for adding files
    }

    public function getMainImage(): ?File
    {
        return $this->images()->orderBy('sort_order')->first();
    }

    public function hasFiles(): bool
    {
        return $this->files()->exists();
    }
}
```

---

## 🎯 **DESAFÍOS AVANZADOS**

### **Desafío 1: Custom Collection Methods**

```php
<?php
// app/Collections/FileCollection.php - CREAR

namespace App\Collections;

use Illuminate\Database\Eloquent\Collection;

class FileCollection extends Collection
{
    public function images(): self
    {
        return $this->filter(fn ($file) => $file->is_image);
    }

    public function documents(): self
    {
        return $this->filter(fn ($file) => $file->is_document);
    }

    public function totalSize(): int
    {
        return $this->sum('size');
    }

    public function totalSizeFormatted(): string
    {
        $totalBytes = $this->totalSize();
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $totalBytes > 1024 && $i < count($units) - 1; $i++) {
            $totalBytes /= 1024;
        }

        return round($totalBytes, 1) . ' ' . $units[$i];
    }

    public function groupByType(): self
    {
        return $this->groupBy('attachment_type');
    }

    public function byMimeType(string $mimeType): self
    {
        return $this->where('mime_type', $mimeType);
    }
}

// En File Model, agregar:
public function newCollection(array $models = []): FileCollection
{
    return new FileCollection($models);
}
```

### **Desafío 2: File Observer**

```php
<?php
// app/Observers/FileObserver.php - CREAR

namespace App\Observers;

use App\Models\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class FileObserver
{
    public function created(File $file): void
    {
        // Clear cache when new file is added
        Cache::forget("files.{$file->attachable_type}.{$file->attachable_id}");
    }

    public function updated(File $file): void
    {
        // Clear cache on update
        Cache::forget("files.{$file->attachable_type}.{$file->attachable_id}");
    }

    public function deleting(File $file): void
    {
        // Delete physical file before model deletion
        if (Storage::disk($file->disk)->exists($file->path)) {
            Storage::disk($file->disk)->delete($file->path);
        }
    }

    public function deleted(File $file): void
    {
        // Clear cache after deletion
        Cache::forget("files.{$file->attachable_type}.{$file->attachable_id}");
    }
}
```

### **Desafío 3: File Analytics Service**

```php
<?php
// app/Services/FileAnalyticsService.php - CREAR

namespace App\Services;

use App\Models\File;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class FileAnalyticsService
{
    public function getStorageStats(): array
    {
        $stats = File::select([
            DB::raw('COUNT(*) as total_files'),
            DB::raw('SUM(size) as total_size'),
            DB::raw('AVG(size) as avg_size')
        ])->first();

        return [
            'total_files' => $stats->total_files,
            'total_size' => $stats->total_size,
            'total_size_formatted' => $this->formatBytes($stats->total_size),
            'avg_size' => $stats->avg_size,
            'avg_size_formatted' => $this->formatBytes($stats->avg_size),
        ];
    }

    public function getFileTypeDistribution(): Collection
    {
        return File::select([
            'mime_type',
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(size) as total_size')
        ])
        ->groupBy('mime_type')
        ->orderByDesc('count')
        ->get()
        ->map(function ($item) {
            return [
                'mime_type' => $item->mime_type,
                'count' => $item->count,
                'total_size' => $this->formatBytes($item->total_size),
            ];
        });
    }

    public function getDiskUsage(): Collection
    {
        return File::select([
            'disk',
            DB::raw('COUNT(*) as file_count'),
            DB::raw('SUM(size) as used_space')
        ])
        ->groupBy('disk')
        ->get()
        ->map(function ($item) {
            return [
                'disk' => $item->disk,
                'file_count' => $item->file_count,
                'used_space' => $this->formatBytes($item->used_space),
            ];
        });
    }

    private function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 1) . ' ' . $units[$i];
    }
}
```

---

## 🧪 **TESTING IMPLEMENTATION**

```bash
# Crear factory y seeder
php artisan make:factory FileFactory
php artisan make:seeder FileSeeder

# Testing en tinker
php artisan tinker

# Crear datos de prueba
>>> File::factory(50)->create()
>>> User::factory(5)->create()
>>> Product::factory(10)->create()

# Probar relationships polymorphic
>>> $user = User::first()
>>> $user->files()->create(['filename' => 'avatar.jpg', ...])

# Probar scopes y collections
>>> File::images()->get()
>>> File::documents()->totalSizeFormatted()
>>> File::with(['attachable', 'uploader'])->get()

# Probar analytics
>>> app(FileAnalyticsService::class)->getStorageStats()
```

---

## ✅ **CRITERIOS DE EVALUACIÓN**

### **CORE (15 puntos)**

- [ ] Polymorphic relationships funcionando (4 pts)
- [ ] Migrations correctas con índices (3 pts)
- [ ] Scopes y accessors implementados (3 pts)
- [ ] Custom collection methods (3 pts)
- [ ] Factory genera datos válidos (2 pts)

### **ENHANCED (5 puntos)**

- [ ] File observer implementado (2 pts)
- [ ] Analytics service funcionando (2 pts)
- [ ] Cache implementation (1 pt)

---

## 🚀 **RETO EXTRA**

1. **Image processing** (resize, thumbnails)
2. **File versioning system**
3. **Virus scanning integration**
4. **CDN integration**
5. **Duplicate detection** mejorado

---

**¡Domina Eloquent avanzado y polymorphism!** 💪

# 🔗 Relationships Básicas

**⏱️ Tiempo:** 30 minutos (14:45-15:15)  
**🎯 Objetivo:** Implementar relaciones Eloquent entre modelos

## 🎯 Metodología MVP

### 🔧 FASE CORE (14:45-14:55) - 10 minutos

**Objetivo:** hasMany + belongsTo funcionando

**Entregables:**

- Relación Categoria -> Productos (hasMany)
- Relación Producto -> Categoria (belongsTo)
- Queries básicas funcionando

### ⚡ FASE ENHANCED (14:55-15:05) - 10 minutos

**Objetivo:** Eager loading optimizado

**Entregables:**

- with() para evitar N+1 queries
- Consultas optimizadas
- Performance mejorado

### ✨ FASE POLISH (15:05-15:15) - 10 minutos

**Objetivo:** Many-to-many básico

**Entregables:**

- Tabla pivot implementada
- belongsToMany funcionando
- Relaciones complejas operativas

## 📋 CORE: hasMany y belongsTo

### 1. Crear Model Categoria

```bash
# Crear migration y model para categorias
php artisan make:model Categoria -m
```

### 2. Migration de Categorias

```php
<?php
// database/migrations/YYYY_MM_DD_create_categorias_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categorias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->string('slug')->unique();
            $table->text('descripcion')->nullable();
            $table->string('icono')->nullable();
            $table->boolean('activa')->default(true);
            $table->timestamps();

            // Índices
            $table->index('activa');
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categorias');
    }
};
```

### 3. Actualizar Migration de Productos

```bash
# Crear migration para agregar foreign key
php artisan make:migration add_categoria_id_to_productos_table
```

```php
<?php
// Migration para agregar relación

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            // Agregar foreign key después de 'categoria'
            $table->foreignId('categoria_id')
                  ->nullable()
                  ->after('categoria')
                  ->constrained('categorias')
                  ->onDelete('set null');

            // Índice para performance
            $table->index('categoria_id');
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropForeign(['categoria_id']);
            $table->dropIndex(['productos_categoria_id_index']);
            $table->dropColumn('categoria_id');
        });
    }
};
```

### 4. Model Categoria Completo

```php
<?php
// app/Models/Categoria.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Categoria extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'icono',
        'activa',
    ];

    protected $casts = [
        'activa' => 'boolean',
    ];

    /**
     * RELACIÓN: Una categoría tiene muchos productos
     */
    public function productos()
    {
        return $this->hasMany(Producto::class);
    }

    /**
     * Accessor: URL amigable
     */
    public function getUrlAttribute(): string
    {
        return route('categorias.show', $this->slug);
    }

    /**
     * Mutator: Generar slug automáticamente
     */
    public function setNombreAttribute($value): void
    {
        $this->attributes['nombre'] = ucwords(strtolower(trim($value)));

        // Generar slug si no existe
        if (empty($this->attributes['slug'])) {
            $this->attributes['slug'] = Str::slug($value);
        }
    }

    /**
     * Scope: Solo categorías activas
     */
    public function scopeActivas($query)
    {
        return $query->where('activa', true);
    }

    /**
     * Scope: Con productos disponibles
     */
    public function scopeConProductos($query)
    {
        return $query->whereHas('productos', function ($q) {
            $q->where('activo', true)->where('stock', '>', 0);
        });
    }

    /**
     * Método: Contar productos activos
     */
    public function contarProductosActivos(): int
    {
        return $this->productos()->activos()->count();
    }

    /**
     * Método: Precio promedio de productos
     */
    public function precioPromedio(): float
    {
        return $this->productos()->activos()->avg('precio') ?? 0;
    }
}
```

### 5. Actualizar Model Producto

```php
<?php
// Agregar al Model Producto existente

/**
 * RELACIÓN: Un producto pertenece a una categoría
 */
public function categoria()
{
    return $this->belongsTo(Categoria::class);
}

/**
 * Accessor: Nombre de categoría
 */
public function getNombreCategoriaAttribute(): string
{
    return $this->categoria ? $this->categoria->nombre : 'Sin categoría';
}

/**
 * Scope: Por categoría usando relación
 */
public function scopePorCategoriaId($query, $categoriaId)
{
    return $query->where('categoria_id', $categoriaId);
}
```

## ⚡ ENHANCED: Eager Loading

### 1. Consultas Optimizadas

```php
<?php
// Ejemplos de Eager Loading para evitar N+1 queries

// ❌ MAL: N+1 Query Problem
$productos = App\Models\Producto::all();
foreach ($productos as $producto) {
    echo $producto->categoria->nombre; // Query por cada producto!
}

// ✅ BIEN: Eager Loading
$productos = App\Models\Producto::with('categoria')->get();
foreach ($productos as $producto) {
    echo $producto->categoria->nombre; // Solo 2 queries total
}

// Múltiples relaciones
$productos = App\Models\Producto::with(['categoria'])
                               ->activos()
                               ->get();

// Eager loading condicional
$productos = App\Models\Producto::with(['categoria' => function ($query) {
                                   $query->activas();
                               }])
                               ->get();
```

### 2. Optimización en Controller

```php
<?php
// En ProductoController::index()

public function index(Request $request)
{
    $query = Producto::with('categoria'); // Eager loading automático

    // Resto del código igual...
    $productos = $query->paginate(15);

    return view('productos.index', compact('productos'));
}
```

## ✨ POLISH: Many-to-Many

### 1. Crear Tabla Pivot (Tags)

```bash
# Crear modelo y migration para tags
php artisan make:model Tag -m

# Crear tabla pivot
php artisan make:migration create_producto_tag_table
```

### 2. Migrations para Many-to-Many

```php
<?php
// Migration para tags
Schema::create('tags', function (Blueprint $table) {
    $table->id();
    $table->string('nombre')->unique();
    $table->string('slug')->unique();
    $table->string('color')->default('#007bff');
    $table->timestamps();
});

// Migration para tabla pivot
Schema::create('producto_tag', function (Blueprint $table) {
    $table->id();
    $table->foreignId('producto_id')->constrained()->onDelete('cascade');
    $table->foreignId('tag_id')->constrained()->onDelete('cascade');
    $table->timestamps();

    // Índice único para evitar duplicados
    $table->unique(['producto_id', 'tag_id']);
});
```

### 3. Models con Many-to-Many

```php
<?php
// En Model Producto
public function tags()
{
    return $this->belongsToMany(Tag::class)
                ->withTimestamps();
}

// En Model Tag
namespace App\Models;

class Tag extends Model
{
    protected $fillable = ['nombre', 'slug', 'color'];

    public function productos()
    {
        return $this->belongsToMany(Producto::class)
                    ->withTimestamps();
    }
}
```

## 🧪 Verificación y Testing

### Script de Testing Completo

```php
<?php
// Testing de relaciones en tinker

echo "🧪 TESTING RELATIONSHIPS\n";

// 1. Crear categorías
$electronica = App\Models\Categoria::create([
    'nombre' => 'Electrónica',
    'descripcion' => 'Productos electrónicos y tecnología'
]);

$gaming = App\Models\Categoria::create([
    'nombre' => 'Gaming',
    'descripcion' => 'Productos para videojuegos'
]);

// 2. Asignar productos a categorías
App\Models\Producto::where('categoria', 'electronica')
                   ->update(['categoria_id' => $electronica->id]);

// 3. Test hasMany
$productosElectronica = $electronica->productos;
echo "📱 Productos en Electrónica: " . $productosElectronica->count();

// 4. Test belongsTo
$producto = App\Models\Producto::with('categoria')->first();
echo "🔗 Producto: {$producto->nombre} - Categoría: {$producto->categoria->nombre}";

echo "✅ Relationships funcionando correctamente";
```

## ✅ Entregables de esta Sección

- [ ] Model Categoria creado con migration
- [ ] Relación hasMany (Categoria -> Productos) funcionando
- [ ] Relación belongsTo (Producto -> Categoria) funcionando
- [ ] Foreign key constraints implementadas
- [ ] Eager loading optimizado
- [ ] Many-to-many básico (opcional)
- [ ] Testing de relaciones exitoso

## ➡️ Preparación para Sección 05

**Próximo paso:** Crear el MVP completo de Products CRUD con UI en la Sección 05.

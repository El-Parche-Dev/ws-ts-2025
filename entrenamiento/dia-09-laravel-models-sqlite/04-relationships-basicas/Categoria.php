<?php
/**
 * Model: Categoria
 * WorldSkills 2025 - Laravel Relationships
 * Tiempo: CORE (10 minutos)
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Categoria extends Model
{
    use HasFactory;

    /**
     * Campos asignables masivamente
     */
    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'icono',
        'activa',
    ];

    /**
     * Casts de atributos
     */
    protected $casts = [
        'activa' => 'boolean',
    ];

    // ========================================
    // RELACIONES - CORE PHASE
    // ========================================

    /**
     * RELACIÓN: Una categoría tiene muchos productos
     * Tipo: One-to-Many (hasMany)
     */
    public function productos()
    {
        return $this->hasMany(Producto::class);
    }

    // ========================================
    // ACCESSORS - ENHANCED PHASE
    // ========================================

    /**
     * Accessor: URL amigable para la categoría
     */
    public function getUrlAttribute(): string
    {
        return route('categorias.show', $this->slug);
    }

    /**
     * Accessor: Icono con fallback
     */
    public function getIconoDisplayAttribute(): string
    {
        return $this->icono ?: '📦';
    }

    // ========================================
    // MUTATORS - ENHANCED PHASE
    // ========================================

    /**
     * Mutator: Generar slug automáticamente al establecer nombre
     */
    public function setNombreAttribute($value): void
    {
        $this->attributes['nombre'] = ucwords(strtolower(trim($value)));
        
        // Generar slug automáticamente si no existe
        if (empty($this->attributes['slug'])) {
            $this->attributes['slug'] = Str::slug($value);
        }
    }

    // ========================================
    // SCOPES - ENHANCED PHASE
    // ========================================

    /**
     * Scope: Solo categorías activas
     */
    public function scopeActivas($query)
    {
        return $query->where('activa', true);
    }

    /**
     * Scope: Categorías que tienen productos disponibles
     */
    public function scopeConProductosDisponibles($query)
    {
        return $query->whereHas('productos', function ($q) {
            $q->where('activo', true)->where('stock', '>', 0);
        });
    }

    /**
     * Scope: Ordenar por número de productos
     */
    public function scopeOrdenPorProductos($query, $direccion = 'desc')
    {
        return $query->withCount('productos')
                     ->orderBy('productos_count', $direccion);
    }

    // ========================================
    // MÉTODOS DE NEGOCIO - ENHANCED PHASE
    // ========================================

    /**
     * Contar productos activos en esta categoría
     */
    public function contarProductosActivos(): int
    {
        return $this->productos()->where('activo', true)->count();
    }

    /**
     * Contar productos disponibles (activos Y con stock)
     */
    public function contarProductosDisponibles(): int
    {
        return $this->productos()
                    ->where('activo', true)
                    ->where('stock', '>', 0)
                    ->count();
    }

    /**
     * Obtener precio promedio de productos en esta categoría
     */
    public function precioPromedio(): float
    {
        return $this->productos()
                    ->where('activo', true)
                    ->avg('precio') ?? 0;
    }

    /**
     * Obtener producto más caro de la categoría
     */
    public function productoMasCaro()
    {
        return $this->productos()
                    ->where('activo', true)
                    ->orderBy('precio', 'desc')
                    ->first();
    }

    /**
     * Obtener producto más barato de la categoría
     */
    public function productoMasBarato()
    {
        return $this->productos()
                    ->where('activo', true)
                    ->orderBy('precio', 'asc')
                    ->first();
    }

    /**
     * Verificar si la categoría tiene productos
     */
    public function tieneProductos(): bool
    {
        return $this->productos()->exists();
    }

    /**
     * Verificar si se puede eliminar la categoría
     */
    public function puedeEliminarse(): bool
    {
        return !$this->tieneProductos();
    }

    // ========================================
    // MÉTODOS ESTÁTICOS - POLISH PHASE
    // ========================================

    /**
     * Obtener categorías con estadísticas
     */
    public static function conEstadisticas()
    {
        return self::withCount([
            'productos',
            'productos as productos_activos_count' => function ($query) {
                $query->where('activo', true);
            },
            'productos as productos_disponibles_count' => function ($query) {
                $query->where('activo', true)->where('stock', '>', 0);
            }
        ])->get();
    }

    /**
     * Obtener categorías más populares (con más productos)
     */
    public static function masPopulares($limite = 5)
    {
        return self::activas()
                   ->withCount('productos')
                   ->orderBy('productos_count', 'desc')
                   ->take($limite)
                   ->get();
    }

    /**
     * Buscar categorías por nombre
     */
    public static function buscarPorNombre($termino)
    {
        return self::where('nombre', 'like', "%{$termino}%")
                   ->orWhere('descripcion', 'like', "%{$termino}%")
                   ->activas()
                   ->get();
    }
}

/*
INSTRUCCIONES DE USO:

1. Copiar este archivo a: app/Models/Categoria.php

2. Ejecutar migrations:
   php artisan make:migration create_categorias_table
   php artisan make:migration add_categoria_id_to_productos_table
   php artisan migrate

3. Probar relaciones en tinker:
   php artisan tinker
   
   // Crear categoría
   $categoria = Categoria::create([
       'nombre' => 'Electrónica',
       'descripcion' => 'Productos tecnológicos'
   ]);
   
   // Asignar productos a categoría
   $producto = Producto::first();
   $producto->categoria_id = $categoria->id;
   $producto->save();
   
   // Test hasMany
   $categoria->productos; // Obtiene todos los productos
   
   // Test métodos
   $categoria->contarProductosActivos();
   $categoria->precioPromedio();

RELACIONES IMPLEMENTADAS:

CORE:
✅ hasMany: Categoria -> Productos
✅ Queries básicas funcionando

ENHANCED:
✅ Scopes para filtrado
✅ Métodos de negocio
✅ Eager loading preparado

POLISH:
✅ Métodos estáticos avanzados
✅ Estadísticas automáticas
✅ Búsquedas optimizadas

PRÓXIMO PASO:
1. Actualizar Model Producto con belongsTo
2. Crear migrations correspondientes
3. Testing completo de relaciones
*/

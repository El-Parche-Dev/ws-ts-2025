<?php
/**
 * Model: Producto
 * WorldSkills 2025 - Laravel Models + SQLite
 * Tiempo: CORE + ENHANCED
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el model
     */
    protected $table = 'productos';

    /**
     * Los atributos que se pueden asignar masivamente
     * CORE: Campos básicos necesarios
     */
    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'stock',
        'activo',
        // ENHANCED: Campos adicionales
        'codigo_sku',
        'imagen',
        'peso',
        'categoria',
        'especificaciones',
        'fecha_vencimiento',
    ];

    /**
     * Los atributos que deben ser casteados
     * CORE: Tipos básicos
     */
    protected $casts = [
        'precio' => 'decimal:2',
        'activo' => 'boolean',
        'stock' => 'integer',
        // ENHANCED: Casts adicionales
        'peso' => 'decimal:3',
        'especificaciones' => 'array', // JSON -> Array automático
        'fecha_vencimiento' => 'datetime',
    ];

    /**
     * Campos ocultos en serialización JSON
     * ENHANCED: Para APIs limpias
     */
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    // ========================================
    // ACCESSORS - ENHANCED PHASE
    // ========================================

    /**
     * Accessor: Precio formateado para mostrar
     */
    public function getPrecioFormateadoAttribute(): string
    {
        return '$' . number_format($this->precio, 2, ',', '.');
    }

    /**
     * Accessor: Estado del stock legible
     */
    public function getEstadoStockAttribute(): string
    {
        if ($this->stock <= 0) {
            return 'Sin stock';
        } elseif ($this->stock <= 10) {
            return 'Stock bajo';
        } else {
            return 'En stock';
        }
    }

    /**
     * Accessor: URL completa de imagen
     */
    public function getImagenUrlAttribute(): string
    {
        if ($this->imagen) {
            return asset('storage/' . $this->imagen);
        }
        return asset('images/no-imagen.png');
    }

    // ========================================
    // MUTATORS - ENHANCED PHASE
    // ========================================

    /**
     * Mutator: Formatear nombre al guardar
     */
    public function setNombreAttribute($value): void
    {
        $this->attributes['nombre'] = ucwords(strtolower(trim($value)));
    }

    /**
     * Mutator: Formatear SKU al guardar
     */
    public function setCodigoSkuAttribute($value): void
    {
        $this->attributes['codigo_sku'] = strtoupper(trim($value));
    }

    // ========================================
    // SCOPES - ENHANCED PHASE
    // ========================================

    /**
     * Scope: Solo productos activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope: Solo productos con stock
     */
    public function scopeEnStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    /**
     * Scope: Filtrar por categoría
     */
    public function scopePorCategoria($query, $categoria)
    {
        return $query->where('categoria', $categoria);
    }

    /**
     * Scope: Buscar por nombre
     */
    public function scopeBuscarPorNombre($query, $termino)
    {
        return $query->where('nombre', 'like', '%' . $termino . '%');
    }

    /**
     * Scope: Productos disponibles (activos Y con stock)
     */
    public function scopeDisponibles($query)
    {
        return $query->activos()->enStock();
    }

    /**
     * Scope: Filtrar por rango de precios
     */
    public function scopeEntrePrecio($query, $min, $max)
    {
        return $query->whereBetween('precio', [$min, $max]);
    }

    // ========================================
    // MÉTODOS DE NEGOCIO - ENHANCED PHASE
    // ========================================

    /**
     * Verificar si el producto está disponible para venta
     */
    public function estaDisponible(): bool
    {
        return $this->activo && $this->stock > 0;
    }

    /**
     * Reducir stock del producto
     */
    public function reducirStock(int $cantidad): bool
    {
        if ($this->stock >= $cantidad) {
            $this->stock -= $cantidad;
            return $this->save();
        }
        return false;
    }

    /**
     * Aumentar stock del producto
     */
    public function aumentarStock(int $cantidad): bool
    {
        $this->stock += $cantidad;
        return $this->save();
    }

    /**
     * Aplicar descuento al precio
     */
    public function aplicarDescuento(float $porcentaje): float
    {
        return $this->precio * (1 - $porcentaje / 100);
    }

    /**
     * Verificar si necesita restock
     */
    public function necesitaRestock(int $minimo = 10): bool
    {
        return $this->stock <= $minimo;
    }

    // ========================================
    // MÉTODOS ESTÁTICOS - POLISH PHASE
    // ========================================

    /**
     * Obtener categorías únicas
     */
    public static function obtenerCategorias(): array
    {
        return self::distinct('categoria')
            ->whereNotNull('categoria')
            ->pluck('categoria')
            ->toArray();
    }

    /**
     * Obtener estadísticas básicas
     */
    public static function obtenerEstadisticas(): array
    {
        return [
            'total' => self::count(),
            'activos' => self::activos()->count(),
            'en_stock' => self::enStock()->count(),
            'disponibles' => self::disponibles()->count(),
            'sin_stock' => self::where('stock', 0)->count(),
            'valor_inventario' => self::activos()->sum('precio'),
            'precio_promedio' => self::activos()->avg('precio'),
        ];
    }

    /**
     * Buscar productos por múltiples criterios
     */
    public static function buscarAvanzado(array $criterios)
    {
        $query = self::query();

        if (!empty($criterios['nombre'])) {
            $query->buscarPorNombre($criterios['nombre']);
        }

        if (!empty($criterios['categoria'])) {
            $query->porCategoria($criterios['categoria']);
        }

        if (isset($criterios['precio_min']) && isset($criterios['precio_max'])) {
            $query->entrePrecio($criterios['precio_min'], $criterios['precio_max']);
        }

        if (!empty($criterios['solo_activos'])) {
            $query->activos();
        }

        if (!empty($criterios['solo_en_stock'])) {
            $query->enStock();
        }

        return $query;
    }
}

/*
INSTRUCCIONES DE USO:

1. Copiar este archivo a: app/Models/Producto.php

2. Asegurarse de que la migration esté ejecutada:
   php artisan migrate

3. Probar el model en tinker:
   php artisan tinker
   
   // Crear producto
   $producto = Producto::create([
       'nombre' => 'iphone 15 pro',
       'precio' => 4999.99,
       'stock' => 50
   ]);
   
   // Usar accessors
   echo $producto->precio_formateado;
   echo $producto->estado_stock;
   
   // Usar scopes
   Producto::activos()->get();
   Producto::enStock()->get();
   Producto::disponibles()->get();

FEATURES PRINCIPALES:

CORE (Básico):
- Fillable, casts básicos
- Funcionalidad de creación/lectura

ENHANCED (Avanzado):
- Accessors para formateo automático
- Mutators para validación de datos
- Scopes para queries comunes
- Métodos de negocio

POLISH (Profesional):
- Métodos estáticos para estadísticas
- Búsqueda avanzada
- Gestión de inventario

PRÓXIMO PASO:
Continuar con Sección 03: Eloquent CRUD Operations
*/

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modelo Product para WorldSkills 2025
 * Implementa todas las relaciones y funcionalidades requeridas
 */
class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'price',
        'cost_price',
        'category_id',
        'sku',
        'stock',
        'min_stock',
        'weight',
        'dimensions',
        'active',
        'featured',
        'meta_title',
        'meta_description',
        'tags'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'stock' => 'integer',
        'min_stock' => 'integer',
        'weight' => 'decimal:2',
        'active' => 'boolean',
        'featured' => 'boolean',
        'dimensions' => 'array',
        'tags' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    protected $hidden = [
        'cost_price', // Ocultar precio de costo en API
        'deleted_at'
    ];

    protected $appends = [
        'formatted_price',
        'profit_margin',
        'stock_status',
        'image_url'
    ];

    // ========== RELACIONES ==========

    /**
     * Relación con categoría
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relación con imágenes del producto
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Relación con reviews
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    /**
     * Relación con items de pedidos
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // ========== ACCESSORS ==========

    /**
     * Precio formateado
     */
    public function getFormattedPriceAttribute(): string
    {
        return '$' . number_format($this->price, 2, ',', '.');
    }

    /**
     * Margen de ganancia
     */
    public function getProfitMarginAttribute(): float
    {
        if ($this->cost_price > 0) {
            return round((($this->price - $this->cost_price) / $this->cost_price) * 100, 2);
        }
        return 0;
    }

    /**
     * Estado del stock
     */
    public function getStockStatusAttribute(): string
    {
        if ($this->stock <= 0) {
            return 'out_of_stock';
        } elseif ($this->stock <= $this->min_stock) {
            return 'low_stock';
        } else {
            return 'in_stock';
        }
    }

    /**
     * URL de imagen principal
     */
    public function getImageUrlAttribute(): ?string
    {
        $mainImage = $this->images()->where('is_primary', true)->first();
        return $mainImage ? asset('storage/' . $mainImage->path) : null;
    }

    /**
     * Rating promedio
     */
    public function getAverageRatingAttribute(): float
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }

    /**
     * Total de reviews
     */
    public function getReviewsCountAttribute(): int
    {
        return $this->reviews()->count();
    }

    // ========== MUTATORS ==========

    /**
     * Normalizar nombre del producto
     */
    public function setNameAttribute($value): void
    {
        $this->attributes['name'] = ucwords(strtolower(trim($value)));
    }

    /**
     * Generar SKU automáticamente si no se proporciona
     */
    public function setSkuAttribute($value): void
    {
        if (empty($value)) {
            $this->attributes['sku'] = 'PRD-' . strtoupper(substr(uniqid(), -8));
        } else {
            $this->attributes['sku'] = strtoupper(trim($value));
        }
    }

    /**
     * Normalizar tags
     */
    public function setTagsAttribute($value): void
    {
        if (is_string($value)) {
            $this->attributes['tags'] = json_encode(array_map('trim', explode(',', $value)));
        } elseif (is_array($value)) {
            $this->attributes['tags'] = json_encode(array_map('trim', $value));
        }
    }

    // ========== SCOPES ==========

    /**
     * Productos activos
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Productos destacados
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    /**
     * Productos en stock
     */
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    /**
     * Productos con stock bajo
     */
    public function scopeLowStock($query)
    {
        return $query->whereRaw('stock <= min_stock');
    }

    /**
     * Búsqueda por nombre o descripción
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('sku', 'like', "%{$search}%");
        });
    }

    /**
     * Filtrar por rango de precios
     */
    public function scopePriceRange($query, $minPrice = null, $maxPrice = null)
    {
        if ($minPrice) {
            $query->where('price', '>=', $minPrice);
        }
        if ($maxPrice) {
            $query->where('price', '<=', $maxPrice);
        }
        return $query;
    }

    /**
     * Filtrar por categoría
     */
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    // ========== MÉTODOS DE NEGOCIO ==========

    /**
     * Reducir stock del producto
     */
    public function reduceStock(int $quantity): bool
    {
        if ($this->stock >= $quantity) {
            $this->stock -= $quantity;
            $this->save();
            return true;
        }
        return false;
    }

    /**
     * Incrementar stock del producto
     */
    public function increaseStock(int $quantity): void
    {
        $this->stock += $quantity;
        $this->save();
    }

    /**
     * Verificar si el producto está disponible
     */
    public function isAvailable(): bool
    {
        return $this->active && $this->stock > 0;
    }

    /**
     * Calcular descuento
     */
    public function calculateDiscount(float $percentage): float
    {
        return round($this->price * (1 - $percentage / 100), 2);
    }

    /**
     * Obtener productos relacionados
     */
    public function getRelatedProducts(int $limit = 4)
    {
        return static::where('category_id', $this->category_id)
                    ->where('id', '!=', $this->id)
                    ->active()
                    ->inStock()
                    ->limit($limit)
                    ->get();
    }
}

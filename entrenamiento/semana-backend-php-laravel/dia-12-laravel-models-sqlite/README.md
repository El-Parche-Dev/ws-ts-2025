# 🗄️ DÍA 12: Laravel Models + SQLite (6 horas)

## 🎯 **OBJETIVO GENERAL**

Dominar Laravel Eloquent ORM, SQLite, migrations, relationships, y factories para desarrollo de APIs profesionales.

---

## ⏰ **CRONOGRAMA INTENSIVO**

### **12:00 - 13:30 | Módulo 1: SQLite + Migrations** (90 min)

- ✅ Configuración SQLite en Laravel
- ✅ Migrations avanzadas con índices
- ✅ Seeders con Factory Pattern
- ✅ **EJERCICIO 1**: Sistema de productos con categorías

### **13:30 - 14:00 | DESCANSO** ☕

### **14:00 - 15:30 | Módulo 2: Eloquent ORM Mastery** (90 min)

- ✅ Model relationships (1:1, 1:N, N:N)
- ✅ Query Builder vs Eloquent
- ✅ Scopes y Mutators/Accessors
- ✅ **EJERCICIO 2**: Blog con usuarios, posts y comentarios

### **15:30 - 16:00 | DESCANSO** ☕

### **16:00 - 17:30 | Módulo 3: Advanced Eloquent** (90 min)

- ✅ Eager Loading y N+1 Problem
- ✅ Polymorphic Relationships
- ✅ Collection Methods avanzados
- ✅ **EJERCICIO 3**: Sistema de archivos adjuntos

### **17:30 - 18:00 | Módulo 4: Testing + Validación** (30 min)

- ✅ Feature Tests con SQLite en memoria
- ✅ Model Factories para testing
- ✅ **VALIDACIÓN FINAL**: Proyecto integrador

---

## 🏗️ **MÓDULO 1: SQLite + Migrations**

### **SQLite Configuration**

```php
// config/database.php
'connections' => [
    'sqlite' => [
        'driver' => 'sqlite',
        'url' => env('DATABASE_URL'),
        'database' => env('DB_DATABASE', database_path('database.sqlite')),
        'prefix' => '',
        'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
    ],
],
```

```bash
# .env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
# O para desarrollo:
DB_DATABASE=database/database.sqlite
```

### **Advanced Migrations**

```php
<?php
// database/migrations/2024_01_12_000001_create_categories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('slug', 120)->unique();
            $table->text('description')->nullable();
            $table->string('color', 7)->default('#3B82F6'); // Hex color
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable(); // JSON column
            $table->timestamps();

            // Índices para performance
            $table->index(['is_active', 'name']);
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

```php
<?php
// database/migrations/2024_01_12_000002_create_products_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('name', 200);
            $table->string('slug', 220)->unique();
            $table->text('description');
            $table->decimal('price', 10, 2); // 99999999.99
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->string('sku', 50)->unique();
            $table->json('images')->nullable(); // Array de URLs
            $table->json('attributes')->nullable(); // Color, talla, etc.
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->decimal('weight', 8, 2)->nullable(); // Para envíos
            $table->string('barcode', 100)->nullable();
            $table->timestamps();

            // Índices compuestos para consultas complejas
            $table->index(['category_id', 'status', 'created_at']);
            $table->index(['price', 'sale_price']);
            $table->index('sku');
            $table->fullText(['name', 'description']); // Para búsquedas
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

### **Model Factories**

```php
<?php
// database/factories/CategoryFactory.php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->unique()->words(2, true);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraph(3),
            'color' => $this->faker->hexColor(),
            'is_active' => $this->faker->boolean(85), // 85% true
            'metadata' => [
                'seo_title' => $name . ' - Tienda Online',
                'seo_description' => $this->faker->sentence(10),
                'featured' => $this->faker->boolean(20),
                'sort_order' => $this->faker->numberBetween(1, 100)
            ]
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'metadata->featured' => true,
        ]);
    }
}
```

```php
<?php
// database/factories/ProductFactory.php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->words(3, true);
        $price = $this->faker->randomFloat(2, 10, 999);
        $hasSale = $this->faker->boolean(30);

        return [
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraphs(3, true),
            'price' => $price,
            'sale_price' => $hasSale ? $price * 0.8 : null,
            'stock' => $this->faker->numberBetween(0, 100),
            'sku' => strtoupper($this->faker->unique()->bothify('SKU-###-???')),
            'images' => [
                $this->faker->imageUrl(800, 600, 'products'),
                $this->faker->imageUrl(800, 600, 'products'),
                $this->faker->imageUrl(800, 600, 'products'),
            ],
            'attributes' => [
                'color' => $this->faker->safeColorName(),
                'size' => $this->faker->randomElement(['XS', 'S', 'M', 'L', 'XL']),
                'material' => $this->faker->randomElement(['Cotton', 'Polyester', 'Wool', 'Silk']),
                'brand' => $this->faker->company(),
            ],
            'status' => $this->faker->randomElement(['draft', 'published', 'archived']),
            'weight' => $this->faker->randomFloat(2, 0.1, 5.0),
            'barcode' => $this->faker->ean13(),
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }

    public function onSale(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'sale_price' => $attributes['price'] * 0.75,
            ];
        });
    }

    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
        ]);
    }
}
```

### **Database Seeder**

```php
<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Crear categorías específicas
        $electronics = Category::factory()->create([
            'name' => 'Electrónicos',
            'slug' => 'electronicos',
            'color' => '#3B82F6',
        ]);

        $clothing = Category::factory()->create([
            'name' => 'Ropa',
            'slug' => 'ropa',
            'color' => '#EF4444',
        ]);

        $books = Category::factory()->create([
            'name' => 'Libros',
            'slug' => 'libros',
            'color' => '#10B981',
        ]);

        // Crear 5 categorías adicionales aleatorias
        Category::factory(5)->create();

        // Crear productos para cada categoría
        Product::factory(10)->published()->create(['category_id' => $electronics->id]);
        Product::factory(15)->published()->create(['category_id' => $clothing->id]);
        Product::factory(8)->published()->create(['category_id' => $books->id]);

        // Crear productos aleatorios
        Product::factory(50)->create();

        // Crear algunos productos en oferta
        Product::factory(10)->onSale()->published()->create();

        // Crear algunos productos sin stock
        Product::factory(5)->outOfStock()->create();
    }
}
```

---

## 🏗️ **MÓDULO 2: Eloquent ORM Mastery**

### **Model Relationships**

```php
<?php
// app/Models/Category.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'is_active',
        'metadata'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'metadata' => 'array',
    ];

    // Relationships
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function activeProducts(): HasMany
    {
        return $this->hasMany(Product::class)->where('status', 'published');
    }

    // Scopes
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): void
    {
        $query->whereJsonContains('metadata->featured', true);
    }

    // Accessors & Mutators
    public function getProductCountAttribute(): int
    {
        return $this->products()->count();
    }

    public function setNameAttribute(string $value): void
    {
        $this->attributes['name'] = ucfirst(trim($value));
        $this->attributes['slug'] = \Str::slug($value);
    }

    // URL Generation
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getUrlAttribute(): string
    {
        return route('categories.show', $this->slug);
    }
}
```

```php
<?php
// app/Models/Product.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'sale_price',
        'stock',
        'sku',
        'images',
        'attributes',
        'status',
        'weight',
        'barcode'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'weight' => 'decimal:2',
        'images' => 'array',
        'attributes' => 'array',
    ];

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Scopes
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published');
    }

    public function scopeInStock(Builder $query): void
    {
        $query->where('stock', '>', 0);
    }

    public function scopeOnSale(Builder $query): void
    {
        $query->whereNotNull('sale_price');
    }

    public function scopeByCategory(Builder $query, string $categorySlug): void
    {
        $query->whereHas('category', function (Builder $q) use ($categorySlug) {
            $q->where('slug', $categorySlug);
        });
    }

    public function scopeSearch(Builder $query, string $term): void
    {
        $query->where(function (Builder $q) use ($term) {
            $q->where('name', 'LIKE', "%{$term}%")
              ->orWhere('description', 'LIKE', "%{$term}%")
              ->orWhere('sku', 'LIKE', "%{$term}%");
        });
    }

    // Accessors usando PHP 8 Attributes
    protected function finalPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->sale_price ?? $this->price,
        );
    }

    protected function isOnSale(): Attribute
    {
        return Attribute::make(
            get: fn () => !is_null($this->sale_price),
        );
    }

    protected function discountPercentage(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->is_on_sale) {
                    return 0;
                }
                return round((($this->price - $this->sale_price) / $this->price) * 100);
            }
        );
    }

    protected function primaryImage(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->images[0] ?? '/images/no-image.jpg',
        );
    }

    // Mutators
    protected function name(): Attribute
    {
        return Attribute::make(
            set: function (string $value) {
                $this->attributes['slug'] = \Str::slug($value);
                return ucwords(trim($value));
            }
        );
    }

    // Methods
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function isAvailable(): bool
    {
        return $this->status === 'published' && $this->stock > 0;
    }

    public function addToStock(int $quantity): self
    {
        $this->increment('stock', $quantity);
        return $this;
    }

    public function removeFromStock(int $quantity): bool
    {
        if ($this->stock >= $quantity) {
            $this->decrement('stock', $quantity);
            return true;
        }
        return false;
    }
}
```

---

## 🏗️ **MÓDULO 3: Advanced Eloquent**

### **Eager Loading & N+1 Prevention**

```php
<?php
// app/Http/Controllers/ProductController.php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ProductController extends Controller
{
    public function index(Request $request): View
    {
        // ❌ BAD: N+1 Problem
        // $products = Product::published()->paginate(12);
        // En la vista: $product->category->name genera N consultas

        // ✅ GOOD: Eager Loading
        $products = Product::with(['category'])
            ->published()
            ->when($request->category, function ($query, $category) {
                $query->byCategory($category);
            })
            ->when($request->search, function ($query, $search) {
                $query->search($search);
            })
            ->when($request->on_sale, function ($query) {
                $query->onSale();
            })
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        $categories = Category::active()
            ->withCount('activeProducts')
            ->orderBy('name')
            ->get();

        return view('products.index', compact('products', 'categories'));
    }

    public function show(Product $product): View
    {
        // Cargar relaciones específicas
        $product->load(['category', 'reviews.user']);

        // Productos relacionados
        $relatedProducts = Product::with('category')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->published()
            ->inStock()
            ->limit(4)
            ->get();

        return view('products.show', compact('product', 'relatedProducts'));
    }

    public function byCategory(Category $category): View
    {
        $products = $category->activeProducts()
            ->with('category')
            ->orderBy('name')
            ->paginate(12);

        return view('products.category', compact('category', 'products'));
    }
}
```

### **Advanced Collection Methods**

```php
<?php
// app/Services/ProductAnalyticsService.php

namespace App\Services;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Collection;

class ProductAnalyticsService
{
    public function getCategoryStats(): Collection
    {
        return Category::with(['products'])
            ->get()
            ->map(function (Category $category) {
                $products = $category->products;

                return [
                    'name' => $category->name,
                    'total_products' => $products->count(),
                    'published_products' => $products->where('status', 'published')->count(),
                    'avg_price' => $products->avg('price'),
                    'total_stock' => $products->sum('stock'),
                    'on_sale_count' => $products->whereNotNull('sale_price')->count(),
                    'out_of_stock_count' => $products->where('stock', 0)->count(),
                ];
            })
            ->sortByDesc('total_products');
    }

    public function getTopSellingProducts(int $limit = 10): Collection
    {
        return Product::with('category')
            ->published()
            ->get()
            ->sortByDesc(function (Product $product) {
                // Simulamos ventas basadas en stock inicial menos stock actual
                return 100 - $product->stock; // Lógica simplificada
            })
            ->take($limit)
            ->values();
    }

    public function getPriceAnalysis(): array
    {
        $products = Product::published()
            ->whereNotNull('price')
            ->get();

        $prices = $products->pluck('price');

        return [
            'min_price' => $prices->min(),
            'max_price' => $prices->max(),
            'avg_price' => $prices->avg(),
            'median_price' => $prices->median(),
            'total_products' => $products->count(),
            'price_ranges' => [
                '0-50' => $products->whereBetween('price', [0, 50])->count(),
                '51-100' => $products->whereBetween('price', [51, 100])->count(),
                '101-200' => $products->whereBetween('price', [101, 200])->count(),
                '201+' => $products->where('price', '>', 200)->count(),
            ],
            'on_sale_stats' => [
                'total_on_sale' => $products->whereNotNull('sale_price')->count(),
                'avg_discount' => $products->whereNotNull('sale_price')
                    ->map(fn ($p) => $p->discount_percentage)
                    ->avg(),
            ]
        ];
    }

    public function getInventoryReport(): Collection
    {
        return Product::with('category')
            ->get()
            ->groupBy('category.name')
            ->map(function (Collection $products, string $categoryName) {
                return [
                    'category' => $categoryName,
                    'products' => $products->map(function (Product $product) {
                        return [
                            'name' => $product->name,
                            'sku' => $product->sku,
                            'stock' => $product->stock,
                            'price' => $product->price,
                            'status' => $product->status,
                            'inventory_value' => $product->stock * $product->price,
                            'needs_restock' => $product->stock <= 5,
                        ];
                    })->sortBy('stock'),
                    'total_value' => $products->sum(fn ($p) => $p->stock * $p->price),
                    'low_stock_count' => $products->where('stock', '<=', 5)->count(),
                ];
            });
    }
}
```

---

## 📝 **EJERCICIOS PRÁCTICOS**

### **🎯 EJERCICIO 1: Implementar Models con Relationships**

- Tiempo: 30 minutos
- Crear User, Post, Comment models con relaciones
- Implementar scopes y accessors

### **🎯 EJERCICIO 2: Advanced Queries**

- Tiempo: 45 minutos
- Sistema de búsqueda con filtros
- Implementar eager loading
- Analytics dashboard

### **🎯 EJERCICIO 3: Factory & Seeding**

- Tiempo: 30 minutos
- Crear factories completas
- Seeders con datos realistas
- Testing con factories

---

## ✅ **VALIDACIÓN FINAL**

### **Checkpoint técnico (15 min):**

- [ ] Models con relationships funcionando
- [ ] Migrations ejecutadas correctamente
- [ ] Factories generando datos válidos
- [ ] Queries optimizadas (sin N+1)
- [ ] Scopes y accessors implementados

### **Proyecto integrador (15 min):**

Sistema completo de gestión de productos con:

- Categorías jerárquicas
- Búsqueda y filtros
- Dashboard analítico
- API endpoints básicos

---

## 🚧 **PREPARACIÓN PARA DÍA 13**

El día 13 construiremos sobre esta base para crear una **API REST completa** con:

- Authentication con Sanctum
- Resource Controllers
- API Resources & Collections
- Validation & Error Handling
- Rate Limiting & Middleware

---

## 📚 **RECURSOS ADICIONALES**

- [Laravel Eloquent ORM](https://laravel.com/docs/eloquent)
- [Database Testing](https://laravel.com/docs/database-testing)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

---

**¡Domina Laravel Models para APIs profesionales!** 🚀

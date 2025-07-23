# 💻 EJERCICIO 3: Advanced API Features - Filtros, Validation & Testing

## Implementación MVP - 45 minutos

### 📋 **DESCRIPCIÓN**

Crear API avanzada con filtros complejos, validation robusta, error handling profesional, y testing automatizado.

---

## 🎯 **REQUERIMIENTOS**

### **FASE CORE ✅ (30 minutos)**

- ✅ Advanced filtering (search, ranges, relationships)
- ✅ Custom validation rules
- ✅ Professional error handling
- ✅ API versioning setup

### **FASE ENHANCED ⚡ (15 minutos)**

- ⚡ Feature tests para API endpoints
- ⚡ Query optimization con indexes
- ⚡ Cache layer para responses
- ⚡ OpenAPI documentation

---

## 🏗️ **PASO A PASO**

### **1. Advanced Query Filters**

```bash
# Crear Filter classes
php artisan make:class Filters/ProductFilter
php artisan make:class Filters/QueryFilter

# Crear Scope classes
php artisan make:scope ActiveScope
php artisan make:scope PublishedScope
```

**Base Query Filter:**

```php
<?php
// app/Filters/QueryFilter.php - CREAR

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

abstract class QueryFilter
{
    protected Request $request;
    protected Builder $builder;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function apply(Builder $builder): Builder
    {
        $this->builder = $builder;

        foreach ($this->filters() as $name => $value) {
            if ($value !== null && $value !== '') {
                $this->$name($value);
            }
        }

        return $this->builder;
    }

    protected function filters(): array
    {
        return $this->request->all();
    }
}
```

**Product Filter Implementation:**

```php
<?php
// app/Filters/ProductFilter.php - IMPLEMENTAR

namespace App\Filters;

class ProductFilter extends QueryFilter
{
    /**
     * Search in name, description, SKU
     */
    protected function search(string $term): void
    {
        $this->builder->where(function ($query) use ($term) {
            $query->where('name', 'LIKE', "%{$term}%")
                  ->orWhere('description', 'LIKE', "%{$term}%")
                  ->orWhere('sku', 'LIKE', "%{$term}%");
        });
    }

    /**
     * Filter by category slug
     */
    protected function category(string $categorySlug): void
    {
        $this->builder->whereHas('category', function ($query) use ($categorySlug) {
            $query->where('slug', $categorySlug);
        });
    }

    /**
     * Filter by minimum price
     */
    protected function minPrice(float $price): void
    {
        $this->builder->where('price', '>=', $price);
    }

    /**
     * Filter by maximum price
     */
    protected function maxPrice(float $price): void
    {
        $this->builder->where('price', '<=', $price);
    }

    /**
     * Filter by price range
     */
    protected function priceRange(string $range): void
    {
        [$min, $max] = explode(',', $range);

        if ($min) {
            $this->builder->where('price', '>=', floatval($min));
        }

        if ($max) {
            $this->builder->where('price', '<=', floatval($max));
        }
    }

    /**
     * Filter by status
     */
    protected function status(string $status): void
    {
        $statuses = explode(',', $status);
        $this->builder->whereIn('status', $statuses);
    }

    /**
     * Filter by stock availability
     */
    protected function inStock(bool $inStock): void
    {
        if ($inStock) {
            $this->builder->where('stock', '>', 0);
        } else {
            $this->builder->where('stock', '=', 0);
        }
    }

    /**
     * Filter products on sale
     */
    protected function onSale(bool $onSale): void
    {
        if ($onSale) {
            $this->builder->whereNotNull('sale_price');
        } else {
            $this->builder->whereNull('sale_price');
        }
    }

    /**
     * Filter by creation date range
     */
    protected function createdBetween(string $dateRange): void
    {
        [$start, $end] = explode(',', $dateRange);

        if ($start) {
            $this->builder->whereDate('created_at', '>=', $start);
        }

        if ($end) {
            $this->builder->whereDate('created_at', '<=', $end);
        }
    }

    /**
     * Filter by tags (if implemented)
     */
    protected function tags(string $tagsList): void
    {
        $tags = explode(',', $tagsList);

        $this->builder->whereHas('tags', function ($query) use ($tags) {
            $query->whereIn('slug', $tags);
        });
    }

    /**
     * Complex sorting logic
     */
    protected function sort(string $sortBy): void
    {
        match($sortBy) {
            'price_asc' => $this->builder->orderBy('price', 'asc'),
            'price_desc' => $this->builder->orderBy('price', 'desc'),
            'name' => $this->builder->orderBy('name', 'asc'),
            'name_desc' => $this->builder->orderBy('name', 'desc'),
            'newest' => $this->builder->orderBy('created_at', 'desc'),
            'oldest' => $this->builder->orderBy('created_at', 'asc'),
            'popular' => $this->builder->orderBy('views_count', 'desc'),
            'stock_asc' => $this->builder->orderBy('stock', 'asc'),
            'stock_desc' => $this->builder->orderBy('stock', 'desc'),
            default => $this->builder->orderBy('id', 'desc')
        };
    }
}
```

### **2. Enhanced Product Controller**

```php
<?php
// app/Http/Controllers/Api/ProductController.php - ACTUALIZAR método index

namespace App\Http\Controllers\Api;

use App\Filters\ProductFilter;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductCollection;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    /**
     * Display a listing of products with advanced filtering
     */
    public function index(Request $request, ProductFilter $filter)
    {
        // TODO: Implementar cache key basado en parámetros
        $cacheKey = 'products.' . md5(serialize($request->all()));

        $products = Cache::remember($cacheKey, 300, function () use ($filter, $request) {
            $query = Product::with(['category'])
                ->filter($filter); // Using custom filter scope

            // Aplicar paginación
            $perPage = min($request->per_page ?? 12, 100);
            return $query->paginate($perPage);
        });

        return new ProductCollection($products);
    }

    // ... resto de métodos
}
```

### **3. Custom Validation Rules**

```bash
# Crear custom validation rules
php artisan make:rule ValidSku
php artisan make:rule ValidPriceRange
php artisan make:rule ValidImageUrl
```

**Custom SKU Validation:**

```php
<?php
// app/Rules/ValidSku.php - IMPLEMENTAR

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidSku implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // TODO: Validar formato de SKU
        // Formato: XXX-###-XXX (letras-números-letras)
        if (!preg_match('/^[A-Z]{2,4}-[0-9]{3,6}-[A-Z]{2,4}$/', $value)) {
            $fail('El SKU debe tener el formato: ABC-123-XYZ (letras-números-letras).');
        }

        // TODO: Verificar que no esté duplicado (excepto el actual)
        $productId = request()->route('product')?->id;
        $exists = \App\Models\Product::where('sku', $value)
            ->when($productId, fn($q) => $q->where('id', '!=', $productId))
            ->exists();

        if ($exists) {
            $fail('Este SKU ya está en uso por otro producto.');
        }
    }
}
```

**Price Range Validation:**

```php
<?php
// app/Rules/ValidPriceRange.php - IMPLEMENTAR

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidPriceRange implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $price = (float) $value;
        $salePrice = (float) request()->input('sale_price', 0);

        // TODO: Verificar que el precio de oferta sea menor al precio regular
        if ($salePrice > 0 && $salePrice >= $price) {
            $fail('El precio de oferta debe ser menor al precio regular.');
        }

        // TODO: Verificar rangos lógicos de precios
        if ($price < 0.01) {
            $fail('El precio debe ser mayor a $0.01.');
        }

        if ($price > 999999.99) {
            $fail('El precio no puede ser mayor a $999,999.99.');
        }

        // TODO: Verificar descuento máximo del 90%
        if ($salePrice > 0) {
            $discountPercentage = (($price - $salePrice) / $price) * 100;
            if ($discountPercentage > 90) {
                $fail('El descuento no puede ser mayor al 90%.');
            }
        }
    }
}
```

### **4. Enhanced Form Request**

```php
<?php
// app/Http/Requests/ProductRequest.php - ACTUALIZAR

namespace App\Http\Requests;

use App\Rules\ValidSku;
use App\Rules\ValidPriceRange;
use App\Rules\ValidImageUrl;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id;

        return [
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
                Rule::unique('products', 'name')->ignore($productId)
            ],
            'description' => [
                'required',
                'string',
                'min:10',
                'max:2000'
            ],
            'price' => [
                'required',
                'numeric',
                'min:0.01',
                'max:999999.99',
                new ValidPriceRange()
            ],
            'sale_price' => [
                'nullable',
                'numeric',
                'min:0.01',
                'max:999999.99'
            ],
            'category_id' => [
                'required',
                'exists:categories,id'
            ],
            'stock' => [
                'required',
                'integer',
                'min:0',
                'max:99999'
            ],
            'sku' => [
                'required',
                'string',
                'max:50',
                new ValidSku()
            ],
            'images' => [
                'nullable',
                'array',
                'max:5'
            ],
            'images.*' => [
                'url',
                'max:500',
                new ValidImageUrl()
            ],
            'attributes' => [
                'nullable',
                'array'
            ],
            'attributes.*' => [
                'string',
                'max:255'
            ],
            'status' => [
                'required',
                'in:draft,published,archived'
            ],
            'weight' => [
                'nullable',
                'numeric',
                'min:0',
                'max:999.99'
            ],
            'barcode' => [
                'nullable',
                'string',
                'max:100',
                'regex:/^[0-9]{8,13}$/' // EAN-8 or EAN-13
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del producto es obligatorio.',
            'name.unique' => 'Ya existe un producto con este nombre.',
            'price.required' => 'El precio es obligatorio.',
            'price.min' => 'El precio debe ser mayor a $0.01.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
            'images.max' => 'Máximo 5 imágenes permitidas.',
            'barcode.regex' => 'El código de barras debe tener entre 8 y 13 dígitos.',
        ];
    }

    /**
     * TODO: Preparar datos antes de validación
     */
    protected function prepareForValidation(): void
    {
        // Limpiar y formatear datos
        if ($this->has('name')) {
            $this->merge([
                'name' => trim($this->name),
                'slug' => \Str::slug($this->name)
            ]);
        }

        if ($this->has('sku')) {
            $this->merge([
                'sku' => strtoupper(trim($this->sku))
            ]);
        }

        // Convertir strings a arrays si es necesario
        if ($this->has('images') && is_string($this->images)) {
            $this->merge([
                'images' => json_decode($this->images, true) ?? []
            ]);
        }
    }
}
```

---

## 🎯 **DESAFÍOS AVANZADOS**

### **Desafío 1: Feature Tests**

```php
<?php
// tests/Feature/ProductApiTest.php - CREAR

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $regularUser;
    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        // TODO: Crear usuarios de prueba
        $this->adminUser = User::factory()->create(['role' => 'admin']);
        $this->regularUser = User::factory()->create(['role' => 'user']);
        $this->category = Category::factory()->create();
    }

    /** @test */
    public function it_can_list_products_without_authentication(): void
    {
        // TODO: Crear productos de prueba
        Product::factory(5)->create(['status' => 'published']);

        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => ['id', 'name', 'price', 'status']
                    ],
                    'meta' => ['total', 'current_page'],
                    'links' => ['first', 'last']
                ]);
    }

    /** @test */
    public function it_can_filter_products_by_category(): void
    {
        $electronicsCategory = Category::factory()->create(['slug' => 'electronics']);
        $clothingCategory = Category::factory()->create(['slug' => 'clothing']);

        Product::factory(3)->create([
            'category_id' => $electronicsCategory->id,
            'status' => 'published'
        ]);
        Product::factory(2)->create([
            'category_id' => $clothingCategory->id,
            'status' => 'published'
        ]);

        $response = $this->getJson('/api/v1/products?category=electronics');

        $response->assertStatus(200)
                ->assertJsonCount(3, 'data');
    }

    /** @test */
    public function it_can_search_products(): void
    {
        Product::factory()->create([
            'name' => 'iPhone 15 Pro',
            'status' => 'published'
        ]);
        Product::factory()->create([
            'name' => 'Samsung Galaxy',
            'status' => 'published'
        ]);

        $response = $this->getJson('/api/v1/products?search=iPhone');

        $response->assertStatus(200)
                ->assertJsonCount(1, 'data')
                ->assertJsonPath('data.0.name', 'iPhone 15 Pro');
    }

    /** @test */
    public function admin_can_create_product(): void
    {
        Sanctum::actingAs($this->adminUser);

        $productData = [
            'name' => 'Test Product',
            'description' => 'This is a test product description.',
            'price' => 99.99,
            'category_id' => $this->category->id,
            'stock' => 10,
            'sku' => 'TEST-001-PRO',
            'status' => 'published'
        ];

        $response = $this->postJson('/api/v1/products', $productData);

        $response->assertStatus(201)
                ->assertJsonPath('name', 'Test Product');

        $this->assertDatabaseHas('products', [
            'name' => 'Test Product',
            'sku' => 'TEST-001-PRO'
        ]);
    }

    /** @test */
    public function regular_user_cannot_create_product(): void
    {
        Sanctum::actingAs($this->regularUser);

        $productData = [
            'name' => 'Test Product',
            'description' => 'This is a test product.',
            'price' => 99.99,
            'category_id' => $this->category->id,
            'stock' => 10,
            'sku' => 'TEST-001-PRO',
            'status' => 'published'
        ];

        $response = $this->postJson('/api/v1/products', $productData);

        $response->assertStatus(403)
                ->assertJsonPath('message', 'Unauthorized. Admin access required.');
    }

    /** @test */
    public function it_validates_product_creation_data(): void
    {
        Sanctum::actingAs($this->adminUser);

        $response = $this->postJson('/api/v1/products', [
            'name' => 'A', // Too short
            'price' => -10, // Invalid price
            'sku' => 'invalid-sku', // Invalid format
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name', 'price', 'sku', 'description', 'category_id', 'stock']);
    }

    /** @test */
    public function it_can_update_product(): void
    {
        Sanctum::actingAs($this->adminUser);

        $product = Product::factory()->create();

        $response = $this->putJson("/api/v1/products/{$product->id}", [
            'name' => 'Updated Product Name',
            'description' => $product->description,
            'price' => 149.99,
            'category_id' => $product->category_id,
            'stock' => $product->stock,
            'sku' => $product->sku,
            'status' => $product->status
        ]);

        $response->assertStatus(200)
                ->assertJsonPath('name', 'Updated Product Name')
                ->assertJsonPath('price.original', 149.99);
    }

    /** @test */
    public function it_can_delete_product(): void
    {
        Sanctum::actingAs($this->adminUser);

        $product = Product::factory()->create();

        $response = $this->deleteJson("/api/v1/products/{$product->id}");

        $response->assertStatus(204);
        $this->assertSoftDeleted('products', ['id' => $product->id]);
    }
}
```

### **Desafío 2: Query Optimization**

```php
<?php
// En Product Model - Agregar scope para filtros

namespace App\Models;

use App\Filters\QueryFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // TODO: Scope para aplicar filtros
    public function scopeFilter(Builder $query, QueryFilter $filters): Builder
    {
        return $filters->apply($query);
    }

    // TODO: Scope para productos populares (con cache)
    public function scopePopular(Builder $query, int $limit = 10): Builder
    {
        return $query->orderBy('views_count', 'desc')
                    ->limit($limit);
    }

    // TODO: Scope para productos relacionados
    public function scopeRelated(Builder $query, Product $product, int $limit = 4): Builder
    {
        return $query->where('category_id', $product->category_id)
                    ->where('id', '!=', $product->id)
                    ->where('status', 'published')
                    ->where('stock', '>', 0)
                    ->inRandomOrder()
                    ->limit($limit);
    }
}
```

### **Desafío 3: API Versioning**

```php
<?php
// app/Http/Controllers/Api/V2/ProductController.php - CREAR V2

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Api\ProductController as BaseProductController;
use App\Http\Resources\V2\ProductResource;
use App\Models\Product;

class ProductController extends BaseProductController
{
    /**
     * Enhanced show method with more data in V2
     */
    public function show(Product $product): ProductResource
    {
        $product->increment('views_count');
        $product->load(['category', 'reviews', 'relatedProducts']);

        return new ProductResource($product);
    }
}
```

---

## 🧪 **TESTING AVANZADO**

```bash
# Ejecutar tests
php artisan test --filter ProductApiTest

# Test con coverage
php artisan test --coverage

# Test específico
php artisan test --filter "it_can_filter_products_by_category"
```

**Ejemplo de testing con filtros:**

```bash
# Test filtros avanzados
curl -G "http://localhost:8000/api/v1/products" \
  -d "search=laptop" \
  -d "category=electronics" \
  -d "min_price=500" \
  -d "max_price=2000" \
  -d "in_stock=true" \
  -d "on_sale=true" \
  -d "sort=price_asc" \
  -d "per_page=20"
```

---

## ✅ **CRITERIOS DE EVALUACIÓN**

### **CORE (15 puntos)**

- [ ] Advanced filtering funcionando (4 pts)
- [ ] Custom validation rules (3 pts)
- [ ] Error handling completo (3 pts)
- [ ] Query optimization (3 pts)
- [ ] Cache implementation (2 pts)

### **ENHANCED (5 puntos)**

- [ ] Feature tests completos (2 pts)
- [ ] API versioning setup (1 pt)
- [ ] Performance optimization (1 pt)
- [ ] Documentation (1 pt)

---

## 🚀 **RETO EXTRA**

1. **GraphQL endpoint**: Agregar soporte para GraphQL
2. **Webhook system**: Notificaciones automáticas
3. **API rate limiting**: Por usuario y endpoint
4. **Background jobs**: Procesamiento asíncrono
5. **Monitoring**: Métricas y logging avanzado

---

**¡Crea APIs profesionales con features avanzadas!** ⚡

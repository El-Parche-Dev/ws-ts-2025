# 💻 EJERCICIO 1: CRUD API Básica - Productos

## Implementación MVP - 45 minutos

### 📋 **DESCRIPCIÓN**

Crear una API REST completa para gestión de productos con endpoints CRUD, validación, y Resources de Laravel.

---

## 🎯 **REQUERIMIENTOS**

### **FASE CORE ✅ (30 minutos)**

- ✅ Resource Controller con 5 métodos (index, store, show, update, destroy)
- ✅ API Resources para respuestas consistentes
- ✅ Validation con Form Requests
- ✅ Error handling básico

### **FASE ENHANCED ⚡ (15 minutos)**

- ⚡ Filtros de búsqueda (search, category, price range)
- ⚡ Paginación customizada
- ⚡ Soft deletes con restore endpoint
- ⚡ Response metadata completa

---

## 🏗️ **PASO A PASO**

### **1. Configurar Proyecto Base**

```bash
# Crear proyecto Laravel
composer create-project laravel/laravel tienda-api
cd tienda-api

# Configurar SQLite
touch database/database.sqlite
```

```env
# .env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
```

### **2. Crear Models y Migrations**

```bash
# Crear modelos base
php artisan make:model Product -mfr
php artisan make:model Category -mf

# Crear controlador API
php artisan make:controller Api/ProductController --api --model=Product
php artisan make:controller Api/CategoryController --api --model=Category

# Crear Resources
php artisan make:resource ProductResource
php artisan make:resource ProductCollection
php artisan make:resource CategoryResource

# Crear Form Requests
php artisan make:request ProductRequest
```

### **3. Implementar Migrations**

**Products Migration:**

```php
<?php
// TODO: Completar products migration

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
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->string('sku', 50)->unique();
            $table->json('images')->nullable();
            $table->json('attributes')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->integer('views_count')->default(0);
            $table->timestamps();
            $table->softDeletes(); // TODO: Implementar soft deletes

            // TODO: Agregar índices
            $table->index(['status', 'created_at']);
            $table->index(['category_id', 'status']);
            $table->fullText(['name', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

### **4. Configurar API Routes**

```php
<?php
// routes/api.php - TODO: Completar rutas

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes V1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Public endpoints
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);

    // Admin endpoints (sin auth por ahora)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // TODO: Implementar soft delete endpoints
    Route::get('/products/trashed', [ProductController::class, 'trashed']);
    Route::post('/products/{id}/restore', [ProductController::class, 'restore']);

    // API Health Check
    Route::get('/status', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now(),
            'version' => '1.0.0'
        ]);
    });
});
```

### **5. Implementar Product Controller**

```php
<?php
// app/Http/Controllers/Api/ProductController.php - COMPLETAR

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductCollection;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Display a listing of products with filters
     */
    public function index(Request $request)
    {
        $query = Product::with(['category']);

        // TODO: Implementar filtros
        // Filter by search term
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->search}%")
                  ->orWhere('description', 'LIKE', "%{$request->search}%")
                  ->orWhere('sku', 'LIKE', "%{$request->search}%");
            });
        }

        // Filter by category
        if ($request->category) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by price range
        if ($request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by status
        $query->where('status', $request->status ?? 'published');

        // TODO: Implementar sorting
        $sortBy = $request->sort ?? 'created_at';
        $sortDirection = $request->direction ?? 'desc';

        match($sortBy) {
            'price' => $query->orderBy('price', $sortDirection),
            'name' => $query->orderBy('name', $sortDirection),
            'views' => $query->orderBy('views_count', $sortDirection),
            default => $query->orderBy('created_at', $sortDirection)
        };

        // TODO: Implementar paginación
        $perPage = min($request->per_page ?? 12, 100); // Max 100 items
        $products = $query->paginate($perPage);

        return new ProductCollection($products);
    }

    /**
     * Store a newly created product
     */
    public function store(ProductRequest $request): JsonResponse
    {
        try {
            $product = Product::create($request->validated());
            $product->load('category');

            return (new ProductResource($product))
                ->response()
                ->setStatusCode(201)
                ->header('Location', route('api.products.show', $product));

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified product
     */
    public function show(Product $product): ProductResource
    {
        // TODO: Incrementar view count
        $product->increment('views_count');
        $product->load(['category']);

        return new ProductResource($product);
    }

    /**
     * Update the specified product
     */
    public function update(ProductRequest $request, Product $product): ProductResource
    {
        $product->update($request->validated());
        $product->load(['category']);

        return new ProductResource($product);
    }

    /**
     * Remove the specified product (soft delete)
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete(); // Soft delete

        return response()->json([
            'message' => 'Product deleted successfully',
            'deleted_at' => $product->deleted_at
        ]);
    }

    /**
     * TODO: Implementar método para productos eliminados
     */
    public function trashed(Request $request)
    {
        $products = Product::onlyTrashed()
            ->with(['category'])
            ->paginate($request->per_page ?? 12);

        return new ProductCollection($products);
    }

    /**
     * TODO: Implementar método para restaurar producto
     */
    public function restore(int $id): JsonResponse
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->restore();

        return response()->json([
            'message' => 'Product restored successfully',
            'product' => new ProductResource($product->load('category'))
        ]);
    }
}
```

---

## 🎯 **DESAFÍOS A RESOLVER**

### **Desafío 1: ProductResource Completo**

```php
<?php
// app/Http/Resources/ProductResource.php - IMPLEMENTAR

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,

            // TODO: Implementar price object
            'price' => [
                'original' => $this->price,
                'sale' => $this->sale_price,
                'final' => $this->sale_price ?? $this->price,
                'formatted' => '$' . number_format($this->sale_price ?? $this->price, 2),
                'discount_percentage' => $this->sale_price ?
                    round((($this->price - $this->sale_price) / $this->price) * 100) : 0
            ],

            'stock' => $this->stock,
            'sku' => $this->sku,
            'images' => $this->images ?? [],
            'attributes' => $this->attributes ?? [],
            'status' => $this->status,

            // TODO: Incluir relación category
            'category' => new CategoryResource($this->whenLoaded('category')),

            // TODO: Implementar campos calculados
            'is_available' => $this->stock > 0 && $this->status === 'published',
            'is_on_sale' => !is_null($this->sale_price),
            'views_count' => $this->views_count,

            // TODO: Metadata
            'meta' => [
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'url' => url("/api/v1/products/{$this->id}")
            ]
        ];
    }
}
```

### **Desafío 2: ProductCollection con Metadata**

```php
<?php
// app/Http/Resources/ProductCollection.php - IMPLEMENTAR

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,

            // TODO: Implementar pagination metadata
            'meta' => [
                'total' => $this->total(),
                'count' => $this->count(),
                'per_page' => $this->perPage(),
                'current_page' => $this->currentPage(),
                'total_pages' => $this->lastPage(),
                'from' => $this->firstItem(),
                'to' => $this->lastItem(),
            ],

            // TODO: Links de navegación
            'links' => [
                'first' => $this->url(1),
                'last' => $this->url($this->lastPage()),
                'prev' => $this->previousPageUrl(),
                'next' => $this->nextPageUrl(),
                'self' => $this->url($this->currentPage()),
            ],

            // TODO: Filtros aplicados
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'min_price' => $request->min_price,
                'max_price' => $request->max_price,
                'status' => $request->status ?? 'published',
                'sort' => $request->sort ?? 'created_at',
                'direction' => $request->direction ?? 'desc',
            ]
        ];
    }
}
```

### **Desafío 3: Form Request Validation**

```php
<?php
// app/Http/Requests/ProductRequest.php - IMPLEMENTAR

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Por ahora sin autenticación
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id;

        return [
            // TODO: Definir reglas de validación
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
                Rule::unique('products', 'name')->ignore($productId)
            ],
            'description' => 'required|string|min:10|max:2000',
            'price' => 'required|numeric|min:0|max:999999.99',
            'sale_price' => 'nullable|numeric|min:0|max:999999.99|lt:price',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'required|integer|min:0|max:99999',
            'sku' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products', 'sku')->ignore($productId)
            ],
            'images' => 'nullable|array|max:5',
            'images.*' => 'url|max:500',
            'attributes' => 'nullable|array',
            'status' => 'required|in:draft,published,archived',
        ];
    }

    public function messages(): array
    {
        return [
            // TODO: Mensajes personalizados
            'name.required' => 'El nombre del producto es obligatorio.',
            'name.unique' => 'Ya existe un producto con este nombre.',
            'price.required' => 'El precio es obligatorio.',
            'sale_price.lt' => 'El precio de oferta debe ser menor al precio regular.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
            'images.max' => 'Máximo 5 imágenes permitidas.',
        ];
    }
}
```

---

## 🧪 **TESTING DE LA API**

### **Comandos básicos:**

```bash
# Ejecutar migrations y seeders
php artisan migrate:fresh --seed

# Iniciar servidor
php artisan serve
```

### **Endpoints para probar:**

```bash
# GET /api/v1/products - Lista de productos
curl -X GET "http://localhost:8000/api/v1/products?search=laptop&category=electronics&min_price=100"

# POST /api/v1/products - Crear producto
curl -X POST "http://localhost:8000/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming",
    "description": "Laptop para gaming de alta gama",
    "price": 1299.99,
    "category_id": 1,
    "stock": 10,
    "sku": "LAP-001",
    "status": "published"
  }'

# GET /api/v1/products/1 - Ver producto específico
curl -X GET "http://localhost:8000/api/v1/products/1"

# PUT /api/v1/products/1 - Actualizar producto
curl -X PUT "http://localhost:8000/api/v1/products/1" \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop Gaming Pro", "price": 1399.99}'

# DELETE /api/v1/products/1 - Eliminar producto
curl -X DELETE "http://localhost:8000/api/v1/products/1"
```

---

## ✅ **CRITERIOS DE EVALUACIÓN**

### **CORE (15 puntos)**

- [ ] 5 endpoints CRUD funcionando (5 pts)
- [ ] ProductResource con estructura correcta (3 pts)
- [ ] Form Request con validación (3 pts)
- [ ] Filtros básicos implementados (2 pts)
- [ ] Error handling básico (2 pts)

### **ENHANCED (5 puntos)**

- [ ] Paginación customizada (1 pt)
- [ ] Soft deletes con restore (2 pts)
- [ ] Sorting y filtros avanzados (1 pt)
- [ ] Response metadata completa (1 pt)

---

## 🚀 **RETO EXTRA**

Si terminas antes de tiempo:

1. **Bulk operations**: Crear/actualizar múltiples productos
2. **Export functionality**: Exportar productos a CSV/JSON
3. **Image validation**: Validar URLs de imágenes
4. **Cache layer**: Cachear respuestas frecuentes
5. **API documentation**: Documentar endpoints con comments

---

**¡Crea tu primera API REST profesional!** 💪

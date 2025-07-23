# 🌐 DÍA 13: API REST con Laravel (6 horas)

## 🎯 **OBJETIVO GENERAL**

Crear APIs REST profesionales con Laravel usando Authentication, Resource Controllers, API Resources, Validation y Testing.

---

## ⏰ **CRONOGRAMA INTENSIVO**

### **12:00 - 13:30 | Módulo 1: API Foundations** (90 min)

- ✅ Configuración API Routes
- ✅ Resource Controllers
- ✅ API Resources & Collections
- ✅ **EJERCICIO 1**: CRUD básico de productos

### **13:30 - 14:00 | DESCANSO** ☕

### **14:00 - 15:30 | Módulo 2: Authentication & Security** (90 min)

- ✅ Laravel Sanctum setup
- ✅ API Token Authentication
- ✅ Middleware y Rate Limiting
- ✅ **EJERCICIO 2**: Sistema de autenticación completo

### **15:30 - 16:00 | DESCANSO** ☕

### **16:00 - 17:30 | Módulo 3: Advanced API Features** (90 min)

- ✅ Validation & Error Handling
- ✅ Filtering, Sorting, Pagination
- ✅ API Versioning
- ✅ **EJERCICIO 3**: API avanzada con filtros

### **17:30 - 18:00 | Módulo 4: Testing & Documentation** (30 min)

- ✅ Feature Tests para APIs
- ✅ API Documentation
- ✅ **VALIDACIÓN FINAL**: API completa funcionando

---

## 🏗️ **MÓDULO 1: API Foundations**

### **Configuración Inicial**

```bash
# Crear proyecto Laravel para API
composer create-project laravel/laravel api-tienda
cd api-tienda

# Instalar Sanctum
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate

# Configurar API
php artisan make:controller Api/ProductController --api --model=Product
php artisan make:resource ProductResource
php artisan make:resource ProductCollection
```

### **API Routes Configuration**

```php
<?php
// routes/api.php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - WorldSkills Standard
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public product routes (read-only)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // Product management (admin only)
    Route::middleware('admin')->group(function () {
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
        Route::apiResource('categories', CategoryController::class)->except(['index']);
    });

    // User actions
    Route::post('/products/{product}/favorite', [ProductController::class, 'favorite']);
    Route::delete('/products/{product}/favorite', [ProductController::class, 'unfavorite']);
});

// API Status and Health Check
Route::get('/status', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});
```

### **API Resource Controllers**

```php
<?php
// app/Http/Controllers/Api/ProductController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductCollection;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Product::with(['category'])
            ->when($request->category, function ($q, $category) {
                $q->whereHas('category', fn($q) => $q->where('slug', $category));
            })
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            })
            ->when($request->min_price, function ($q, $price) {
                $q->where('price', '>=', $price);
            })
            ->when($request->max_price, function ($q, $price) {
                $q->where('price', '<=', $price);
            })
            ->when($request->sort, function ($q, $sort) {
                match($sort) {
                    'price_asc' => $q->orderBy('price', 'asc'),
                    'price_desc' => $q->orderBy('price', 'desc'),
                    'name' => $q->orderBy('name', 'asc'),
                    'newest' => $q->orderBy('created_at', 'desc'),
                    default => $q->orderBy('id', 'desc')
                };
            })
            ->published();

        $products = $query->paginate($request->per_page ?? 12);

        return new ProductCollection($products);
    }

    /**
     * Store a newly created product
     */
    public function store(ProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        return (new ProductResource($product))
            ->response()
            ->setStatusCode(201)
            ->header('Location', route('api.products.show', $product));
    }

    /**
     * Display the specified product
     */
    public function show(Product $product): ProductResource
    {
        $product->load(['category']);
        $product->increment('views_count');

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
     * Remove the specified product
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ], 204);
    }

    /**
     * Add product to favorites
     */
    public function favorite(Request $request, Product $product): JsonResponse
    {
        $user = $request->user();

        if (!$user->favoriteProducts()->where('product_id', $product->id)->exists()) {
            $user->favoriteProducts()->attach($product->id);
        }

        return response()->json([
            'message' => 'Product added to favorites',
            'is_favorite' => true
        ]);
    }

    /**
     * Remove product from favorites
     */
    public function unfavorite(Request $request, Product $product): JsonResponse
    {
        $request->user()->favoriteProducts()->detach($product->id);

        return response()->json([
            'message' => 'Product removed from favorites',
            'is_favorite' => false
        ]);
    }
}
```

### **API Resources**

```php
<?php
// app/Http/Resources/ProductResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => [
                'original' => $this->price,
                'sale' => $this->sale_price,
                'final' => $this->final_price,
                'formatted' => '$' . number_format($this->final_price, 2),
                'discount_percentage' => $this->discount_percentage
            ],
            'stock' => $this->stock,
            'sku' => $this->sku,
            'images' => $this->images ?? [],
            'attributes' => $this->attributes ?? [],
            'status' => $this->status,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'is_available' => $this->isAvailable(),
            'is_on_sale' => $this->is_on_sale,
            'views_count' => $this->views_count,
            'is_favorite' => $this->when(
                auth('sanctum')->check(),
                fn () => auth('sanctum')->user()->favoriteProducts()->where('product_id', $this->id)->exists()
            ),
            'meta' => [
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'url' => route('api.products.show', $this->id)
            ]
        ];
    }
}
```

```php
<?php
// app/Http/Resources/ProductCollection.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total' => $this->total(),
                'count' => $this->count(),
                'per_page' => $this->perPage(),
                'current_page' => $this->currentPage(),
                'total_pages' => $this->lastPage(),
                'from' => $this->firstItem(),
                'to' => $this->lastItem(),
            ],
            'links' => [
                'first' => $this->url(1),
                'last' => $this->url($this->lastPage()),
                'prev' => $this->previousPageUrl(),
                'next' => $this->nextPageUrl(),
                'self' => $this->url($this->currentPage()),
            ],
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'min_price' => $request->min_price,
                'max_price' => $request->max_price,
                'sort' => $request->sort ?? 'newest',
            ]
        ];
    }
}
```

---

## 🏗️ **MÓDULO 2: Authentication & Security**

### **Laravel Sanctum Setup**

```php
<?php
// app/Models/User.php - Enhanced for API

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relationships
    public function favoriteProducts(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'user_favorites', 'user_id', 'product_id')
                    ->withTimestamps();
    }

    // Helpers
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function createApiToken(string $name = 'API Token'): string
    {
        return $this->createToken($name)->plainTextToken;
    }
}
```

### **Authentication Controller**

```php
<?php
// app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user' // Default role
        ]);

        $token = $user->createApiToken('Registration Token');

        return response()->json([
            'message' => 'User registered successfully',
            'user' => new UserResource($user),
            'token' => $token,
            'token_type' => 'Bearer'
        ], 201);
    }

    /**
     * Authenticate user and return token
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Revoke existing tokens (optional - for single session)
        // $user->tokens()->delete();

        $token = $user->createApiToken('Login Token');

        return response()->json([
            'message' => 'Login successful',
            'user' => new UserResource($user),
            'token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Logout from all devices
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out from all devices'
        ]);
    }
}
```

### **Middleware Configuration**

```php
<?php
// app/Http/Middleware/AdminMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }

        return $next($request);
    }
}
```

```php
<?php
// app/Http/Kernel.php - Register middleware

protected $middlewareAliases = [
    // ... existing middleware
    'admin' => \App\Http\Middleware\AdminMiddleware::class,
];
```

### **Rate Limiting Configuration**

```php
<?php
// app/Providers/RouteServiceProvider.php

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

public function boot(): void
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    RateLimiter::for('auth', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip());
    });

    RateLimiter::for('strict', function (Request $request) {
        return Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
    });

    $this->routes(function () {
        Route::middleware(['api', 'throttle:api'])
            ->prefix('api/v1')
            ->group(base_path('routes/api.php'));
    });
}
```

---

## 🏗️ **MÓDULO 3: Advanced API Features**

### **Advanced Validation**

```php
<?php
// app/Http/Requests/ProductRequest.php

namespace App\Http\Requests;

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
            'attributes.*' => 'string|max:255',
            'status' => 'required|in:draft,published,archived',
            'weight' => 'nullable|numeric|min:0|max:999.99',
            'barcode' => 'nullable|string|max:100'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del producto es obligatorio.',
            'name.unique' => 'Ya existe un producto con este nombre.',
            'price.required' => 'El precio es obligatorio.',
            'sale_price.lt' => 'El precio de oferta debe ser menor al precio regular.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
            'images.max' => 'Máximo 5 imágenes permitidas.',
            'images.*.url' => 'Cada imagen debe ser una URL válida.'
        ];
    }
}
```

### **Global Exception Handler**

```php
<?php
// app/Exceptions/Handler.php - Enhanced for API

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        if ($request->expectsJson()) {
            return $this->handleApiException($request, $e);
        }

        return parent::render($request, $e);
    }

    private function handleApiException(Request $request, Throwable $e): JsonResponse
    {
        if ($e instanceof ValidationException) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }

        if ($e instanceof ModelNotFoundException) {
            return response()->json([
                'message' => 'Resource not found'
            ], 404);
        }

        if ($e instanceof NotFoundHttpException) {
            return response()->json([
                'message' => 'Endpoint not found'
            ], 404);
        }

        if ($e instanceof MethodNotAllowedHttpException) {
            return response()->json([
                'message' => 'Method not allowed'
            ], 405);
        }

        if ($e instanceof AuthenticationException) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Generic server error
        return response()->json([
            'message' => config('app.debug') ? $e->getMessage() : 'Server error',
            'trace' => config('app.debug') ? $e->getTrace() : null
        ], 500);
    }
}
```

---

## 📝 **EJERCICIOS PRÁCTICOS**

### **🎯 EJERCICIO 1: CRUD API Básica**

- Tiempo: 45 minutos
- Implementar ProductController completo
- Crear Resources para respuestas consistentes
- Testing con Postman/Thunder Client

### **🎯 EJERCICIO 2: Authentication System**

- Tiempo: 45 minutos
- Implementar registro/login con Sanctum
- Middleware de autorización
- Rate limiting en endpoints sensibles

### **🎯 EJERCICIO 3: Advanced Features**

- Tiempo: 45 minutos
- Filtros y búsqueda avanzada
- Paginación personalizada
- Error handling completo

---

## ✅ **VALIDACIÓN FINAL**

### **Checkpoint técnico (15 min):**

- [ ] API endpoints respondiendo correctamente
- [ ] Authentication funcionando con tokens
- [ ] Validation y error handling implementado
- [ ] Resources devolviendo formato consistente
- [ ] Rate limiting activo

### **API Testing (15 min):**

- Registro de usuario
- Login y obtención de token
- CRUD completo de productos (autenticado)
- Filtros y búsqueda
- Error handling (401, 404, 422, 500)

---

## 🚧 **PREPARACIÓN PARA DÍA 14**

El día 14 extenderemos la API con:

- File Upload & Management
- Advanced Relationships (Favorites, Reviews)
- Background Jobs & Queues
- Caching Strategies
- Performance Optimization

---

## 📚 **RECURSOS ADICIONALES**

- [Laravel API Resources](https://laravel.com/docs/eloquent-resources)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [API Testing](https://laravel.com/docs/http-tests)

---

**¡Crea APIs REST profesionales con Laravel!** 🚀

# ✅ VALIDACIÓN DÍA 13: Laravel API REST

## 🎯 **CHECKPOINT TÉCNICO** (15 minutos)

### **📋 Verificación Rápida**

```bash
# 1. Verificar que la API responde
curl -X GET "http://localhost:8000/api/v1/status"

# 2. Probar endpoint público
curl -X GET "http://localhost:8000/api/v1/products"

# 3. Verificar estructura de respuesta
curl -X GET "http://localhost:8000/api/v1/products?per_page=2" | jq
```

---

## ⚡ **VALIDACIÓN CORE** (20 puntos)

### **1. CRUD API Endpoints (8 puntos)**

```bash
# Test completo de CRUD
# 1. Crear producto (POST)
curl -X POST "http://localhost:8000/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product API",
    "description": "Producto de prueba para validación",
    "price": 199.99,
    "category_id": 1,
    "stock": 50,
    "sku": "TEST-001-API",
    "status": "published"
  }'

# 2. Listar productos (GET)
curl -X GET "http://localhost:8000/api/v1/products"

# 3. Ver producto específico (GET)
curl -X GET "http://localhost:8000/api/v1/products/1"

# 4. Actualizar producto (PUT)
curl -X PUT "http://localhost:8000/api/v1/products/1" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Product", "price": 249.99}'

# 5. Eliminar producto (DELETE)
curl -X DELETE "http://localhost:8000/api/v1/products/1"
```

**Checklist:**

- [ ] POST /products crea productos correctamente (2 pts)
- [ ] GET /products lista con paginación (2 pts)
- [ ] GET /products/{id} muestra producto específico (1 pt)
- [ ] PUT /products/{id} actualiza correctamente (2 pts)
- [ ] DELETE /products/{id} elimina (soft delete) (1 pt)

### **2. API Resources y Collections (4 puntos)**

```bash
# Verificar estructura de respuesta
curl -X GET "http://localhost:8000/api/v1/products/1" | jq '.price'
curl -X GET "http://localhost:8000/api/v1/products" | jq '.meta'
```

**Checklist:**

- [ ] ProductResource con estructura correcta (2 pts)
- [ ] ProductCollection con metadata (1 pt)
- [ ] Relationships incluidas (category) (1 pt)

### **3. Authentication con Sanctum (4 puntos)**

```bash
# 1. Registro
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@api.com",
    "password": "SecurePass123!",
    "password_confirmation": "SecurePass123!"
  }'

# 2. Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@api.com",
    "password": "SecurePass123!"
  }'

# 3. Usar token (reemplazar YOUR_TOKEN)
curl -X GET "http://localhost:8000/api/v1/auth/user" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. Logout
curl -X POST "http://localhost:8000/api/v1/auth/logout" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Checklist:**

- [ ] Registro funciona y devuelve token (1 pt)
- [ ] Login autentica y devuelve token (1 pt)
- [ ] Middleware auth:sanctum protege endpoints (1 pt)
- [ ] Logout revoca token correctamente (1 pt)

### **4. Validation y Error Handling (4 puntos)**

```bash
# Test validation errors
curl -X POST "http://localhost:8000/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A",
    "price": -10
  }'

# Test 404 error
curl -X GET "http://localhost:8000/api/v1/products/99999"
```

**Checklist:**

- [ ] Form Request valida datos correctamente (2 pts)
- [ ] Errores 422 con mensajes claros (1 pt)
- [ ] Errores 404 manejados correctamente (1 pt)

---

## 🚀 **VALIDACIÓN ENHANCED** (10 puntos)

### **5. Advanced Filtering (3 puntos)**

```bash
# Test filtros avanzados
curl -G "http://localhost:8000/api/v1/products" \
  -d "search=laptop" \
  -d "min_price=100" \
  -d "max_price=1000" \
  -d "sort=price_asc"
```

**Checklist:**

- [ ] Filtro de búsqueda (search) funciona (1 pt)
- [ ] Filtros de precio (min_price, max_price) (1 pt)
- [ ] Sorting personalizado implementado (1 pt)

### **6. Rate Limiting y Middleware (2 puntos)**

```bash
# Test rate limiting (ejecutar múltiples veces rápido)
for i in {1..10}; do curl -X POST "http://localhost:8000/api/v1/auth/login"; done
```

**Checklist:**

- [ ] Rate limiting configurado en auth endpoints (1 pt)
- [ ] Middleware personalizado (admin) funcionando (1 pt)

### **7. API Versioning y Documentation (2 puntos)**

```bash
# Verificar versionado
curl -X GET "http://localhost:8000/api/v1/status"
```

**Checklist:**

- [ ] API versionada (v1 prefix) (1 pt)
- [ ] Endpoints documentados en código (1 pt)

### **8. Testing Automatizado (3 puntos)**

```bash
# Ejecutar tests
php artisan test --filter ProductApiTest
```

**Checklist:**

- [ ] Feature tests para endpoints principales (2 pts)
- [ ] Tests de autenticación y autorización (1 pt)

---

## 📊 **PROYECTO INTEGRADOR** (15 minutos)

### **Implementar API Dashboard Endpoint**

Crear un endpoint que devuelva estadísticas completas de la API:

```php
<?php
// routes/api.php - Agregar endpoint de dashboard

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'apiStats']);
});
```

```php
<?php
// app/Http/Controllers/Api/DashboardController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function apiStats(Request $request): JsonResponse
    {
        return response()->json([
            'products' => [
                'total' => Product::count(),
                'published' => Product::where('status', 'published')->count(),
                'draft' => Product::where('status', 'draft')->count(),
                'low_stock' => Product::where('stock', '<', 10)->count(),
                'avg_price' => Product::avg('price'),
                'total_value' => Product::sum(\DB::raw('price * stock')),
            ],
            'users' => [
                'total' => User::count(),
                'active' => User::where('is_active', true)->count(),
                'admins' => User::where('role', 'admin')->count(),
                'recent' => User::where('created_at', '>=', now()->subDays(7))->count(),
            ],
            'categories' => [
                'total' => Category::count(),
                'with_products' => Category::has('products')->count(),
            ],
            'api_info' => [
                'version' => '1.0.0',
                'uptime' => now()->diffInMinutes(app()->getLoadedProviders()['App\Providers\AppServiceProvider']::class ?? now()),
                'timestamp' => now(),
            ]
        ]);
    }
}
```

**Test del endpoint:**

```bash
# Crear usuario admin
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "AdminPass123!",
    "password_confirmation": "AdminPass123!",
    "role": "admin"
  }'

# Obtener token y probar dashboard
curl -X GET "http://localhost:8000/api/v1/dashboard/stats" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 🧭 **AUTOEVALUACIÓN**

### **Mi puntuación:**

- Core (20 pts): \_\_\_/20
- Enhanced (10 pts): \_\_\_/10
- **TOTAL: \_\_\_/30**

### **Estado:**

- [ ] **EXCELENTE (27-30)**: Listo para Día 14 Advanced API
- [ ] **BUENO (21-26)**: Review authentication y testing
- [ ] **REGULAR (15-20)**: Reforzar Resources y validation
- [ ] **INSUFICIENTE (<15)**: Repetir Día 13 completo

---

## ⚠️ **ERRORES COMUNES**

### **1. Token Authentication Issues**

```bash
# Error: Unauthenticated
# Solución: Verificar que el token se envía correctamente
curl -H "Authorization: Bearer YOUR_TOKEN" # ✅ Correcto
curl -H "Bearer YOUR_TOKEN"                # ❌ Incorrecto
```

### **2. CORS Problems**

```php
// En config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['*'], // Solo para desarrollo
'allowed_headers' => ['*'],
```

### **3. Validation Not Working**

```php
// Verificar que el FormRequest está siendo usado
public function store(ProductRequest $request) // ✅ Correcto
public function store(Request $request)        // ❌ No valida
```

### **4. Resource Structure Issues**

```php
// En ProductResource
return [
    'id' => $this->id,           // ✅ Correcto
    'id' => $this->resource->id, // ❌ Redundante
];
```

---

## 📝 **PRÓXIMO PASO: DÍA 14**

Si tu puntuación es **21+**, estás listo para:

**🚀 DÍA 14: Advanced API Features**

- File Upload & Management API
- Background Jobs & Queues
- Advanced Caching Strategies
- API Performance Optimization
- WebSockets & Real-time Features

---

## 🆘 **AYUDA Y RECURSOS**

### **Comandos de debugging:**

```bash
# Verificar rutas API
php artisan route:list --path=api

# Debug queries
DB::enableQueryLog();
// ... tu código ...
dd(DB::getQueryLog());

# Limpiar cache
php artisan cache:clear
php artisan config:clear
```

### **Recursos adicionales:**

- [Laravel API Resources](https://laravel.com/docs/eloquent-resources)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Testing APIs](https://laravel.com/docs/http-tests)
- [Postman Collection](https://learning.postman.com/docs/collections/collections-overview/)

---

**¡Validación API REST completada! Ready for Advanced Features! 🚀**

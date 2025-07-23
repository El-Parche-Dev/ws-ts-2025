# ✅ VALIDACIÓN DÍA 12: Laravel Models + SQLite

## 🎯 **CHECKPOINT TÉCNICO** (15 minutos)

### **📋 Verificación Rápida**

```bash
# 1. Verificar migrations ejecutadas
php artisan migrate:status

# 2. Probar conexión SQLite
php artisan tinker
>>> DB::connection()->getPdo()

# 3. Verificar models funcionando
>>> Category::count()
>>> Product::with('category')->first()
```

---

## ⚡ **VALIDACIÓN CORE** (20 puntos)

### **1. Models y Relationships (8 puntos)**

```php
// Test básico en tinker
>>> $category = Category::create(['name' => 'Test Category'])
>>> $product = $category->products()->create(['name' => 'Test Product', 'price' => 99.99])
>>> $product->category->name // Debe mostrar 'Test Category'
```

**Checklist:**

- [ ] Category model con fillable correcto (2 pts)
- [ ] Product model con relationship funcionando (2 pts)
- [ ] Foreign keys en migrations (2 pts)
- [ ] Casts configurados apropiadamente (2 pts)

### **2. Migrations y Database (4 puntos)**

```bash
# Verificar estructura de tablas
php artisan tinker
>>> Schema::getColumnListing('products')
>>> Schema::getColumnListing('categories')
```

**Checklist:**

- [ ] Migrations ejecutan sin errores (2 pts)
- [ ] Índices creados correctamente (1 pt)
- [ ] Foreign key constraints funcionando (1 pt)

### **3. Scopes y Query Builder (4 puntos)**

```php
// Test scopes
>>> Category::active()->count()
>>> Product::published()->with('category')->get()
>>> Product::search('test')->count()
```

**Checklist:**

- [ ] Scope 'active' en Category (1 pt)
- [ ] Scope 'published' en Product (1 pt)
- [ ] Scope 'search' implementado (1 pt)
- [ ] Eager loading funcionando (1 pt)

### **4. Factories y Seeders (4 puntos)**

```bash
# Test factories
php artisan tinker
>>> Category::factory()->make()
>>> Product::factory()->create()
>>> Product::factory(5)->published()->create()
```

**Checklist:**

- [ ] CategoryFactory genera datos válidos (1 pt)
- [ ] ProductFactory genera datos válidos (1 pt)
- [ ] Factory states funcionando (1 pt)
- [ ] Seeder crea datos correctamente (1 pt)

---

## 🚀 **VALIDACIÓN ENHANCED** (10 puntos)

### **5. Accessors y Mutators (3 puntos)**

```php
// Test accessors
>>> $product = Product::first()
>>> $product->final_price
>>> $product->discount_percentage
>>> $product->is_on_sale
```

**Checklist:**

- [ ] Accessor 'final_price' funcionando (1 pt)
- [ ] Accessor 'discount_percentage' correcto (1 pt)
- [ ] Mutator auto-genera slug (1 pt)

### **6. Collection Methods (3 puntos)**

```php
// Test collections
>>> $products = Product::all()
>>> $products->where('status', 'published')
>>> $products->sum('price')
>>> $products->groupBy('category_id')
```

**Checklist:**

- [ ] Collections filtering correctamente (1 pt)
- [ ] Aggregate methods funcionando (1 pt)
- [ ] Group by methods correctos (1 pt)

### **7. Query Optimization (4 puntos)**

```php
// Test N+1 prevention
>>> $products = Product::with('category')->get()
>>> foreach($products as $product) { echo $product->category->name; }
// Debe ejecutar solo 2 queries, no N+1
```

**Checklist:**

- [ ] Eager loading previene N+1 (2 pts)
- [ ] Índices mejoran performance (1 pt)
- [ ] Queries optimizadas (1 pt)

---

## 📊 **PROYECTO INTEGRADOR** (15 minutos)

### **Implementar Dashboard Analítico**

```php
<?php
// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_categories' => Category::count(),
            'active_categories' => Category::active()->count(),
            'total_products' => Product::count(),
            'published_products' => Product::published()->count(),
            'avg_price' => Product::avg('price'),
            'total_stock' => Product::sum('stock'),
        ];

        $categories = Category::withCount('products')
            ->orderByDesc('products_count')
            ->limit(5)
            ->get();

        $recent_products = Product::with('category')
            ->latest()
            ->limit(10)
            ->get();

        return view('dashboard', compact('stats', 'categories', 'recent_products'));
    }
}
```

**Tareas a completar:**

1. Crear la ruta `/dashboard`
2. Implementar el controller
3. Crear vista básica mostrando las estadísticas
4. Probar que todas las queries funcionan

---

## 🧭 **AUTOEVALUACIÓN**

### **Mi puntuación:**

- Core (20 pts): \_\_\_/20
- Enhanced (10 pts): \_\_\_/10
- **TOTAL: \_\_\_/30**

### **Estado:**

- [ ] **EXCELENTE (27-30)**: Listo para Día 13 API REST
- [ ] **BUENO (21-26)**: Review concepts antes de continuar
- [ ] **REGULAR (15-20)**: Reforzar relationships y queries
- [ ] **INSUFICIENTE (<15)**: Repetir Día 12 completo

---

## ⚠️ **ERRORES COMUNES**

### **1. Migrations failing**

```bash
# Solución
php artisan migrate:fresh
php artisan migrate
```

### **2. Foreign key constraint errors**

```php
// En migrations, verificar orden:
// 1. Crear tabla padre (categories)
// 2. Crear tabla hija (products) con foreign key
```

### **3. N+1 Query Problem**

```php
// ❌ MAL
$products = Product::all();
foreach($products as $product) {
    echo $product->category->name; // N+1!
}

// ✅ BIEN
$products = Product::with('category')->get();
foreach($products as $product) {
    echo $product->category->name; // Solo 2 queries
}
```

### **4. Factory relationship issues**

```php
// ❌ MAL
'category_id' => 1, // Hardcoded

// ✅ BIEN
'category_id' => Category::factory(),
```

---

## 📝 **PRÓXIMO PASO: DÍA 13**

Si tu puntuación es **21+**, estás listo para:

**🚀 DÍA 13: API REST con Laravel**

- Authentication con Sanctum
- Resource Controllers
- API Resources & Collections
- Validation & Error Handling
- Testing API endpoints

---

## 🆘 **AYUDA Y RECURSOS**

### **Comandos de debugging:**

```bash
# Ver estructura de tablas
php artisan migrate:status
php artisan schema:dump

# Debug queries
DB::enableQueryLog();
// ... tus queries ...
dd(DB::getQueryLog());
```

### **Recursos adicionales:**

- [Laravel Eloquent Docs](https://laravel.com/docs/eloquent)
- [Query Builder](https://laravel.com/docs/queries)
- [Database Testing](https://laravel.com/docs/database-testing)

---

**¡Validación completada! Ready for API REST! 🚀**

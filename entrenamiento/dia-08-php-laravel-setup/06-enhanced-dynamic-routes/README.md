# 🛣️ 06. Enhanced: Dynamic Routes

## 🎯 Objetivos de la Sección

⏱️ **Tiempo Asignado: 60 minutos** `16:30-17:30`

Implementar rutas dinámicas avanzadas con parámetros complejos, middleware personalizado y validación sofisticada para una aplicación Laravel robusta.

### **MVP Breakdown**

- **🔧 CORE (40 min)**: Rutas con múltiples parámetros, validaciones, middleware
- **⚡ ENHANCED (15 min)**: Route Model Binding, grupos avanzados
- **✨ POLISH (5 min)**: Optimizaciones y cacheo de rutas

---

## 🔧 FASE CORE ✅ (40 minutos)

### **Rutas con Parámetros Complejos (15 min)**

#### **Archivo: `routes/web.php` - Versión Avanzada**

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\BusquedaController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| Rutas con Parámetros Múltiples y Validación
|--------------------------------------------------------------------------
*/

// 🎯 Rutas de productos con categoría y subcategoría
Route::get('/categoria/{categoria}/subcategoria/{subcategoria}/productos', [ProductoController::class, 'porCategoriaYSubcategoria'])
    ->where(['categoria' => '[a-z-]+', 'subcategoria' => '[a-z-]+'])
    ->name('productos.categoria.subcategoria');

// 🎯 Productos con filtros complejos
Route::get('/productos/precio/{min}/{max}', [ProductoController::class, 'porRangoPrecio'])
    ->where(['min' => '[0-9]+(\.[0-9]+)?', 'max' => '[0-9]+(\.[0-9]+)?'])
    ->name('productos.precio.rango');

// 🎯 Búsqueda avanzada con múltiples parámetros
Route::get('/buscar/{termino}/categoria/{categoria?}/precio/{min?}/{max?}', [BusquedaController::class, 'busquedaAvanzada'])
    ->where([
        'termino' => '[a-zA-Z0-9\s\-]+',
        'categoria' => '[a-z-]+',
        'min' => '[0-9]+(\.[0-9]+)?',
        'max' => '[0-9]+(\.[0-9]+)?'
    ])
    ->name('busqueda.avanzada');

// 🎯 Productos por año y mes de creación
Route::get('/productos/archivo/{año}/{mes?}', [ProductoController::class, 'porFecha'])
    ->where(['año' => '[0-9]{4}', 'mes' => '[0-9]{1,2}'])
    ->name('productos.archivo');

// 🎯 Rutas con parámetros opcionales múltiples
Route::get('/catalogo/{categoria?}/{subcategoria?}/{pagina?}', [ProductoController::class, 'catalogo'])
    ->where([
        'categoria' => '[a-z-]+',
        'subcategoria' => '[a-z-]+',
        'pagina' => '[0-9]+'
    ])
    ->name('catalogo.navegacion');

/*
|--------------------------------------------------------------------------
| Rutas con Validación Personalizada
|--------------------------------------------------------------------------
*/

// 🎯 Validación de códigos de producto
Route::get('/producto/codigo/{codigo}', [ProductoController::class, 'porCodigo'])
    ->where('codigo', '[A-Z]{2,3}-[0-9]{3,6}')
    ->name('producto.codigo');

// 🎯 Rutas con múltiples formatos de ID
Route::get('/item/{id}', [ProductoController::class, 'mostrarItem'])
    ->where('id', '[0-9]+|[A-Z]{2,3}-[0-9]{3,6}')
    ->name('item.mostrar');

// 🎯 Rutas con validación de fecha
Route::get('/reportes/{fecha}', [AdminController::class, 'reportePorFecha'])
    ->where('fecha', '[0-9]{4}-[0-9]{2}-[0-9]{2}')
    ->name('reportes.fecha');

/*
|--------------------------------------------------------------------------
| Rutas Condicionales y Dinámicas
|--------------------------------------------------------------------------
*/

// 🎯 Rutas que cambian según el entorno
if (app()->environment('local', 'testing')) {
    Route::get('/debug/productos', [ProductoController::class, 'debug'])->name('debug.productos');
    Route::get('/debug/routes', function () {
        return collect(Route::getRoutes())->map(function ($route) {
            return [
                'uri' => $route->uri(),
                'methods' => $route->methods(),
                'name' => $route->getName(),
                'action' => $route->getActionName(),
            ];
        });
    })->name('debug.routes');
}

// 🎯 Rutas con subdominios (para futuro)
// Route::domain('{subdominio}.localhost')->group(function () {
//     Route::get('/', [SubdominioController::class, 'index']);
// });
```

### **Controladores con Lógica de Parámetros Avanzada (15 min)**

#### **Controlador de Búsqueda Avanzada**

```bash
# Crear controlador de búsqueda
php artisan make:controller BusquedaController
```

**Archivo: `app/Http/Controllers/BusquedaController.php`**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BusquedaController extends Controller
{
    /**
     * Búsqueda avanzada con múltiples parámetros
     */
    public function busquedaAvanzada(
        string $termino,
        string $categoria = null,
        float $min = null,
        float $max = null
    ) {
        // 🎯 Validar parámetros
        $this->validarParametrosBusqueda($termino, $categoria, $min, $max);

        // 🎯 Datos de ejemplo (en producción sería de BD)
        $productos = collect([
            ['id' => 1, 'nombre' => 'Laptop HP Pavilion', 'precio' => 2499.99, 'categoria' => 'electronica'],
            ['id' => 2, 'nombre' => 'Smartphone Samsung', 'precio' => 1299.99, 'categoria' => 'electronica'],
            ['id' => 3, 'nombre' => 'Auriculares Sony', 'precio' => 349.99, 'categoria' => 'audio'],
            ['id' => 4, 'nombre' => 'Monitor Dell', 'precio' => 599.99, 'categoria' => 'electronica'],
            ['id' => 5, 'nombre' => 'Teclado Corsair', 'precio' => 189.99, 'categoria' => 'accesorios'],
        ]);

        // 🎯 Aplicar filtros
        $resultados = $productos->filter(function ($producto) use ($termino, $categoria, $min, $max) {
            // Filtro por término de búsqueda
            $coincideTermino = stripos($producto['nombre'], $termino) !== false;

            // Filtro por categoría (opcional)
            $coincideCategoria = !$categoria || $producto['categoria'] === $categoria;

            // Filtro por precio mínimo (opcional)
            $cumplePrecioMin = !$min || $producto['precio'] >= $min;

            // Filtro por precio máximo (opcional)
            $cumplePrecioMax = !$max || $producto['precio'] <= $max;

            return $coincideTermino && $coincideCategoria && $cumplePrecioMin && $cumplePrecioMax;
        });

        // 🎯 Estadísticas de búsqueda
        $estadisticas = [
            'total_encontrados' => $resultados->count(),
            'termino_busqueda' => $termino,
            'categoria_filtro' => $categoria,
            'rango_precio' => $min || $max ? ['min' => $min, 'max' => $max] : null,
            'precio_promedio' => $resultados->avg('precio'),
            'tiempo_busqueda' => round(microtime(true) - LARAVEL_START, 3),
        ];

        // 🎯 Sugerencias de búsqueda relacionada
        $sugerencias = $this->generarSugerencias($termino, $categoria);

        return view('busqueda.resultados', compact('resultados', 'estadisticas', 'sugerencias'));
    }

    /**
     * Validar parámetros de búsqueda
     */
    private function validarParametrosBusqueda(string $termino, ?string $categoria, ?float $min, ?float $max)
    {
        // 🎯 Validar término de búsqueda
        if (strlen($termino) < 2) {
            abort(400, 'El término de búsqueda debe tener al menos 2 caracteres');
        }

        // 🎯 Validar categoría
        $categoriasValidas = ['electronica', 'audio', 'accesorios', 'fotografia'];
        if ($categoria && !in_array($categoria, $categoriasValidas)) {
            abort(400, 'Categoría no válida');
        }

        // 🎯 Validar rango de precios
        if ($min !== null && $max !== null && $min > $max) {
            abort(400, 'El precio mínimo no puede ser mayor al máximo');
        }

        if ($min !== null && $min < 0) {
            abort(400, 'El precio mínimo no puede ser negativo');
        }

        if ($max !== null && $max > 100000) {
            abort(400, 'El precio máximo no puede exceder $100,000');
        }
    }

    /**
     * Generar sugerencias de búsqueda
     */
    private function generarSugerencias(string $termino, ?string $categoria): array
    {
        $sugerencias = [];

        // 🎯 Sugerencias basadas en términos similares
        $terminosSimilares = [
            'laptop' => ['computadora', 'notebook', 'portatil'],
            'telefono' => ['smartphone', 'celular', 'movil'],
            'audio' => ['sonido', 'auriculares', 'parlantes'],
        ];

        foreach ($terminosSimilares as $base => $similares) {
            if (stripos($termino, $base) !== false) {
                foreach ($similares as $similar) {
                    $sugerencias[] = str_ireplace($base, $similar, $termino);
                }
            }
        }

        // 🎯 Sugerencias de categorías relacionadas
        if (!$categoria) {
            $sugerencias[] = $termino . ' en Electrónicos';
            $sugerencias[] = $termino . ' en Audio';
            $sugerencias[] = $termino . ' en Accesorios';
        }

        return array_slice(array_unique($sugerencias), 0, 5);
    }
}
```

#### **Extensión del ProductoController para Rutas Dinámicas**

**Archivo: `app/Http/Controllers/ProductoController.php` - Métodos Adicionales**

```php
<?php

// Agregar estos métodos al ProductoController existente

/**
 * Mostrar productos por categoría y subcategoría
 */
public function porCategoriaYSubcategoria(string $categoria, string $subcategoria)
{
    $productos = $this->getProductos()
        ->where('categoria', $categoria)
        ->where('subcategoria', $subcategoria);

    if ($productos->isEmpty()) {
        return redirect()->route('productos.index')
            ->with('info', "No hay productos en {$categoria} > {$subcategoria}");
    }

    return view('productos.categoria-subcategoria', compact('productos', 'categoria', 'subcategoria'));
}

/**
 * Mostrar productos por rango de precio
 */
public function porRangoPrecio(float $min, float $max)
{
    // 🎯 Validar rango
    if ($min > $max) {
        abort(400, 'El precio mínimo no puede ser mayor al máximo');
    }

    if ($min < 0 || $max < 0) {
        abort(400, 'Los precios no pueden ser negativos');
    }

    $productos = $this->getProductos()
        ->whereBetween('precio', [$min, $max]);

    $estadisticas = [
        'rango' => ['min' => $min, 'max' => $max],
        'total' => $productos->count(),
        'precio_promedio' => $productos->avg('precio'),
    ];

    return view('productos.rango-precio', compact('productos', 'estadisticas'));
}

/**
 * Mostrar productos por fecha de creación
 */
public function porFecha(int $año, int $mes = null)
{
    // 🎯 Validar año
    $añoActual = date('Y');
    if ($año < 2020 || $año > $añoActual) {
        abort(400, 'Año no válido');
    }

    // 🎯 Validar mes
    if ($mes !== null && ($mes < 1 || $mes > 12)) {
        abort(400, 'Mes no válido');
    }

    $productos = $this->getProductos()->filter(function ($producto) use ($año, $mes) {
        $fechaProducto = $producto['fecha_creacion'];
        $añoProducto = $fechaProducto->year;
        $mesProducto = $fechaProducto->month;

        if ($mes !== null) {
            return $añoProducto == $año && $mesProducto == $mes;
        }

        return $añoProducto == $año;
    });

    $periodo = $mes ? "de {$año}-{$mes}" : "del {$año}";

    return view('productos.archivo', compact('productos', 'año', 'mes', 'periodo'));
}

/**
 * Catálogo con navegación avanzada
 */
public function catalogo(string $categoria = null, string $subcategoria = null, int $pagina = 1)
{
    $productos = $this->getProductos();

    // 🎯 Filtrar por categoría
    if ($categoria) {
        $productos = $productos->where('categoria', $categoria);
    }

    // 🎯 Filtrar por subcategoría
    if ($subcategoria) {
        $productos = $productos->where('subcategoria', $subcategoria);
    }

    // 🎯 Paginación manual
    $porPagina = 6;
    $total = $productos->count();
    $totalPaginas = ceil($total / $porPagina);

    if ($pagina > $totalPaginas && $totalPaginas > 0) {
        abort(404, 'Página no encontrada');
    }

    $offset = ($pagina - 1) * $porPagina;
    $productos = $productos->slice($offset, $porPagina);

    $paginacion = [
        'pagina_actual' => $pagina,
        'total_paginas' => $totalPaginas,
        'por_pagina' => $porPagina,
        'total_items' => $total,
        'tiene_anterior' => $pagina > 1,
        'tiene_siguiente' => $pagina < $totalPaginas,
    ];

    return view('productos.catalogo', compact('productos', 'categoria', 'subcategoria', 'paginacion'));
}

/**
 * Mostrar producto por código
 */
public function porCodigo(string $codigo)
{
    // 🎯 Simular búsqueda por código
    $codigosProductos = [
        'HP-001' => 1,
        'SAM-002' => 2,
        'SNY-003' => 3,
        'DEL-004' => 4,
        'COR-005' => 5,
    ];

    if (!isset($codigosProductos[$codigo])) {
        abort(404, "Producto con código {$codigo} no encontrado");
    }

    $producto = $this->getProductos()->firstWhere('id', $codigosProductos[$codigo]);

    return view('productos.show', compact('producto'))->with('codigo_busqueda', $codigo);
}

/**
 * Mostrar item (por ID numérico o código)
 */
public function mostrarItem(string $id)
{
    // 🎯 Determinar si es ID numérico o código
    if (is_numeric($id)) {
        return $this->show($id);
    } else {
        return $this->porCodigo($id);
    }
}
```

### **Middleware Personalizado para Validaciones (10 min)**

```bash
# Crear middleware personalizado
php artisan make:middleware ValidateProductSearch
php artisan make:middleware LogRouteAccess
```

#### **Middleware de Validación de Búsqueda**

**Archivo: `app/Http/Middleware/ValidateProductSearch.php`**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ValidateProductSearch
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // 🎯 Validar parámetros de búsqueda de productos
        $termino = $request->route('termino');
        $categoria = $request->route('categoria');
        $min = $request->route('min');
        $max = $request->route('max');

        // 🎯 Validaciones
        if ($termino && strlen($termino) < 2) {
            return response()->view('errors.search-invalid', [
                'message' => 'El término de búsqueda debe tener al menos 2 caracteres'
            ], 400);
        }

        if ($min && $max && (float)$min > (float)$max) {
            return response()->view('errors.search-invalid', [
                'message' => 'El precio mínimo no puede ser mayor al máximo'
            ], 400);
        }

        // 🎯 Sanitizar parámetros
        if ($termino) {
            $request->route()->setParameter('termino', htmlspecialchars($termino, ENT_QUOTES));
        }

        return $next($request);
    }
}
```

#### **Middleware de Log de Acceso a Rutas**

**Archivo: `app/Http/Middleware/LogRouteAccess.php`**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogRouteAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // 🎯 Log de acceso a rutas específicas
        $routeName = $request->route()->getName();
        $userAgent = $request->userAgent();
        $ip = $request->ip();

        // 🎯 Solo log rutas importantes
        $importantRoutes = [
            'busqueda.avanzada',
            'productos.categoria.subcategoria',
            'productos.precio.rango'
        ];

        if (in_array($routeName, $importantRoutes)) {
            Log::info("Acceso a ruta dinámica: {$routeName}", [
                'ip' => $ip,
                'user_agent' => $userAgent,
                'parameters' => $request->route()->parameters(),
                'timestamp' => now(),
            ]);
        }

        return $next($request);
    }
}
```

#### **Registrar Middleware**

**Archivo: `app/Http/Kernel.php`**

```php
protected $routeMiddleware = [
    // ... middleware existentes
    'validate.search' => \App\Http\Middleware\ValidateProductSearch::class,
    'log.route' => \App\Http\Middleware\LogRouteAccess::class,
];
```

#### **Aplicar Middleware a Rutas**

```php
// En routes/web.php

// 🎯 Aplicar middleware a rutas específicas
Route::get('/buscar/{termino}/categoria/{categoria?}/precio/{min?}/{max?}', [BusquedaController::class, 'busquedaAvanzada'])
    ->middleware(['validate.search', 'log.route'])
    ->where([
        'termino' => '[a-zA-Z0-9\s\-]+',
        'categoria' => '[a-z-]+',
        'min' => '[0-9]+(\.[0-9]+)?',
        'max' => '[0-9]+(\.[0-9]+)?'
    ])
    ->name('busqueda.avanzada');

// 🎯 Grupo con middleware
Route::middleware(['log.route'])->group(function () {
    Route::get('/categoria/{categoria}/subcategoria/{subcategoria}/productos', [ProductoController::class, 'porCategoriaYSubcategoria'])
        ->where(['categoria' => '[a-z-]+', 'subcategoria' => '[a-z-]+'])
        ->name('productos.categoria.subcategoria');

    Route::get('/productos/precio/{min}/{max}', [ProductoController::class, 'porRangoPrecio'])
        ->where(['min' => '[0-9]+(\.[0-9]+)?', 'max' => '[0-9]+(\.[0-9]+)?'])
        ->name('productos.precio.rango');
});
```

---

## ⚡ FASE ENHANCED (15 minutos)

### **Route Model Binding Personalizado**

#### **Crear Provider de Route Binding**

**Archivo: `app/Providers/RouteServiceProvider.php`**

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Define your route model bindings, pattern filters, etc.
     */
    public function boot()
    {
        // 🎯 Route Model Binding personalizado para productos
        Route::bind('producto_codigo', function ($value) {
            // Buscar producto por código o ID
            $productos = collect([
                ['id' => 1, 'codigo' => 'HP-001', 'nombre' => 'Laptop HP'],
                ['id' => 2, 'codigo' => 'SAM-002', 'nombre' => 'Samsung Galaxy'],
                ['id' => 3, 'codigo' => 'SNY-003', 'nombre' => 'Sony Headphones'],
            ]);

            // Buscar por código o ID
            $producto = $productos->firstWhere('codigo', $value)
                     ?? $productos->firstWhere('id', (int)$value);

            if (!$producto) {
                abort(404, "Producto no encontrado: {$value}");
            }

            return (object)$producto;
        });

        // 🎯 Binding para categorías con validación
        Route::bind('categoria_valida', function ($value) {
            $categoriasValidas = [
                'electronica' => 'Electrónicos',
                'audio' => 'Audio y Sonido',
                'accesorios' => 'Accesorios',
                'fotografia' => 'Fotografía',
            ];

            if (!isset($categoriasValidas[$value])) {
                abort(404, "Categoría no encontrada: {$value}");
            }

            return (object)[
                'slug' => $value,
                'nombre' => $categoriasValidas[$value],
                'productos_count' => rand(5, 25),
            ];
        });

        parent::boot();
    }
}
```

#### **Usar Route Model Binding**

```php
// En routes/web.php

// 🎯 Usar binding personalizado
Route::get('/producto-binding/{producto_codigo}', function ($producto) {
    return view('productos.show-binding', compact('producto'));
})->name('producto.binding');

Route::get('/categoria-binding/{categoria_valida}', function ($categoria) {
    return view('productos.categoria-binding', compact('categoria'));
})->name('categoria.binding');
```

### **Grupos de Rutas Avanzados**

```php
// En routes/web.php

/*
|--------------------------------------------------------------------------
| Grupos de Rutas con Configuración Avanzada
|--------------------------------------------------------------------------
*/

// 🎯 Grupo de API interna con rate limiting
Route::middleware(['throttle:60,1'])->prefix('api/internal')->name('api.')->group(function () {
    Route::get('/productos/stats', [ProductoController::class, 'apiStats'])->name('productos.stats');
    Route::get('/busqueda/sugerencias/{termino}', [BusquedaController::class, 'apiSugerencias'])->name('busqueda.sugerencias');
});

// 🎯 Grupo administrativo con múltiples middleware
Route::middleware(['auth', 'role:admin', 'log.route'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/productos/analytics', [AdminController::class, 'productosAnalytics'])->name('productos.analytics');
        Route::get('/rutas/estadisticas', [AdminController::class, 'rutasEstadisticas'])->name('rutas.stats');
    });

// 🎯 Grupo de rutas con caché
Route::middleware(['cache.headers:public;max_age=3600'])
    ->prefix('cache')
    ->name('cache.')
    ->group(function () {
        Route::get('/productos/populares', [ProductoController::class, 'populares'])->name('productos.populares');
        Route::get('/categorias/menu', [CategoriaController::class, 'menu'])->name('categorias.menu');
    });

// 🎯 Rutas con configuración de CORS específica
Route::middleware(['cors'])
    ->prefix('public-api')
    ->name('public-api.')
    ->group(function () {
        Route::get('/productos', [ProductoController::class, 'apiPublica'])->name('productos');
        Route::get('/categorias', [CategoriaController::class, 'apiPublica'])->name('categorias');
    });
```

---

## ✨ FASE POLISH (5 minutos)

### **Optimización y Cacheo de Rutas**

#### **Comandos de Optimización**

```bash
# 🎯 Cachear rutas para producción
php artisan route:cache

# 🎯 Limpiar caché de rutas
php artisan route:clear

# 🎯 Ver estadísticas de rutas
php artisan route:list --columns=uri,name,action,middleware
```

#### **Configuración de Cache para Rutas**

**Archivo: `config/cache.php` - Configuración específica para rutas**

```php
'route_cache' => [
    'enabled' => env('ROUTE_CACHE_ENABLED', true),
    'ttl' => env('ROUTE_CACHE_TTL', 3600), // 1 hora
    'key_prefix' => 'route_cache_',
],
```

#### **Helper para Generar URLs Complejas**

**Archivo: `app/Helpers/RouteHelper.php`**

```php
<?php

namespace App\Helpers;

class RouteHelper
{
    /**
     * Generar URL de búsqueda avanzada
     */
    public static function busquedaAvanzada(string $termino, array $filtros = []): string
    {
        $parametros = [$termino];

        if (isset($filtros['categoria'])) {
            $parametros[] = $filtros['categoria'];
        }

        if (isset($filtros['precio_min'])) {
            $parametros[] = $filtros['precio_min'];

            if (isset($filtros['precio_max'])) {
                $parametros[] = $filtros['precio_max'];
            }
        }

        return route('busqueda.avanzada', $parametros);
    }

    /**
     * Generar breadcrumbs dinámicos
     */
    public static function breadcrumbs(): array
    {
        $route = request()->route();
        $routeName = $route->getName();
        $parameters = $route->parameters();

        $breadcrumbs = [
            ['url' => route('home'), 'title' => 'Inicio']
        ];

        switch ($routeName) {
            case 'busqueda.avanzada':
                $breadcrumbs[] = ['url' => route('productos.index'), 'title' => 'Productos'];
                $breadcrumbs[] = ['url' => null, 'title' => 'Búsqueda: ' . $parameters['termino']];
                break;

            case 'productos.categoria.subcategoria':
                $breadcrumbs[] = ['url' => route('productos.index'), 'title' => 'Productos'];
                $breadcrumbs[] = ['url' => null, 'title' => ucfirst($parameters['categoria'])];
                $breadcrumbs[] = ['url' => null, 'title' => ucfirst($parameters['subcategoria'])];
                break;
        }

        return $breadcrumbs;
    }
}
```

### **Monitoreo de Performance de Rutas**

**Archivo: `app/Http/Middleware/RoutePerformanceMonitor.php`**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class RoutePerformanceMonitor
{
    public function handle(Request $request, Closure $next)
    {
        $startTime = microtime(true);

        $response = $next($request);

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000; // en milisegundos

        // 🎯 Log rutas lentas
        if ($duration > 500) { // más de 500ms
            Log::warning('Ruta lenta detectada', [
                'route' => $request->route()->getName(),
                'duration' => $duration,
                'url' => $request->fullUrl(),
                'method' => $request->method(),
            ]);
        }

        // 🎯 Guardar estadísticas en caché
        $routeName = $request->route()->getName();
        $cacheKey = "route_stats_{$routeName}";

        $stats = Cache::get($cacheKey, ['count' => 0, 'total_time' => 0, 'avg_time' => 0]);
        $stats['count']++;
        $stats['total_time'] += $duration;
        $stats['avg_time'] = $stats['total_time'] / $stats['count'];

        Cache::put($cacheKey, $stats, 3600);

        return $response;
    }
}
```

---

## ✅ Checklist de Validación

### **🔧 CORE MVP**

- [ ] Rutas con múltiples parámetros funcionando
- [ ] Validaciones de parámetros implementadas
- [ ] Middleware personalizado creado y aplicado
- [ ] Controladores con lógica avanzada
- [ ] Manejo de errores para parámetros inválidos

### **⚡ ENHANCED MVP**

- [ ] Route Model Binding personalizado
- [ ] Grupos de rutas con configuración avanzada
- [ ] Logging de acceso a rutas implementado
- [ ] Sanitización de parámetros funcionando

### **✨ POLISH MVP**

- [ ] Optimización de rutas implementada
- [ ] Helper de rutas creado
- [ ] Monitoreo de performance activo
- [ ] Breadcrumbs dinámicos funcionando

---

## 🚀 Comandos de Verificación

```bash
# Verificar rutas
php artisan route:list

# Verificar rutas con middleware
php artisan route:list --middleware

# Cachear rutas
php artisan route:cache

# Probar rutas específicas
curl -s "http://localhost:8000/buscar/laptop"
curl -s "http://localhost:8000/productos/precio/100/500"
curl -s "http://localhost:8000/categoria/electronica/subcategoria/laptops/productos"
```

---

## 🔄 Próximo Paso

**Sección 07**: Polish Basic Layout

- Layout maestro optimizado
- Componentes UI avanzados
- Mejoras de UX y performance

---

> **⏱️ Tiempo Target: 60 minutos** > **🎯 Objetivo: Rutas dinámicas avanzadas** > **✅ Resultado: Sistema de enrutamiento robusto**

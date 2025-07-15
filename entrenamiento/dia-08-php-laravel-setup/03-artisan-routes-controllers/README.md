# ⚙️ 03. Artisan + Routes + Controllers

## 🎯 Objetivos de la Sección

⏱️ **Tiempo Asignado: 60 minutos** `13:45-14:45`

Dominar los comandos Artisan, el sistema de rutas de Laravel y la creación de controladores para una arquitectura MVC sólida.

### **MVP Breakdown**

- **🔧 CORE (40 min)**: Comandos Artisan básicos, rutas, controladores
- **⚡ ENHANCED (15 min)**: Rutas avanzadas, middleware, resource controllers
- **✨ POLISH (5 min)**: Organización y mejores prácticas

---

## 🔧 FASE CORE ✅ (40 minutos)

### **Comandos Artisan Esenciales (15 min)**

```bash
# 🎯 Ver todos los comandos disponibles
php artisan list

# 🎯 Información detallada de la aplicación
php artisan about

# 🎯 Generar controlador
php artisan make:controller ProductoController

# 🎯 Generar modelo
php artisan make:model Producto

# 🎯 Generar migración
php artisan make:migration crear_tabla_productos

# 🎯 Generar todo junto (Modelo + Migración + Controlador)
php artisan make:model Producto -mcr
# -m: migración
# -c: controlador
# -r: resource controller

# 🎯 Generar seeder
php artisan make:seeder ProductoSeeder

# 🎯 Generar factory
php artisan make:factory ProductoFactory

# 🎯 Generar request para validación
php artisan make:request StoreProductoRequest

# 🎯 Comandos de base de datos
php artisan migrate              # Ejecutar migraciones
php artisan migrate:rollback     # Revertir última migración
php artisan migrate:refresh      # Revertir y re-ejecutar
php artisan migrate:fresh        # Eliminar todas las tablas y re-ejecutar
php artisan migrate:status       # Ver estado de migraciones

# 🎯 Seeders
php artisan db:seed                    # Ejecutar todos los seeders
php artisan db:seed --class=ProductoSeeder # Ejecutar seeder específico

# 🎯 Limpiar caché
php artisan cache:clear          # Limpiar caché de aplicación
php artisan config:clear         # Limpiar caché de configuración
php artisan route:clear          # Limpiar caché de rutas
php artisan view:clear           # Limpiar caché de vistas

# 🎯 Ver rutas
php artisan route:list           # Listar todas las rutas
php artisan route:list --name=producto # Filtrar rutas por nombre
```

### **Sistema de Rutas (15 min)**

#### **Archivo: `routes/web.php`**

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\UsuarioController;

/*
|--------------------------------------------------------------------------
| Rutas Básicas
|--------------------------------------------------------------------------
*/

// 🎯 Ruta básica con closure
Route::get('/', function () {
    return view('welcome');
});

// 🎯 Ruta con controlador
Route::get('/home', [HomeController::class, 'index'])->name('home');

/*
|--------------------------------------------------------------------------
| Rutas con Parámetros
|--------------------------------------------------------------------------
*/

// 🎯 Parámetro obligatorio
Route::get('/producto/{id}', [ProductoController::class, 'show'])->name('producto.show');

// 🎯 Parámetro opcional
Route::get('/usuario/{id?}', [UsuarioController::class, 'show'])->name('usuario.show');

// 🎯 Múltiples parámetros
Route::get('/categoria/{categoria}/producto/{id}', [ProductoController::class, 'showByCategory'])
    ->name('producto.show.category');

/*
|--------------------------------------------------------------------------
| Rutas con Restricciones
|--------------------------------------------------------------------------
*/

// 🎯 Restricción numérica
Route::get('/producto/{id}', [ProductoController::class, 'show'])
    ->where('id', '[0-9]+')
    ->name('producto.show');

// 🎯 Restricción alfabética
Route::get('/categoria/{slug}', [ProductoController::class, 'category'])
    ->where('slug', '[a-z-]+')
    ->name('producto.category');

// 🎯 Múltiples restricciones
Route::get('/usuario/{id}/pedido/{numero}', [UsuarioController::class, 'showOrder'])
    ->where(['id' => '[0-9]+', 'numero' => '[A-Z0-9]+'])
    ->name('usuario.pedido');

/*
|--------------------------------------------------------------------------
| Grupos de Rutas
|--------------------------------------------------------------------------
*/

// 🎯 Grupo con prefijo
Route::prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/usuarios', [AdminController::class, 'usuarios'])->name('admin.usuarios');
    Route::get('/productos', [AdminController::class, 'productos'])->name('admin.productos');
});

// 🎯 Grupo con middleware
Route::middleware(['auth'])->group(function () {
    Route::get('/perfil', [UsuarioController::class, 'perfil'])->name('perfil');
    Route::get('/configuracion', [UsuarioController::class, 'configuracion'])->name('configuracion');
});

/*
|--------------------------------------------------------------------------
| Resource Routes (CRUD Completo)
|--------------------------------------------------------------------------
*/

// 🎯 Rutas resource completas
Route::resource('productos', ProductoController::class);

// 🎯 Rutas resource parciales
Route::resource('categorias', CategoriaController::class)->only([
    'index', 'show', 'create', 'store'
]);

// 🎯 Rutas resource excluyen algunas
Route::resource('usuarios', UsuarioController::class)->except([
    'destroy'
]);
```

#### **Rutas Resource Generadas Automáticamente**

```bash
# php artisan route:list | grep productos

# GET      /productos              index    productos.index
# GET      /productos/create       create   productos.create
# POST     /productos              store    productos.store
# GET      /productos/{producto}   show     productos.show
# GET      /productos/{producto}/edit edit  productos.edit
# PUT      /productos/{producto}   update   productos.update
# DELETE   /productos/{producto}   destroy  productos.destroy
```

### **Controladores (10 min)**

#### **Controlador Básico**

**Archivo: `app/Http/Controllers/HomeController.php`**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Mostrar la página de inicio
     */
    public function index()
    {
        $data = [
            'titulo' => 'Página de Inicio',
            'fecha' => now()->format('d/m/Y'),
            'usuario_count' => 150,
            'producto_count' => 89,
        ];

        return view('home.index', $data);
    }

    /**
     * Mostrar página "Acerca de"
     */
    public function about()
    {
        return view('home.about', [
            'version' => '1.0.0',
            'desarrolladores' => ['Juan', 'María', 'Carlos']
        ]);
    }

    /**
     * Mostrar información del sistema
     */
    public function info()
    {
        $info = [
            'laravel_version' => app()->version(),
            'php_version' => phpversion(),
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'N/A',
            'environment' => app()->environment(),
            'debug' => config('app.debug'),
            'timezone' => config('app.timezone'),
        ];

        return view('home.info', compact('info'));
    }
}
```

#### **Resource Controller Completo**

**Archivo: `app/Http/Controllers/ProductoController.php`**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TODO: Obtener productos de la base de datos
        $productos = [
            ['id' => 1, 'nombre' => 'Laptop HP', 'precio' => 2500.00],
            ['id' => 2, 'nombre' => 'Mouse Logitech', 'precio' => 45.99],
            ['id' => 3, 'nombre' => 'Teclado Mecánico', 'precio' => 129.99],
        ];

        return view('productos.index', compact('productos'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('productos.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 🎯 Validación básica
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
        ]);

        // TODO: Guardar en base de datos
        // Producto::create($validatedData);

        return redirect()->route('productos.index')
            ->with('success', 'Producto creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // TODO: Obtener producto específico
        $producto = [
            'id' => $id,
            'nombre' => 'Producto ' . $id,
            'precio' => rand(10, 1000),
            'descripcion' => 'Descripción del producto ' . $id,
            'categoria' => 'Electrónicos',
            'stock' => rand(0, 50),
        ];

        return view('productos.show', compact('producto'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // TODO: Obtener producto para editar
        $producto = [
            'id' => $id,
            'nombre' => 'Producto ' . $id,
            'precio' => rand(10, 1000),
            'descripcion' => 'Descripción del producto ' . $id,
        ];

        return view('productos.edit', compact('producto'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // 🎯 Validación
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
        ]);

        // TODO: Actualizar en base de datos
        // $producto = Producto::findOrFail($id);
        // $producto->update($validatedData);

        return redirect()->route('productos.show', $id)
            ->with('success', 'Producto actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // TODO: Eliminar de base de datos
        // Producto::findOrFail($id)->delete();

        return redirect()->route('productos.index')
            ->with('success', 'Producto eliminado exitosamente.');
    }

    /**
     * Mostrar productos por categoría
     */
    public function showByCategory(string $categoria, string $id)
    {
        $producto = [
            'id' => $id,
            'nombre' => 'Producto ' . $id,
            'categoria' => ucfirst($categoria),
            'precio' => rand(10, 1000),
        ];

        return view('productos.show', compact('producto'));
    }
}
```

---

## ⚡ FASE ENHANCED (15 minutos)

### **Middleware Básico**

```bash
# 🎯 Crear middleware personalizado
php artisan make:middleware VerifyAge
```

**Archivo: `app/Http/Middleware/VerifyAge.php`**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyAge
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, $minAge = 18)
    {
        $age = $request->input('age');

        if ($age && $age < $minAge) {
            return response()->json([
                'error' => "Debes tener al menos {$minAge} años"
            ], 403);
        }

        return $next($request);
    }
}
```

**Registrar middleware en `app/Http/Kernel.php`**

```php
protected $routeMiddleware = [
    // ... middleware existentes
    'verify.age' => \App\Http\Middleware\VerifyAge::class,
];
```

**Usar middleware en rutas**

```php
// En routes/web.php
Route::get('/adultos-only', function () {
    return 'Contenido para adultos';
})->middleware('verify.age:21');
```

### **Request Classes para Validación**

```bash
# 🎯 Crear request class
php artisan make:request StoreProductoRequest
```

**Archivo: `app/Http/Requests/StoreProductoRequest.php`**

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // TODO: Implementar lógica de autorización
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255|unique:productos,nombre',
            'precio' => 'required|numeric|min:0.01|max:999999.99',
            'descripcion' => 'nullable|string|max:1000',
            'categoria_id' => 'required|exists:categorias,id',
            'stock' => 'required|integer|min:0|max:9999',
            'activo' => 'boolean',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'nombre.unique' => 'Ya existe un producto con este nombre.',
            'precio.required' => 'El precio es obligatorio.',
            'precio.min' => 'El precio debe ser mayor a 0.',
            'categoria_id.required' => 'Debes seleccionar una categoría.',
            'categoria_id.exists' => 'La categoría seleccionada no existe.',
            'imagen.image' => 'El archivo debe ser una imagen.',
            'imagen.max' => 'La imagen no puede ser mayor a 2MB.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'categoria_id' => 'categoría',
            'stock' => 'cantidad en stock',
        ];
    }
}
```

**Usar en el controlador**

```php
use App\Http\Requests\StoreProductoRequest;

public function store(StoreProductoRequest $request)
{
    // Los datos ya están validados
    $validatedData = $request->validated();

    // TODO: Guardar producto

    return redirect()->route('productos.index')
        ->with('success', 'Producto creado exitosamente.');
}
```

### **API Routes**

**Archivo: `routes/api.php`**

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductoApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 🎯 Rutas API sin autenticación
Route::prefix('v1')->group(function () {
    // Productos públicos
    Route::get('/productos', [ProductoApiController::class, 'index']);
    Route::get('/productos/{id}', [ProductoApiController::class, 'show']);
});

// 🎯 Rutas API con autenticación
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::post('/productos', [ProductoApiController::class, 'store']);
    Route::put('/productos/{id}', [ProductoApiController::class, 'update']);
    Route::delete('/productos/{id}', [ProductoApiController::class, 'destroy']);
});

// 🎯 Resource API completo
Route::apiResource('categorias', CategoriaApiController::class);
```

---

## ✨ FASE POLISH (5 minutos)

### **Organización Avanzada de Controladores**

```bash
# 🎯 Crear controladores en subdirectorios
php artisan make:controller Admin/ProductoController
php artisan make:controller Api/ProductoApiController
php artisan make:controller Auth/LoginController
```

### **Route Model Binding**

```php
// En routes/web.php
Route::get('/producto/{producto}', [ProductoController::class, 'show']);

// En el controlador (cuando tengamos modelos)
public function show(Producto $producto)
{
    // Laravel automáticamente busca el producto por ID
    return view('productos.show', compact('producto'));
}
```

### **Rutas con Nombres Descriptivos**

```php
Route::name('admin.')->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::resource('productos', ProductoController::class)->names([
        'index' => 'productos.listar',
        'create' => 'productos.crear',
        'store' => 'productos.guardar',
        'show' => 'productos.ver',
        'edit' => 'productos.editar',
        'update' => 'productos.actualizar',
        'destroy' => 'productos.eliminar',
    ]);
});

// Genera rutas como: admin.productos.listar, admin.productos.crear, etc.
```

---

## 🧪 Ejercicio Práctico: Sistema de Productos Completo

### **Paso 1: Generar Estructura**

```bash
# 🎯 Crear todo lo necesario
php artisan make:model Producto -mcr
php artisan make:request StoreProductoRequest
php artisan make:request UpdateProductoRequest
php artisan make:controller Api/ProductoApiController
```

### **Paso 2: Configurar Rutas Completas**

**Archivo: `routes/web.php`**

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductoController;

// 🎯 Rutas principales
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/info', [HomeController::class, 'info'])->name('info');

// 🎯 Rutas de productos
Route::resource('productos', ProductoController::class);

// 🎯 Rutas adicionales de productos
Route::get('/categoria/{categoria}/productos', [ProductoController::class, 'porCategoria'])
    ->where('categoria', '[a-z-]+')
    ->name('productos.categoria');

Route::get('/productos/buscar/{termino}', [ProductoController::class, 'buscar'])
    ->where('termino', '[a-zA-Z0-9\s]+')
    ->name('productos.buscar');

// 🎯 Grupo de rutas administrativas
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return view('admin.dashboard');
    })->name('dashboard');

    Route::get('/reportes', function () {
        return view('admin.reportes');
    })->name('reportes');
});
```

### **Paso 3: Implementar Controlador Avanzado**

**Archivo: `app/Http/Controllers/ProductoController.php`** (versión mejorada)

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // 🎯 Productos de ejemplo (después será de DB)
        $productos = collect([
            ['id' => 1, 'nombre' => 'Laptop HP Pavilion', 'precio' => 2500.00, 'categoria' => 'electronica', 'stock' => 15],
            ['id' => 2, 'nombre' => 'Mouse Logitech MX Master', 'precio' => 89.99, 'categoria' => 'electronica', 'stock' => 25],
            ['id' => 3, 'nombre' => 'Teclado Mecánico Corsair', 'precio' => 159.99, 'categoria' => 'electronica', 'stock' => 12],
            ['id' => 4, 'nombre' => 'Camiseta Nike Dri-FIT', 'precio' => 45.99, 'categoria' => 'ropa', 'stock' => 30],
            ['id' => 5, 'nombre' => 'Zapatillas Adidas Ultraboost', 'precio' => 179.99, 'categoria' => 'ropa', 'stock' => 8],
        ]);

        // 🎯 Filtrar por búsqueda si existe
        if ($request->has('search') && $request->search) {
            $productos = $productos->filter(function ($producto) use ($request) {
                return stripos($producto['nombre'], $request->search) !== false;
            });
        }

        // 🎯 Estadísticas básicas
        $stats = [
            'total' => $productos->count(),
            'precio_promedio' => $productos->avg('precio'),
            'stock_total' => $productos->sum('stock'),
            'categorias' => $productos->pluck('categoria')->unique()->count(),
        ];

        return view('productos.index', compact('productos', 'stats'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categorias = [
            'electronica' => 'Electrónica',
            'ropa' => 'Ropa y Accesorios',
            'hogar' => 'Hogar y Jardín',
            'deportes' => 'Deportes',
            'libros' => 'Libros',
        ];

        return view('productos.create', compact('categorias'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 🎯 Validación completa
        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0.01|max:999999.99',
            'descripcion' => 'nullable|string|max:1000',
            'categoria' => 'required|string|in:electronica,ropa,hogar,deportes,libros',
            'stock' => 'required|integer|min:0|max:9999',
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'precio.required' => 'El precio es obligatorio.',
            'precio.min' => 'El precio debe ser mayor a 0.',
            'categoria.required' => 'Debes seleccionar una categoría.',
            'categoria.in' => 'La categoría seleccionada no es válida.',
            'stock.required' => 'El stock es obligatorio.',
            'stock.min' => 'El stock no puede ser negativo.',
        ]);

        // TODO: Guardar en base de datos

        return redirect()->route('productos.index')
            ->with('success', 'Producto creado exitosamente.')
            ->with('producto_nombre', $request->nombre);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // TODO: Obtener de base de datos
        $producto = [
            'id' => $id,
            'nombre' => 'Producto Ejemplo ' . $id,
            'precio' => rand(10, 1000),
            'descripcion' => 'Esta es una descripción detallada del producto ' . $id . '. Incluye todas las características importantes.',
            'categoria' => 'electronica',
            'stock' => rand(0, 50),
            'fecha_creacion' => now()->subDays(rand(1, 30)),
            'activo' => true,
        ];

        // 🎯 Productos relacionados
        $relacionados = [
            ['id' => 2, 'nombre' => 'Producto Relacionado 1', 'precio' => 89.99],
            ['id' => 3, 'nombre' => 'Producto Relacionado 2', 'precio' => 159.99],
            ['id' => 4, 'nombre' => 'Producto Relacionado 3', 'precio' => 45.99],
        ];

        return view('productos.show', compact('producto', 'relacionados'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // TODO: Obtener de base de datos
        $producto = [
            'id' => $id,
            'nombre' => 'Producto ' . $id,
            'precio' => rand(10, 1000),
            'descripcion' => 'Descripción del producto ' . $id,
            'categoria' => 'electronica',
            'stock' => rand(0, 50),
        ];

        $categorias = [
            'electronica' => 'Electrónica',
            'ropa' => 'Ropa y Accesorios',
            'hogar' => 'Hogar y Jardín',
            'deportes' => 'Deportes',
            'libros' => 'Libros',
        ];

        return view('productos.edit', compact('producto', 'categorias'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // 🎯 Validación
        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0.01|max:999999.99',
            'descripcion' => 'nullable|string|max:1000',
            'categoria' => 'required|string|in:electronica,ropa,hogar,deportes,libros',
            'stock' => 'required|integer|min:0|max:9999',
        ]);

        // TODO: Actualizar en base de datos

        return redirect()->route('productos.show', $id)
            ->with('success', 'Producto actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // TODO: Eliminar de base de datos

        return redirect()->route('productos.index')
            ->with('success', 'Producto eliminado exitosamente.');
    }

    /**
     * Mostrar productos por categoría
     */
    public function porCategoria(string $categoria)
    {
        $productos = collect([
            ['id' => 1, 'nombre' => 'Laptop HP', 'precio' => 2500.00, 'categoria' => 'electronica'],
            ['id' => 2, 'nombre' => 'Mouse Logitech', 'precio' => 89.99, 'categoria' => 'electronica'],
            ['id' => 4, 'nombre' => 'Camiseta Nike', 'precio' => 45.99, 'categoria' => 'ropa'],
        ])->where('categoria', $categoria);

        $categorias = [
            'electronica' => 'Electrónica',
            'ropa' => 'Ropa y Accesorios',
            'hogar' => 'Hogar y Jardín',
            'deportes' => 'Deportes',
            'libros' => 'Libros',
        ];

        $categoria_nombre = $categorias[$categoria] ?? 'Categoría Desconocida';

        return view('productos.categoria', compact('productos', 'categoria', 'categoria_nombre'));
    }

    /**
     * Buscar productos
     */
    public function buscar(string $termino)
    {
        $productos = collect([
            ['id' => 1, 'nombre' => 'Laptop HP Pavilion', 'precio' => 2500.00],
            ['id' => 2, 'nombre' => 'Mouse Logitech MX Master', 'precio' => 89.99],
            ['id' => 3, 'nombre' => 'Teclado Mecánico Corsair', 'precio' => 159.99],
        ])->filter(function ($producto) use ($termino) {
            return stripos($producto['nombre'], $termino) !== false;
        });

        return view('productos.busqueda', compact('productos', 'termino'));
    }
}
```

---

## ✅ Checklist de Validación

### **🔧 CORE MVP**

- [ ] Comandos Artisan básicos funcionando
- [ ] Rutas básicas definidas y accesibles
- [ ] Controladores básicos creados
- [ ] Resource routes funcionando
- [ ] Parámetros en rutas funcionando
- [ ] Validación básica implementada

### **⚡ ENHANCED MVP**

- [ ] Middleware personalizado creado
- [ ] Request classes implementadas
- [ ] Rutas API configuradas
- [ ] Grupos de rutas organizados
- [ ] Restricciones de rutas funcionando

### **✨ POLISH MVP**

- [ ] Organización de controladores en subdirectorios
- [ ] Route Model Binding configurado
- [ ] Nombres de rutas descriptivos
- [ ] Código bien documentado
- [ ] Manejo de errores implementado

---

## 🚀 Comandos de Verificación

```bash
# Verificar rutas
php artisan route:list

# Verificar rutas específicas
php artisan route:list --name=producto

# Verificar controladores generados
ls -la app/Http/Controllers/

# Verificar requests generados
ls -la app/Http/Requests/

# Verificar middleware
php artisan route:list --middleware

# Probar rutas específicas
curl -s http://localhost:8000/productos
curl -s http://localhost:8000/productos/1
```

---

## 🔄 Próximo Paso

**Sección 04**: Blade Templates Básicos

- Motor de templates Blade
- Herencia de layouts
- Componentes y directivas
- Integración con datos del controlador

---

> **⏱️ Tiempo Target: 60 minutos** > **🎯 Objetivo: Dominar Artisan, rutas y controladores** > **✅ Resultado: Arquitectura MVC sólida**

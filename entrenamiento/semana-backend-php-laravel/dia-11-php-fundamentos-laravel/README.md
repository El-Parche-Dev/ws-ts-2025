# 🚀 DÍA 11 - PHP Fundamentos + Laravel Setup

## Entrenamiento Intensivo WorldSkills 2025 - Backend Day 1

### 📅 **INFORMACIÓN DE LA SESIÓN**

- **Fecha**: Día 11 del entrenamiento
- **Horario**: 12:00 PM - 6:00 PM (6 horas intensivas)
- **Modalidad**: Presencial con seguimiento individual
- **Nivel**: PHP muy básico → Laravel funcional
- **Meta**: Base sólida PHP + aplicación Laravel operativa

---

## 🎯 **OBJETIVOS DEL DÍA**

### **🔧 FASE CORE (2.5 horas) - LO ESENCIAL**

- ✅ Dominar PHP 8.2+ syntax esencial para Laravel
- ✅ Configurar entorno Laravel funcional
- ✅ Crear primera aplicación Laravel básica
- ✅ Implementar MVC básico operativo

### **⚡ FASE ENHANCED (2.5 horas) - FUNCIONALIDADES ADICIONALES**

- ⚡ PHP OOP avanzado para Laravel
- ⚡ Artisan commands y middleware
- ⚡ Blade templates con datos dinámicos
- ⚡ Routing avanzado y configuración

### **✨ FASE POLISH (1 hora) - REFINAMIENTO**

- ✨ Setup profesional de desarrollo
- ✨ Git workflow para Laravel
- ✨ Debugging y logging
- ✨ Mejores prácticas de código

---

## 📚 **CRONOGRAMA DETALLADO**

### **12:00 PM - 12:30 PM | Setup Inicial (30 min)**

#### **🔍 Evaluación de Conocimientos Previos**

```php
// Test rápido: ¿Qué conoces de PHP?
// Completar este código:

<?php
// 1. Variables y tipos
$nombre = "Tu nombre";
$edad = 25;
$activo = true;

// 2. Arrays
$lenguajes = ['PHP', 'JavaScript', 'Python'];

// 3. Funciones básicas
function saludar($nombre) {
    return "Hola " . $nombre;
}

// 4. Condicionales
if ($edad >= 18) {
    echo "Mayor de edad";
}

// 5. Bucles
foreach ($lenguajes as $lenguaje) {
    echo $lenguaje . "\n";
}
?>
```

#### **✅ Verificación de Entorno**

```bash
# Verificar versiones requeridas
php --version  # Debe ser 8.2+
composer --version
sqlite3 --version

# Verificar extensiones PHP necesarias
php -m | grep -E "(sqlite|pdo|openssl|mbstring|tokenizer|xml|ctype|json)"
```

---

### **12:30 PM - 2:00 PM | CORE - PHP Moderno (90 min)**

## 🎯 **PHP 8.2+ Esencial para Laravel - Implementación MVP**

### **FASE CORE ✅ (60 minutos)**

#### **1. Sintaxis Moderna PHP 8.2+ (20 min)**

```php
<?php
// 🎯 PHP 8.2+ Features Esenciales - CORE

// ========== TIPOS DE DATOS Y DECLARACIONES ==========
declare(strict_types=1);

// Union Types (PHP 8.0+)
function procesarDato(string|int|float $valor): string|null {
    return match(gettype($valor)) {
        'string' => "Texto: " . $valor,
        'integer' => "Número entero: " . $valor,
        'double' => "Número decimal: " . $valor,
        default => null
    };
}

// Named Arguments (PHP 8.0+)
function crearUsuario(string $nombre, int $edad, bool $activo = true): array {
    return [
        'nombre' => $nombre,
        'edad' => $edad,
        'activo' => $activo,
        'creado_en' => date('Y-m-d H:i:s')
    ];
}

// Uso con named arguments
$usuario = crearUsuario(
    nombre: "Juan Pérez",
    edad: 25,
    activo: true
);

// Nullsafe Operator (PHP 8.0+)
$email = $usuario['contacto']?->email ?? 'No definido';

// Match Expression (PHP 8.0+)
$categoria = match($usuario['edad']) {
    0...17 => 'Menor',
    18...64 => 'Adulto',
    default => 'Adulto Mayor'
};

echo "Usuario: {$usuario['nombre']}, Categoría: $categoria\n";
?>
```

#### **2. OOP Básico para Laravel (20 min)**

```php
<?php
// 🎯 OOP Básico Laravel - CORE

// ========== CLASES BÁSICAS ==========
class Usuario {
    // Properties con tipos (PHP 7.4+)
    private string $nombre;
    private int $edad;
    private bool $activo;

    // Constructor Property Promotion (PHP 8.0+)
    public function __construct(
        string $nombre,
        int $edad,
        bool $activo = true
    ) {
        $this->nombre = $nombre;
        $this->edad = $edad;
        $this->activo = $activo;
    }

    // Getters con return types
    public function getNombre(): string {
        return $this->nombre;
    }

    public function getEdad(): int {
        return $this->edad;
    }

    public function isActivo(): bool {
        return $this->activo;
    }

    // Método para array (útil para Laravel)
    public function toArray(): array {
        return [
            'nombre' => $this->nombre,
            'edad' => $this->edad,
            'activo' => $this->activo
        ];
    }
}

// ========== USO BÁSICO ==========
$usuario = new Usuario("María García", 28);
echo "Usuario: " . $usuario->getNombre() . "\n";
print_r($usuario->toArray());
?>
```

#### **3. Arrays y Manejo de Datos (20 min)**

```php
<?php
// 🎯 Arrays y Datos - CORE

// ========== ARRAYS MODERNOS ==========
$productos = [
    ['id' => 1, 'nombre' => 'Laptop', 'precio' => 1500.00, 'activo' => true],
    ['id' => 2, 'nombre' => 'Mouse', 'precio' => 25.50, 'activo' => true],
    ['id' => 3, 'nombre' => 'Teclado', 'precio' => 85.00, 'activo' => false],
];

// ========== OPERACIONES FUNCIONALES ==========
// Filtrar productos activos
$productosActivos = array_filter($productos, fn($p) => $p['activo']);

// Mapear para obtener solo nombres
$nombres = array_map(fn($p) => $p['nombre'], $productosActivos);

// Buscar producto por ID
function buscarProducto(array $productos, int $id): ?array {
    $encontrado = array_filter($productos, fn($p) => $p['id'] === $id);
    return array_shift($encontrado);
}

// Calcular total de precios
$totalPrecios = array_reduce(
    $productosActivos,
    fn($total, $producto) => $total + $producto['precio'],
    0
);

// ========== OUTPUT ==========
echo "Productos activos: " . count($productosActivos) . "\n";
echo "Nombres: " . implode(', ', $nombres) . "\n";
echo "Total precios: $" . number_format($totalPrecios, 2) . "\n";

$producto = buscarProducto($productos, 1);
if ($producto) {
    echo "Producto encontrado: {$producto['nombre']}\n";
}
?>
```

### **FASE ENHANCED ⚡ (30 minutos)**

#### **4. OOP Avanzado para Laravel**

```php
<?php
// 🎯 OOP Avanzado Laravel - ENHANCED

// ========== INTERFACES ==========
interface RepositoryInterface {
    public function find(int $id): ?array;
    public function all(): array;
    public function create(array $data): array;
}

// ========== ABSTRACT CLASS ==========
abstract class BaseRepository implements RepositoryInterface {
    protected array $data = [];

    public function all(): array {
        return $this->data;
    }

    public function find(int $id): ?array {
        return array_filter($this->data, fn($item) => $item['id'] === $id)[0] ?? null;
    }

    abstract public function create(array $data): array;
}

// ========== CONCRETE CLASS ==========
class ProductoRepository extends BaseRepository {
    public function __construct() {
        $this->data = [
            ['id' => 1, 'nombre' => 'Laptop', 'precio' => 1500.00],
            ['id' => 2, 'nombre' => 'Mouse', 'precio' => 25.50],
        ];
    }

    public function create(array $data): array {
        $newId = max(array_column($this->data, 'id')) + 1;
        $producto = array_merge(['id' => $newId], $data);
        $this->data[] = $producto;
        return $producto;
    }

    // Método específico
    public function findByPriceRange(float $min, float $max): array {
        return array_filter(
            $this->data,
            fn($p) => $p['precio'] >= $min && $p['precio'] <= $max
        );
    }
}

// ========== TRAITS ==========
trait Timestampable {
    protected string $createdAt;
    protected string $updatedAt;

    public function setTimestamps(): void {
        $now = date('Y-m-d H:i:s');
        $this->createdAt = $now;
        $this->updatedAt = $now;
    }

    public function updateTimestamp(): void {
        $this->updatedAt = date('Y-m-d H:i:s');
    }
}

class Producto {
    use Timestampable;

    public function __construct(
        private string $nombre,
        private float $precio
    ) {
        $this->setTimestamps();
    }

    public function getNombre(): string {
        return $this->nombre;
    }

    public function getPrecio(): float {
        return $this->precio;
    }
}

// ========== USO ==========
$repo = new ProductoRepository();
$productos = $repo->all();
$productoEncontrado = $repo->find(1);
$nuevoProducto = $repo->create(['nombre' => 'Teclado', 'precio' => 85.00]);

echo "Total productos: " . count($productos) . "\n";
echo "Nuevo producto: {$nuevoProducto['nombre']}\n";

$producto = new Producto("Monitor", 350.00);
echo "Producto: " . $producto->getNombre() . "\n";
?>
```

---

### **2:15 PM - 4:00 PM | CORE - Laravel Basics (105 min)**

## 🎯 **Laravel Setup y Fundamentos - Implementación MVP**

### **FASE CORE ✅ (75 minutos)**

#### **1. Instalación y Configuración Laravel (25 min)**

```bash
# 🎯 Laravel Installation - CORE

# ========== CREAR PROYECTO LARAVEL ==========
cd /ruta/tu/workspace
composer create-project laravel/laravel worldskills-api
cd worldskills-api

# ========== CONFIGURACIÓN BÁSICA ==========
# Generar APP_KEY
php artisan key:generate

# Configurar .env para SQLite
cp .env.example .env
```

```env
# .env - Configuración básica
APP_NAME="WorldSkills API"
APP_ENV=local
APP_KEY=base64:TU_APP_KEY_AQUI
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite

CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
```

```bash
# Crear base de datos SQLite
touch database/database.sqlite

# Ejecutar migraciones básicas
php artisan migrate

# Verificar que todo funciona
php artisan serve
```

#### **2. Estructura Laravel y MVC (25 min)**

```php
<?php
// routes/web.php - CORE Routes
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductoController;

// ========== RUTAS BÁSICAS ==========
// Ruta básica
Route::get('/', function () {
    return view('welcome', [
        'mensaje' => 'Bienvenido a WorldSkills API',
        'fecha' => now()->format('Y-m-d H:i:s')
    ]);
});

// Rutas con parámetros
Route::get('/saludo/{nombre}', function (string $nombre) {
    return "Hola {$nombre}, bienvenido a Laravel!";
});

// Rutas con controlador
Route::get('/home', [HomeController::class, 'index'])->name('home');
Route::resource('productos', ProductoController::class);
?>
```

```php
<?php
// app/Http/Controllers/HomeController.php - CORE Controller
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class HomeController extends Controller
{
    /**
     * Mostrar página principal
     */
    public function index(): View
    {
        $datos = [
            'titulo' => 'Dashboard WorldSkills',
            'usuario' => 'Aprendiz SENA',
            'productos_count' => 10,
            'categorias_count' => 5,
            'fecha_actual' => now()->format('d/m/Y H:i:s')
        ];

        return view('home', $datos);
    }
}
?>
```

```php
<?php
// app/Http/Controllers/ProductoController.php - CORE CRUD
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class ProductoController extends Controller
{
    // Simulamos datos (más tarde será base de datos)
    private static array $productos = [
        1 => ['id' => 1, 'nombre' => 'Laptop', 'precio' => 1500.00, 'activo' => true],
        2 => ['id' => 2, 'nombre' => 'Mouse', 'precio' => 25.50, 'activo' => true],
        3 => ['id' => 3, 'nombre' => 'Teclado', 'precio' => 85.00, 'activo' => false],
    ];

    /**
     * Display a listing of the resource.
     */
    public function index(): View
    {
        return view('productos.index', [
            'productos' => collect(self::$productos)->where('activo', true)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): View
    {
        return view('productos.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        // Validación básica
        $request->validate([
            'nombre' => 'required|string|min:3|max:255',
            'precio' => 'required|numeric|min:0'
        ]);

        // Simular creación
        $nuevoId = max(array_keys(self::$productos)) + 1;
        self::$productos[$nuevoId] = [
            'id' => $nuevoId,
            'nombre' => $request->nombre,
            'precio' => (float) $request->precio,
            'activo' => true
        ];

        return redirect()->route('productos.index')
            ->with('success', 'Producto creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): View
    {
        $producto = self::$productos[$id] ?? null;

        if (!$producto) {
            abort(404, 'Producto no encontrado');
        }

        return view('productos.show', compact('producto'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): View
    {
        $producto = self::$productos[$id] ?? null;

        if (!$producto) {
            abort(404, 'Producto no encontrado');
        }

        return view('productos.edit', compact('producto'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        if (!isset(self::$productos[$id])) {
            abort(404, 'Producto no encontrado');
        }

        $request->validate([
            'nombre' => 'required|string|min:3|max:255',
            'precio' => 'required|numeric|min:0'
        ]);

        self::$productos[$id]['nombre'] = $request->nombre;
        self::$productos[$id]['precio'] = (float) $request->precio;

        return redirect()->route('productos.show', $id)
            ->with('success', 'Producto actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        if (!isset(self::$productos[$id])) {
            abort(404, 'Producto no encontrado');
        }

        // Soft delete simulation
        self::$productos[$id]['activo'] = false;

        return redirect()->route('productos.index')
            ->with('success', 'Producto eliminado exitosamente');
    }
}
?>
```

#### **3. Blade Templates Básicos (25 min)**

```html
{{-- resources/views/layouts/app.blade.php - CORE Layout --}}
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>@yield('title', 'WorldSkills Laravel')</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet" />
  </head>
  <body>
    {{-- Navigation --}}
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a
          class="navbar-brand"
          href="{{ route('home') }}">
          WorldSkills API
        </a>
        <ul class="navbar-nav">
          <li class="nav-item">
            <a
              class="nav-link"
              href="{{ route('home') }}"
              >Inicio</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="{{ route('productos.index') }}"
              >Productos</a
            >
          </li>
        </ul>
      </div>
    </nav>

    {{-- Main Content --}}
    <div class="container mt-4">
      {{-- Alert Messages --}} @if(session('success'))
      <div class="alert alert-success alert-dismissible fade show">
        {{ session('success') }}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"></button>
      </div>
      @endif @if(session('error'))
      <div class="alert alert-danger alert-dismissible fade show">
        {{ session('error') }}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"></button>
      </div>
      @endif {{-- Page Content --}} @yield('content')
    </div>

    {{-- Scripts --}}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts')
  </body>
</html>
```

```html
{{-- resources/views/home.blade.php - CORE Home View --}}
@extends('layouts.app') @section('title', 'Dashboard - WorldSkills')
@section('content')
<div class="row">
  <div class="col-12">
    <h1>{{ $titulo }}</h1>
    <p class="lead">Bienvenido {{ $usuario }}</p>
  </div>
</div>

<div class="row mt-4">
  {{-- Stats Cards --}}
  <div class="col-md-6">
    <div class="card text-white bg-primary">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <div>
            <h5 class="card-title">Productos</h5>
            <h2>{{ $productos_count }}</h2>
          </div>
          <div class="align-self-center">
            <i class="fas fa-box fa-2x"></i>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="col-md-6">
    <div class="card text-white bg-success">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <div>
            <h5 class="card-title">Categorías</h5>
            <h2>{{ $categorias_count }}</h2>
          </div>
          <div class="align-self-center">
            <i class="fas fa-tags fa-2x"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="row mt-4">
  <div class="col-12">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Acciones Rápidas</h5>
        <a
          href="{{ route('productos.index') }}"
          class="btn btn-primary me-2">
          Ver Productos
        </a>
        <a
          href="{{ route('productos.create') }}"
          class="btn btn-success">
          Crear Producto
        </a>
      </div>
    </div>
  </div>
</div>

<div class="row mt-4">
  <div class="col-12">
    <small class="text-muted">Última actualización: {{ $fecha_actual }}</small>
  </div>
</div>
@endsection
```

```html
{{-- resources/views/productos/index.blade.php - CORE Products List --}}
@extends('layouts.app') @section('title', 'Productos - WorldSkills')
@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
  <h1>Lista de Productos</h1>
  <a
    href="{{ route('productos.create') }}"
    class="btn btn-success">
    Crear Producto
  </a>
</div>

@if($productos->count() > 0)
<div class="row">
  @foreach($productos as $producto)
  <div class="col-md-4 mb-3">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{ $producto['nombre'] }}</h5>
        <p class="card-text">
          <strong>Precio:</strong> ${{ number_format($producto['precio'], 2) }}
        </p>
        <p class="card-text">
          <small class="text-muted">
            Estado:
            <span class="badge bg-success">Activo</span>
          </small>
        </p>

        {{-- Actions --}}
        <div
          class="btn-group"
          role="group">
          <a
            href="{{ route('productos.show', $producto['id']) }}"
            class="btn btn-sm btn-outline-primary">
            Ver
          </a>
          <a
            href="{{ route('productos.edit', $producto['id']) }}"
            class="btn btn-sm btn-outline-warning">
            Editar
          </a>
          <form
            action="{{ route('productos.destroy', $producto['id']) }}"
            method="POST"
            style="display: inline-block;"
            onsubmit="return confirm('¿Estás seguro?')">
            @csrf @method('DELETE')
            <button
              type="submit"
              class="btn btn-sm btn-outline-danger">
              Eliminar
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  @endforeach
</div>
@else
<div class="alert alert-info">
  <h4>No hay productos disponibles</h4>
  <p>¡Crea tu primer producto para comenzar!</p>
  <a
    href="{{ route('productos.create') }}"
    class="btn btn-success">
    Crear Primer Producto
  </a>
</div>
@endif @endsection
```

### **FASE ENHANCED ⚡ (30 minutos)**

#### **4. Formularios y Validación**

```html
{{-- resources/views/productos/create.blade.php - ENHANCED Form --}}
@extends('layouts.app') @section('title', 'Crear Producto - WorldSkills')
@section('content')
<div class="row justify-content-center">
  <div class="col-md-8">
    <div class="card">
      <div class="card-header">
        <h4>Crear Nuevo Producto</h4>
      </div>
      <div class="card-body">
        <form
          method="POST"
          action="{{ route('productos.store') }}">
          @csrf {{-- Nombre --}}
          <div class="mb-3">
            <label
              for="nombre"
              class="form-label"
              >Nombre del Producto *</label
            >
            <input
              type="text"
              id="nombre"
              name="nombre"
              class="form-control @error('nombre') is-invalid @enderror"
              value="{{ old('nombre') }}"
              placeholder="Ingresa el nombre del producto"
              required />
            @error('nombre')
            <div class="invalid-feedback">{{ $message }}</div>
            @enderror
          </div>

          {{-- Precio --}}
          <div class="mb-3">
            <label
              for="precio"
              class="form-label"
              >Precio *</label
            >
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input
                type="number"
                id="precio"
                name="precio"
                class="form-control @error('precio') is-invalid @enderror"
                value="{{ old('precio') }}"
                step="0.01"
                min="0"
                placeholder="0.00"
                required />
              @error('precio')
              <div class="invalid-feedback">{{ $message }}</div>
              @enderror
            </div>
          </div>

          {{-- Actions --}}
          <div class="d-flex justify-content-between">
            <a
              href="{{ route('productos.index') }}"
              class="btn btn-secondary">
              Cancelar
            </a>
            <button
              type="submit"
              class="btn btn-success">
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
@endsection @push('scripts')
<script>
  // Validación en tiempo real
  document.getElementById('precio').addEventListener('input', function (e) {
    const value = parseFloat(e.target.value);
    if (value < 0) {
      e.target.setCustomValidity('El precio no puede ser negativo');
    } else {
      e.target.setCustomValidity('');
    }
  });
</script>
@endpush
```

---

### **📝 Notas de Implementación MVP - Día 11**

- **Prioridad 1**: PHP syntax funcional + Laravel instalado
- **Prioridad 2**: CRUD básico operativo con arrays
- **Prioridad 3**: Templates bonitos y validación avanzada

---

## 🧪 **EJERCICIOS PRÁCTICOS**

### **Ejercicio 1: PHP Moderno (30 min)**

Crear una clase `Calculadora` que use PHP 8.2+ features:

- Constructor property promotion
- Return types estrictos
- Named arguments
- Match expressions

### **Ejercicio 2: Laravel CRUD (60 min)**

Extender el controlador `ProductoController` para:

- Agregar campo "descripción"
- Implementar búsqueda por nombre
- Agregar paginación básica
- Mejorar las validaciones

### **Ejercicio 3: Blade Templates (30 min)**

Crear vistas para:

- Formulario de edición de productos
- Vista detalle de producto
- Componente reutilizable para tarjetas de producto

---

## ✅ **CHECKLIST DEL DÍA**

### **CORE Completado:**

- [ ] PHP 8.2+ syntax dominado
- [ ] Laravel instalado y funcionando
- [ ] CRUD básico operativo
- [ ] Templates Blade funcionales

### **ENHANCED Completado:**

- [ ] OOP avanzado implementado
- [ ] Validaciones funcionando
- [ ] Formularios con manejo de errores
- [ ] Navigation y layout profesional

### **POLISH Completado:**

- [ ] VS Code configurado para Laravel
- [ ] Git repository inicializado
- [ ] Código documentado y limpio
- [ ] Debugging setup funcionando

---

## 🎯 **EVALUACIÓN DEL DÍA**

### **Criterios de Evaluación (20 puntos totales):**

#### **Funcionalidad (8 puntos)**

- Aplicación Laravel funciona sin errores (4 pts)
- CRUD básico operativo (4 pts)

#### **Código Limpio (7 puntos)**

- PHP 8.2+ features correctamente usadas (3 pts)
- Estructura MVC respetada (2 pts)
- Blade templates bien organizados (2 pts)

#### **Velocidad de Desarrollo (5 puntos)**

- Completó CORE en tiempo asignado (3 pts)
- Aplicó metodología MVP correctamente (2 pts)

---

¡Día 11 completado! Mañana continuamos con Models y SQLite en Laravel. 🚀

# 🎯 05. MVP: Laravel Hello World

## 🎯 Objetivos de la Sección

⏱️ **Tiempo Asignado: 60 minutos** `15:30-16:30`

Crear una aplicación Laravel completa y funcional que integre todos los conceptos aprendidos: rutas, controladores, vistas Blade y datos dinámicos.

### **MVP Breakdown**

- **🔧 CORE (40 min)**: Aplicación básica funcionando completamente
- **⚡ ENHANCED (15 min)**: Funcionalidades adicionales y navegación
- **✨ POLISH (5 min)**: Mejoras visuales y UX

---

## 🔧 FASE CORE ✅ (40 minutos)

### **Paso 1: Crear Proyecto Laravel Completo (15 min)**

```bash
# 🎯 Crear nuevo proyecto Laravel para el MVP
composer create-project laravel/laravel laravel-hello-world

# 🎯 Entrar al directorio
cd laravel-hello-world

# 🎯 Configurar base de datos SQLite
touch database/database.sqlite

# 🎯 Configurar .env
cp .env.example .env
php artisan key:generate

# 🎯 Ejecutar migraciones básicas
php artisan migrate

# 🎯 Iniciar servidor
php artisan serve
```

#### **Configuración `.env`**

```bash
APP_NAME="Laravel Hello World"
APP_ENV=local
APP_KEY=base64:TU_CLAVE_AQUI
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
# Comentar las demás líneas de DB

LOG_CHANNEL=stack
LOG_LEVEL=debug
```

### **Paso 2: Crear Controladores MVP (10 min)**

```bash
# 🎯 Crear controladores principales
php artisan make:controller HomeController
php artisan make:controller AboutController
php artisan make:controller ProductoController --resource
php artisan make:controller ContactController
```

#### **Controlador Principal**

**Archivo: `app/Http/Controllers/HomeController.php`**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Mostrar página de inicio con estadísticas
     */
    public function index()
    {
        $estadisticas = [
            'total_productos' => 47,
            'total_usuarios' => 156,
            'ventas_mes' => 28450.50,
            'productos_nuevos' => 12,
        ];

        $productos_destacados = [
            [
                'id' => 1,
                'nombre' => 'Laptop HP Pavilion 15',
                'precio' => 2499.99,
                'categoria' => 'Electrónicos',
                'imagen' => '💻',
                'destacado' => true
            ],
            [
                'id' => 2,
                'nombre' => 'Smartphone Samsung Galaxy',
                'precio' => 1299.99,
                'categoria' => 'Electrónicos',
                'imagen' => '📱',
                'destacado' => true
            ],
            [
                'id' => 3,
                'nombre' => 'Auriculares Sony WH-1000XM4',
                'precio' => 349.99,
                'categoria' => 'Audio',
                'imagen' => '🎧',
                'destacado' => true
            ],
        ];

        $noticias = [
            [
                'titulo' => 'Nueva línea de productos disponible',
                'fecha' => now()->subDays(2),
                'contenido' => 'Hemos agregado una nueva línea de productos electrónicos.'
            ],
            [
                'titulo' => 'Promoción de fin de mes',
                'fecha' => now()->subDays(5),
                'contenido' => 'Aprovecha nuestras ofertas especiales hasta fin de mes.'
            ],
            [
                'titulo' => 'Mejoras en el sitio web',
                'fecha' => now()->subWeek(),
                'contenido' => 'Hemos implementado nuevas funcionalidades para mejorar tu experiencia.'
            ],
        ];

        return view('home.index', compact('estadisticas', 'productos_destacados', 'noticias'));
    }

    /**
     * Página de información del sistema
     */
    public function info()
    {
        $sistema = [
            'laravel_version' => app()->version(),
            'php_version' => phpversion(),
            'environment' => app()->environment(),
            'debug_mode' => config('app.debug'),
            'timezone' => config('app.timezone'),
            'database' => config('database.default'),
            'cache_driver' => config('cache.default'),
            'session_driver' => config('session.driver'),
            'servidor' => $_SERVER['SERVER_SOFTWARE'] ?? 'Desconocido',
            'memoria_php' => ini_get('memory_limit'),
            'max_upload' => ini_get('upload_max_filesize'),
        ];

        return view('home.info', compact('sistema'));
    }
}
```

#### **Controlador About**

**Archivo: `app/Http/Controllers/AboutController.php`**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AboutController extends Controller
{
    /**
     * Mostrar información sobre la empresa
     */
    public function index()
    {
        $empresa = [
            'nombre' => 'Laravel Hello World Corp',
            'fundacion' => '2025',
            'mision' => 'Desarrollar aplicaciones web modernas y eficientes usando las mejores tecnologías.',
            'vision' => 'Ser líderes en desarrollo web con Laravel y tecnologías modernas.',
            'empleados' => 150,
            'oficinas' => ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'],
            'tecnologias' => ['Laravel', 'Vue.js', 'React', 'Docker', 'AWS'],
        ];

        $equipo = [
            [
                'nombre' => 'Ana García',
                'cargo' => 'CEO & Fundadora',
                'experiencia' => '10+ años',
                'especialidad' => 'Estrategia y Liderazgo',
                'avatar' => '👩‍💼'
            ],
            [
                'nombre' => 'Carlos Rodríguez',
                'cargo' => 'CTO',
                'experiencia' => '8+ años',
                'especialidad' => 'Arquitectura de Software',
                'avatar' => '👨‍💻'
            ],
            [
                'nombre' => 'María López',
                'cargo' => 'Lead Developer',
                'experiencia' => '6+ años',
                'especialidad' => 'Laravel & PHP',
                'avatar' => '👩‍💻'
            ],
            [
                'nombre' => 'Juan Martínez',
                'cargo' => 'Frontend Developer',
                'experiencia' => '4+ años',
                'especialidad' => 'Vue.js & React',
                'avatar' => '👨‍🎨'
            ],
        ];

        $logros = [
            '🏆 Mejor startup tecnológica 2024',
            '🥇 Premio innovación en desarrollo web',
            '📈 +100 proyectos exitosos',
            '⭐ 4.9/5 satisfacción del cliente',
            '🌍 Presencia en 4 ciudades',
        ];

        return view('about.index', compact('empresa', 'equipo', 'logros'));
    }
}
```

#### **Controlador de Productos MVP**

**Archivo: `app/Http/Controllers/ProductoController.php`**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProductoController extends Controller
{
    private function getProductos()
    {
        return collect([
            [
                'id' => 1,
                'nombre' => 'Laptop HP Pavilion 15',
                'precio' => 2499.99,
                'categoria' => 'electronica',
                'categoria_nombre' => 'Electrónicos',
                'stock' => 15,
                'descripcion' => 'Laptop de alto rendimiento con procesador Intel Core i7, 16GB RAM y SSD 512GB.',
                'imagen' => '💻',
                'activo' => true,
                'fecha_creacion' => now()->subDays(10),
                'destacado' => true
            ],
            [
                'id' => 2,
                'nombre' => 'Smartphone Samsung Galaxy S24',
                'precio' => 1299.99,
                'categoria' => 'electronica',
                'categoria_nombre' => 'Electrónicos',
                'stock' => 28,
                'descripcion' => 'Smartphone premium con cámara de 200MP, pantalla AMOLED y batería de larga duración.',
                'imagen' => '📱',
                'activo' => true,
                'fecha_creacion' => now()->subDays(8),
                'destacado' => true
            ],
            [
                'id' => 3,
                'nombre' => 'Auriculares Sony WH-1000XM5',
                'precio' => 349.99,
                'categoria' => 'audio',
                'categoria_nombre' => 'Audio',
                'stock' => 42,
                'descripcion' => 'Auriculares con cancelación de ruido activa y calidad de sonido superior.',
                'imagen' => '🎧',
                'activo' => true,
                'fecha_creacion' => now()->subDays(15),
                'destacado' => true
            ],
            [
                'id' => 4,
                'nombre' => 'Monitor Dell UltraSharp 27"',
                'precio' => 599.99,
                'categoria' => 'electronica',
                'categoria_nombre' => 'Electrónicos',
                'stock' => 18,
                'descripcion' => 'Monitor 4K con tecnología IPS y calibración de color profesional.',
                'imagen' => '🖥️',
                'activo' => true,
                'fecha_creacion' => now()->subDays(20),
                'destacado' => false
            ],
            [
                'id' => 5,
                'nombre' => 'Teclado Mecánico Corsair K95',
                'precio' => 189.99,
                'categoria' => 'accesorios',
                'categoria_nombre' => 'Accesorios',
                'stock' => 35,
                'descripcion' => 'Teclado mecánico RGB con switches Cherry MX y teclas programables.',
                'imagen' => '⌨️',
                'activo' => true,
                'fecha_creacion' => now()->subDays(12),
                'destacado' => false
            ],
            [
                'id' => 6,
                'nombre' => 'Mouse Logitech MX Master 3S',
                'precio' => 99.99,
                'categoria' => 'accesorios',
                'categoria_nombre' => 'Accesorios',
                'stock' => 67,
                'descripcion' => 'Mouse ergonómico de precisión con conectividad multi-dispositivo.',
                'imagen' => '🖱️',
                'activo' => true,
                'fecha_creacion' => now()->subDays(6),
                'destacado' => false
            ],
            [
                'id' => 7,
                'nombre' => 'Cámara Canon EOS R6 Mark II',
                'precio' => 2799.99,
                'categoria' => 'fotografia',
                'categoria_nombre' => 'Fotografía',
                'stock' => 8,
                'descripcion' => 'Cámara mirrorless profesional con sensor full-frame y video 4K.',
                'imagen' => '📷',
                'activo' => true,
                'fecha_creacion' => now()->subDays(25),
                'destacado' => false
            ],
            [
                'id' => 8,
                'nombre' => 'Tablet iPad Pro 12.9"',
                'precio' => 1499.99,
                'categoria' => 'electronica',
                'categoria_nombre' => 'Electrónicos',
                'stock' => 22,
                'descripcion' => 'Tablet profesional con chip M2, pantalla Liquid Retina XDR y Apple Pencil.',
                'imagen' => '📱',
                'activo' => true,
                'fecha_creacion' => now()->subDays(18),
                'destacado' => false
            ],
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $productos = $this->getProductos();

        // 🎯 Filtrar por categoría
        if ($request->has('categoria') && $request->categoria) {
            $productos = $productos->where('categoria', $request->categoria);
        }

        // 🎯 Buscar por nombre
        if ($request->has('search') && $request->search) {
            $productos = $productos->filter(function ($producto) use ($request) {
                return stripos($producto['nombre'], $request->search) !== false;
            });
        }

        // 🎯 Filtrar por precio
        if ($request->has('precio_min') && $request->precio_min) {
            $productos = $productos->where('precio', '>=', $request->precio_min);
        }

        if ($request->has('precio_max') && $request->precio_max) {
            $productos = $productos->where('precio', '<=', $request->precio_max);
        }

        // 🎯 Estadísticas
        $stats = [
            'total' => $productos->count(),
            'precio_promedio' => $productos->avg('precio'),
            'stock_total' => $productos->sum('stock'),
            'categorias' => $productos->pluck('categoria')->unique()->count(),
            'precio_min' => $productos->min('precio'),
            'precio_max' => $productos->max('precio'),
        ];

        // 🎯 Categorías para filtro
        $categorias = [
            'electronica' => 'Electrónicos',
            'audio' => 'Audio',
            'accesorios' => 'Accesorios',
            'fotografia' => 'Fotografía',
        ];

        return view('productos.index', compact('productos', 'stats', 'categorias'));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $producto = $this->getProductos()->firstWhere('id', (int)$id);

        if (!$producto) {
            abort(404, 'Producto no encontrado');
        }

        // 🎯 Productos relacionados (misma categoría)
        $relacionados = $this->getProductos()
            ->where('categoria', $producto['categoria'])
            ->where('id', '!=', (int)$id)
            ->take(3);

        return view('productos.show', compact('producto', 'relacionados'));
    }

    /**
     * Mostrar productos por categoría
     */
    public function porCategoria(string $categoria)
    {
        $productos = $this->getProductos()->where('categoria', $categoria);

        $categorias = [
            'electronica' => 'Electrónicos',
            'audio' => 'Audio',
            'accesorios' => 'Accesorios',
            'fotografia' => 'Fotografía',
        ];

        $categoria_nombre = $categorias[$categoria] ?? 'Categoría Desconocida';

        if ($productos->isEmpty()) {
            return redirect()->route('productos.index')
                ->with('info', "No se encontraron productos en la categoría: {$categoria_nombre}");
        }

        return view('productos.categoria', compact('productos', 'categoria', 'categoria_nombre'));
    }
}
```

### **Paso 3: Definir Rutas Completas (5 min)**

**Archivo: `routes/web.php`**

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| Rutas Principales
|--------------------------------------------------------------------------
*/

// 🎯 Página principal
Route::get('/', [HomeController::class, 'index'])->name('home');

// 🎯 Información del sistema
Route::get('/info', [HomeController::class, 'info'])->name('info');

/*
|--------------------------------------------------------------------------
| Rutas About
|--------------------------------------------------------------------------
*/

Route::get('/about', [AboutController::class, 'index'])->name('about');

/*
|--------------------------------------------------------------------------
| Rutas de Productos
|--------------------------------------------------------------------------
*/

// 🎯 Rutas resource de productos
Route::resource('productos', ProductoController::class)->only([
    'index', 'show'
]);

// 🎯 Rutas adicionales de productos
Route::get('/categoria/{categoria}', [ProductoController::class, 'porCategoria'])
    ->where('categoria', '[a-z]+')
    ->name('productos.categoria');

/*
|--------------------------------------------------------------------------
| Rutas de Contacto
|--------------------------------------------------------------------------
*/

Route::get('/contact', [ContactController::class, 'index'])->name('contact');

/*
|--------------------------------------------------------------------------
| Rutas de Utilidad
|--------------------------------------------------------------------------
*/

// 🎯 Ruta de prueba
Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Laravel Hello World está funcionando correctamente',
        'timestamp' => now(),
        'laravel_version' => app()->version(),
        'php_version' => phpversion(),
    ]);
})->name('test');

// 🎯 Ruta 404 personalizada
Route::fallback(function () {
    return view('errors.404');
});
```

### **Paso 4: Crear Vistas MVP (10 min)**

#### **Layout Principal**

**Archivo: `resources/views/layouts/app.blade.php`**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <meta
      name="csrf-token"
      content="{{ csrf_token() }}" />
    <title>@yield('title', config('app.name', 'Laravel Hello World'))</title>

    <!-- Bootstrap CSS -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      rel="stylesheet" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css"
      rel="stylesheet" />

    @stack('styles')

    <style>
      body {
        padding-top: 76px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .navbar-brand {
        font-weight: bold;
        font-size: 1.5rem;
      }
      footer {
        margin-top: 60px;
        padding: 40px 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      .card {
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      }
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }
      .precio {
        font-size: 1.25rem;
        font-weight: bold;
        color: #28a745;
      }
      .alert-floating {
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
      }
    </style>
  </head>
  <body>
    <!-- Navbar -->
    <nav
      class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
      <div class="container">
        <a
          class="navbar-brand"
          href="{{ route('home') }}">
          <i class="bi bi-rocket-takeoff"></i>
          {{ config('app.name', 'Laravel Hello World') }}
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div
          class="collapse navbar-collapse"
          id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a
                class="nav-link {{ request()->routeIs('home') ? 'active' : '' }}"
                href="{{ route('home') }}">
                <i class="bi bi-house"></i> Inicio
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link {{ request()->routeIs('productos.*') ? 'active' : '' }}"
                href="{{ route('productos.index') }}">
                <i class="bi bi-box"></i> Productos
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link {{ request()->routeIs('about') ? 'active' : '' }}"
                href="{{ route('about') }}">
                <i class="bi bi-info-circle"></i> Acerca de
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link {{ request()->routeIs('contact') ? 'active' : '' }}"
                href="{{ route('contact') }}">
                <i class="bi bi-envelope"></i> Contacto
              </a>
            </li>
          </ul>

          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown">
                <i class="bi bi-gear"></i> Sistema
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a
                    class="dropdown-item"
                    href="{{ route('info') }}">
                    <i class="bi bi-info-square"></i> Información
                  </a>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a
                    class="dropdown-item"
                    href="{{ route('test') }}"
                    target="_blank">
                    <i class="bi bi-bug"></i> Test API
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Alertas -->
    @if(session('success'))
    <div
      class="alert alert-success alert-dismissible fade show alert-floating"
      role="alert">
      <i class="bi bi-check-circle"></i>
      <strong>¡Éxito!</strong> {{ session('success') }}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"></button>
    </div>
    @endif @if(session('error'))
    <div
      class="alert alert-danger alert-dismissible fade show alert-floating"
      role="alert">
      <i class="bi bi-exclamation-triangle"></i>
      <strong>¡Error!</strong> {{ session('error') }}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"></button>
    </div>
    @endif @if(session('info'))
    <div
      class="alert alert-info alert-dismissible fade show alert-floating"
      role="alert">
      <i class="bi bi-info-circle"></i>
      <strong>Info:</strong> {{ session('info') }}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"></button>
    </div>
    @endif

    <!-- Breadcrumbs -->
    @hasSection('breadcrumbs')
    <div class="container mt-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          @yield('breadcrumbs')
        </ol>
      </nav>
    </div>
    @endif

    <!-- Contenido Principal -->
    <main class="container">@yield('content')</main>

    <!-- Footer -->
    <footer class="text-center">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h5>
              <i class="bi bi-rocket-takeoff"></i> {{ config('app.name') }}
            </h5>
            <p>
              Desarrollado con Laravel {{ app()->version() }} y PHP {{
              phpversion() }}
            </p>
          </div>
          <div class="col-md-6">
            <h5>Enlaces Rápidos</h5>
            <ul class="list-unstyled">
              <li>
                <a
                  href="{{ route('home') }}"
                  class="text-white-50"
                  >Inicio</a
                >
              </li>
              <li>
                <a
                  href="{{ route('productos.index') }}"
                  class="text-white-50"
                  >Productos</a
                >
              </li>
              <li>
                <a
                  href="{{ route('about') }}"
                  class="text-white-50"
                  >Acerca de</a
                >
              </li>
              <li>
                <a
                  href="{{ route('contact') }}"
                  class="text-white-50"
                  >Contacto</a
                >
              </li>
            </ul>
          </div>
        </div>
        <hr class="my-4" />
        <p>
          &copy; {{ date('Y') }} {{ config('app.name') }}. Entrenamiento
          WorldSkills 2025.
        </p>
      </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

    @stack('scripts')

    <script>
      // Auto-cerrar alertas
      setTimeout(function () {
        var alerts = document.querySelectorAll('.alert-floating');
        alerts.forEach(function (alert) {
          var bsAlert = new bootstrap.Alert(alert);
          bsAlert.close();
        });
      }, 5000);

      // Animación suave para cards
      document.addEventListener('DOMContentLoaded', function () {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
          card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
          });
          card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
          });
        });
      });
    </script>
  </body>
</html>
```

---

## ⚡ FASE ENHANCED (15 minutos)

### **Vista Home Completa**

**Archivo: `resources/views/home/index.blade.php`**

```html
@extends('layouts.app') @section('title', 'Inicio - ' . config('app.name'))
@section('content')
<!-- Hero Section -->
<div class="row mb-5">
  <div class="col-12">
    <div
      class="jumbotron bg-gradient p-5 rounded-4 text-white"
      style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div class="container text-center">
        <h1 class="display-4 fw-bold mb-3">
          <i class="bi bi-rocket-takeoff"></i>
          ¡Bienvenido a Laravel Hello World!
        </h1>
        <p class="lead mb-4">
          Tu primera aplicación Laravel funcionando perfectamente con PHP {{
          phpversion() }} y Laravel {{ app()->version() }}
        </p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
          <a
            href="{{ route('productos.index') }}"
            class="btn btn-light btn-lg px-4">
            <i class="bi bi-box"></i> Explorar Productos
          </a>
          <a
            href="{{ route('about') }}"
            class="btn btn-outline-light btn-lg px-4">
            <i class="bi bi-info-circle"></i> Conocer Más
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Estadísticas -->
<div class="row mb-5">
  <div class="col-12">
    <h2 class="text-center mb-4">📊 Estadísticas en Tiempo Real</h2>
  </div>
  <div class="col-md-3 mb-3">
    <div class="card text-center h-100 border-0 shadow-sm">
      <div class="card-body">
        <div class="display-6 text-primary mb-2">
          <i class="bi bi-box-seam"></i>
        </div>
        <h3 class="h2 text-primary">
          {{ number_format($estadisticas['total_productos']) }}
        </h3>
        <p class="card-text text-muted">Productos Disponibles</p>
      </div>
    </div>
  </div>
  <div class="col-md-3 mb-3">
    <div class="card text-center h-100 border-0 shadow-sm">
      <div class="card-body">
        <div class="display-6 text-success mb-2">
          <i class="bi bi-people"></i>
        </div>
        <h3 class="h2 text-success">
          {{ number_format($estadisticas['total_usuarios']) }}
        </h3>
        <p class="card-text text-muted">Usuarios Registrados</p>
      </div>
    </div>
  </div>
  <div class="col-md-3 mb-3">
    <div class="card text-center h-100 border-0 shadow-sm">
      <div class="card-body">
        <div class="display-6 text-warning mb-2">
          <i class="bi bi-currency-dollar"></i>
        </div>
        <h3 class="h2 text-warning">
          ${{ number_format($estadisticas['ventas_mes'], 2) }}
        </h3>
        <p class="card-text text-muted">Ventas del Mes</p>
      </div>
    </div>
  </div>
  <div class="col-md-3 mb-3">
    <div class="card text-center h-100 border-0 shadow-sm">
      <div class="card-body">
        <div class="display-6 text-info mb-2">
          <i class="bi bi-star"></i>
        </div>
        <h3 class="h2 text-info">{{ $estadisticas['productos_nuevos'] }}</h3>
        <p class="card-text text-muted">Productos Nuevos</p>
      </div>
    </div>
  </div>
</div>

<!-- Productos Destacados -->
<div class="row mb-5">
  <div class="col-12">
    <h2 class="text-center mb-4">⭐ Productos Destacados</h2>
  </div>
  @foreach($productos_destacados as $producto)
  <div class="col-md-4 mb-4">
    <div class="card h-100 border-0 shadow-sm">
      <div class="card-body text-center">
        <div class="display-3 mb-3">{{ $producto['imagen'] }}</div>
        <h5 class="card-title">{{ $producto['nombre'] }}</h5>
        <p class="precio">${{ number_format($producto['precio'], 2) }}</p>
        <p class="card-text">
          <small class="text-muted">
            <i class="bi bi-tag"></i> {{ $producto['categoria'] }}
          </small>
        </p>
      </div>
      <div class="card-footer bg-transparent border-0">
        <div class="d-grid">
          <a
            href="{{ route('productos.show', $producto['id']) }}"
            class="btn btn-outline-primary">
            <i class="bi bi-eye"></i> Ver Detalles
          </a>
        </div>
      </div>
    </div>
  </div>
  @endforeach
</div>

<!-- Noticias -->
<div class="row mb-5">
  <div class="col-12">
    <h2 class="text-center mb-4">📰 Últimas Noticias</h2>
  </div>
  @foreach($noticias as $noticia)
  <div class="col-md-4 mb-3">
    <div class="card h-100 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="card-title">{{ $noticia['titulo'] }}</h6>
        <p class="card-text small">{{ $noticia['contenido'] }}</p>
        <small class="text-muted">
          <i class="bi bi-calendar"></i>
          {{ $noticia['fecha']->diffForHumans() }}
        </small>
      </div>
    </div>
  </div>
  @endforeach
</div>

<!-- CTA Section -->
<div class="row">
  <div class="col-12">
    <div class="card bg-light border-0">
      <div class="card-body text-center py-5">
        <h3>¿Listo para comenzar?</h3>
        <p class="lead">
          Explora nuestra plataforma y descubre todo lo que tenemos para
          ofrecerte.
        </p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
          <a
            href="{{ route('productos.index') }}"
            class="btn btn-primary btn-lg">
            <i class="bi bi-shop"></i> Ver Catálogo Completo
          </a>
          <a
            href="{{ route('contact') }}"
            class="btn btn-outline-primary btn-lg">
            <i class="bi bi-envelope"></i> Contactar
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection @push('scripts')
<script>
  // Contador animado para estadísticas
  document.addEventListener('DOMContentLoaded', function () {
    const counters = document.querySelectorAll('.h2');
    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/,/g, ''));
      if (!isNaN(target)) {
        animateCounter(counter, target);
      }
    });
  });

  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 20);
  }
</script>
@endpush
```

---

## ✨ FASE POLISH (5 minutos)

### **Vista de Productos con Funcionalidades Avanzadas**

**Archivo: `resources/views/productos/index.blade.php`**

```html
@extends('layouts.app')

@section('title', 'Productos - ' . config('app.name'))

@section('breadcrumbs')
    <li class="breadcrumb-item"><a href="{{ route('home') }}">Inicio</a></li>
    <li class="breadcrumb-item active">Productos</li>
@endsection

@section('content')
<!-- Header -->
<div class="row mb-4">
    <div class="col-md-8">
        <h1><i class="bi bi-box"></i> Catálogo de Productos</h1>
        <p class="text-muted">Descubre nuestra amplia selección de productos de calidad</p>
    </div>
    <div class="col-md-4 text-end">
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-outline-secondary" id="gridView">
                <i class="bi bi-grid-3x3-gap"></i>
            </button>
            <button type="button" class="btn btn-outline-secondary" id="listView">
                <i class="bi bi-list"></i>
            </button>
        </div>
    </div>
</div>

<!-- Filtros -->
<div class="row mb-4">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
                <form method="GET" action="{{ route('productos.index') }}">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label">Buscar</label>
                            <input type="text" class="form-control" name="search"
                                   value="{{ request('search') }}" placeholder="Nombre del producto...">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Categoría</label>
                            <select class="form-select" name="categoria">
                                <option value="">Todas</option>
                                @foreach($categorias as $key => $nombre)
                                    <option value="{{ $key }}" {{ request('categoria') == $key ? 'selected' : '' }}>
                                        {{ $nombre }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Precio Mín.</label>
                            <input type="number" class="form-control" name="precio_min"
                                   value="{{ request('precio_min') }}" step="0.01" min="0">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Precio Máx.</label>
                            <input type="number" class="form-control" name="precio_max"
                                   value="{{ request('precio_max') }}" step="0.01" min="0">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">&nbsp;</label>
                            <div class="d-grid gap-2 d-md-flex">
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-search"></i> Filtrar
                                </button>
                                <a href="{{ route('productos.index') }}" class="btn btn-outline-secondary">
                                    <i class="bi bi-x-circle"></i> Limpiar
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Estadísticas -->
@if($stats['total'] > 0)
    <div class="row mb-4">
        <div class="col-md-3">
            <div class="card text-center bg-primary text-white">
                <div class="card-body">
                    <h5>{{ $stats['total'] }}</h5>
                    <small>Productos</small>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center bg-success text-white">
                <div class="card-body">
                    <h5>${{ number_format($stats['precio_promedio'], 2) }}</h5>
                    <small>Precio Promedio</small>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center bg-info text-white">
                <div class="card-body">
                    <h5>{{ number_format($stats['stock_total']) }}</h5>
                    <small>Stock Total</small>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center bg-warning text-white">
                <div class="card-body">
                    <h5>{{ $stats['categorias'] }}</h5>
                    <small>Categorías</small>
                </div>
            </div>
        </div>
    </div>
@endif

<!-- Productos -->
<div class="row" id="productosContainer">
    @forelse($productos as $producto)
        <div class="col-md-4 mb-4 producto-item">
            <div class="card h-100 border-0 shadow-sm">
                <!-- Badge de stock -->
                @if($producto['stock'] > 0)
                    <span class="badge bg-success position-absolute top-0 end-0 m-2">
                        <i class="bi bi-check-circle"></i> Disponible
                    </span>
                @else
                    <span class="badge bg-danger position-absolute top-0 end-0 m-2">
                        <i class="bi bi-x-circle"></i> Agotado
                    </span>
                @endif

                <div class="card-body text-center">
                    <div class="display-4 mb-3">{{ $producto['imagen'] }}</div>
                    <h5 class="card-title">{{ $producto['nombre'] }}</h5>
                    <p class="precio">${{ number_format($producto['precio'], 2) }}</p>
                    <p class="card-text text-muted small">
                        <i class="bi bi-tag"></i> {{ $producto['categoria_nombre'] }} |
                        <i class="bi bi-box"></i> Stock: {{ $producto['stock'] }}
                    </p>
                </div>

                <div class="card-footer bg-transparent border-0">
                    <div class="d-grid gap-2">
                        <a href="{{ route('productos.show', $producto['id']) }}"
                           class="btn btn-outline-primary">
                            <i class="bi bi-eye"></i> Ver Detalles
                        </a>
                    </div>
                </div>
            </div>
        </div>
    @empty
        <div class="col-12">
            <div class="alert alert-info text-center py-5">
                <div class="display-1 mb-3">🔍</div>
                <h4>No se encontraron productos</h4>
                <p>Intenta ajustar los filtros de búsqueda.</p>
                <a href="{{ route('productos.index') }}" class="btn btn-primary">
                    <i class="bi bi-arrow-clockwise"></i> Ver Todos los Productos
                </a>
            </div>
        </div>
    @endforelse
</div>
@endsection

@push('scripts')
<script>
    // Vista de grid vs lista
    document.getElementById('gridView').addEventListener('click', function() {
        const items = document.querySelectorAll('.producto-item');
        items.forEach(item => {
            item.className = 'col-md-4 mb-4 producto-item';
        });
        this.classList.add('active');
        document.getElementById('listView').classList.remove('active');
    });

    document.getElementById('listView').addEventListener('click', function() {
        const items = document.querySelectorAll('.producto-item');
        items.forEach(item => {
            item.className = 'col-12 mb-3 producto-item';
        });
        this.classList.add('active');
        document.getElementById('gridView').classList.remove('active');
    });
</script>
@endpush
```

---

## ✅ Checklist de Validación MVP

### **🔧 CORE MVP**

- [ ] Proyecto Laravel creado y funcionando
- [ ] Base de datos SQLite configurada
- [ ] Controladores principales implementados
- [ ] Rutas definidas y funcionando
- [ ] Layout principal responsive
- [ ] Navegación entre páginas fluida
- [ ] Datos dinámicos mostrados correctamente

### **⚡ ENHANCED MVP**

- [ ] Sistema de filtros funcionando
- [ ] Estadísticas dinámicas implementadas
- [ ] Breadcrumbs implementados
- [ ] Alertas de sesión funcionando
- [ ] Productos relacionados mostrados
- [ ] Navegación activa resaltada

### **✨ POLISH MVP**

- [ ] Animaciones CSS implementadas
- [ ] Vista de grid/lista alternativa
- [ ] Alertas auto-cerrables
- [ ] Diseño responsive completo
- [ ] Performance optimizado

---

## 🚀 Comandos de Verificación

```bash
# Verificar instalación
php artisan --version

# Verificar rutas
php artisan route:list

# Verificar configuración
php artisan config:show app

# Limpiar caché
php artisan optimize:clear

# Iniciar servidor
php artisan serve

# Probar endpoints
curl -s http://localhost:8000
curl -s http://localhost:8000/productos
curl -s http://localhost:8000/test
```

---

## 🔄 Próximo Paso

**Sección 06**: Enhanced Dynamic Routes

- Rutas con parámetros complejos
- Middleware personalizado
- Validación de parámetros avanzada

---

> **⏱️ Tiempo Target: 60 minutos** > **🎯 Objetivo: Aplicación Laravel completa y funcional** > **✅ Resultado: MVP sólido para WorldSkills**

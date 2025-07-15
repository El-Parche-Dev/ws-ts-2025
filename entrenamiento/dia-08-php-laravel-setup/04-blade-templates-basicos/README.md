# 🎨 04. Blade Templates Básicos

## 🎯 Objetivos de la Sección

⏱️ **Tiempo Asignado: 30 minutos** `14:45-15:15`

Dominar el motor de templates Blade de Laravel para crear vistas dinámicas, reutilizables y bien estructuradas.

### **MVP Breakdown**

- **🔧 CORE (20 min)**: Sintaxis Blade básica, layouts, herencia
- **⚡ ENHANCED (8 min)**: Componentes, directivas avanzadas
- **✨ POLISH (2 min)**: Optimizaciones y mejores prácticas

---

## 🔧 FASE CORE ✅ (20 minutos)

### **Sintaxis Blade Básica (8 min)**

#### **Variables y Expresiones**

```php
{{-- resources/views/ejemplo-basico.blade.php --}}

{{-- 🎯 Mostrar variables (escaped por defecto) --}}
<h1>{{ $titulo }}</h1>
<p>Precio: {{ $precio }}</p>
<p>Usuario: {{ $usuario['nombre'] }}</p>

{{-- 🎯 Mostrar HTML sin escapar (¡CUIDADO!) --}}
<div>{!! $contenido_html !!}</div>

{{-- 🎯 Valor por defecto si la variable no existe --}}
<p>Descripción: {{ $descripcion ?? 'Sin descripción' }}</p>

{{-- 🎯 Expresiones PHP --}}
<p>Fecha: {{ date('d/m/Y') }}</p>
<p>Precio con IVA: {{ $precio * 1.19 }}</p>
<p>Nombre en mayúsculas: {{ strtoupper($nombre) }}</p>

{{-- 🎯 Comentarios Blade (no aparecen en HTML) --}}
{{-- Este es un comentario que no se renderiza --}}

{{-- 🎯 Condicionales --}}
@if($usuario)
    <p>Bienvenido, {{ $usuario->nombre }}!</p>
@elseif($invitado)
    <p>Bienvenido, invitado!</p>
@else
    <p>Por favor, inicia sesión.</p>
@endif

{{-- 🎯 Verificar si existe --}}
@isset($productos)
    <p>Hay {{ count($productos) }} productos.</p>
@endisset

@empty($productos)
    <p>No hay productos disponibles.</p>
@endempty

{{-- 🎯 Bucles --}}
@foreach($productos as $producto)
    <div class="producto">
        <h3>{{ $producto['nombre'] }}</h3>
        <p>${{ number_format($producto['precio'], 2) }}</p>
    </div>
@endforeach

{{-- 🎯 Bucle for --}}
@for($i = 1; $i <= 5; $i++)
    <p>Número {{ $i }}</p>
@endfor

{{-- 🎯 While loop --}}
@php $contador = 0; @endphp
@while($contador < 3)
    <p>Contador: {{ $contador }}</p>
    @php $contador++; @endphp
@endwhile
```

#### **Variable $loop en Foreach**

```php
@foreach($productos as $producto)
    <div class="producto">
        {{-- 🎯 Información del loop --}}
        <span class="badge">
            {{ $loop->iteration }} de {{ $loop->count }}
        </span>

        {{-- 🎯 Condicionales del loop --}}
        @if($loop->first)
            <span class="first">¡Primer producto!</span>
        @endif

        @if($loop->last)
            <span class="last">¡Último producto!</span>
        @endif

        {{-- 🎯 Clases CSS dinámicas --}}
        <div class="item {{ $loop->even ? 'even' : 'odd' }}">
            <h3>{{ $producto['nombre'] }}</h3>
        </div>
    </div>
@endforeach
```

### **Layouts y Herencia (12 min)**

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

    {{-- 🎯 Título dinámico --}}
    <title>@yield('title', 'Mi App Laravel')</title>

    {{-- 🎯 Meta tags dinámicos --}} @hasSection('description')
    <meta
      name="description"
      content="@yield('description')" />
    @endif {{-- 🎯 CSS --}}
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet" />
    @stack('styles')

    <style>
      body {
        padding-top: 70px;
      }
      .navbar-brand {
        font-weight: bold;
      }
      footer {
        margin-top: 50px;
        padding: 30px 0;
        background-color: #f8f9fa;
      }
      .alert-floating {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 1050;
      }
    </style>
  </head>
  <body>
    {{-- 🎯 Navbar --}}
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div class="container">
        <a
          class="navbar-brand"
          href="{{ route('home') }}">
          {{ config('app.name', 'Laravel') }}
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
            <li class="nav-item">
              <a
                class="nav-link"
                href="{{ route('about') }}"
                >Acerca de</a
              >
            </li>
          </ul>

          {{-- 🎯 Buscador --}}
          <form
            class="d-flex"
            method="GET"
            action="{{ route('productos.index') }}">
            <input
              class="form-control me-2"
              type="search"
              name="search"
              placeholder="Buscar productos..."
              value="{{ request('search') }}" />
            <button
              class="btn btn-outline-light"
              type="submit">
              Buscar
            </button>
          </form>
        </div>
      </div>
    </nav>

    {{-- 🎯 Alerts flotantes --}} @if(session('success'))
    <div
      class="alert alert-success alert-dismissible fade show alert-floating"
      role="alert">
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
      <strong>¡Error!</strong> {{ session('error') }}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"></button>
    </div>
    @endif {{-- 🎯 Breadcrumbs (si están definidos) --}}
    @hasSection('breadcrumbs')
    <div class="container mt-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          @yield('breadcrumbs')
        </ol>
      </nav>
    </div>
    @endif {{-- 🎯 Contenido principal --}}
    <div class="container">
      {{-- 🎯 Título de página --}} @hasSection('page-title')
      <div class="row mb-4">
        <div class="col">
          <h1 class="h2">@yield('page-title')</h1>
          @hasSection('page-subtitle')
          <p class="text-muted">@yield('page-subtitle')</p>
          @endif
        </div>
      </div>
      @endif {{-- 🎯 Contenido de la página --}} @yield('content')
    </div>

    {{-- 🎯 Footer --}}
    <footer class="text-center text-muted">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <p>
              &copy; {{ date('Y') }} {{ config('app.name') }}. Todos los
              derechos reservados.
            </p>
          </div>
          <div class="col-md-6">
            <p>
              <small
                >Laravel {{ app()->version() }} | PHP {{ phpversion() }}</small
              >
            </p>
          </div>
        </div>
      </div>
    </footer>

    {{-- 🎯 JavaScript --}}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts')

    <script>
      // Auto-cerrar alertas después de 5 segundos
      setTimeout(function () {
        var alerts = document.querySelectorAll('.alert-floating');
        alerts.forEach(function (alert) {
          var bsAlert = new bootstrap.Alert(alert);
          bsAlert.close();
        });
      }, 5000);
    </script>
  </body>
</html>
```

#### **Vista que Extiende el Layout**

**Archivo: `resources/views/productos/index.blade.php`**

```html
@extends('layouts.app') @section('title', 'Lista de Productos')
@section('description', 'Explora nuestra amplia selección de productos de alta
calidad.') @section('page-title', 'Productos') @section('page-subtitle',
'Explora nuestra colección completa') @section('breadcrumbs')
<li class="breadcrumb-item"><a href="{{ route('home') }}">Inicio</a></li>
<li class="breadcrumb-item active">Productos</li>
@endsection @section('styles')
<style>
  .producto-card {
    transition: transform 0.2s;
  }
  .producto-card:hover {
    transform: translateY(-5px);
  }
  .precio {
    font-size: 1.25rem;
    font-weight: bold;
    color: #28a745;
  }
</style>
@endsection @section('content') {{-- 🎯 Estadísticas --}} @isset($stats)
<div class="row mb-4">
  <div class="col-md-3">
    <div class="card text-center">
      <div class="card-body">
        <h5 class="card-title">{{ $stats['total'] }}</h5>
        <p class="card-text">Total Productos</p>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card text-center">
      <div class="card-body">
        <h5 class="card-title">
          ${{ number_format($stats['precio_promedio'], 2) }}
        </h5>
        <p class="card-text">Precio Promedio</p>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card text-center">
      <div class="card-body">
        <h5 class="card-title">{{ $stats['stock_total'] }}</h5>
        <p class="card-text">Stock Total</p>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card text-center">
      <div class="card-body">
        <h5 class="card-title">{{ $stats['categorias'] }}</h5>
        <p class="card-text">Categorías</p>
      </div>
    </div>
  </div>
</div>
@endisset {{-- 🎯 Botones de acción --}}
<div class="row mb-3">
  <div class="col">
    <a
      href="{{ route('productos.create') }}"
      class="btn btn-primary">
      <i class="bi bi-plus-circle"></i> Nuevo Producto
    </a>
  </div>
</div>

{{-- 🎯 Lista de productos --}} @if($productos->count() > 0)
<div class="row">
  @foreach($productos as $producto)
  <div class="col-md-4 mb-4">
    <div class="card h-100 producto-card">
      <div class="card-body">
        <h5 class="card-title">{{ $producto['nombre'] }}</h5>
        <p class="precio">${{ number_format($producto['precio'], 2) }}</p>
        <p class="card-text">
          <small class="text-muted">
            Categoría: {{ ucfirst($producto['categoria']) }} | Stock: {{
            $producto['stock'] }}
          </small>
        </p>
      </div>
      <div class="card-footer">
        <div
          class="btn-group w-100"
          role="group">
          <a
            href="{{ route('productos.show', $producto['id']) }}"
            class="btn btn-outline-primary btn-sm"
            >Ver</a
          >
          <a
            href="{{ route('productos.edit', $producto['id']) }}"
            class="btn btn-outline-warning btn-sm"
            >Editar</a
          >
          <form
            method="POST"
            action="{{ route('productos.destroy', $producto['id']) }}"
            style="display: inline;"
            onsubmit="return confirm('¿Estás seguro?')">
            @csrf @method('DELETE')
            <button
              type="submit"
              class="btn btn-outline-danger btn-sm">
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
<div class="row">
  <div class="col-12">
    <div class="alert alert-info text-center">
      <h4>No hay productos disponibles</h4>
      <p>Comienza agregando tu primer producto.</p>
      <a
        href="{{ route('productos.create') }}"
        class="btn btn-primary"
        >Agregar Producto</a
      >
    </div>
  </div>
</div>
@endif @endsection @section('scripts')
<script>
  // Confirmación de eliminación más elegante
  document.querySelectorAll('form[onsubmit]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        this.submit();
      }
    });
  });
</script>
@endsection
```

---

## ⚡ FASE ENHANCED (8 minutos)

### **Incluir Parciales**

**Archivo: `resources/views/partials/producto-card.blade.php`**

```html
{{-- 🎯 Componente reutilizable para mostrar producto --}}
<div class="card h-100 producto-card">
  {{-- 🎯 Badge de estado --}} @if($producto['stock'] > 0)
  <span class="badge bg-success position-absolute top-0 end-0 m-2"
    >Disponible</span
  >
  @else
  <span class="badge bg-danger position-absolute top-0 end-0 m-2">Agotado</span>
  @endif

  <div class="card-body">
    <h5 class="card-title">{{ $producto['nombre'] }}</h5>

    {{-- 🎯 Precio con formato --}}
    <p class="precio">${{ number_format($producto['precio'], 2) }}</p>

    {{-- 🎯 Información adicional --}}
    <div class="row text-muted small">
      <div class="col-6">
        <strong>Categoría:</strong><br />
        {{ ucfirst($producto['categoria']) }}
      </div>
      <div class="col-6">
        <strong>Stock:</strong><br />
        {{ $producto['stock'] }} unidades
      </div>
    </div>
  </div>

  <div class="card-footer">
    {{-- 🎯 Botones de acción --}}
    <div
      class="btn-group w-100"
      role="group">
      <a
        href="{{ route('productos.show', $producto['id']) }}"
        class="btn btn-outline-primary btn-sm">
        👁️ Ver
      </a>
      <a
        href="{{ route('productos.edit', $producto['id']) }}"
        class="btn btn-outline-warning btn-sm">
        ✏️ Editar
      </a>
      <button
        type="button"
        class="btn btn-outline-danger btn-sm"
        onclick="eliminarProducto({{ $producto['id'] }})">
        🗑️ Eliminar
      </button>
    </div>
  </div>
</div>
```

**Usar el parcial:**

```html
{{-- En productos/index.blade.php --}}
<div class="row">
  @foreach($productos as $producto)
  <div class="col-md-4 mb-4">
    @include('partials.producto-card', ['producto' => $producto])
  </div>
  @endforeach
</div>
```

### **Componentes Blade (Laravel 7+)**

```bash
# 🎯 Crear componente
php artisan make:component ProductoCard
```

**Archivo: `app/View/Components/ProductoCard.php`**

```php
<?php

namespace App\View\Components;

use Illuminate\View\Component;

class ProductoCard extends Component
{
    public $producto;
    public $showActions;

    public function __construct($producto, $showActions = true)
    {
        $this->producto = $producto;
        $this->showActions = $showActions;
    }

    public function render()
    {
        return view('components.producto-card');
    }

    public function getPrecioFormateado()
    {
        return '$' . number_format($this->producto['precio'], 2);
    }

    public function getEstadoStock()
    {
        return $this->producto['stock'] > 0 ? 'Disponible' : 'Agotado';
    }
}
```

**Archivo: `resources/views/components/producto-card.blade.php`**

```html
<div class="card h-100 producto-card">
  {{-- 🎯 Badge usando método del componente --}}
  <span
    class="badge {{ $producto['stock'] > 0 ? 'bg-success' : 'bg-danger' }} position-absolute top-0 end-0 m-2">
    {{ $getEstadoStock() }}
  </span>

  <div class="card-body">
    <h5 class="card-title">{{ $producto['nombre'] }}</h5>
    <p class="precio">{{ $getPrecioFormateado() }}</p>

    {{ $slot }} {{-- Contenido adicional del componente --}}
  </div>

  @if($showActions)
  <div class="card-footer">
    <div
      class="btn-group w-100"
      role="group">
      <a
        href="{{ route('productos.show', $producto['id']) }}"
        class="btn btn-outline-primary btn-sm"
        >Ver</a
      >
      <a
        href="{{ route('productos.edit', $producto['id']) }}"
        class="btn btn-outline-warning btn-sm"
        >Editar</a
      >
    </div>
  </div>
  @endif
</div>
```

**Usar el componente:**

```html
{{-- Uso básico --}}
<x-producto-card :producto="$producto" />

{{-- Con contenido adicional --}}
<x-producto-card
  :producto="$producto"
  :show-actions="false">
  <p class="text-muted">Producto destacado de la semana</p>
</x-producto-card>
```

### **Directivas Personalizadas**

**Archivo: `app/Providers/AppServiceProvider.php`**

```php
use Illuminate\Support\Facades\Blade;

public function boot()
{
    // 🎯 Directiva para formatear precio
    Blade::directive('precio', function ($expression) {
        return "<?php echo '$' . number_format({$expression}, 2); ?>";
    });

    // 🎯 Directiva para fecha en español
    Blade::directive('fechaes', function ($expression) {
        return "<?php echo {$expression}->locale('es')->translatedFormat('d \\d\\e F, Y'); ?>";
    });

    // 🎯 Directiva para badge de stock
    Blade::directive('stockbadge', function ($expression) {
        return "<?php echo {$expression} > 0 ? '<span class=\"badge bg-success\">Disponible</span>' : '<span class=\"badge bg-danger\">Agotado</span>'; ?>";
    });
}
```

**Usar directivas personalizadas:**

```html
{{-- Usar directivas personalizadas --}}
<p>Precio: @precio($producto['precio'])</p>
<p>Fecha: @fechaes($fechaCreacion)</p>
<div>Estado: @stockbadge($producto['stock'])</div>
```

---

## ✨ FASE POLISH (2 minutos)

### **Optimizaciones de Performance**

```html
{{-- 🎯 Compilar assets --}} @vite(['resources/css/app.css',
'resources/js/app.js']) {{-- 🎯 Precarga de imágenes críticas --}} @push('head')
<link
  rel="preload"
  href="{{ asset('images/logo.png') }}"
  as="image" />
@endpush {{-- 🎯 Lazy loading para contenido no crítico --}}
<img
  src="{{ $producto['imagen'] }}"
  alt="{{ $producto['nombre'] }}"
  loading="lazy" />

{{-- 🎯 Cache de vistas (en producción) --}}
@if(app()->environment('production')) @php($cached = true) @endif
```

### **Mejores Prácticas**

```html
{{-- ✅ Siempre escapar datos de usuario --}}
<h1>{{ $titulo }}</h1>

{{-- ✅ Usar helpers de Laravel --}}
<a href="{{ route('productos.show', $producto) }}">Ver producto</a>
<img
  src="{{ asset('images/producto.jpg') }}"
  alt="Producto" />

{{-- ✅ Componentes consistentes --}}
<x-alert
  type="success"
  message="{{ session('success') }}" />

{{-- ✅ Validar existencia antes de usar --}} @isset($usuario)
<p>Bienvenido, {{ $usuario->nombre }}</p>
@endisset {{-- ✅ Usar stacks para organizar assets --}} @push('styles')
<link
  rel="stylesheet"
  href="{{ asset('css/productos.css') }}" />
@endpush
```

---

## 🧪 Ejercicio Práctico: Crear Vistas Completas

### **Crear Vista de Producto Individual**

**Archivo: `resources/views/productos/show.blade.php`**

```html
@extends('layouts.app') @section('title', $producto['nombre'] . ' - Detalles')
@section('description', 'Conoce todos los detalles del producto ' .
$producto['nombre']) @section('breadcrumbs')
<li class="breadcrumb-item"><a href="{{ route('home') }}">Inicio</a></li>
<li class="breadcrumb-item">
  <a href="{{ route('productos.index') }}">Productos</a>
</li>
<li class="breadcrumb-item active">{{ $producto['nombre'] }}</li>
@endsection @section('content')
<div class="row">
  {{-- 🎯 Imagen del producto --}}
  <div class="col-md-6">
    <div class="card">
      <div class="card-body text-center">
        <div
          style="height: 300px; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center;">
          <span class="text-muted">📦 Imagen del producto</span>
        </div>
      </div>
    </div>
  </div>

  {{-- 🎯 Información del producto --}}
  <div class="col-md-6">
    <h1>{{ $producto['nombre'] }}</h1>

    {{-- 🎯 Precio --}}
    <div class="h3 text-success mb-3">@precio($producto['precio'])</div>

    {{-- 🎯 Información básica --}}
    <table class="table table-borderless">
      <tr>
        <td><strong>Categoría:</strong></td>
        <td>{{ ucfirst($producto['categoria']) }}</td>
      </tr>
      <tr>
        <td><strong>Stock:</strong></td>
        <td>
          @stockbadge($producto['stock']) {{ $producto['stock'] }} unidades
        </td>
      </tr>
      <tr>
        <td><strong>Estado:</strong></td>
        <td>
          @if($producto['activo'])
          <span class="badge bg-success">Activo</span>
          @else
          <span class="badge bg-danger">Inactivo</span>
          @endif
        </td>
      </tr>
      <tr>
        <td><strong>Fecha de creación:</strong></td>
        <td>@fechaes($producto['fecha_creacion'])</td>
      </tr>
    </table>

    {{-- 🎯 Descripción --}}
    <div class="mb-4">
      <h5>Descripción</h5>
      <p>{{ $producto['descripcion'] }}</p>
    </div>

    {{-- 🎯 Botones de acción --}}
    <div class="d-grid gap-2 d-md-flex justify-content-md-start">
      <a
        href="{{ route('productos.edit', $producto['id']) }}"
        class="btn btn-warning">
        ✏️ Editar Producto
      </a>
      <a
        href="{{ route('productos.index') }}"
        class="btn btn-secondary">
        ⬅️ Volver a Lista
      </a>
      <form
        method="POST"
        action="{{ route('productos.destroy', $producto['id']) }}"
        style="display: inline;"
        onsubmit="return confirm('¿Estás seguro?')">
        @csrf @method('DELETE')
        <button
          type="submit"
          class="btn btn-danger">
          🗑️ Eliminar
        </button>
      </form>
    </div>
  </div>
</div>

{{-- 🎯 Productos relacionados --}} @if(isset($relacionados) &&
count($relacionados) > 0)
<hr class="my-5" />
<h3>Productos Relacionados</h3>
<div class="row">
  @foreach($relacionados as $relacionado)
  <div class="col-md-4 mb-3">
    @include('partials.producto-card', ['producto' => $relacionado])
  </div>
  @endforeach
</div>
@endif @endsection @push('scripts')
<script>
  // Galería de imágenes (para futuro)
  function cambiarImagen(src) {
    document.getElementById('imagen-principal').src = src;
  }
</script>
@endpush
```

---

## ✅ Checklist de Validación

### **🔧 CORE MVP**

- [ ] Sintaxis Blade básica funcionando (variables, condicionales, bucles)
- [ ] Layout principal creado y funcionando
- [ ] Herencia de templates implementada
- [ ] Secciones (@yield, @section) funcionando
- [ ] Directivas básicas (@if, @foreach) operativas

### **⚡ ENHANCED MVP**

- [ ] Componentes reutilizables creados
- [ ] Partials organizados y funcionando
- [ ] Stacks (@push, @stack) implementados
- [ ] Breadcrumbs y navegación funcional
- [ ] Variable $loop utilizada correctamente

### **✨ POLISH MVP**

- [ ] Directivas personalizadas creadas
- [ ] Assets organizados con @push/@stack
- [ ] Performance optimizado
- [ ] Componentes Blade funcionando
- [ ] Mejores prácticas aplicadas

---

## 🚀 Comandos de Verificación

```bash
# Limpiar caché de vistas
php artisan view:clear

# Compilar vistas (verificar sintaxis)
php artisan view:cache

# Verificar rutas y vistas
php artisan route:list

# Iniciar servidor y probar vistas
php artisan serve
```

---

## 🔄 Próximo Paso

**Sección 05**: MVP Laravel Hello World

- Aplicación completa funcionando
- Integración de todos los conceptos
- Navegación fluida entre páginas

---

> **⏱️ Tiempo Target: 30 minutos** > **🎯 Objetivo: Templates Blade dinámicos** > **✅ Resultado: Vistas profesionales y reutilizables**

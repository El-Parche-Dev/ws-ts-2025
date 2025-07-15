# 🏗️ 02. Laravel Installation + Structure

## 🎯 Objetivos de la Sección

⏱️ **Tiempo Asignado: 60 minutos** `12:30-13:30`

Instalar Laravel desde cero y comprender profundamente su estructura de directorios para un desarrollo eficiente.

### **MVP Breakdown**

- **🔧 CORE (40 min)**: Instalación, configuración, estructura básica
- **⚡ ENHANCED (15 min)**: Configuración avanzada, artisan commands
- **✨ POLISH (5 min)**: Optimizaciones y mejores prácticas

---

## 🔧 FASE CORE ✅ (40 minutos)

### **Paso 1: Verificar Requisitos (5 min)**

```bash
# 🎯 Verificar PHP (debe ser 8.1+)
php --version

# 🎯 Verificar Composer
composer --version

# 🎯 Verificar extensiones PHP necesarias
php -m | grep -E "(openssl|pdo|mbstring|tokenizer|xml|ctype|json|bcmath)"

# 🎯 Si falta alguna extensión en Ubuntu/Debian:
# sudo apt install php8.2-cli php8.2-common php8.2-mbstring php8.2-xml php8.2-zip php8.2-curl
```

### **Paso 2: Instalar Laravel (10 min)**

```bash
# 🎯 Crear nuevo proyecto Laravel
composer create-project laravel/laravel mi-primera-app

# 🎯 Entrar al directorio
cd mi-primera-app

# 🎯 Verificar instalación
php artisan --version

# 🎯 Generar clave de aplicación (si no existe)
php artisan key:generate

# 🎯 Iniciar servidor de desarrollo
php artisan serve
```

**✅ Verificación**: Abrir `http://localhost:8000` - debe mostrar la página de bienvenida de Laravel.

### **Paso 3: Entender la Estructura (15 min)**

```
📁 mi-primera-app/
├── 📁 app/                     # Lógica de la aplicación
│   ├── 📁 Http/
│   │   ├── 📁 Controllers/     # Controladores
│   │   ├── 📁 Middleware/      # Middleware personalizado
│   │   └── Kernel.php          # Kernel HTTP
│   ├── 📁 Models/              # Modelos Eloquent
│   ├── 📁 Providers/           # Service Providers
│   └── 📁 Console/             # Comandos Artisan personalizados
├── 📁 bootstrap/               # Archivos de arranque
├── 📁 config/                  # Archivos de configuración
│   ├── app.php                 # Config principal
│   ├── database.php            # Config base de datos
│   └── ...
├── 📁 database/                # Migraciones, seeders, factories
│   ├── 📁 migrations/          # Migraciones de DB
│   ├── 📁 seeders/             # Datos de prueba
│   └── 📁 factories/           # Model factories
├── 📁 public/                  # Punto de entrada web
│   ├── index.php               # Punto de entrada principal
│   ├── 📁 css/                 # CSS público
│   ├── 📁 js/                  # JavaScript público
│   └── 📁 images/              # Imágenes públicas
├── 📁 resources/               # Recursos sin procesar
│   ├── 📁 views/               # Templates Blade
│   ├── 📁 css/                 # CSS fuente
│   └── 📁 js/                  # JavaScript fuente
├── 📁 routes/                  # Definición de rutas
│   ├── web.php                 # Rutas web
│   ├── api.php                 # Rutas API
│   └── console.php             # Rutas de consola
├── 📁 storage/                 # Archivos generados
│   ├── 📁 app/                 # Archivos de aplicación
│   ├── 📁 framework/           # Archivos del framework
│   └── 📁 logs/                # Logs de la aplicación
├── 📁 tests/                   # Tests automatizados
├── 📁 vendor/                  # Dependencias de Composer
├── .env                        # Variables de entorno
├── .env.example                # Ejemplo de variables
├── artisan                     # CLI de Laravel
├── composer.json               # Dependencias PHP
└── package.json                # Dependencias Node.js (opcional)
```

### **Paso 4: Configuración Básica (10 min)**

#### **Archivo `.env`**

```bash
# 🎯 Configuración básica de desarrollo
APP_NAME="Mi Primera App"
APP_ENV=local
APP_KEY=base64:TU_CLAVE_GENERADA_AQUI
APP_DEBUG=true
APP_URL=http://localhost:8000

# 🎯 Configuración de base de datos SQLite (para empezar)
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=

# 🎯 Configuración de logging
LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug
```

#### **Crear base de datos SQLite**

```bash
# 🎯 Crear archivo de base de datos
touch database/database.sqlite

# 🎯 Verificar que se creó
ls -la database/database.sqlite

# 🎯 Ejecutar migraciones básicas
php artisan migrate
```

**✅ Verificación**: Ejecutar `php artisan migrate` sin errores.

---

## ⚡ FASE ENHANCED (15 minutos)

### **Comandos Artisan Esenciales**

```bash
# 🎯 Ver todos los comandos disponibles
php artisan list

# 🎯 Información de la aplicación
php artisan about

# 🎯 Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 🎯 Ver rutas actuales
php artisan route:list

# 🎯 Crear controlador
php artisan make:controller HomeController

# 🎯 Crear modelo
php artisan make:model Producto

# 🎯 Crear migración
php artisan make:migration crear_tabla_productos

# 🎯 Crear todo junto (modelo + migración + controlador)
php artisan make:model Producto -mc

# 🎯 Ayuda para cualquier comando
php artisan help migrate
```

### **Configuración del Entorno de Desarrollo**

#### **Configurar timezone y locale**

```php
// config/app.php

return [
    // 🎯 Configuración de zona horaria
    'timezone' => 'America/Bogota',

    // 🎯 Configuración de idioma
    'locale' => 'es',
    'fallback_locale' => 'en',
    'faker_locale' => 'es_ES',

    // 🎯 Configuración de URL
    'url' => env('APP_URL', 'http://localhost:8000'),
];
```

#### **Habilitar debug más detallado**

```php
// config/logging.php - Agregar configuración personalizada

'channels' => [
    // ... canales existentes

    'daily_detailed' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
        'days' => 14,
        'replace_placeholders' => true,
    ],
];
```

### **Estructura de Directorios Personalizada**

```bash
# 🎯 Crear directorios adicionales para organización
mkdir -p app/Services
mkdir -p app/Repositories
mkdir -p app/Http/Requests
mkdir -p app/Http/Resources
mkdir -p resources/views/layouts
mkdir -p resources/views/pages
mkdir -p resources/views/components
mkdir -p public/assets/css
mkdir -p public/assets/js
mkdir -p public/assets/images
```

---

## ✨ FASE POLISH (5 minutos)

### **Optimizaciones y Mejores Prácticas**

#### **Composer optimizations**

```bash
# 🎯 Optimizar autoload para producción
composer dump-autoload --optimize

# 🎯 Instalar dependencias solo de producción
composer install --no-dev --optimize-autoloader
```

#### **Configuración de IDE Helper (para VS Code)**

```bash
# 🎯 Instalar Laravel IDE Helper (desarrollo)
composer require --dev barryvdh/laravel-ide-helper

# 🎯 Generar archivos de ayuda para autocompletado
php artisan ide-helper:generate
php artisan ide-helper:models
php artisan ide-helper:meta
```

#### **Configuración de debugging con Clockwork**

```bash
# 🎯 Instalar Clockwork para debugging avanzado
composer require itsgoingd/clockwork

# 🎯 Publicar configuración
php artisan vendor:publish --provider="Clockwork\Support\Laravel\ClockworkServiceProvider"
```

---

## 🧪 Ejercicio Práctico: Explorar Laravel

### **Paso 1: Crear Estructura Básica**

```bash
# 🎯 Crear controladores básicos
php artisan make:controller HomeController
php artisan make:controller AboutController
php artisan make:controller ContactController

# 🎯 Crear vistas básicas
mkdir -p resources/views/layouts
mkdir -p resources/views/pages
```

### **Paso 2: Crear Layout Principal**

**Archivo: `resources/views/layouts/app.blade.php`**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>@yield('title', 'Mi Primera App Laravel')</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet" />
    <style>
      body {
        padding-top: 60px;
      }
      .navbar-brand {
        font-weight: bold;
      }
      footer {
        margin-top: 50px;
        padding: 20px 0;
        background-color: #f8f9fa;
      }
    </style>
  </head>
  <body>
    <!-- 🎯 Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div class="container">
        <a
          class="navbar-brand"
          href="{{ route('home') }}"
          >Mi Primera App</a
        >
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
          <ul class="navbar-nav ms-auto">
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
                href="{{ route('about') }}"
                >Acerca de</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                href="{{ route('contact') }}"
                >Contacto</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 🎯 Contenido principal -->
    <div class="container">
      @if(session('success'))
      <div
        class="alert alert-success alert-dismissible fade show"
        role="alert">
        {{ session('success') }}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"></button>
      </div>
      @endif @if(session('error'))
      <div
        class="alert alert-danger alert-dismissible fade show"
        role="alert">
        {{ session('error') }}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"></button>
      </div>
      @endif @yield('content')
    </div>

    <!-- 🎯 Footer -->
    <footer class="text-center text-muted">
      <div class="container">
        <p>
          &copy; {{ date('Y') }} Mi Primera App Laravel. Entrenamiento
          WorldSkills 2025.
        </p>
        <p>
          <small>Laravel {{ app()->version() }} | PHP {{ phpversion() }}</small>
        </p>
      </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
```

### **Paso 3: Crear Páginas Básicas**

**Archivo: `resources/views/pages/home.blade.php`**

```html
@extends('layouts.app') @section('title', 'Inicio - Mi Primera App')
@section('content')
<div class="row">
  <div class="col-md-12">
    <div class="jumbotron bg-light p-5 rounded-3 mb-4">
      <h1 class="display-4">¡Bienvenido a Laravel!</h1>
      <p class="lead">
        Esta es tu primera aplicación Laravel funcionando correctamente.
      </p>
      <p>Laravel versión: <strong>{{ app()->version() }}</strong></p>
      <p>PHP versión: <strong>{{ phpversion() }}</strong></p>
      <a
        class="btn btn-primary btn-lg"
        href="{{ route('about') }}"
        role="button"
        >Conocer más</a
      >
    </div>
  </div>
</div>

<div class="row">
  <div class="col-md-4">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">🚀 Artisan CLI</h5>
        <p class="card-text">
          Potente herramienta de línea de comandos para generar código y
          gestionar la aplicación.
        </p>
        <code>php artisan list</code>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">🎨 Blade Templates</h5>
        <p class="card-text">
          Motor de templates simple pero poderoso para crear vistas dinámicas.
        </p>
        <code>@extends('layouts.app')</code>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">🗄️ Eloquent ORM</h5>
        <p class="card-text">
          ORM elegante para trabajar con bases de datos de forma intuitiva.
        </p>
        <code>Model::create($data)</code>
      </div>
    </div>
  </div>
</div>

<div class="row mt-4">
  <div class="col-md-12">
    <div class="card">
      <div class="card-header">
        <h5>📊 Información del Sistema</h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <ul class="list-unstyled">
              <li><strong>Entorno:</strong> {{ app()->environment() }}</li>
              <li>
                <strong>Debug:</strong> {{ config('app.debug') ? 'Habilitado' :
                'Deshabilitado' }}
              </li>
              <li><strong>Timezone:</strong> {{ config('app.timezone') }}</li>
            </ul>
          </div>
          <div class="col-md-6">
            <ul class="list-unstyled">
              <li>
                <strong>Base de datos:</strong> {{ config('database.default') }}
              </li>
              <li>
                <strong>Cache driver:</strong> {{ config('cache.default') }}
              </li>
              <li>
                <strong>Session driver:</strong> {{ config('session.driver') }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection
```

### **Paso 4: Definir Rutas**

**Archivo: `routes/web.php`**

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 🎯 Ruta principal
Route::get('/', [HomeController::class, 'index'])->name('home');

// 🎯 Rutas básicas
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');

// 🎯 Ruta de información del sistema
Route::get('/info', function () {
    return view('pages.info', [
        'laravel_version' => app()->version(),
        'php_version' => phpversion(),
        'environment' => app()->environment(),
        'debug' => config('app.debug'),
        'timezone' => config('app.timezone'),
        'database' => config('database.default'),
    ]);
})->name('info');
```

### **Paso 5: Implementar Controladores**

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
            'titulo' => 'Bienvenido a Laravel',
            'laravel_version' => app()->version(),
            'php_version' => phpversion(),
            'environment' => app()->environment(),
        ];

        return view('pages.home', $data);
    }
}
```

---

## ✅ Checklist de Validación

### **🔧 CORE MVP**

- [ ] PHP 8.1+ instalado y funcionando
- [ ] Composer instalado y configurado
- [ ] Laravel instalado via Composer
- [ ] Servidor de desarrollo corriendo (`php artisan serve`)
- [ ] Página de bienvenida accesible en localhost:8000
- [ ] Base de datos SQLite configurada
- [ ] Migraciones ejecutadas sin errores

### **⚡ ENHANCED MVP**

- [ ] Comandos Artisan básicos funcionando
- [ ] IDE Helper instalado y configurado
- [ ] Timezone y locale configurados
- [ ] Estructura de directorios personalizada creada
- [ ] Debug tools instalados (Clockwork)

### **✨ POLISH MVP**

- [ ] Layout principal creado y funcionando
- [ ] Rutas básicas definidas
- [ ] Controladores implementados
- [ ] Páginas navegables
- [ ] Bootstrap integrado
- [ ] Información del sistema mostrada

---

## 🚀 Comandos de Verificación

```bash
# Verificar instalación
php artisan --version

# Verificar rutas
php artisan route:list

# Verificar configuración
php artisan config:show app

# Verificar base de datos
php artisan migrate:status

# Iniciar servidor
php artisan serve

# Verificar en navegador
curl -s http://localhost:8000 | grep "Laravel"
```

---

## 📝 Problemas Comunes y Soluciones

### **Error: "Class 'OpenSSL' not found"**

```bash
# Ubuntu/Debian
sudo apt install php8.2-openssl

# macOS con Homebrew
brew install php@8.2
```

### **Error: "The stream or file could not be opened"**

```bash
# Permisos de storage y bootstrap/cache
sudo chmod -R 775 storage
sudo chmod -R 775 bootstrap/cache
```

### **Error: "No application encryption key has been specified"**

```bash
php artisan key:generate
```

### **SQLite database file not found**

```bash
touch database/database.sqlite
php artisan migrate
```

---

## 🔄 Próximo Paso

**Sección 03**: Artisan + Routes + Controllers

- Comandos Artisan avanzados
- Sistema de rutas de Laravel
- Creación y organización de controladores

---

> **⏱️ Tiempo Target: 60 minutos** > **🎯 Objetivo: Laravel funcionando completamente** > **✅ Resultado: Base sólida para desarrollo web**

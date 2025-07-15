<?php

/**
 * 🎯 Rutas para Productos - WorldSkills 2025
 * 
 * Configuración de rutas resource para el controlador de productos
 * Incluye rutas básicas y rutas adicionales para funcionalidades MVP
 */

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// ========== FASE CORE ✅ (5 minutos) ==========
// Rutas resource básicas para CRUD

/**
 * Rutas Resource para Productos
 * 
 * Genera automáticamente todas las rutas CRUD:
 * GET    /productos              -> index   (listar productos)
 * GET    /productos/create       -> create  (formulario crear)
 * POST   /productos              -> store   (guardar producto)
 * GET    /productos/{id}         -> show    (ver producto)
 * GET    /productos/{id}/edit    -> edit    (formulario editar)  
 * PUT    /productos/{id}         -> update  (actualizar producto)
 * DELETE /productos/{id}         -> destroy (eliminar producto)
 */
Route::resource('productos', ProductController::class, [
    'names' => [
        'index' => 'products.index',
        'create' => 'products.create',
        'store' => 'products.store',
        'show' => 'products.show',
        'edit' => 'products.edit',
        'update' => 'products.update',
        'destroy' => 'products.destroy'
    ]
]);

// ========== FASE ENHANCED ⚡ (5 minutos) ==========
// Rutas adicionales para funcionalidades mejoradas

/**
 * Ruta para búsqueda AJAX de productos
 * GET /productos/search?term=nombre&category_id=1
 */
Route::get('productos-search', [ProductController::class, 'search'])
    ->name('products.search');

/**
 * Ruta para cambiar estado activo/inactivo via AJAX
 * PATCH /productos/{id}/toggle-status
 */
Route::patch('productos/{product}/toggle-status', [ProductController::class, 'toggleStatus'])
    ->name('products.toggle-status');

/**
 * Ruta para obtener productos por categoría via AJAX
 * GET /productos/categoria/{category_id}
 */
Route::get('productos/categoria/{category_id}', [ProductController::class, 'getByCategory'])
    ->name('products.by-category');

// ========== FASE POLISH ✨ (3 minutos) ==========
// Rutas avanzadas y optimizaciones

/**
 * Ruta para exportar productos a CSV/Excel
 * GET /productos/export?format=csv
 */
Route::get('productos-export', [ProductController::class, 'export'])
    ->name('products.export');

/**
 * Ruta para importar productos desde CSV
 * POST /productos/import
 */
Route::post('productos-import', [ProductController::class, 'import'])
    ->name('products.import');

/**
 * Rutas API para productos (sin vistas, solo JSON)
 * Útil para consumo desde JavaScript/AJAX
 */
Route::prefix('api')->group(function () {
    Route::apiResource('productos', ProductController::class, [
        'names' => [
            'index' => 'api.products.index',
            'store' => 'api.products.store',
            'show' => 'api.products.show',
            'update' => 'api.products.update',
            'destroy' => 'api.products.destroy'
        ]
    ]);
});

// ========== RUTAS DE DESARROLLO Y TESTING ==========
// Solo para entorno de desarrollo/testing

if (app()->environment(['local', 'testing'])) {
    /**
     * Ruta para generar productos de prueba
     * GET /productos/seed
     */
    Route::get('productos-seed', function () {
        \App\Models\Product::factory(20)->create();
        return redirect()->route('products.index')
            ->with('success', '20 productos de prueba generados exitosamente.');
    })->name('products.seed');
    
    /**
     * Ruta para limpiar todos los productos
     * DELETE /productos/truncate
     */
    Route::delete('productos-truncate', function () {
        \App\Models\Product::truncate();
        return redirect()->route('products.index')
            ->with('success', 'Todos los productos han sido eliminados.');
    })->name('products.truncate');
}

// ========== MIDDLEWARE Y GRUPOS DE RUTAS ==========

/**
 * Grupo de rutas protegidas por autenticación
 * Descomenta cuando tengas sistema de autenticación
 */
/*
Route::middleware(['auth'])->group(function () {
    Route::resource('productos', ProductController::class);
    // Resto de rutas protegidas...
});
*/

/**
 * Grupo de rutas administrativas
 * Descomenta cuando tengas roles de usuario
 */
/*
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('productos/analytics', [ProductController::class, 'analytics'])
        ->name('admin.products.analytics');
    Route::get('productos/reports', [ProductController::class, 'reports'])
        ->name('admin.products.reports');
});
*/

// ========== REDIRECCIONES Y ALIASES ==========

/**
 * Redirección desde raíz hacia productos
 * GET / -> /productos
 */
Route::redirect('/', '/productos');

/**
 * Alias para compatibilidad con URLs anteriores
 */
Route::redirect('/products', '/productos');
Route::redirect('/items', '/productos');

// 📝 Notas de Implementación:
// 
// 1. CORE: Rutas resource básicas funcionan inmediatamente
// 2. ENHANCED: Rutas AJAX para interactividad
// 3. POLISH: Rutas API y funcionalidades avanzadas
// 
// 💡 Comandos útiles para testing:
// php artisan route:list | grep productos
// php artisan route:list --name=products

<?php
/**
 * Demo de Relationships en Eloquent
 * WorldSkills 2025 - Laravel Models + SQLite
 * Para ejecutar en: php artisan tinker
 */

echo "🔗 DEMO RELATIONSHIPS ELOQUENT\n";
echo "═══════════════════════════════════════════════════════════════\n";

// ============================================================================
// PREPARACIÓN: Crear datos de testing
// ============================================================================

echo "\n🔧 PREPARACIÓN: Creando datos de testing...\n";
echo "─────────────────────────────────────────────────────────────────\n";

// Crear categorías de ejemplo
/*
$electronica = App\Models\Categoria::create([
    'nombre' => 'Electrónica',
    'slug' => 'electronica',
    'descripcion' => 'Dispositivos electrónicos y tecnología',
    'icono' => '📱',
    'activa' => true
]);

$gaming = App\Models\Categoria::create([
    'nombre' => 'Gaming',
    'slug' => 'gaming', 
    'descripcion' => 'Productos para videojuegos y streaming',
    'icono' => '🎮',
    'activa' => true
]);

$hogar = App\Models\Categoria::create([
    'nombre' => 'Hogar',
    'slug' => 'hogar',
    'descripcion' => 'Artículos para el hogar y decoración',
    'icono' => '🏠',
    'activa' => true
]);

echo "✅ Categorías creadas: Electrónica, Gaming, Hogar\n";
*/

// ============================================================================
// SECCIÓN 1: HASONE Y BELONGSTO
// ============================================================================

echo "\n🔗 SECCIÓN 1: RELACIONES HASONE Y BELONGSTO\n";
echo "─────────────────────────────────────────────────────────────────\n";

echo "📝 Ejemplo 1.1: Asignar productos a categorías\n";
/*
// Obtener categorías
$electronica = App\Models\Categoria::where('slug', 'electronica')->first();
$gaming = App\Models\Categoria::where('slug', 'gaming')->first();

// Asignar productos existentes a categorías
App\Models\Producto::where('categoria', 'electronica')
                   ->update(['categoria_id' => $electronica->id]);

App\Models\Producto::where('categoria', 'gaming')
                   ->update(['categoria_id' => $gaming->id]);

echo "✅ Productos asignados a categorías\n";
*/

echo "📝 Ejemplo 1.2: Test belongsTo (Producto -> Categoría)\n";
/*
$producto = App\Models\Producto::with('categoria')->first();

if ($producto && $producto->categoria) {
    echo "📦 Producto: {$producto->nombre}\n";
    echo "🏷️ Categoría: {$producto->categoria->nombre}\n";
    echo "📝 Descripción: {$producto->categoria->descripcion}\n";
} else {
    echo "⚠️ Producto sin categoría asignada\n";
}
*/

echo "📝 Ejemplo 1.3: Test hasMany (Categoría -> Productos)\n";
/*
$categoria = App\Models\Categoria::with('productos')->first();

if ($categoria) {
    $productos = $categoria->productos;
    echo "🏷️ Categoría: {$categoria->nombre}\n";
    echo "📦 Total productos: {$productos->count()}\n";
    
    $productos->take(3)->each(function($p) {
        echo "  • {$p->nombre} - {$p->precio_formateado}\n";
    });
}
*/

// ============================================================================
// SECCIÓN 2: EAGER LOADING - EVITAR N+1 QUERIES
// ============================================================================

echo "\n⚡ SECCIÓN 2: EAGER LOADING - OPTIMIZACIÓN\n";
echo "─────────────────────────────────────────────────────────────────\n";

echo "📝 Ejemplo 2.1: Problema N+1 vs Eager Loading\n";
/*
// ❌ MAL: N+1 Query Problem
echo "❌ Método LENTO (N+1 queries):\n";
$productos = App\Models\Producto::take(5)->get();
foreach ($productos as $producto) {
    if ($producto->categoria) {
        echo "  {$producto->nombre} -> {$producto->categoria->nombre}\n";
    }
}

// ✅ BIEN: Eager Loading
echo "\n✅ Método OPTIMIZADO (2 queries):\n";
$productos = App\Models\Producto::with('categoria')->take(5)->get();
foreach ($productos as $producto) {
    if ($producto->categoria) {
        echo "  {$producto->nombre} -> {$producto->categoria->nombre}\n";
    }
}
*/

echo "📝 Ejemplo 2.2: Eager Loading condicional\n";
/*
// Solo cargar categorías activas
$productos = App\Models\Producto::with(['categoria' => function ($query) {
                                   $query->where('activa', true);
                               }])
                               ->get();

echo "✅ Productos con categorías activas cargadas\n";
*/

echo "📝 Ejemplo 2.3: Lazy Loading vs Eager Loading\n";
/*
// Contar queries ejecutadas
$queryCount = DB::getQueryLog();
DB::enableQueryLog();

// Con eager loading
$productos = App\Models\Producto::with('categoria')->take(10)->get();
$productos->each(function($p) {
    $categoria = $p->categoria ? $p->categoria->nombre : 'Sin categoría';
});

$queries = DB::getQueryLog();
echo "✅ Queries ejecutadas con Eager Loading: " . count($queries) . "\n";
*/

// ============================================================================
// SECCIÓN 3: MÉTODOS DE RELACIONES
// ============================================================================

echo "\n🎯 SECCIÓN 3: MÉTODOS DE RELACIONES\n";
echo "─────────────────────────────────────────────────────────────────\n";

echo "📝 Ejemplo 3.1: Métodos de Categoría\n";
/*
$categoria = App\Models\Categoria::first();

if ($categoria) {
    echo "🏷️ ESTADÍSTICAS DE: {$categoria->nombre}\n";
    echo "   Total productos: {$categoria->productos->count()}\n";
    echo "   Productos activos: {$categoria->contarProductosActivos()}\n";
    echo "   Productos disponibles: {$categoria->contarProductosDisponibles()}\n";
    echo "   Precio promedio: $" . number_format($categoria->precioPromedio(), 2) . "\n";
    
    $caro = $categoria->productoMasCaro();
    $barato = $categoria->productoMasBarato();
    
    if ($caro) echo "   Más caro: {$caro->nombre} - {$caro->precio_formateado}\n";
    if ($barato) echo "   Más barato: {$barato->nombre} - {$barato->precio_formateado}\n";
}
*/

echo "📝 Ejemplo 3.2: Scopes de relaciones\n";
/*
// Categorías con productos disponibles
$categoriasConProductos = App\Models\Categoria::conProductosDisponibles()->get();
echo "🏷️ Categorías con productos disponibles: {$categoriasConProductos->count()}\n";

// Categorías ordenadas por cantidad de productos
$categoriasPopulares = App\Models\Categoria::ordenPorProductos()->take(3)->get();
echo "🏆 TOP 3 categorías más populares:\n";
$categoriasPopulares->each(function($cat) {
    echo "   {$cat->nombre}: {$cat->productos_count} productos\n";
});
*/

// ============================================================================
// SECCIÓN 4: QUERIES AVANZADAS CON RELACIONES
// ============================================================================

echo "\n🚀 SECCIÓN 4: QUERIES AVANZADAS\n";
echo "─────────────────────────────────────────────────────────────────\n";

echo "📝 Ejemplo 4.1: whereHas - Productos en categorías específicas\n";
/*
// Productos que pertenecen a categorías activas
$productos = App\Models\Producto::whereHas('categoria', function ($query) {
                                    $query->where('activa', true);
                                })
                                ->activos()
                                ->get();

echo "✅ Productos en categorías activas: {$productos->count()}\n";

// Productos en categorías específicas
$productosElectronica = App\Models\Producto::whereHas('categoria', function ($query) {
                                               $query->where('nombre', 'Electrónica');
                                           })
                                           ->disponibles()
                                           ->get();

echo "📱 Productos electrónicos disponibles: {$productosElectronica->count()}\n";
*/

echo "📝 Ejemplo 4.2: withCount - Contar relaciones\n";
/*
// Categorías con conteo de productos
$categorias = App\Models\Categoria::withCount([
    'productos',
    'productos as productos_activos' => function ($query) {
        $query->where('activo', true);
    },
    'productos as productos_disponibles' => function ($query) {
        $query->where('activo', true)->where('stock', '>', 0);
    }
])->get();

echo "📊 ESTADÍSTICAS POR CATEGORÍA:\n";
$categorias->each(function($cat) {
    echo "   {$cat->nombre}:\n";
    echo "     Total: {$cat->productos_count}\n";
    echo "     Activos: {$cat->productos_activos}\n";
    echo "     Disponibles: {$cat->productos_disponibles}\n";
});
*/

echo "📝 Ejemplo 4.3: Ordenar por relaciones\n";
/*
// Productos ordenados por nombre de categoría
$productos = App\Models\Producto::join('categorias', 'productos.categoria_id', '=', 'categorias.id')
                                ->select('productos.*', 'categorias.nombre as categoria_nombre')
                                ->orderBy('categoria_nombre')
                                ->orderBy('productos.nombre')
                                ->take(10)
                                ->get();

echo "📋 Productos ordenados por categoría:\n";
$productos->each(function($p) {
    echo "   {$p->categoria_nombre}: {$p->nombre}\n";
});
*/

// ============================================================================
// SECCIÓN 5: MANTENIMIENTO DE RELACIONES
// ============================================================================

echo "\n🔧 SECCIÓN 5: MANTENIMIENTO DE RELACIONES\n";
echo "─────────────────────────────────────────────────────────────────\n";

echo "📝 Ejemplo 5.1: Crear producto con categoría\n";
/*
$categoria = App\Models\Categoria::where('slug', 'electronica')->first();

if ($categoria) {
    $nuevoProducto = App\Models\Producto::create([
        'codigo_sku' => 'REL-TEST-' . time(),
        'nombre' => 'Producto Test Relaciones',
        'descripcion' => 'Producto creado para testing de relaciones',
        'precio' => 299000.00,
        'stock' => 25,
        'categoria_id' => $categoria->id, // Asignar categoría
        'activo' => true
    ]);
    
    echo "✅ Producto creado en categoría: {$categoria->nombre}\n";
    echo "   Producto: {$nuevoProducto->nombre}\n";
    echo "   Categoría: {$nuevoProducto->categoria->nombre}\n";
}
*/

echo "📝 Ejemplo 5.2: Cambiar categoría de producto\n";
/*
$producto = App\Models\Producto::with('categoria')->first();
$nuevaCategoria = App\Models\Categoria::where('slug', 'gaming')->first();

if ($producto && $nuevaCategoria) {
    $categoriaAnterior = $producto->categoria ? $producto->categoria->nombre : 'Sin categoría';
    
    $producto->categoria_id = $nuevaCategoria->id;
    $producto->save();
    
    echo "🔄 Categoría cambiada:\n";
    echo "   Producto: {$producto->nombre}\n";
    echo "   De: {$categoriaAnterior}\n";
    echo "   A: {$nuevaCategoria->nombre}\n";
}
*/

echo "📝 Ejemplo 5.3: Eliminar categoría (validación)\n";
/*
$categoria = App\Models\Categoria::where('slug', 'hogar')->first();

if ($categoria) {
    if ($categoria->puedeEliminarse()) {
        echo "✅ La categoría '{$categoria->nombre}' puede eliminarse (sin productos)\n";
        // $categoria->delete();
    } else {
        echo "❌ La categoría '{$categoria->nombre}' NO puede eliminarse (tiene productos)\n";
        echo "   Productos: {$categoria->productos->count()}\n";
    }
}
*/

// ============================================================================
// SECCIÓN 6: TESTING COMPLETO
// ============================================================================

echo "\n🧪 SECCIÓN 6: TESTING COMPLETO DE RELACIONES\n";
echo "─────────────────────────────────────────────────────────────────\n";

echo "📝 Testing completo de relationships\n";
/*
try {
    echo "🔧 Iniciando test completo de relaciones...\n";
    
    // Test 1: Crear categoría
    $testCategoria = App\Models\Categoria::create([
        'nombre' => 'Test Relationships',
        'slug' => 'test-rel-' . time(),
        'descripcion' => 'Categoría para testing'
    ]);
    echo "✅ TEST 1: Categoría creada\n";
    
    // Test 2: Crear producto con relación
    $testProducto = App\Models\Producto::create([
        'codigo_sku' => 'TEST-REL-' . time(),
        'nombre' => 'Producto Test Relación',
        'precio' => 150000.00,
        'stock' => 10,
        'categoria_id' => $testCategoria->id,
        'activo' => true
    ]);
    echo "✅ TEST 2: Producto creado con relación\n";
    
    // Test 3: Verificar belongsTo
    $producto = App\Models\Producto::with('categoria')->find($testProducto->id);
    if ($producto->categoria && $producto->categoria->id === $testCategoria->id) {
        echo "✅ TEST 3: belongsTo funcionando\n";
    }
    
    // Test 4: Verificar hasMany
    $categoria = App\Models\Categoria::with('productos')->find($testCategoria->id);
    if ($categoria->productos->count() > 0) {
        echo "✅ TEST 4: hasMany funcionando\n";
    }
    
    // Test 5: Métodos de negocio
    $activos = $categoria->contarProductosActivos();
    echo "✅ TEST 5: Métodos de negocio funcionando (Activos: {$activos})\n";
    
    // Cleanup
    $testProducto->delete();
    $testCategoria->delete();
    echo "✅ TEST 6: Cleanup completado\n";
    
    echo "🎉 TODOS LOS TESTS DE RELACIONES PASARON\n";
    
} catch (Exception $e) {
    echo "❌ ERROR EN TEST: {$e->getMessage()}\n";
}
*/

// ============================================================================
// INSTRUCCIONES DE USO
// ============================================================================

echo "\n📚 INSTRUCCIONES DE USO:\n";
echo "─────────────────────────────────────────────────────────────────\n";
echo "1. Ejecutar migrations:\n";
echo "   php artisan make:migration create_categorias_table\n";
echo "   php artisan make:migration add_categoria_id_to_productos_table\n";
echo "   php artisan migrate\n\n";

echo "2. Copiar models:\n";
echo "   app/Models/Categoria.php\n";
echo "   Actualizar app/Models/Producto.php\n\n";

echo "3. Ejecutar en tinker:\n";
echo "   php artisan tinker\n";
echo "   Copiar secciones una por una\n\n";

echo "🔗 RELACIONES IMPLEMENTADAS:\n";
echo "   ✅ hasMany: Categoria -> Productos\n";
echo "   ✅ belongsTo: Producto -> Categoria\n";
echo "   ✅ Eager Loading optimizado\n";
echo "   ✅ Métodos de negocio\n";
echo "   ✅ Queries avanzadas\n";
echo "   ✅ Testing completo\n\n";

echo "⚠️ RECORDATORIO:\n";
echo "   - Descomentar código para ejecutar\n";
echo "   - Ejecutar migraciones antes de testing\n";
echo "   - Verificar foreign keys en SQLite\n";

echo "\n═══════════════════════════════════════════════════════════════\n";
echo "🏆 RELATIONSHIPS BÁSICAS - LISTO PARA WORLDSKILLS 2025\n";

/*
PRÓXIMO PASO:
Continuar con Sección 05: MVP Products CRUD con UI completa
*/

<?php
/**
 * Ejemplos Prácticos de Eloquent CRUD
 * WorldSkills 2025 - Laravel Models + SQLite
 * Para ejecutar en: php artisan tinker
 */

echo "🚀 EJEMPLOS ELOQUENT CRUD OPERATIONS\n";
echo "═══════════════════════════════════════════════════════════════\n";

// ============================================================================
// SECCIÓN 1: CREATE - Crear Registros
// ============================================================================

echo "\n🔧 SECCIÓN 1: CREATE OPERATIONS\n";
echo "─────────────────────────────────────────────────────────────────\n";

// Ejemplo 1.1: Create básico
echo "📝 Ejemplo 1.1: Create básico con save()\n";
/*
$producto = new App\Models\Producto();
$producto->nombre = 'iPad Air M2';
$producto->descripcion = 'Tablet profesional con chip M2 y pantalla Liquid Retina';
$producto->precio = 2299000.00;
$producto->stock = 20;
$producto->categoria = 'electronica';
$producto->activo = true;
$producto->save();

echo "✅ Producto creado: {$producto->nombre} (ID: {$producto->id})\n";
*/

// Ejemplo 1.2: Create masivo con fillable
echo "📝 Ejemplo 1.2: Create masivo con create()\n";
/*
$producto = App\Models\Producto::create([
    'codigo_sku' => 'APPLE-WATCH-001',
    'nombre' => 'Apple Watch Series 9',
    'descripcion' => 'Smartwatch con GPS y pantalla Always-On Retina',
    'precio' => 1599000.00,
    'peso' => 0.032,
    'stock' => 35,
    'categoria' => 'electronica',
    'especificaciones' => [
        'pantalla' => '45mm Always-On Retina',
        'resistencia' => 'Agua hasta 50 metros',
        'sensores' => 'ECG, Oxígeno en sangre, Temperatura',
        'bateria' => 'Hasta 18 horas'
    ],
    'activo' => true
]);

echo "✅ Apple Watch creado: {$producto->codigo_sku}\n";
*/

// Ejemplo 1.3: Create con validación
echo "📝 Ejemplo 1.3: Create con manejo de errores\n";
/*
try {
    $producto = App\Models\Producto::create([
        'codigo_sku' => 'GAMING-KB-001',
        'nombre' => 'Teclado Gaming Mecánico RGB',
        'descripcion' => 'Teclado mecánico con switches Cherry MX Blue y retroiluminación RGB',
        'precio' => 459000.00,
        'peso' => 1.2,
        'stock' => 60,
        'categoria' => 'gaming',
        'especificaciones' => [
            'switches' => 'Cherry MX Blue',
            'iluminacion' => 'RGB 16.7M colores',
            'layout' => 'QWERTY Español',
            'conectividad' => 'USB-C desmontable'
        ],
        'activo' => true
    ]);
    
    echo "✅ Teclado gaming creado exitosamente\n";
} catch (Exception $e) {
    echo "❌ Error al crear producto: {$e->getMessage()}\n";
}
*/

// ============================================================================
// SECCIÓN 2: READ - Leer Registros
// ============================================================================

echo "\n📖 SECCIÓN 2: READ OPERATIONS\n";
echo "─────────────────────────────────────────────────────────────────\n";

// Ejemplo 2.1: Obtener todos los productos
echo "📝 Ejemplo 2.1: Obtener todos los productos\n";
/*
$productos = App\Models\Producto::all();
echo "📦 Total productos en DB: {$productos->count()}\n";

// Mostrar primeros 3
$productos->take(3)->each(function($p) {
    echo "  • {$p->nombre} - {$p->precio_formateado}\n";
});
*/

// Ejemplo 2.2: Buscar por ID
echo "📝 Ejemplo 2.2: Buscar producto por ID\n";
/*
$producto = App\Models\Producto::find(1);
if ($producto) {
    echo "🎯 Producto encontrado:\n";
    echo "   Nombre: {$producto->nombre}\n";
    echo "   Precio: {$producto->precio_formateado}\n";
    echo "   Stock: {$producto->estado_stock}\n";
} else {
    echo "❌ Producto con ID 1 no encontrado\n";
}
*/

// Ejemplo 2.3: Búsquedas con WHERE
echo "📝 Ejemplo 2.3: Búsquedas con condiciones WHERE\n";
/*
// Productos de electrónica
$electronicos = App\Models\Producto::where('categoria', 'electronica')->get();
echo "📱 Productos electrónicos: {$electronicos->count()}\n";

// Productos caros (> 1 millón)
$productosCaros = App\Models\Producto::where('precio', '>', 1000000)
                                     ->where('activo', true)
                                     ->get();
echo "💰 Productos > $1M: {$productosCaros->count()}\n";

// Búsqueda por texto
$iphones = App\Models\Producto::where('nombre', 'like', '%iPhone%')->get();
$iphones->each(function($p) {
    echo "  📱 {$p->nombre} - {$p->precio_formateado}\n";
});
*/

// Ejemplo 2.4: Usar Scopes del Model
echo "📝 Ejemplo 2.4: Usar Scopes personalizados\n";
/*
// Productos activos
$activos = App\Models\Producto::activos()->count();
echo "✅ Productos activos: {$activos}\n";

// Productos disponibles (activos Y con stock)
$disponibles = App\Models\Producto::disponibles()->count();
echo "🎯 Productos disponibles: {$disponibles}\n";

// Productos por categoría
$gaming = App\Models\Producto::porCategoria('electronica')->activos()->count();
echo "🎮 Productos electrónicos activos: {$gaming}\n";
*/

// ============================================================================
// SECCIÓN 3: UPDATE - Actualizar Registros
// ============================================================================

echo "\n🔄 SECCIÓN 3: UPDATE OPERATIONS\n";
echo "─────────────────────────────────────────────────────────────────\n";

// Ejemplo 3.1: Update individual
echo "📝 Ejemplo 3.1: Actualizar producto individual\n";
/*
$producto = App\Models\Producto::first();
if ($producto) {
    $precioAnterior = $producto->precio;
    
    $producto->precio = $precioAnterior * 1.1; // Aumentar 10%
    $producto->save();
    
    echo "✅ Precio actualizado:\n";
    echo "   Anterior: $" . number_format($precioAnterior, 2) . "\n";
    echo "   Nuevo: {$producto->precio_formateado}\n";
}
*/

// Ejemplo 3.2: Update con where
echo "📝 Ejemplo 3.2: Update masivo con WHERE\n";
/*
// Activar todos los productos de gaming
$actualizados = App\Models\Producto::where('categoria', 'gaming')
                                   ->update(['activo' => true]);
echo "✅ {$actualizados} productos gaming activados\n";

// Incrementar stock de productos con poco inventario
$incrementados = App\Models\Producto::where('stock', '<', 10)
                                   ->where('activo', true)
                                   ->increment('stock', 20);
echo "📈 Stock incrementado en productos con bajo inventario\n";
*/

// Ejemplo 3.3: Update usando métodos del model
echo "📝 Ejemplo 3.3: Update usando métodos de negocio\n";
/*
$producto = App\Models\Producto::where('stock', '>', 10)->first();
if ($producto) {
    echo "📦 Producto para testing: {$producto->nombre}\n";
    echo "   Stock inicial: {$producto->stock}\n";
    
    // Reducir stock usando método del model
    if ($producto->reducirStock(5)) {
        echo "✅ Stock reducido en 5 unidades\n";
        echo "   Stock actual: {$producto->stock}\n";
    }
    
    // Aumentar stock
    $producto->aumentarStock(10);
    echo "📈 Stock aumentado en 10 unidades\n";
    echo "   Stock final: {$producto->stock}\n";
}
*/

// ============================================================================
// SECCIÓN 4: DELETE - Eliminar Registros
// ============================================================================

echo "\n🗑️ SECCIÓN 4: DELETE OPERATIONS\n";
echo "─────────────────────────────────────────────────────────────────\n";

// Ejemplo 4.1: Delete individual
echo "📝 Ejemplo 4.1: Eliminar producto individual\n";
/*
// Crear producto temporal para eliminar
$temporal = App\Models\Producto::create([
    'codigo_sku' => 'TEMP-DELETE-' . time(),
    'nombre' => 'Producto Temporal para Delete',
    'precio' => 1000.00,
    'stock' => 0,
    'categoria' => 'testing',
    'activo' => false
]);

echo "📦 Producto temporal creado: {$temporal->nombre}\n";

// Eliminar el producto
$nombreProducto = $temporal->nombre;
$temporal->delete();
echo "🗑️ Producto eliminado: {$nombreProducto}\n";
*/

// Ejemplo 4.2: Delete masivo con condiciones
echo "📝 Ejemplo 4.2: Delete masivo con WHERE\n";
/*
// Eliminar productos de testing inactivos
$eliminados = App\Models\Producto::where('categoria', 'testing')
                                 ->where('activo', false)
                                 ->where('stock', 0)
                                 ->delete();

echo "🗑️ {$eliminados} productos de testing eliminados\n";
*/

// ============================================================================
// SECCIÓN 5: QUERIES AVANZADAS
// ============================================================================

echo "\n🎯 SECCIÓN 5: QUERIES AVANZADAS\n";
echo "─────────────────────────────────────────────────────────────────\n";

// Ejemplo 5.1: Agregaciones
echo "📝 Ejemplo 5.1: Agregaciones y estadísticas\n";
/*
$stats = [
    'total' => App\Models\Producto::count(),
    'activos' => App\Models\Producto::where('activo', true)->count(),
    'precio_promedio' => App\Models\Producto::avg('precio'),
    'precio_maximo' => App\Models\Producto::max('precio'),
    'precio_minimo' => App\Models\Producto::min('precio'),
    'stock_total' => App\Models\Producto::sum('stock'),
];

echo "📊 ESTADÍSTICAS:\n";
foreach ($stats as $key => $value) {
    if (str_contains($key, 'precio')) {
        echo "   {$key}: $" . number_format($value, 2) . "\n";
    } else {
        echo "   {$key}: {$value}\n";
    }
}
*/

// Ejemplo 5.2: Productos por categoría
echo "📝 Ejemplo 5.2: Agrupación por categoría\n";
/*
$categorias = App\Models\Producto::selectRaw('categoria, count(*) as total, avg(precio) as precio_promedio')
                                 ->groupBy('categoria')
                                 ->orderBy('total', 'desc')
                                 ->get();

echo "🏷️ PRODUCTOS POR CATEGORÍA:\n";
$categorias->each(function($cat) {
    echo "   {$cat->categoria}: {$cat->total} productos (Promedio: $" . number_format($cat->precio_promedio, 2) . ")\n";
});
*/

// Ejemplo 5.3: Top productos
echo "📝 Ejemplo 5.3: Top productos más caros\n";
/*
$topCaros = App\Models\Producto::activos()
                               ->orderBy('precio', 'desc')
                               ->take(5)
                               ->get();

echo "💎 TOP 5 PRODUCTOS MÁS CAROS:\n";
$topCaros->each(function($p, $index) {
    echo "   " . ($index + 1) . ". {$p->nombre} - {$p->precio_formateado}\n";
});
*/

// ============================================================================
// SECCIÓN 6: TESTING Y VERIFICACIÓN
// ============================================================================

echo "\n🧪 SECCIÓN 6: TESTING COMPLETO\n";
echo "─────────────────────────────────────────────────────────────────\n";

echo "📝 Ejemplo 6.1: Test completo de CRUD\n";
/*
try {
    echo "🔧 Iniciando test completo...\n";
    
    // CREATE
    $producto = App\Models\Producto::create([
        'codigo_sku' => 'TEST-CRUD-' . time(),
        'nombre' => 'Producto Test CRUD',
        'descripcion' => 'Producto creado para testing completo',
        'precio' => 199000.00,
        'stock' => 50,
        'categoria' => 'testing',
        'activo' => true
    ]);
    echo "✅ CREATE: Producto creado (ID: {$producto->id})\n";
    
    // READ
    $encontrado = App\Models\Producto::find($producto->id);
    echo "✅ READ: Producto encontrado - {$encontrado->nombre}\n";
    
    // UPDATE
    $encontrado->update(['precio' => 249000.00, 'stock' => 75]);
    echo "✅ UPDATE: Precio actualizado a {$encontrado->precio_formateado}\n";
    
    // TEST ACCESSORS
    echo "✅ ACCESSOR: Estado stock - {$encontrado->estado_stock}\n";
    
    // TEST METHODS
    $disponible = $encontrado->estaDisponible() ? 'SÍ' : 'NO';
    echo "✅ METHOD: ¿Está disponible? {$disponible}\n";
    
    // DELETE
    $encontrado->delete();
    echo "✅ DELETE: Producto eliminado exitosamente\n";
    
    echo "🎉 TEST COMPLETO EXITOSO - Todos los CRUD funcionando\n";
    
} catch (Exception $e) {
    echo "❌ ERROR EN TEST: {$e->getMessage()}\n";
}
*/

// ============================================================================
// INSTRUCCIONES DE USO
// ============================================================================

echo "\n📚 INSTRUCCIONES DE USO:\n";
echo "─────────────────────────────────────────────────────────────────\n";
echo "1. Ejecutar en Laravel Tinker:\n";
echo "   php artisan tinker\n\n";
echo "2. Copiar y pegar cada sección por separado\n";
echo "3. Quitar los comentarios /* */ para ejecutar el código\n";
echo "4. Observar los resultados de cada operación\n\n";

echo "🎯 EJEMPLOS INCLUIDOS:\n";
echo "   ✅ Create: 3 métodos diferentes\n";
echo "   ✅ Read: Búsquedas simples y complejas\n";
echo "   ✅ Update: Individual, masivo y con métodos\n";
echo "   ✅ Delete: Individual y masivo\n";
echo "   ✅ Queries avanzadas: Agregaciones y estadísticas\n";
echo "   ✅ Testing: Verificación completa\n\n";

echo "🔧 COMANDOS ÚTILES:\n";
echo "   App\\Models\\Producto::count()              - Contar productos\n";
echo "   App\\Models\\Producto::activos()->count()   - Productos activos\n";
echo "   App\\Models\\Producto::obtenerEstadisticas() - Stats completas\n";
echo "   App\\Models\\Producto::obtenerCategorias()   - Lista categorías\n\n";

echo "⚠️ IMPORTANTE:\n";
echo "   - Descomenta el código que quieras ejecutar\n";
echo "   - Ejecuta una sección a la vez\n";
echo "   - Verifica los resultados antes de continuar\n";

echo "\n═══════════════════════════════════════════════════════════════\n";
echo "🏆 ELOQUENT CRUD OPERATIONS - LISTO PARA WORLDSKILLS 2025\n";

/*
PRÓXIMO PASO:
Continuar con Sección 04: Relationships Básicas (hasMany, belongsTo)
*/

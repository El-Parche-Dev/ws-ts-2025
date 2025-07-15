# 🔧 Eloquent CRUD Operations

**⏱️ Tiempo:** 60 minutos (13:45-14:45)  
**🎯 Objetivo:** Dominar operaciones CRUD completas con Eloquent ORM

## 🎯 Metodología MVP

### 🔧 FASE CORE (13:45-14:05) - 20 minutos

**Objetivo:** CRUD básico funcionando

**Entregables:**

- Create, Read, Update, Delete básicos
- Controller con métodos fundamentales
- Operaciones sin errores

### ⚡ FASE ENHANCED (14:05-14:25) - 20 minutos

**Objetivo:** Queries avanzadas

**Entregables:**

- Query Builder complejo
- Where clauses múltiples
- Joins y relaciones básicas

### ✨ FASE POLISH (14:25-14:45) - 20 minutos

**Objetivo:** Eloquent avanzado

**Entregables:**

- Scopes personalizados
- Accessors/Mutators en acción
- Performance optimization

## 📋 CORE: CRUD Básico con Eloquent

### 1. Create - Crear Registros

#### Método 1: Instanciar y Guardar

```php
<?php
// Ejemplo básico de CREATE

// Crear instancia del model
$producto = new App\Models\Producto();
$producto->nombre = 'Laptop Gaming ASUS';
$producto->descripcion = 'Laptop para gaming con RTX 4060';
$producto->precio = 3499000.00;
$producto->stock = 15;
$producto->activo = true;

// Guardar en base de datos
$producto->save();

echo "✅ Producto creado con ID: " . $producto->id;
```

#### Método 2: Create Masivo

```php
<?php
// CREATE usando fillable (más eficiente)

$producto = App\Models\Producto::create([
    'nombre' => 'Samsung Galaxy S24',
    'descripcion' => 'Smartphone flagship con cámara IA',
    'precio' => 2899000.00,
    'stock' => 40,
    'activo' => true,
    'categoria' => 'electronica'
]);

echo "✅ Producto creado: " . $producto->nombre;
```

#### Método 3: Create con Validación

```php
<?php
// CREATE con validación de datos

try {
    $datosProducto = [
        'codigo_sku' => 'GAMER-001',
        'nombre' => 'Silla Gaming RGB',
        'descripcion' => 'Silla ergonómica para gaming con luces RGB',
        'precio' => 899000.00,
        'peso' => 18.5,
        'stock' => 25,
        'categoria' => 'muebles',
        'activo' => true
    ];

    $producto = App\Models\Producto::create($datosProducto);
    echo "✅ Producto creado exitosamente: {$producto->codigo_sku}";

} catch (Exception $e) {
    echo "❌ Error al crear producto: " . $e->getMessage();
}
```

### 2. Read - Leer Registros

#### Obtener Todos los Registros

```php
<?php
// READ - Obtener todos los productos

// Obtener todos (¡CUIDADO en producción!)
$productos = App\Models\Producto::all();
echo "📦 Total productos: " . $productos->count();

// Obtener solo campos específicos
$productos = App\Models\Producto::select('id', 'nombre', 'precio')->get();
foreach ($productos as $producto) {
    echo "• {$producto->nombre}: \${$producto->precio}\n";
}
```

#### Obtener por ID

```php
<?php
// READ - Obtener producto específico

// Por clave primaria
$producto = App\Models\Producto::find(1);
if ($producto) {
    echo "Producto encontrado: " . $producto->nombre;
} else {
    echo "Producto no encontrado";
}

// Por clave primaria (lanza excepción si no existe)
try {
    $producto = App\Models\Producto::findOrFail(999);
    echo $producto->nombre;
} catch (ModelNotFoundException $e) {
    echo "❌ Producto con ID 999 no existe";
}
```

#### Búsquedas con Where

```php
<?php
// READ - Búsquedas con condiciones

// Productos activos
$productosActivos = App\Models\Producto::where('activo', true)->get();
echo "Productos activos: " . $productosActivos->count();

// Productos con stock
$productosEnStock = App\Models\Producto::where('stock', '>', 0)->get();

// Múltiples condiciones
$productosCaros = App\Models\Producto::where('precio', '>', 1000000)
                                     ->where('activo', true)
                                     ->where('stock', '>', 0)
                                     ->get();

// Búsqueda por texto
$busqueda = App\Models\Producto::where('nombre', 'like', '%iPhone%')->get();
foreach ($busqueda as $producto) {
    echo "📱 {$producto->nombre} - {$producto->precio_formateado}\n";
}
```

### 3. Update - Actualizar Registros

#### Update Individual

```php
<?php
// UPDATE - Actualizar un producto

// Método 1: Find y Save
$producto = App\Models\Producto::find(1);
if ($producto) {
    $producto->precio = 4599000.00;
    $producto->stock = 30;
    $producto->save();

    echo "✅ Producto actualizado: " . $producto->nombre;
}

// Método 2: Update directo
App\Models\Producto::where('id', 1)
                   ->update([
                       'precio' => 4599000.00,
                       'stock' => 30
                   ]);

echo "✅ Producto actualizado mediante where";
```

#### Update Masivo

```php
<?php
// UPDATE - Actualización masiva

// Actualizar todos los productos de una categoría
$productosActualizados = App\Models\Producto::where('categoria', 'electronica')
                                           ->update(['activo' => true]);

echo "✅ {$productosActualizados} productos de electrónica activados";

// Incrementar precios en 10%
App\Models\Producto::where('categoria', 'ropa')
                   ->increment('precio', 0.10);

echo "✅ Precios de ropa incrementados 10%";
```

#### Update con Validación

```php
<?php
// UPDATE con validación y manejo de errores

try {
    $producto = App\Models\Producto::findOrFail(2);

    // Validar antes de actualizar
    if ($producto->stock < 10) {
        echo "⚠️ Advertencia: Stock bajo para {$producto->nombre}";
    }

    $producto->update([
        'descripcion' => 'Descripción actualizada con más detalles',
        'peso' => 0.5,
        'categoria' => 'electronica_actualizada'
    ]);

    echo "✅ Producto actualizado: " . $producto->nombre;

} catch (ModelNotFoundException $e) {
    echo "❌ Producto no encontrado para actualizar";
} catch (Exception $e) {
    echo "❌ Error al actualizar: " . $e->getMessage();
}
```

### 4. Delete - Eliminar Registros

#### Delete Individual

```php
<?php
// DELETE - Eliminar producto

// Método 1: Find y Delete
$producto = App\Models\Producto::find(3);
if ($producto) {
    $nombreProducto = $producto->nombre;
    $producto->delete();
    echo "🗑️ Producto eliminado: {$nombreProducto}";
}

// Método 2: Delete directo por ID
$eliminado = App\Models\Producto::destroy(4);
if ($eliminado) {
    echo "🗑️ Producto con ID 4 eliminado";
}

// Método 3: Delete con where
$eliminados = App\Models\Producto::where('stock', 0)
                                 ->where('activo', false)
                                 ->delete();
echo "🗑️ {$eliminados} productos sin stock eliminados";
```

#### Delete con Validación

```php
<?php
// DELETE con validación de negocio

try {
    $producto = App\Models\Producto::findOrFail(5);

    // Validar si se puede eliminar
    if ($producto->stock > 0) {
        echo "❌ No se puede eliminar producto con stock: {$producto->nombre}";
        return;
    }

    // Guardar información antes de eliminar
    $info = [
        'nombre' => $producto->nombre,
        'precio' => $producto->precio,
        'eliminado_en' => now()
    ];

    $producto->delete();

    echo "✅ Producto eliminado: " . $info['nombre'];
    echo "📊 Precio original: " . $info['precio'];

} catch (ModelNotFoundException $e) {
    echo "❌ Producto no encontrado para eliminar";
}
```

## ⚡ ENHANCED: Query Builder Avanzado

### 1. Queries Complejas con Where

```php
<?php
// ENHANCED - Where clauses avanzadas

// Where con OR
$productos = App\Models\Producto::where('categoria', 'electronica')
                                ->orWhere('categoria', 'gaming')
                                ->get();

// Where anidado con grupos
$productos = App\Models\Producto::where(function ($query) {
                                     $query->where('precio', '<', 500000)
                                           ->where('stock', '>', 10);
                                 })
                                ->orWhere(function ($query) {
                                     $query->where('categoria', 'oferta')
                                           ->where('activo', true);
                                 })
                                ->get();

// Where con arrays (IN)
$categorias = ['electronica', 'gaming', 'informatica'];
$productos = App\Models\Producto::whereIn('categoria', $categorias)->get();

// Where con rangos
$productos = App\Models\Producto::whereBetween('precio', [100000, 1000000])->get();

// Where con NULL
$productosImagenes = App\Models\Producto::whereNotNull('imagen')->get();
$productosSinPeso = App\Models\Producto::whereNull('peso')->get();

echo "📊 Productos encontrados: " . $productos->count();
```

### 2. Ordenamiento y Límites

```php
<?php
// ENHANCED - Ordenamiento y paginación

// Ordenar por precio descendente
$productosCaros = App\Models\Producto::orderBy('precio', 'desc')
                                     ->take(5)
                                     ->get();

// Ordenar por múltiples campos
$productos = App\Models\Producto::orderBy('categoria', 'asc')
                                ->orderBy('precio', 'desc')
                                ->get();

// Obtener el más caro y más barato
$masCaro = App\Models\Producto::orderBy('precio', 'desc')->first();
$masBarato = App\Models\Producto::orderBy('precio', 'asc')->first();

echo "💰 Más caro: {$masCaro->nombre} - {$masCaro->precio_formateado}";
echo "💸 Más barato: {$masBarato->nombre} - {$masBarato->precio_formateado}";

// Paginación manual
$pagina = 1;
$porPagina = 10;
$productos = App\Models\Producto::skip(($pagina - 1) * $porPagina)
                                ->take($porPagina)
                                ->get();
```

### 3. Agregaciones y Estadísticas

```php
<?php
// ENHANCED - Funciones de agregación

// Conteos
$totalProductos = App\Models\Producto::count();
$productosActivos = App\Models\Producto::where('activo', true)->count();
$productosPorCategoria = App\Models\Producto::groupBy('categoria')
                                           ->selectRaw('categoria, count(*) as total')
                                           ->get();

// Precios
$precioPromedio = App\Models\Producto::avg('precio');
$precioMinimo = App\Models\Producto::min('precio');
$precioMaximo = App\Models\Producto::max('precio');
$sumaTotal = App\Models\Producto::sum('precio');

// Stock
$stockTotal = App\Models\Producto::sum('stock');
$stockPromedio = App\Models\Producto::avg('stock');

echo "📊 ESTADÍSTICAS DE PRODUCTOS:";
echo "Total productos: {$totalProductos}";
echo "Productos activos: {$productosActivos}";
echo "Precio promedio: $" . number_format($precioPromedio, 2);
echo "Stock total: {$stockTotal} unidades";

// Estadísticas por categoría
foreach ($productosPorCategoria as $stat) {
    echo "🏷️ {$stat->categoria}: {$stat->total} productos";
}
```

### 4. Búsquedas y Filtros Avanzados

```php
<?php
// ENHANCED - Búsquedas complejas

// Búsqueda full-text simulada
function buscarProductos($termino) {
    return App\Models\Producto::where('nombre', 'like', "%{$termino}%")
                              ->orWhere('descripcion', 'like', "%{$termino}%")
                              ->orWhere('codigo_sku', 'like', "%{$termino}%")
                              ->get();
}

// Filtros combinados
function filtrarProductos($filtros) {
    $query = App\Models\Producto::query();

    if (!empty($filtros['categoria'])) {
        $query->where('categoria', $filtros['categoria']);
    }

    if (!empty($filtros['precio_min'])) {
        $query->where('precio', '>=', $filtros['precio_min']);
    }

    if (!empty($filtros['precio_max'])) {
        $query->where('precio', '<=', $filtros['precio_max']);
    }

    if (!empty($filtros['solo_activos'])) {
        $query->where('activo', true);
    }

    if (!empty($filtros['con_stock'])) {
        $query->where('stock', '>', 0);
    }

    return $query->get();
}

// Ejemplos de uso
$resultados = buscarProductos('iPhone');
echo "🔍 Búsqueda 'iPhone': " . $resultados->count() . " resultados";

$filtrados = filtrarProductos([
    'categoria' => 'electronica',
    'precio_min' => 500000,
    'precio_max' => 2000000,
    'solo_activos' => true,
    'con_stock' => true
]);

echo "🎯 Productos filtrados: " . $filtrados->count();
```

## ✨ POLISH: Eloquent Avanzado

### 1. Usando Scopes del Model

```php
<?php
// POLISH - Usar scopes definidos en el Model

// Scopes básicos
$activos = App\Models\Producto::activos()->get();
$enStock = App\Models\Producto::enStock()->get();
$disponibles = App\Models\Producto::disponibles()->get(); // activos Y en stock

// Scopes con parámetros
$electronicos = App\Models\Producto::porCategoria('electronica')->get();
$busqueda = App\Models\Producto::buscarPorNombre('iPhone')->get();

// Combinando scopes
$productosVendibles = App\Models\Producto::activos()
                                        ->enStock()
                                        ->porCategoria('electronica')
                                        ->get();

echo "🎯 Productos vendibles: " . $productosVendibles->count();

// Scopes con ordenamiento
$mejoresProductos = App\Models\Producto::disponibles()
                                      ->orderBy('precio', 'desc')
                                      ->take(10)
                                      ->get();

foreach ($mejoresProductos as $producto) {
    echo "⭐ {$producto->nombre} - {$producto->precio_formateado}";
}
```

### 2. Accessors en Acción

```php
<?php
// POLISH - Usar accessors para datos formateados

$productos = App\Models\Producto::take(5)->get();

foreach ($productos as $producto) {
    echo "📦 PRODUCTO: {$producto->nombre}";
    echo "💰 Precio: {$producto->precio_formateado}"; // Accessor
    echo "📊 Stock: {$producto->estado_stock}"; // Accessor
    echo "🖼️ Imagen: {$producto->imagen_url}"; // Accessor
    echo "---";
}

// Accessor para calcular descuentos
$productos = App\Models\Producto::where('categoria', 'electronica')->get();

foreach ($productos as $producto) {
    $precioDescuento = $producto->aplicarDescuento(15); // Método del model
    echo "{$producto->nombre}:";
    echo "  Precio normal: {$producto->precio_formateado}";
    echo "  Con 15% desc: $" . number_format($precioDescuento, 2);
}
```

### 3. Operaciones Avanzadas de Negocio

```php
<?php
// POLISH - Métodos de negocio del model

// Gestión de inventario
$producto = App\Models\Producto::find(1);

if ($producto) {
    echo "📦 GESTIÓN DE INVENTARIO para: {$producto->nombre}";
    echo "Stock actual: {$producto->stock}";

    // Verificar disponibilidad
    if ($producto->estaDisponible()) {
        echo "✅ Producto disponible para venta";

        // Simular venta
        if ($producto->reducirStock(3)) {
            echo "✅ Stock reducido en 3 unidades";
            echo "Stock actual: {$producto->stock}";
        }
    } else {
        echo "❌ Producto NO disponible";
    }

    // Verificar si necesita restock
    if ($producto->necesitaRestock(15)) {
        echo "⚠️ ALERTA: Producto necesita restock";

        // Agregar stock
        $producto->aumentarStock(20);
        echo "✅ Stock aumentado en 20 unidades";
    }
}
```

### 4. Estadísticas y Reports

```php
<?php
// POLISH - Estadísticas usando métodos estáticos

// Estadísticas generales
$stats = App\Models\Producto::obtenerEstadisticas();

echo "📊 REPORTE DE PRODUCTOS:";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━";
echo "📦 Total productos: {$stats['total']}";
echo "✅ Productos activos: {$stats['activos']}";
echo "📈 En stock: {$stats['en_stock']}";
echo "🎯 Disponibles: {$stats['disponibles']}";
echo "❌ Sin stock: {$stats['sin_stock']}";
echo "💰 Valor inventario: $" . number_format($stats['valor_inventario'], 2);
echo "📊 Precio promedio: $" . number_format($stats['precio_promedio'], 2);

// Obtener categorías
$categorias = App\Models\Producto::obtenerCategorias();
echo "🏷️ Categorías disponibles: " . implode(', ', $categorias);

// Búsqueda avanzada
$resultados = App\Models\Producto::buscarAvanzado([
    'nombre' => 'iPhone',
    'categoria' => 'electronica',
    'precio_min' => 1000000,
    'precio_max' => 5000000,
    'solo_activos' => true,
    'solo_en_stock' => true
])->get();

echo "🔍 Búsqueda avanzada: " . $resultados->count() . " resultados";
foreach ($resultados as $producto) {
    echo "  • {$producto->nombre} - {$producto->precio_formateado}";
}
```

## 🧪 Verificación Final y Testing

### Script de Verificación Completo

```php
<?php
// TESTING - Script completo de verificación

echo "🧪 TESTING ELOQUENT CRUD OPERATIONS";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

try {
    // TEST 1: CREATE
    echo "\n🔧 TEST 1: CREATE";
    $nuevoProducto = App\Models\Producto::create([
        'codigo_sku' => 'TEST-' . time(),
        'nombre' => 'Producto de Testing',
        'descripcion' => 'Creado para verificar CRUD',
        'precio' => 99000.00,
        'stock' => 50,
        'categoria' => 'testing',
        'activo' => true
    ]);
    echo "✅ CREATE exitoso - ID: {$nuevoProducto->id}";

    // TEST 2: READ
    echo "\n📖 TEST 2: READ";
    $producto = App\Models\Producto::find($nuevoProducto->id);
    echo "✅ READ exitoso - Nombre: {$producto->nombre}";
    echo "✅ Accessor funcionando - Precio: {$producto->precio_formateado}";

    // TEST 3: UPDATE
    echo "\n🔄 TEST 3: UPDATE";
    $producto->update([
        'precio' => 149000.00,
        'stock' => 75
    ]);
    echo "✅ UPDATE exitoso - Nuevo precio: {$producto->precio_formateado}";

    // TEST 4: SCOPES
    echo "\n🎯 TEST 4: SCOPES";
    $activos = App\Models\Producto::activos()->count();
    $disponibles = App\Models\Producto::disponibles()->count();
    echo "✅ SCOPES funcionando - Activos: {$activos}, Disponibles: {$disponibles}";

    // TEST 5: ESTADÍSTICAS
    echo "\n📊 TEST 5: ESTADÍSTICAS";
    $stats = App\Models\Producto::obtenerEstadisticas();
    echo "✅ ESTADÍSTICAS funcionando - Total: {$stats['total']}";

    // TEST 6: DELETE
    echo "\n🗑️ TEST 6: DELETE";
    $producto->delete();
    echo "✅ DELETE exitoso - Producto eliminado";

    echo "\n🎉 TODOS LOS TESTS PASARON EXITOSAMENTE";

} catch (Exception $e) {
    echo "\n❌ ERROR EN TESTING: " . $e->getMessage();
}

echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
echo "🏆 ELOQUENT CRUD OPERATIONS VERIFICADO";
```

## ✅ Entregables de esta Sección

- [ ] CRUD básico (Create, Read, Update, Delete) funcional
- [ ] Query Builder con where clauses complejas
- [ ] Agregaciones y estadísticas implementadas
- [ ] Scopes del model en uso
- [ ] Accessors formateando datos automáticamente
- [ ] Métodos de negocio operativos
- [ ] Búsquedas avanzadas funcionando
- [ ] Script de testing completo ejecutado

## 🚨 Troubleshooting Común

### Error: "Mass assignment not allowed"

```php
// Solución: Verificar $fillable en el Model
protected $fillable = [
    'nombre', 'descripcion', 'precio', 'stock', 'activo'
];
```

### Error: "Class not found"

```bash
# Regenerar autoload
composer dump-autoload

# Verificar namespace
php artisan tinker
App\Models\Producto::first();
```

## ➡️ Preparación para Sección 04

Una vez completada esta sección, tendrás:

✅ Dominio completo de operaciones CRUD  
✅ Query Builder avanzado funcionando  
✅ Scopes y métodos de negocio activos  
✅ Sistema de testing verificado

**Próximo paso:** Implementar relationships básicas (hasMany, belongsTo) en la Sección 04.

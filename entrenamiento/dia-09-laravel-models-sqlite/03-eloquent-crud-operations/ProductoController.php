<?php
/**
 * ProductoController - CRUD Operations
 * WorldSkills 2025 - Laravel Models + SQLite
 * Tiempo: CORE + ENHANCED (40 minutos)
 */

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProductoController extends Controller
{
    /**
     * Mostrar lista de productos
     * GET /productos
     */
    public function index(Request $request)
    {
        try {
            // CORE: Lista básica
            $query = Producto::query();

            // ENHANCED: Filtros opcionales
            if ($request->filled('categoria')) {
                $query->porCategoria($request->categoria);
            }

            if ($request->filled('buscar')) {
                $query->buscarPorNombre($request->buscar);
            }

            if ($request->boolean('solo_activos')) {
                $query->activos();
            }

            if ($request->boolean('solo_disponibles')) {
                $query->disponibles();
            }

            // ENHANCED: Filtros de precio
            if ($request->filled('precio_min')) {
                $query->where('precio', '>=', $request->precio_min);
            }

            if ($request->filled('precio_max')) {
                $query->where('precio', '<=', $request->precio_max);
            }

            // ENHANCED: Ordenamiento
            $ordenPor = $request->get('orden_por', 'nombre');
            $direccion = $request->get('direccion', 'asc');
            $query->orderBy($ordenPor, $direccion);

            // ENHANCED: Paginación
            $porPagina = $request->get('por_pagina', 15);
            $productos = $query->paginate($porPagina);

            // Para API JSON
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'data' => $productos,
                    'meta' => [
                        'total' => $productos->total(),
                        'per_page' => $productos->perPage(),
                        'current_page' => $productos->currentPage(),
                    ]
                ]);
            }

            // Para web view
            $categorias = Producto::obtenerCategorias();
            $estadisticas = Producto::obtenerEstadisticas();

            return view('productos.index', compact(
                'productos', 
                'categorias', 
                'estadisticas'
            ));

        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al obtener productos',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Error al cargar productos: ' . $e->getMessage());
        }
    }

    /**
     * Mostrar formulario de creación
     * GET /productos/create
     */
    public function create()
    {
        $categorias = Producto::obtenerCategorias();
        
        return view('productos.create', compact('categorias'));
    }

    /**
     * Guardar nuevo producto
     * POST /productos
     */
    public function store(Request $request)
    {
        try {
            // CORE: Validación básica
            $validatedData = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'precio' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'activo' => 'boolean',
            ]);

            // ENHANCED: Validaciones adicionales
            $validatedData = array_merge($validatedData, $request->validate([
                'codigo_sku' => 'nullable|string|unique:productos,codigo_sku',
                'peso' => 'nullable|numeric|min:0',
                'categoria' => 'required|string|max:100',
                'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]));

            // ENHANCED: Manejo de imagen
            if ($request->hasFile('imagen')) {
                $imagen = $request->file('imagen');
                $nombreImagen = time() . '_' . $imagen->getClientOriginalName();
                $rutaImagen = $imagen->storeAs('productos', $nombreImagen, 'public');
                $validatedData['imagen'] = $rutaImagen;
            }

            // CORE: Crear producto
            $producto = Producto::create($validatedData);

            // Respuesta JSON para API
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Producto creado exitosamente',
                    'data' => $producto
                ], 201);
            }

            // Redirección para web
            return redirect()
                ->route('productos.show', $producto)
                ->with('success', "Producto '{$producto->nombre}' creado exitosamente");

        } catch (\Illuminate\Validation\ValidationException $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $e->errors()
                ], 422);
            }

            return back()
                ->withErrors($e->errors())
                ->withInput();

        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al crear producto',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()
                ->withInput()
                ->with('error', 'Error al crear producto: ' . $e->getMessage());
        }
    }

    /**
     * Mostrar producto específico
     * GET /productos/{producto}
     */
    public function show(Producto $producto)
    {
        try {
            // ENHANCED: Productos relacionados
            $productosRelacionados = Producto::porCategoria($producto->categoria)
                                            ->where('id', '!=', $producto->id)
                                            ->activos()
                                            ->take(4)
                                            ->get();

            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'data' => $producto,
                    'related_products' => $productosRelacionados
                ]);
            }

            return view('productos.show', compact('producto', 'productosRelacionados'));

        } catch (\Exception $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al obtener producto',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Error al cargar producto: ' . $e->getMessage());
        }
    }

    /**
     * Mostrar formulario de edición
     * GET /productos/{producto}/edit
     */
    public function edit(Producto $producto)
    {
        $categorias = Producto::obtenerCategorias();
        
        return view('productos.edit', compact('producto', 'categorias'));
    }

    /**
     * Actualizar producto
     * PUT /productos/{producto}
     */
    public function update(Request $request, Producto $producto)
    {
        try {
            // CORE: Validación básica
            $validatedData = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'precio' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'activo' => 'boolean',
            ]);

            // ENHANCED: Validaciones adicionales (excluyendo el producto actual)
            $validatedData = array_merge($validatedData, $request->validate([
                'codigo_sku' => 'nullable|string|unique:productos,codigo_sku,' . $producto->id,
                'peso' => 'nullable|numeric|min:0',
                'categoria' => 'required|string|max:100',
                'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]));

            // ENHANCED: Manejo de nueva imagen
            if ($request->hasFile('imagen')) {
                // Eliminar imagen anterior si existe
                if ($producto->imagen && \Storage::disk('public')->exists($producto->imagen)) {
                    \Storage::disk('public')->delete($producto->imagen);
                }

                $imagen = $request->file('imagen');
                $nombreImagen = time() . '_' . $imagen->getClientOriginalName();
                $rutaImagen = $imagen->storeAs('productos', $nombreImagen, 'public');
                $validatedData['imagen'] = $rutaImagen;
            }

            // CORE: Actualizar producto
            $producto->update($validatedData);

            // Respuesta JSON para API
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Producto actualizado exitosamente',
                    'data' => $producto->fresh() // Recargar datos
                ]);
            }

            // Redirección para web
            return redirect()
                ->route('productos.show', $producto)
                ->with('success', "Producto '{$producto->nombre}' actualizado exitosamente");

        } catch (\Illuminate\Validation\ValidationException $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $e->errors()
                ], 422);
            }

            return back()
                ->withErrors($e->errors())
                ->withInput();

        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al actualizar producto',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()
                ->withInput()
                ->with('error', 'Error al actualizar producto: ' . $e->getMessage());
        }
    }

    /**
     * Eliminar producto
     * DELETE /productos/{producto}
     */
    public function destroy(Producto $producto)
    {
        try {
            // ENHANCED: Validaciones de negocio antes de eliminar
            if ($producto->stock > 0) {
                $mensaje = "No se puede eliminar '{$producto->nombre}' porque tiene stock disponible";
                
                if (request()->expectsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => $mensaje
                    ], 400);
                }

                return back()->with('error', $mensaje);
            }

            // Guardar información antes de eliminar
            $nombreProducto = $producto->nombre;
            $codigoSku = $producto->codigo_sku;

            // ENHANCED: Eliminar imagen si existe
            if ($producto->imagen && \Storage::disk('public')->exists($producto->imagen)) {
                \Storage::disk('public')->delete($producto->imagen);
            }

            // CORE: Eliminar producto
            $producto->delete();

            // Respuesta JSON para API
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => "Producto '{$nombreProducto}' eliminado exitosamente"
                ]);
            }

            // Redirección para web
            return redirect()
                ->route('productos.index')
                ->with('success', "Producto '{$nombreProducto}' ({$codigoSku}) eliminado exitosamente");

        } catch (\Exception $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al eliminar producto',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Error al eliminar producto: ' . $e->getMessage());
        }
    }

    /**
     * ENHANCED: Buscar productos
     * GET /productos/buscar
     */
    public function buscar(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2|max:100'
        ]);

        try {
            $termino = $request->q;
            
            $productos = Producto::where('nombre', 'like', "%{$termino}%")
                                ->orWhere('descripcion', 'like', "%{$termino}%")
                                ->orWhere('codigo_sku', 'like', "%{$termino}%")
                                ->activos()
                                ->take(20)
                                ->get();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'data' => $productos,
                    'query' => $termino,
                    'count' => $productos->count()
                ]);
            }

            return view('productos.buscar', compact('productos', 'termino'));

        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error en búsqueda',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Error en búsqueda: ' . $e->getMessage());
        }
    }

    /**
     * ENHANCED: Actualizar stock de producto
     * PATCH /productos/{producto}/stock
     */
    public function actualizarStock(Request $request, Producto $producto)
    {
        $request->validate([
            'accion' => 'required|in:aumentar,reducir',
            'cantidad' => 'required|integer|min:1'
        ]);

        try {
            $cantidad = $request->cantidad;
            $accion = $request->accion;

            if ($accion === 'aumentar') {
                $resultado = $producto->aumentarStock($cantidad);
                $mensaje = "Stock aumentado en {$cantidad} unidades";
            } else {
                $resultado = $producto->reducirStock($cantidad);
                $mensaje = "Stock reducido en {$cantidad} unidades";
            }

            if (!$resultado) {
                $error = $accion === 'reducir' 
                    ? 'Stock insuficiente para reducir' 
                    : 'Error al actualizar stock';

                if ($request->expectsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => $error
                    ], 400);
                }

                return back()->with('error', $error);
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $mensaje,
                    'nuevo_stock' => $producto->stock
                ]);
            }

            return back()->with('success', $mensaje . ". Stock actual: {$producto->stock}");

        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al actualizar stock',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Error al actualizar stock: ' . $e->getMessage());
        }
    }

    /**
     * POLISH: Estadísticas de productos
     * GET /productos/estadisticas
     */
    public function estadisticas()
    {
        try {
            $stats = Producto::obtenerEstadisticas();
            $categorias = Producto::obtenerCategorias();
            
            // Productos por categoría
            $productosPorCategoria = collect($categorias)->mapWithKeys(function ($categoria) {
                return [$categoria => Producto::porCategoria($categoria)->count()];
            });

            // Top productos más caros
            $topCaros = Producto::activos()
                               ->orderBy('precio', 'desc')
                               ->take(5)
                               ->get(['nombre', 'precio', 'codigo_sku']);

            // Productos con bajo stock
            $bajoStock = Producto::activos()
                                ->where('stock', '<=', 10)
                                ->where('stock', '>', 0)
                                ->orderBy('stock', 'asc')
                                ->get(['nombre', 'stock', 'codigo_sku']);

            $data = [
                'estadisticas_generales' => $stats,
                'productos_por_categoria' => $productosPorCategoria,
                'top_productos_caros' => $topCaros,
                'productos_bajo_stock' => $bajoStock
            ];

            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'data' => $data
                ]);
            }

            return view('productos.estadisticas', $data);

        } catch (\Exception $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al obtener estadísticas',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Error al cargar estadísticas: ' . $e->getMessage());
        }
    }
}

/*
INSTRUCCIONES DE USO:

1. Copiar este archivo a: app/Http/Controllers/ProductoController.php

2. Registrar rutas en routes/web.php:
   Route::resource('productos', ProductoController::class);
   Route::get('productos/buscar', [ProductoController::class, 'buscar'])->name('productos.buscar');
   Route::patch('productos/{producto}/stock', [ProductoController::class, 'actualizarStock'])->name('productos.stock');
   Route::get('productos/estadisticas', [ProductoController::class, 'estadisticas'])->name('productos.estadisticas');

3. Para rutas API en routes/api.php:
   Route::apiResource('productos', ProductoController::class);
   Route::get('productos/buscar', [ProductoController::class, 'buscar']);
   Route::patch('productos/{producto}/stock', [ProductoController::class, 'actualizarStock']);

FEATURES INCLUIDAS:

CORE (Básico):
✅ CRUD completo (index, create, store, show, edit, update, destroy)
✅ Validación de datos
✅ Manejo de errores básico

ENHANCED (Avanzado):
✅ Filtros y búsquedas
✅ Paginación
✅ Subida de imágenes
✅ Respuestas JSON para API
✅ Gestión de stock

POLISH (Profesional):
✅ Estadísticas avanzadas
✅ Validaciones de negocio
✅ Manejo completo de errores
✅ Métodos adicionales (buscar, stock)

RUTAS GENERADAS:
- GET /productos (index)
- GET /productos/create (create)
- POST /productos (store)
- GET /productos/{id} (show)
- GET /productos/{id}/edit (edit)
- PUT/PATCH /productos/{id} (update)
- DELETE /productos/{id} (destroy)
- GET /productos/buscar (buscar)
- PATCH /productos/{id}/stock (actualizarStock)
- GET /productos/estadisticas (estadisticas)

PRÓXIMO PASO:
Crear vistas Blade para este controller en la Sección 05
*/

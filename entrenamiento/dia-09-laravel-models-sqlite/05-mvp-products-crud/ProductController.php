<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * 🎯 ProductController - Implementación MVP para WorldSkills 2025
 * 
 * Controlador Resource completo con operaciones CRUD para productos
 * Implementado siguiendo metodología MVP: Core → Enhanced → Polish
 */
class ProductController extends Controller
{
    // ========== FASE CORE ✅ (15 minutos) ==========
    // Funcionalidades básicas: CRUD funcional sin validaciones complejas

    /**
     * Mostrar lista de productos
     * 
     * @param Request $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request)
    {
        // Búsqueda básica
        $query = Product::with('category');
        
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        // Paginación básica
        $products = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return view('products.index', compact('products'));
    }

    /**
     * Mostrar formulario de creación
     * 
     * @return \Illuminate\View\View
     */
    public function create()
    {
        $categories = Category::orderBy('name')->get();
        return view('products.create', compact('categories'));
    }

    /**
     * Guardar nuevo producto
     * 
     * @param ProductRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(ProductRequest $request)
    {
        try {
            $data = $request->validated();
            
            // Manejar imagen si existe
            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('products', 'public');
            }
            
            $product = Product::create($data);
            
            return redirect()
                ->route('products.index')
                ->with('success', '¡Producto creado exitosamente!');
                
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Error al crear producto: ' . $e->getMessage());
        }
    }

    /**
     * Mostrar producto específico
     * 
     * @param Product $product
     * @return \Illuminate\View\View
     */
    public function show(Product $product)
    {
        $product->load('category');
        return view('products.show', compact('product'));
    }

    /**
     * Mostrar formulario de edición
     * 
     * @param Product $product
     * @return \Illuminate\View\View
     */
    public function edit(Product $product)
    {
        $categories = Category::orderBy('name')->get();
        return view('products.edit', compact('product', 'categories'));
    }

    // ========== FASE ENHANCED ⚡ (15 minutos) ==========
    // Mejoras: Validaciones, manejo de errores, funcionalidades adicionales

    /**
     * Actualizar producto existente
     * 
     * @param ProductRequest $request
     * @param Product $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(ProductRequest $request, Product $product)
    {
        try {
            $data = $request->validated();
            
            // Manejar nueva imagen
            if ($request->hasFile('image')) {
                // Eliminar imagen anterior si existe
                if ($product->image && Storage::disk('public')->exists($product->image)) {
                    Storage::disk('public')->delete($product->image);
                }
                
                $data['image'] = $request->file('image')->store('products', 'public');
            }
            
            $product->update($data);
            
            return redirect()
                ->route('products.show', $product)
                ->with('success', '¡Producto actualizado exitosamente!');
                
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Error al actualizar producto: ' . $e->getMessage());
        }
    }

    /**
     * Eliminar producto
     * 
     * @param Product $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Product $product)
    {
        try {
            // Verificar relaciones antes de eliminar
            if ($product->orders()->count() > 0) {
                return back()->with('error', 'No se puede eliminar el producto porque tiene pedidos asociados.');
            }
            
            // Eliminar imagen si existe
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            
            $product->delete();
            
            return redirect()
                ->route('products.index')
                ->with('success', '¡Producto eliminado exitosamente!');
                
        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar producto: ' . $e->getMessage());
        }
    }

    // ========== FASE POLISH ✨ (10 minutos) ==========
    // Refinamientos: Funcionalidades avanzadas, optimizaciones

    /**
     * Buscar productos por AJAX
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $query = Product::with('category');
        
        if ($request->filled('term')) {
            $query->where('name', 'like', '%' . $request->term . '%')
                  ->orWhere('description', 'like', '%' . $request->term . '%');
        }
        
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        $products = $query->orderBy('name')
                          ->limit(10)
                          ->get(['id', 'name', 'price', 'category_id']);
        
        return response()->json($products);
    }

    /**
     * Cambiar estado activo/inactivo
     * 
     * @param Product $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleStatus(Product $product)
    {
        try {
            $product->update(['active' => !$product->active]);
            
            $status = $product->active ? 'activado' : 'desactivado';
            
            return response()->json([
                'success' => true,
                'message' => "Producto {$status} exitosamente",
                'active' => $product->active
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar estado del producto'
            ], 500);
        }
    }

    /**
     * Obtener productos de una categoría específica
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByCategory(Request $request)
    {
        $products = Product::where('category_id', $request->category_id)
                          ->where('active', true)
                          ->orderBy('name')
                          ->get(['id', 'name', 'price']);
        
        return response()->json($products);
    }
}

// 📝 Notas de Implementación MVP:
// - Prioridad 1: CRUD básico funcional (CORE)
// - Prioridad 2: Validaciones y manejo de errores (ENHANCED)  
// - Prioridad 3: Funcionalidades AJAX y optimizaciones (POLISH)

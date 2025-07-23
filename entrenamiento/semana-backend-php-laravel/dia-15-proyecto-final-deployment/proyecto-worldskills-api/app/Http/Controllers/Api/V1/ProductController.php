<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controlador de productos para API WorldSkills 2025
 * CRUD completo con búsqueda, filtros y operaciones avanzadas
 */
class ProductController extends Controller
{
    private ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
        
        // Middleware de autorización
        $this->middleware('auth:sanctum');
        $this->middleware('throttle:60,1'); // Rate limiting
    }

    /**
     * Obtener lista de productos con filtros y paginación
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only([
                'search', 'category_id', 'min_price', 'max_price', 
                'active', 'sort_by', 'sort_direction'
            ]);

            $perPage = $request->get('per_page', 15);
            $products = $this->productService->getFilteredProducts($filters, $perPage);

            return response()->json([
                'status' => 'success',
                'data' => ProductResource::collection($products),
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'total_pages' => $products->lastPage(),
                    'total_items' => $products->total(),
                    'per_page' => $products->perPage()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener productos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear nuevo producto
     */
    public function store(ProductRequest $request): JsonResponse
    {
        try {
            $product = $this->productService->createProduct($request->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Producto creado exitosamente',
                'data' => new ProductResource($product)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al crear producto',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Mostrar producto específico
     */
    public function show(Product $product): JsonResponse
    {
        try {
            $product->load(['category', 'images', 'reviews']);

            return response()->json([
                'status' => 'success',
                'data' => new ProductResource($product)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar producto existente
     */
    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        try {
            $updatedProduct = $this->productService->updateProduct($product, $request->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Producto actualizado exitosamente',
                'data' => new ProductResource($updatedProduct)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar producto',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Eliminar producto (soft delete)
     */
    public function destroy(Product $product): JsonResponse
    {
        try {
            $this->productService->deleteProduct($product);

            return response()->json([
                'status' => 'success',
                'message' => 'Producto eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al eliminar producto',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Búsqueda avanzada de productos
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->get('q', '');
            $filters = $request->only(['category_id', 'min_price', 'max_price']);
            
            $products = $this->productService->searchProducts($query, $filters);

            return response()->json([
                'status' => 'success',
                'data' => ProductResource::collection($products),
                'meta' => [
                    'query' => $query,
                    'total_results' => $products->count()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error en búsqueda',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Operaciones en lote
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'products' => 'required|array',
                'products.*.id' => 'required|exists:products,id',
                'action' => 'required|in:activate,deactivate,delete'
            ]);

            $result = $this->productService->bulkOperation(
                $request->get('products'),
                $request->get('action')
            );

            return response()->json([
                'status' => 'success',
                'message' => "Operación '{$request->get('action')}' ejecutada exitosamente",
                'data' => [
                    'processed' => $result['processed'],
                    'failed' => $result['failed']
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error en operación en lote',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Exportar products a CSV
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['category_id', 'active']);
            $jobId = $this->productService->exportToCSV($filters);

            return response()->json([
                'status' => 'success',
                'message' => 'Exportación iniciada',
                'data' => [
                    'job_id' => $jobId,
                    'status_url' => route('api.v1.jobs.status', $jobId)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al iniciar exportación',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

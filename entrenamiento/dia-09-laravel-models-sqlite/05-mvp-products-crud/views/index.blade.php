@extends('layout')

@section('title', 'Lista de Productos')

@section('content')
<div class="fade-in">
    {{-- Header de la página --}}
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h1 class="h3 mb-1">
                <i class="fas fa-boxes me-2 text-primary"></i>
                Gestión de Productos
            </h1>
            <p class="text-muted mb-0">
                Administra tu inventario de productos
            </p>
        </div>
        <a href="{{ route('products.create') }}" class="btn btn-primary">
            <i class="fas fa-plus me-2"></i>
            Nuevo Producto
        </a>
    </div>

    {{-- ========== FASE CORE ✅ - Funcionalidad básica ========== --}}
    
    {{-- Filtros y búsqueda --}}
    <div class="search-form">
        <form method="GET" action="{{ route('products.index') }}" class="row g-3">
            <div class="col-md-6">
                <label for="search" class="form-label">Buscar productos</label>
                <div class="input-group">
                    <span class="input-group-text">
                        <i class="fas fa-search"></i>
                    </span>
                    <input type="text" 
                           class="form-control" 
                           id="search" 
                           name="search"
                           placeholder="Nombre del producto..."
                           value="{{ request('search') }}">
                </div>
            </div>
            <div class="col-md-3">
                <label for="category" class="form-label">Categoría</label>
                <select class="form-select" id="category" name="category_id">
                    <option value="">Todas las categorías</option>
                    @foreach($categories ?? [] as $category)
                        <option value="{{ $category->id }}" 
                                {{ request('category_id') == $category->id ? 'selected' : '' }}>
                            {{ $category->name }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-3 d-flex align-items-end">
                <button type="submit" class="btn btn-outline-primary me-2">
                    <i class="fas fa-filter me-1"></i>
                    Filtrar
                </button>
                <a href="{{ route('products.index') }}" class="btn btn-outline-secondary">
                    <i class="fas fa-times me-1"></i>
                    Limpiar
                </a>
            </div>
        </form>
    </div>

    {{-- Estadísticas rápidas --}}
    <div class="row mb-4">
        <div class="col-md-3">
            <div class="card text-center h-100">
                <div class="card-body">
                    <i class="fas fa-cubes fa-2x text-primary mb-2"></i>
                    <h5 class="card-title">{{ $products->total() }}</h5>
                    <p class="card-text text-muted">Total Productos</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center h-100">
                <div class="card-body">
                    <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
                    <h5 class="card-title">{{ $products->where('active', true)->count() }}</h5>
                    <p class="card-text text-muted">Activos</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center h-100">
                <div class="card-body">
                    <i class="fas fa-warehouse fa-2x text-warning mb-2"></i>
                    <h5 class="card-title">{{ $products->where('stock', '>', 0)->count() }}</h5>
                    <p class="card-text text-muted">En Stock</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center h-100">
                <div class="card-body">
                    <i class="fas fa-exclamation-triangle fa-2x text-danger mb-2"></i>
                    <h5 class="card-title">{{ $products->where('stock', 0)->count() }}</h5>
                    <p class="card-text text-muted">Sin Stock</p>
                </div>
            </div>
        </div>
    </div>

    {{-- ========== FASE ENHANCED ⚡ - Lista mejorada ========== --}}
    
    @if($products->count() > 0)
        {{-- Tabla de productos --}}
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                    <i class="fas fa-list me-2"></i>
                    Lista de Productos
                </h5>
                <small class="text-muted">
                    Mostrando {{ $products->firstItem() }}-{{ $products->lastItem() }} 
                    de {{ $products->total() }} productos
                </small>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th width="80">Imagen</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th width="120">Precio</th>
                                <th width="80">Stock</th>
                                <th width="100">Estado</th>
                                <th width="180">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($products as $product)
                                <tr class="hover-scale">
                                    {{-- Imagen --}}
                                    <td>
                                        @if($product->image)
                                            <img src="{{ asset('storage/' . $product->image) }}" 
                                                 alt="{{ $product->name }}"
                                                 class="product-image">
                                        @else
                                            <div class="product-image bg-light d-flex align-items-center justify-content-center">
                                                <i class="fas fa-image text-muted"></i>
                                            </div>
                                        @endif
                                    </td>
                                    
                                    {{-- Nombre --}}
                                    <td>
                                        <div>
                                            <strong>{{ $product->name }}</strong>
                                            @if($product->description)
                                                <br>
                                                <small class="text-muted">
                                                    {{ Str::limit($product->description, 50) }}
                                                </small>
                                            @endif
                                        </div>
                                    </td>
                                    
                                    {{-- Categoría --}}
                                    <td>
                                        @if($product->category)
                                            <span class="badge bg-secondary">
                                                {{ $product->category->name }}
                                            </span>
                                        @else
                                            <span class="text-muted">Sin categoría</span>
                                        @endif
                                    </td>
                                    
                                    {{-- Precio --}}
                                    <td>
                                        <strong class="text-success">
                                            ${{ number_format($product->price, 2) }}
                                        </strong>
                                    </td>
                                    
                                    {{-- Stock --}}
                                    <td>
                                        @if($product->stock > 10)
                                            <span class="badge bg-success">{{ $product->stock }}</span>
                                        @elseif($product->stock > 0)
                                            <span class="badge bg-warning">{{ $product->stock }}</span>
                                        @else
                                            <span class="badge bg-danger">{{ $product->stock }}</span>
                                        @endif
                                    </td>
                                    
                                    {{-- Estado --}}
                                    <td>
                                        @if($product->active)
                                            <span class="badge bg-success status-badge">
                                                <i class="fas fa-check me-1"></i>
                                                Activo
                                            </span>
                                        @else
                                            <span class="badge bg-secondary status-badge">
                                                <i class="fas fa-times me-1"></i>
                                                Inactivo
                                            </span>
                                        @endif
                                    </td>
                                    
                                    {{-- Acciones --}}
                                    <td>
                                        <div class="btn-group btn-group-actions" role="group">
                                            {{-- Ver --}}
                                            <a href="{{ route('products.show', $product) }}" 
                                               class="btn btn-sm btn-outline-primary" 
                                               title="Ver producto">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            
                                            {{-- Editar --}}
                                            <a href="{{ route('products.edit', $product) }}" 
                                               class="btn btn-sm btn-outline-warning" 
                                               title="Editar producto">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            
                                            {{-- Eliminar --}}
                                            <form method="POST" 
                                                  action="{{ route('products.destroy', $product) }}" 
                                                  class="d-inline"
                                                  onsubmit="return confirmDelete(event, '¿Eliminar {{ $product->name }}?')">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" 
                                                        class="btn btn-sm btn-outline-danger" 
                                                        title="Eliminar producto">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {{-- ========== FASE POLISH ✨ - Paginación ========== --}}
        
        {{-- Paginación --}}
        @if($products->hasPages())
            <div class="d-flex justify-content-center mt-4">
                {{ $products->appends(request()->query())->links() }}
            </div>
        @endif
        
    @else
        {{-- Estado vacío --}}
        <div class="card">
            <div class="card-body text-center py-5">
                <i class="fas fa-box-open fa-4x text-muted mb-3"></i>
                <h4>No hay productos disponibles</h4>
                <p class="text-muted mb-4">
                    @if(request('search'))
                        No se encontraron productos que coincidan con "{{ request('search') }}"
                    @else
                        Comienza agregando tu primer producto al inventario
                    @endif
                </p>
                
                @if(request('search'))
                    <a href="{{ route('products.index') }}" class="btn btn-outline-primary me-2">
                        <i class="fas fa-list me-2"></i>
                        Ver todos los productos
                    </a>
                @endif
                
                <a href="{{ route('products.create') }}" class="btn btn-primary">
                    <i class="fas fa-plus me-2"></i>
                    Agregar primer producto
                </a>
            </div>
        </div>
    @endif
</div>

{{-- Scripts adicionales --}}
@push('scripts')
<script>
    // ========== FASE ENHANCED ⚡ - JavaScript interactivo ==========
    
    // Búsqueda en tiempo real
    const searchInput = document.getElementById('search');
    if (searchInput) {
        const debouncedSearch = debounce(function() {
            this.form.submit();
        }, 500);
        
        searchInput.addEventListener('input', debouncedSearch);
    }
    
    // ========== FASE POLISH ✨ - Funcionalidades avanzadas ==========
    
    // Cambio de estado vía AJAX
    function toggleProductStatus(productId, currentStatus) {
        fetch(`/productos/${productId}/toggle-status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': window.csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Actualizar badge de estado
                location.reload(); // Simplificado para MVP
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cambiar el estado del producto');
        });
    }
    
    // Selección múltiple para acciones en lote
    let selectedProducts = [];
    
    function toggleProductSelection(productId) {
        const index = selectedProducts.indexOf(productId);
        if (index > -1) {
            selectedProducts.splice(index, 1);
        } else {
            selectedProducts.push(productId);
        }
        
        updateBulkActionsVisibility();
    }
    
    function updateBulkActionsVisibility() {
        const bulkActions = document.getElementById('bulk-actions');
        if (bulkActions) {
            bulkActions.style.display = selectedProducts.length > 0 ? 'block' : 'none';
        }
    }
</script>
@endpush
@endsection

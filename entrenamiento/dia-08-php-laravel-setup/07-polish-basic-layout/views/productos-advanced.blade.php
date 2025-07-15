@extends('layouts.app')

@section('title', 'Productos')

@push('styles')
<style>
    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .product-card {
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .product-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transition: left 0.5s;
        z-index: 1;
    }

    .product-card:hover::before {
        left: 100%;
    }

    .product-image {
        height: 200px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        color: white;
        position: relative;
    }

    .product-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255,255,255,0.9);
        padding: 0.25rem 0.5rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .product-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
    }

    .search-box {
        position: relative;
    }

    .search-box .form-control {
        padding-left: 2.5rem;
        border-radius: 50px;
        border: 2px solid #e9ecef;
        transition: all 0.3s ease;
    }

    .search-box .form-control:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #6c757d;
    }

    .stats-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
    }

    .stats-icon {
        font-size: 2rem;
        opacity: 0.8;
    }
</style>
@endpush

@section('content')
<div class="container-fluid">
    <!-- Page Header -->
    <div class="row mb-4">
        <div class="col">
            <h1 class="text-gradient mb-3">
                <i class="bi bi-box-seam me-3"></i>
                Gestión de Productos
            </h1>
            <p class="text-muted">Administra tu catálogo de productos de manera eficiente</p>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="row mb-4">
        <div class="col-md-3">
            <x-card type="primary" :shadow="true">
                <div class="d-flex align-items-center">
                    <div class="stats-icon me-3">
                        <i class="bi bi-box-seam"></i>
                    </div>
                    <div>
                        <h3 class="mb-1">{{ count($productos) }}</h3>
                        <small class="text-muted">Total Productos</small>
                    </div>
                </div>
            </x-card>
        </div>
        <div class="col-md-3">
            <x-card type="success" :shadow="true">
                <div class="d-flex align-items-center">
                    <div class="stats-icon me-3">
                        <i class="bi bi-graph-up"></i>
                    </div>
                    <div>
                        <h3 class="mb-1">
                            ${{ number_format(collect($productos)->sum('precio'), 2) }}
                        </h3>
                        <small class="text-muted">Valor Total</small>
                    </div>
                </div>
            </x-card>
        </div>
        <div class="col-md-3">
            <x-card type="warning" :shadow="true">
                <div class="d-flex align-items-center">
                    <div class="stats-icon me-3">
                        <i class="bi bi-tags"></i>
                    </div>
                    <div>
                        <h3 class="mb-1">
                            {{ collect($productos)->groupBy('categoria')->count() }}
                        </h3>
                        <small class="text-muted">Categorías</small>
                    </div>
                </div>
            </x-card>
        </div>
        <div class="col-md-3">
            <x-card type="info" :shadow="true">
                <div class="d-flex align-items-center">
                    <div class="stats-icon me-3">
                        <i class="bi bi-star"></i>
                    </div>
                    <div>
                        <h3 class="mb-1">
                            {{ number_format(collect($productos)->avg('precio'), 2) }}
                        </h3>
                        <small class="text-muted">Precio Promedio</small>
                    </div>
                </div>
            </x-card>
        </div>
    </div>

    <!-- Actions and Search -->
    <div class="row mb-4">
        <div class="col-md-6">
            <div class="search-box">
                <i class="bi bi-search search-icon"></i>
                <input type="text" class="form-control" placeholder="Buscar productos..." id="searchProducts">
            </div>
        </div>
        <div class="col-md-6 text-end">
            <x-button variant="primary" icon="plus-lg" class="me-2">
                Nuevo Producto
            </x-button>
            <x-button variant="outline-secondary" icon="download">
                Exportar
            </x-button>
        </div>
    </div>

    <!-- Products Grid -->
    <div class="product-grid" id="productsGrid">
        @forelse($productos as $producto)
        <div class="product-card">
            <x-card :shadow="true" :hover="true">
                <div class="product-image">
                    <span class="product-badge">{{ $producto['categoria'] }}</span>
                    <i class="bi bi-box-seam"></i>
                </div>
                <div class="card-body">
                    <h5 class="card-title">{{ $producto['nombre'] }}</h5>
                    <p class="card-text text-muted">{{ $producto['descripcion'] }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="product-price">${{ number_format($producto['precio'], 2) }}</span>
                        <div class="btn-group" role="group">
                            <x-button variant="outline-primary" size="sm" icon="eye">
                                Ver
                            </x-button>
                            <x-button variant="outline-warning" size="sm" icon="pencil">
                                Editar
                            </x-button>
                            <x-button variant="outline-danger" size="sm" icon="trash">
                                Eliminar
                            </x-button>
                        </div>
                    </div>
                </div>
            </x-card>
        </div>
        @empty
        <div class="col-12 text-center py-5">
            <x-alert type="info" :dismissible="false">
                <h4>No hay productos disponibles</h4>
                <p class="mb-0">Comienza agregando tu primer producto al catálogo.</p>
            </x-alert>
        </div>
        @endforelse
    </div>
</div>
@endsection

@push('scripts')
<script>
    // Search functionality
    document.getElementById('searchProducts').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-text').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Add fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
</script>
@endpush

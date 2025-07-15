<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Gestión de Productos') - WorldSkills 2025</title>
    
    {{-- Bootstrap 5 CSS --}}
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    {{-- Font Awesome para íconos --}}
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    
    {{-- CSS personalizado --}}
    <style>
        /* ========== FASE CORE ✅ - Estilos básicos ========== */
        .navbar-brand {
            font-weight: bold;
            color: #0d6efd !important;
        }
        
        .card {
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
            border: 1px solid rgba(0, 0, 0, 0.125);
        }
        
        .btn-group-actions {
            gap: 0.25rem;
        }
        
        /* ========== FASE ENHANCED ⚡ - Mejoras UX ========== */
        .product-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 0.375rem;
        }
        
        .status-badge {
            font-size: 0.75rem;
        }
        
        .loading {
            pointer-events: none;
            opacity: 0.6;
        }
        
        .alert {
            border-radius: 0.5rem;
        }
        
        /* ========== FASE POLISH ✨ - Refinamientos ========== */
        .fade-in {
            animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .hover-scale:hover {
            transform: scale(1.02);
            transition: transform 0.2s ease;
        }
        
        .search-form {
            background: #f8f9fa;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        
        .pagination .page-link {
            border-radius: 0.375rem;
            margin: 0 0.125rem;
        }
    </style>
    
    @stack('styles')
</head>
<body>
    {{-- Navegación principal --}}
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="{{ route('products.index') }}">
                <i class="fas fa-store me-2"></i>
                Gestión de Productos
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link {{ request()->routeIs('products.index') ? 'active' : '' }}" 
                           href="{{ route('products.index') }}">
                            <i class="fas fa-list me-1"></i>
                            Productos
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ request()->routeIs('products.create') ? 'active' : '' }}" 
                           href="{{ route('products.create') }}">
                            <i class="fas fa-plus me-1"></i>
                            Agregar Producto
                        </a>
                    </li>
                </ul>
                
                {{-- Búsqueda rápida en navbar --}}
                <form class="d-flex" method="GET" action="{{ route('products.index') }}">
                    <input class="form-control me-2" type="search" name="search" 
                           placeholder="Buscar productos..." 
                           value="{{ request('search') }}"
                           style="width: 200px;">
                    <button class="btn btn-outline-light" type="submit">
                        <i class="fas fa-search"></i>
                    </button>
                </form>
            </div>
        </div>
    </nav>

    {{-- Contenido principal --}}
    <main class="container my-4">
        {{-- Breadcrumbs --}}
        @if(isset($breadcrumbs))
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    @foreach($breadcrumbs as $breadcrumb)
                        @if($loop->last)
                            <li class="breadcrumb-item active" aria-current="page">
                                {{ $breadcrumb['title'] }}
                            </li>
                        @else
                            <li class="breadcrumb-item">
                                <a href="{{ $breadcrumb['url'] }}">{{ $breadcrumb['title'] }}</a>
                            </li>
                        @endif
                    @endforeach
                </ol>
            </nav>
        @endif

        {{-- Alertas y mensajes flash --}}
        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show fade-in" role="alert">
                <i class="fas fa-check-circle me-2"></i>
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        @if(session('error'))
            <div class="alert alert-danger alert-dismissible fade show fade-in" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                {{ session('error') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        @if(session('warning'))
            <div class="alert alert-warning alert-dismissible fade show fade-in" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ session('warning') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        {{-- Contenido de la página --}}
        @yield('content')
    </main>

    {{-- Footer --}}
    <footer class="bg-light py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h6>WorldSkills 2025 - Sistema de Gestión</h6>
                    <p class="text-muted mb-0">
                        Desarrollado con Laravel + SQLite
                    </p>
                </div>
                <div class="col-md-6 text-md-end">
                    <small class="text-muted">
                        <i class="fas fa-clock me-1"></i>
                        {{ now()->format('d/m/Y H:i') }}
                    </small>
                </div>
            </div>
        </div>
    </footer>

    {{-- JavaScript --}}
    {{-- Bootstrap 5 JS --}}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    
    {{-- JavaScript personalizado --}}
    <script>
        // ========== FASE CORE ✅ - Funcionalidades básicas ==========
        
        // Configurar CSRF token para AJAX
        document.addEventListener('DOMContentLoaded', function() {
            const token = document.querySelector('meta[name="csrf-token"]');
            if (token) {
                window.csrfToken = token.getAttribute('content');
            }
        });

        // ========== FASE ENHANCED ⚡ - Interactividad ==========
        
        // Confirmación de eliminación
        function confirmDelete(event, message = '¿Estás seguro de eliminar este elemento?') {
            if (!confirm(message)) {
                event.preventDefault();
                return false;
            }
            
            // Mostrar loading
            const button = event.target.closest('button') || event.target.closest('a');
            if (button) {
                button.classList.add('loading');
                button.disabled = true;
            }
            
            return true;
        }

        // Auto-hide alerts después de 5 segundos
        document.addEventListener('DOMContentLoaded', function() {
            const alerts = document.querySelectorAll('.alert:not(.alert-danger)');
            alerts.forEach(alert => {
                setTimeout(() => {
                    const bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                }, 5000);
            });
        });

        // ========== FASE POLISH ✨ - Funcionalidades avanzadas ==========
        
        // Búsqueda en tiempo real (debounced)
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Loading state para formularios
        function showLoading(form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Procesando...';
            }
        }

        // Restablecer loading state
        function hideLoading(form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtn.dataset.originalText || 'Guardar';
            }
        }

        // Aplicar loading a todos los formularios
        document.addEventListener('DOMContentLoaded', function() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.dataset.originalText = submitBtn.innerHTML;
                }
                
                form.addEventListener('submit', function() {
                    showLoading(form);
                });
            });
        });
    </script>
    
    @stack('scripts')
</body>
</html>

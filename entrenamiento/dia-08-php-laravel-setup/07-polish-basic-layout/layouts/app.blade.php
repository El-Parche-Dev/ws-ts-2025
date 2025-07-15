<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>@yield('title', 'Laravel App') - WorldSkills 2025</title>
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <!-- Custom CSS -->
    <style>
        :root {
            --primary-color: #007bff;
            --secondary-color: #6c757d;
            --success-color: #28a745;
            --danger-color: #dc3545;
            --warning-color: #ffc107;
            --info-color: #17a2b8;
            --light-color: #f8f9fa;
            --dark-color: #343a40;
            --sidebar-width: 280px;
            --header-height: 60px;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--light-color);
            /* CSS Grid layout para estructura principal */
            display: grid;
            grid-template-rows: auto 1fr;
        }

        /* Header Styles */
        .app-header {
            height: var(--header-height);
            background: linear-gradient(135deg, var(--primary-color), #0056b3);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1030;
        }

        .header-brand {
            font-weight: 700;
            font-size: 1.2rem;
            color: white !important;
            text-decoration: none;
        }

        /* Sidebar Styles con flexbox */
        .app-sidebar {
            width: var(--sidebar-width);
            height: calc(100vh - var(--header-height));
            position: fixed;
            top: var(--header-height);
            left: 0;
            background: white;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            overflow-y: auto;
            transition: transform 0.3s ease;
            z-index: 1020;
        }

        .sidebar-nav {
            padding: 1rem 0;
        }

        .nav-item {
            margin: 0.25rem 1rem;
        }

        .nav-link {
            color: var(--dark-color);
            padding: 0.75rem 1rem;
            border-radius: 8px;
            transition: all 0.3s ease;
            border: none;
            background: none;
        }

        .nav-link:hover, .nav-link.active {
            background-color: var(--primary-color);
            color: white;
            transform: translateX(5px);
        }

        .nav-link i {
            width: 20px;
            margin-right: 0.5rem;
        }

        /* Main Content */
        .app-main {
            margin-left: var(--sidebar-width);
            margin-top: var(--header-height);
            padding: 2rem;
            min-height: calc(100vh - var(--header-height));
        }

        /* Cards */
        .card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }

        .card-header {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-bottom: 1px solid #dee2e6;
            border-radius: 12px 12px 0 0 !important;
            font-weight: 600;
        }

        /* Breadcrumbs */
        .breadcrumb {
            background: none;
            padding: 0;
            margin-bottom: 1.5rem;
        }

        .breadcrumb-item {
            font-weight: 500;
        }

        .breadcrumb-item.active {
            color: var(--primary-color);
        }

        /* Buttons */
        .btn {
            border-radius: 8px;
            font-weight: 500;
            padding: 0.5rem 1.5rem;
            transition: all 0.3s ease;
        }

        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        /* Alerts */
        .alert {
            border: none;
            border-radius: 12px;
            font-weight: 500;
        }

        .alert-dismissible .btn-close {
            border-radius: 50%;
        }

        /* Loading Skeleton */
        .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }

        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .app-sidebar {
                transform: translateX(-100%);
            }
            
            .app-sidebar.show {
                transform: translateX(0);
            }
            
            .app-main {
                margin-left: 0;
                padding: 1rem;
            }
        }

        /* Utilities */
        .text-gradient {
            background: linear-gradient(135deg, var(--primary-color), #0056b3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .shadow-custom {
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }

        .border-gradient {
            border: 2px solid;
            border-image: linear-gradient(135deg, var(--primary-color), #0056b3) 1;
        }
    </style>
    
    @stack('styles')
</head>
<body>
    <!-- Header -->
    <header class="app-header">
        <div class="container-fluid h-100">
            <div class="row h-100 align-items-center">
                <div class="col-auto">
                    <button class="btn btn-outline-light d-md-none" id="sidebarToggle">
                        <i class="bi bi-list"></i>
                    </button>
                    <a href="{{ route('dashboard') }}" class="header-brand ms-2">
                        <i class="bi bi-code-square me-2"></i>
                        Laravel WorldSkills
                    </a>
                </div>
                <div class="col"></div>
                <div class="col-auto">
                    <div class="dropdown">
                        <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            <i class="bi bi-person-circle me-1"></i>
                            Usuario
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Perfil</a></li>
                            <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Configuración</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="#"><i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Sidebar -->
    <aside class="app-sidebar" id="sidebar">
        <nav class="sidebar-nav">
            <ul class="nav flex-column">
                <li class="nav-item">
                    <a href="{{ route('dashboard') }}" class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}">
                        <i class="bi bi-speedometer2"></i>
                        Dashboard
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('productos.index') }}" class="nav-link {{ request()->routeIs('productos.*') ? 'active' : '' }}">
                        <i class="bi bi-box-seam"></i>
                        Productos
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('stats') }}" class="nav-link {{ request()->routeIs('stats') ? 'active' : '' }}">
                        <i class="bi bi-graph-up"></i>
                        Estadísticas
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="bi bi-people"></i>
                        Usuarios
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="bi bi-gear"></i>
                        Configuración
                    </a>
                </li>
            </ul>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="app-main">
        <!-- Breadcrumbs -->
        @if(!empty($breadcrumbs))
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                @foreach($breadcrumbs as $breadcrumb)
                    @if(!$loop->last)
                        <li class="breadcrumb-item">
                            <a href="{{ $breadcrumb['url'] }}">{{ $breadcrumb['title'] }}</a>
                        </li>
                    @else
                        <li class="breadcrumb-item active">{{ $breadcrumb['title'] }}</li>
                    @endif
                @endforeach
            </ol>
        </nav>
        @endif

        <!-- Flash Messages -->
        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle me-2"></i>
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        @if(session('error'))
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ session('error') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        @if(session('warning'))
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ session('warning') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        <!-- Page Content -->
        @yield('content')
    </main>

    <!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JavaScript -->
    <script>
        // Sidebar toggle for mobile
        document.getElementById('sidebarToggle')?.addEventListener('click', function() {
            document.getElementById('sidebar').classList.toggle('show');
        });

        // Auto-hide alerts after 5 seconds
        setTimeout(function() {
            const alerts = document.querySelectorAll('.alert');
            alerts.forEach(alert => {
                if (alert.classList.contains('fade')) {
                    const bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                }
            });
        }, 5000);

        // Loading states simulation
        function showLoading(element) {
            element.innerHTML = '<div class="skeleton" style="height: 20px; border-radius: 4px;"></div>';
        }

        function hideLoading(element, content) {
            setTimeout(() => {
                element.innerHTML = content;
            }, 1000);
        }
    </script>
    
    @stack('scripts')
</body>
</html>

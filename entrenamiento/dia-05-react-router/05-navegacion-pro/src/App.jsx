// App.jsx - Navegación Profesional Avanzada (FASE ENHANCED)
import React, { useEffect, useRef, useState } from 'react';
import {
  NavLink,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import './App.css';

// Hook personalizado para navegación con historial
const useNavigationHistory = () => {
  const [history, setHistory] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setHistory(prev => {
      const newHistory = [...prev, location.pathname];
      // Mantener solo los últimos 10 elementos
      return newHistory.slice(-10);
    });
  }, [location.pathname]);

  return history;
};

// Hook para navegación programática avanzada
const useAdvancedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => navigate(-1);
  const goForward = () => navigate(1);

  const navigateWithState = (path, state = {}) => {
    navigate(path, { state });
  };

  const replaceCurrentRoute = path => {
    navigate(path, { replace: true });
  };

  const navigateWithQuery = (path, queryParams) => {
    const searchParams = new URLSearchParams(queryParams);
    navigate(`${path}?${searchParams.toString()}`);
  };

  return {
    goBack,
    goForward,
    navigateWithState,
    replaceCurrentRoute,
    navigateWithQuery,
    currentPath: location.pathname,
    locationState: location.state,
  };
};

// Componente de Search Global
const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Simular datos de búsqueda
  const searchData = [
    { id: 1, title: 'Dashboard Principal', type: 'page', path: '/dashboard' },
    { id: 2, title: 'Gestión de Productos', type: 'page', path: '/productos' },
    { id: 3, title: 'Lista de Usuarios', type: 'page', path: '/usuarios' },
    {
      id: 4,
      title: 'Configuración del Sistema',
      type: 'page',
      path: '/configuracion',
    },
    {
      id: 5,
      title: 'Laptop Dell Inspiron',
      type: 'product',
      path: '/productos/1',
    },
    { id: 6, title: 'iPhone 15 Pro', type: 'product', path: '/productos/2' },
    { id: 7, title: 'Juan Pérez', type: 'user', path: '/usuarios/1' },
    { id: 8, title: 'María García', type: 'user', path: '/usuarios/2' },
  ];

  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async term => {
    setSearchTerm(term);
    setIsOpen(term.length > 0);

    if (term.length > 2) {
      setIsLoading(true);

      // Simular búsqueda con delay
      setTimeout(() => {
        const filtered = searchData.filter(item =>
          item.title.toLowerCase().includes(term.toLowerCase())
        );
        setResults(filtered);
        setIsLoading(false);
      }, 300);
    } else {
      setResults([]);
    }
  };

  const handleResultClick = result => {
    navigate(result.path);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getTypeIcon = type => {
    switch (type) {
      case 'page':
        return '📄';
      case 'product':
        return '📦';
      case 'user':
        return '👤';
      default:
        return '🔍';
    }
  };

  return (
    <div
      className="global-search"
      ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Buscar páginas, productos, usuarios... (Ctrl+K)"
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(searchTerm.length > 0)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      {isOpen && (
        <div className="search-results">
          {isLoading ? (
            <div className="search-loading">
              <div className="spinner"></div>
              <span>Buscando...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="results-list">
              <div className="results-header">
                <span>Resultados ({results.length})</span>
              </div>
              {results.map(result => (
                <div
                  key={result.id}
                  className="result-item"
                  onClick={() => handleResultClick(result)}>
                  <span className="result-icon">
                    {getTypeIcon(result.type)}
                  </span>
                  <div className="result-content">
                    <div className="result-title">{result.title}</div>
                    <div className="result-type">{result.type}</div>
                  </div>
                  <span className="result-arrow">→</span>
                </div>
              ))}
            </div>
          ) : searchTerm.length > 2 ? (
            <div className="no-results">
              <span>No se encontraron resultados</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

// Componente de Navegación con Tabs
const TabNavigation = ({ tabs, currentTab, onTabChange }) => {
  return (
    <div className="tab-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab ${currentTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}>
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
          {tab.badge && <span className="tab-badge">{tab.badge}</span>}
        </button>
      ))}
    </div>
  );
};

// Componente de Breadcrumbs Avanzado
const AdvancedBreadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { goBack } = useAdvancedNavigation();

  const pathSegments = location.pathname.split('/').filter(segment => segment);

  const breadcrumbMap = {
    dashboard: { label: 'Dashboard', icon: '📊' },
    productos: { label: 'Productos', icon: '📦' },
    usuarios: { label: 'Usuarios', icon: '👥' },
    configuracion: { label: 'Configuración', icon: '⚙️' },
    perfil: { label: 'Mi Perfil', icon: '👤' },
    reportes: { label: 'Reportes', icon: '📈' },
    categorias: { label: 'Categorías', icon: '📂' },
  };

  if (pathSegments.length === 0) return null;

  return (
    <div className="advanced-breadcrumbs">
      <button
        className="back-button"
        onClick={goBack}>
        ← Atrás
      </button>

      <nav className="breadcrumb-nav">
        <NavLink
          to="/"
          className="breadcrumb-item home">
          🏠 Inicio
        </NavLink>

        {pathSegments.map((segment, index) => {
          const path = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;
          const breadcrumb = breadcrumbMap[segment] || {
            label: segment,
            icon: '📄',
          };

          return (
            <React.Fragment key={path}>
              <span className="breadcrumb-separator">/</span>
              {isLast ? (
                <span className="breadcrumb-current">
                  <span className="breadcrumb-icon">{breadcrumb.icon}</span>
                  {breadcrumb.label}
                </span>
              ) : (
                <NavLink
                  to={path}
                  className="breadcrumb-item">
                  <span className="breadcrumb-icon">{breadcrumb.icon}</span>
                  {breadcrumb.label}
                </NavLink>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

// Componente de Sidebar con Menús Anidados
const AdvancedSidebar = ({ isOpen, onToggle }) => {
  const [expandedMenus, setExpandedMenus] = useState(new Set(['main']));
  const location = useLocation();

  const toggleMenu = menuId => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  const menuItems = [
    {
      id: 'main',
      label: 'Principal',
      icon: '📊',
      children: [
        { path: '/dashboard', label: 'Dashboard', icon: '📈' },
        { path: '/analytics', label: 'Analytics', icon: '📊' },
      ],
    },
    {
      id: 'inventory',
      label: 'Inventario',
      icon: '📦',
      children: [
        { path: '/productos', label: 'Productos', icon: '📦' },
        { path: '/productos/categorias', label: 'Categorías', icon: '📂' },
        { path: '/productos/stock', label: 'Control de Stock', icon: '📋' },
      ],
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: '👥',
      children: [
        { path: '/usuarios', label: 'Lista de Usuarios', icon: '👥' },
        { path: '/usuarios/roles', label: 'Roles y Permisos', icon: '🔐' },
        {
          path: '/usuarios/actividad',
          label: 'Registro de Actividad',
          icon: '📝',
        },
      ],
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: '📈',
      children: [
        { path: '/reportes/ventas', label: 'Ventas', icon: '💰' },
        { path: '/reportes/inventario', label: 'Inventario', icon: '📦' },
        { path: '/reportes/usuarios', label: 'Usuarios', icon: '👥' },
      ],
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: '⚙️',
      children: [
        { path: '/configuracion/perfil', label: 'Mi Perfil', icon: '👤' },
        { path: '/configuracion/sistema', label: 'Sistema', icon: '🖥️' },
        { path: '/configuracion/seguridad', label: 'Seguridad', icon: '🔒' },
      ],
    },
  ];

  return (
    <aside className={`advanced-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🚀</span>
          {isOpen && <span className="logo-text">Nav Pro</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={onToggle}>
          {isOpen ? '←' : '→'}
        </button>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map(menu => (
          <div
            key={menu.id}
            className="menu-group">
            <button
              className={`menu-header ${
                expandedMenus.has(menu.id) ? 'expanded' : ''
              }`}
              onClick={() => toggleMenu(menu.id)}>
              <span className="menu-icon">{menu.icon}</span>
              {isOpen && (
                <>
                  <span className="menu-label">{menu.label}</span>
                  <span className="expand-icon">
                    {expandedMenus.has(menu.id) ? '⌄' : '⌃'}
                  </span>
                </>
              )}
            </button>

            {(expandedMenus.has(menu.id) || !isOpen) && (
              <div className="menu-children">
                {menu.children.map(child => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    className={({ isActive }) =>
                      `menu-item ${isActive ? 'active' : ''}`
                    }>
                    <span className="item-icon">{child.icon}</span>
                    {isOpen && (
                      <span className="item-label">{child.label}</span>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">👤</div>
          {isOpen && (
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-role">Administrador</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

// Header con navegación avanzada
const AdvancedHeader = ({ onSidebarToggle, sidebarOpen }) => {
  const history = useNavigationHistory();
  const { goBack, goForward } = useAdvancedNavigation();

  return (
    <header className="advanced-header">
      <div className="header-left">
        <div className="navigation-controls">
          <button
            className="nav-control"
            onClick={goBack}
            title="Ir atrás">
            ←
          </button>
          <button
            className="nav-control"
            onClick={goForward}
            title="Ir adelante">
            →
          </button>
        </div>

        <GlobalSearch />
      </div>

      <div className="header-center">
        <AdvancedBreadcrumbs />
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button
            className="action-btn"
            title="Notificaciones">
            🔔
            <span className="notification-badge">3</span>
          </button>
          <button
            className="action-btn"
            title="Mensajes">
            💬
            <span className="notification-badge">5</span>
          </button>
          <button
            className="action-btn"
            title="Ayuda">
            ❓
          </button>
        </div>

        <div className="user-menu">
          <div className="user-avatar">👤</div>
          <div className="user-dropdown">
            <NavLink to="/configuracion/perfil">Mi Perfil</NavLink>
            <NavLink to="/configuracion">Configuración</NavLink>
            <button>Cerrar Sesión</button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Páginas de demostración
const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: '📊', badge: null },
    { id: 'analytics', label: 'Analytics', icon: '📈', badge: 'New' },
    { id: 'reports', label: 'Reportes', icon: '📄', badge: null },
    { id: 'settings', label: 'Configuración', icon: '⚙️', badge: null },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>📊 Dashboard Principal</h1>
        <div className="page-actions">
          <button className="btn-primary">+ Crear</button>
          <button className="btn-secondary">🔄 Actualizar</button>
        </div>
      </div>

      <TabNavigation
        tabs={tabs}
        currentTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Ventas Hoy</h3>
                <div className="stat-value">$45,230</div>
                <div className="stat-change positive">+12%</div>
              </div>
              <div className="stat-card">
                <h3>Usuarios Activos</h3>
                <div className="stat-value">1,234</div>
                <div className="stat-change positive">+5%</div>
              </div>
              <div className="stat-card">
                <h3>Productos</h3>
                <div className="stat-value">567</div>
                <div className="stat-change neutral">0%</div>
              </div>
              <div className="stat-card">
                <h3>Pedidos</h3>
                <div className="stat-value">89</div>
                <div className="stat-change negative">-3%</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-content">
            <h3>📈 Análisis Avanzado</h3>
            <p>Aquí irían los gráficos y análisis detallados.</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-content">
            <h3>📄 Reportes del Sistema</h3>
            <p>Lista de reportes disponibles.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-content">
            <h3>⚙️ Configuración del Dashboard</h3>
            <p>Personalizar la vista del dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductosPage = () => (
  <div className="productos-page">
    <h1>📦 Gestión de Productos</h1>
    <p>Sistema avanzado de gestión de productos con filtros y búsqueda.</p>
  </div>
);

const UsuariosPage = () => (
  <div className="usuarios-page">
    <h1>👥 Gestión de Usuarios</h1>
    <p>Administración completa de usuarios del sistema.</p>
  </div>
);

// Layout Principal
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className={`main-layout ${
        sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
      }`}>
      <AdvancedSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="layout-content">
        <AdvancedHeader
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="main-content">
          <Routes>
            <Route
              index
              element={<DashboardPage />}
            />
            <Route
              path="dashboard"
              element={<DashboardPage />}
            />
            <Route
              path="productos/*"
              element={<ProductosPage />}
            />
            <Route
              path="usuarios/*"
              element={<UsuariosPage />}
            />
            <Route
              path="configuracion/*"
              element={<div>Configuración</div>}
            />
            <Route
              path="reportes/*"
              element={<div>Reportes</div>}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// App principal
function App() {
  useEffect(() => {
    // Atajos de teclado
    const handleKeyDown = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-input')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/*"
            element={<MainLayout />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

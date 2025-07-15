// App.jsx - Sistema de Layouts Anidados (FASE CORE)
import React, { useState } from 'react';
import {
  NavLink,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import './App.css';

// Componente Breadcrumbs
const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  const breadcrumbMap = {
    '': 'Inicio',
    dashboard: 'Dashboard',
    productos: 'Productos',
    usuarios: 'Usuarios',
    configuracion: 'Configuración',
    perfil: 'Mi Perfil',
    ajustes: 'Ajustes',
    reportes: 'Reportes',
    crear: 'Crear',
    editar: 'Editar',
  };

  if (pathSegments.length === 0) return null;

  return (
    <nav className="breadcrumbs">
      <NavLink
        to="/"
        className="breadcrumb-item">
        🏠 Inicio
      </NavLink>
      {pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;
        const label = breadcrumbMap[segment] || segment;

        return (
          <React.Fragment key={path}>
            <span className="breadcrumb-separator"> / </span>
            {isLast ? (
              <span className="breadcrumb-current">{label}</span>
            ) : (
              <NavLink
                to={path}
                className="breadcrumb-item">
                {label}
              </NavLink>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// Layout Principal con Sidebar
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className={`main-layout ${
        sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
      }`}>
      {/* Header */}
      <header className="layout-header">
        <div className="header-left">
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}>
            {sidebarOpen ? '←' : '→'}
          </button>
          <h1 className="app-title">🏗️ Sistema de Layouts</h1>
        </div>
        <div className="header-right">
          <div className="user-menu">
            <span>👤 Usuario</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3>Principal</h3>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }>
              📊 Dashboard
            </NavLink>
          </div>

          <div className="nav-section">
            <h3>Gestión</h3>
            <NavLink
              to="/productos"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }>
              📦 Productos
            </NavLink>
            <NavLink
              to="/usuarios"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }>
              👥 Usuarios
            </NavLink>
          </div>

          <div className="nav-section">
            <h3>Sistema</h3>
            <NavLink
              to="/configuracion"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }>
              ⚙️ Configuración
            </NavLink>
          </div>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="layout-main">
        <div className="content-wrapper">
          <Breadcrumbs />
          <div className="page-content">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

// Layout para Dashboard
const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-header">
        <h2>📊 Panel de Control</h2>
        <div className="dashboard-actions">
          <button className="btn-refresh">🔄 Actualizar</button>
          <button className="btn-export">📁 Exportar</button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

// Layout para Productos
const ProductosLayout = () => {
  return (
    <div className="productos-layout">
      <div className="productos-header">
        <h2>📦 Gestión de Productos</h2>
        <NavLink
          to="/productos/crear"
          className="btn-crear">
          ➕ Nuevo Producto
        </NavLink>
      </div>
      <div className="productos-tabs">
        <NavLink
          to="/productos"
          className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
          end>
          Lista
        </NavLink>
        <NavLink
          to="/productos/categorias"
          className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
          Categorías
        </NavLink>
        <NavLink
          to="/productos/reportes"
          className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
          Reportes
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

// Layout para Configuración
const ConfiguracionLayout = () => {
  return (
    <div className="configuracion-layout">
      <div className="config-sidebar">
        <nav className="config-nav">
          <NavLink
            to="/configuracion/perfil"
            className={({ isActive }) =>
              `config-item ${isActive ? 'active' : ''}`
            }>
            👤 Perfil
          </NavLink>
          <NavLink
            to="/configuracion/ajustes"
            className={({ isActive }) =>
              `config-item ${isActive ? 'active' : ''}`
            }>
            ⚙️ Ajustes
          </NavLink>
          <NavLink
            to="/configuracion/seguridad"
            className={({ isActive }) =>
              `config-item ${isActive ? 'active' : ''}`
            }>
            🔒 Seguridad
          </NavLink>
        </nav>
      </div>
      <div className="config-content">
        <Outlet />
      </div>
    </div>
  );
};

// Páginas de Dashboard
const DashboardHome = () => (
  <div className="dashboard-content">
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Productos</h3>
        <div className="stat-number">1,234</div>
        <div className="stat-change positive">+12%</div>
      </div>
      <div className="stat-card">
        <h3>Usuarios Activos</h3>
        <div className="stat-number">567</div>
        <div className="stat-change positive">+8%</div>
      </div>
      <div className="stat-card">
        <h3>Ventas del Mes</h3>
        <div className="stat-number">$89,432</div>
        <div className="stat-change negative">-3%</div>
      </div>
      <div className="stat-card">
        <h3>Pedidos Pendientes</h3>
        <div className="stat-number">23</div>
        <div className="stat-change neutral">0%</div>
      </div>
    </div>

    <div className="dashboard-widgets">
      <div className="widget">
        <h4>📈 Gráfico de Ventas</h4>
        <div className="chart-placeholder">
          <p>Aquí iría un gráfico de ventas</p>
        </div>
      </div>
      <div className="widget">
        <h4>🎯 Objetivos del Mes</h4>
        <div className="objectives">
          <div className="objective">
            <span>Ventas</span>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: '75%' }}></div>
            </div>
            <span>75%</span>
          </div>
          <div className="objective">
            <span>Usuarios</span>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: '60%' }}></div>
            </div>
            <span>60%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Páginas de Productos
const ProductosList = () => (
  <div className="productos-list">
    <div className="list-header">
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar productos..."
        />
      </div>
      <div className="filters">
        <select>
          <option>Todas las categorías</option>
          <option>Laptops</option>
          <option>Smartphones</option>
          <option>Tablets</option>
        </select>
      </div>
    </div>

    <div className="productos-table">
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Laptop Dell Inspiron</td>
            <td>Laptops</td>
            <td>$2,500,000</td>
            <td>15</td>
            <td>
              <button className="btn-edit">✏️</button>
              <button className="btn-delete">🗑️</button>
            </td>
          </tr>
          <tr>
            <td>iPhone 15 Pro</td>
            <td>Smartphones</td>
            <td>$3,800,000</td>
            <td>8</td>
            <td>
              <button className="btn-edit">✏️</button>
              <button className="btn-delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const ProductosCategorias = () => (
  <div className="categorias-content">
    <h3>📂 Gestión de Categorías</h3>
    <div className="categorias-grid">
      <div className="categoria-card">
        <h4>💻 Laptops</h4>
        <p>25 productos</p>
        <button className="btn-edit">Editar</button>
      </div>
      <div className="categoria-card">
        <h4>📱 Smartphones</h4>
        <p>18 productos</p>
        <button className="btn-edit">Editar</button>
      </div>
      <div className="categoria-card">
        <h4>📱 Tablets</h4>
        <p>12 productos</p>
        <button className="btn-edit">Editar</button>
      </div>
    </div>
  </div>
);

const ProductosReportes = () => (
  <div className="reportes-content">
    <h3>📊 Reportes de Productos</h3>
    <div className="reportes-grid">
      <div className="reporte-card">
        <h4>Productos más vendidos</h4>
        <button className="btn-generar">Generar Reporte</button>
      </div>
      <div className="reporte-card">
        <h4>Stock bajo</h4>
        <button className="btn-generar">Generar Reporte</button>
      </div>
    </div>
  </div>
);

// Páginas de Usuarios
const UsuariosList = () => (
  <div className="usuarios-content">
    <h2>👥 Lista de Usuarios</h2>
    <div className="usuarios-table">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Juan Pérez</td>
            <td>juan@email.com</td>
            <td>Admin</td>
            <td>
              <span className="status activo">Activo</span>
            </td>
            <td>
              <button className="btn-edit">✏️</button>
              <button className="btn-delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// Páginas de Configuración
const ConfigPerfil = () => (
  <div className="config-page">
    <h3>👤 Mi Perfil</h3>
    <form className="config-form">
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          defaultValue="Usuario Admin"
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          defaultValue="admin@email.com"
        />
      </div>
      <button
        type="submit"
        className="btn-save">
        Guardar Cambios
      </button>
    </form>
  </div>
);

const ConfigAjustes = () => (
  <div className="config-page">
    <h3>⚙️ Ajustes del Sistema</h3>
    <div className="ajustes-grid">
      <div className="ajuste-item">
        <label>Tema:</label>
        <select>
          <option>Claro</option>
          <option>Oscuro</option>
        </select>
      </div>
      <div className="ajuste-item">
        <label>Idioma:</label>
        <select>
          <option>Español</option>
          <option>English</option>
        </select>
      </div>
    </div>
  </div>
);

const ConfigSeguridad = () => (
  <div className="config-page">
    <h3>🔒 Configuración de Seguridad</h3>
    <div className="seguridad-options">
      <div className="security-item">
        <h4>Cambiar Contraseña</h4>
        <button className="btn-action">Cambiar</button>
      </div>
      <div className="security-item">
        <h4>Autenticación de Dos Factores</h4>
        <button className="btn-action">Configurar</button>
      </div>
    </div>
  </div>
);

// Página 404
const PageNotFound = () => (
  <div className="page not-found">
    <h1>🚫 404 - Página No Encontrada</h1>
    <p>La página que buscas no existe.</p>
    <NavLink
      to="/dashboard"
      className="btn-home">
      🏠 Volver al Dashboard
    </NavLink>
  </div>
);

// App principal
function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Redirigir / a /dashboard */}
          <Route
            path="/"
            element={<MainLayout />}>
            <Route
              index
              element={<DashboardHome />}
            />

            {/* Rutas de Dashboard */}
            <Route
              path="dashboard"
              element={<DashboardLayout />}>
              <Route
                index
                element={<DashboardHome />}
              />
            </Route>

            {/* Rutas de Productos */}
            <Route
              path="productos"
              element={<ProductosLayout />}>
              <Route
                index
                element={<ProductosList />}
              />
              <Route
                path="categorias"
                element={<ProductosCategorias />}
              />
              <Route
                path="reportes"
                element={<ProductosReportes />}
              />
            </Route>

            {/* Rutas de Usuarios */}
            <Route
              path="usuarios"
              element={<UsuariosList />}
            />

            {/* Rutas de Configuración */}
            <Route
              path="configuracion"
              element={<ConfiguracionLayout />}>
              <Route
                index
                element={<ConfigPerfil />}
              />
              <Route
                path="perfil"
                element={<ConfigPerfil />}
              />
              <Route
                path="ajustes"
                element={<ConfigAjustes />}
              />
              <Route
                path="seguridad"
                element={<ConfigSeguridad />}
              />
            </Route>

            {/* Ruta 404 */}
            <Route
              path="*"
              element={<PageNotFound />}
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

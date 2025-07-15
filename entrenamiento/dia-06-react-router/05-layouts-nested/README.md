# 🏗️ Sección 5: Layouts Anidados (60 min)

**⏰ TIEMPO**: 4:30 PM - 5:30 PM (Post Break)  
**🎯 OBJETIVO**: Outlet, nested routes, layouts complejos

## ⚡ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Actividad                 |
| --------------- | --------- | ------------------------- |
| 🔧 **CORE**     | 0-25 min  | Outlet básico + layouts   |
| ⚡ **ENHANCED** | 25-45 min | Dashboard nested, sidebar |
| ✨ **POLISH**   | 45-60 min | Responsive, animations    |

## 🚀 IMPLEMENTACIÓN RÁPIDA

### 🔧 FASE CORE (25 min)

```jsx
// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

```jsx
// App.jsx - Rutas anidadas
<Routes>
  <Route
    path="/"
    element={<MainLayout />}>
    <Route
      index
      element={<Home />}
    />
    <Route
      path="productos"
      element={<Productos />}
    />
    <Route
      path="producto/:id"
      element={<ProductoDetalle />}
    />
    <Route
      path="nosotros"
      element={<Nosotros />}
    />
    <Route
      path="contacto"
      element={<Contacto />}
    />
  </Route>

  <Route
    path="/dashboard"
    element={<DashboardLayout />}>
    <Route
      index
      element={<DashboardHome />}
    />
    <Route
      path="productos"
      element={<DashboardProductos />}
    />
    <Route
      path="usuarios"
      element={<DashboardUsuarios />}
    />
  </Route>
</Routes>
```

### ⚡ FASE ENHANCED (20 min)

```jsx
// src/layouts/DashboardLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>📊 Dashboard</h3>
          <p>Hola, {user?.name}</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            end>
            🏠 Inicio
          </NavLink>
          <NavLink to="/dashboard/productos">📦 Productos</NavLink>
          <NavLink to="/dashboard/usuarios">👥 Usuarios</NavLink>
          <NavLink to="/dashboard/reportes">📈 Reportes</NavLink>
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={logout}
            className="logout-btn">
            🚪 Salir
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Panel de Control</h1>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

```jsx
// src/pages/dashboard/DashboardProductos.jsx
import { Outlet, useLocation } from 'react-router-dom';

export default function DashboardProductos() {
  const location = useLocation();
  const isIndex = location.pathname === '/dashboard/productos';

  return (
    <div className="dashboard-productos">
      <div className="page-header">
        <h2>📦 Gestión de Productos</h2>
        <div className="actions">
          <button className="btn-primary">+ Nuevo Producto</button>
        </div>
      </div>

      {isIndex ? (
        <div className="productos-grid">
          <div className="product-card">Producto 1</div>
          <div className="product-card">Producto 2</div>
          <div className="product-card">Producto 3</div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
```

### ✨ FASE POLISH (15 min)

```css
/* src/styles/layouts.css - Responsive layouts */
.dashboard-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #1f2937;
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-nav a {
  display: block;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
}

.sidebar-nav a:hover,
.sidebar-nav a.active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.dashboard-main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .sidebar {
    order: 2;
    flex-direction: row;
    overflow-x: auto;
  }

  .sidebar-nav {
    display: flex;
  }
}
```

```jsx
// src/components/BreadcrumbsNested.jsx - Breadcrumbs para nested routes
import { Link, useLocation } from 'react-router-dom';

export default function BreadcrumbsNested() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbLabels = {
    dashboard: '📊 Dashboard',
    productos: '📦 Productos',
    usuarios: '👥 Usuarios',
    reportes: '📈 Reportes',
  };

  return (
    <nav className="breadcrumbs-nested">
      <Link to="/">🏠 Inicio</Link>
      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = breadcrumbLabels[pathname] || pathname;

        return (
          <span key={routeTo}>
            <span className="separator"> / </span>
            {isLast ? (
              <span className="current">{label}</span>
            ) : (
              <Link to={routeTo}>{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
```

## ✅ VALIDACIÓN RÁPIDA

- [ ] ✅ Outlet funcionando correctamente
- [ ] ✅ Layouts anidados navegables
- [ ] ✅ Dashboard con sidebar
- [ ] ✅ Breadcrumbs para nested routes
- [ ] ✅ Responsive design implementado
- [ ] ✅ Transiciones y UX pulidas

**¡Listo para Proyecto Final! 🚀**

# 🏗️ Sección 4: Layout System (60 min)

**⏰ TIEMPO**: 3:15 PM - 4:15 PM  
**🎯 OBJETIVO**: Outlet, layouts anidados y estructura escalable

## ⚡ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Actividad                  |
| --------------- | --------- | -------------------------- |
| 🔧 **CORE**     | 0-25 min  | Outlet básico + MainLayout |
| ⚡ **ENHANCED** | 25-45 min | Dashboard layout + sidebar |
| ✨ **POLISH**   | 45-60 min | Responsive + breadcrumbs   |

## 🚀 IMPLEMENTACIÓN RÁPIDA

### 🔧 FASE CORE (25 min) - OUTLET Y LAYOUTS

```jsx
// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main
        style={{
          flex: 1,
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
```

```jsx
// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthStatus from './AuthStatus';

export default function Navbar() {
  return (
    <nav
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link
          to="/"
          style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textDecoration: 'none',
          }}>
          🚀 Mi App
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link
            to="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
            }}>
            🏠 Inicio
          </Link>
          <Link
            to="/productos"
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
            }}>
            📦 Productos
          </Link>
        </div>
      </div>

      <AuthStatus />
    </nav>
  );
}
```

```jsx
// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer
      style={{
        background: '#f8f9fa',
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid #dee2e6',
        marginTop: 'auto',
      }}>
      <p>&copy; 2025 React Router Fundamentos - WorldSkills Training</p>
      <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
        Día 5 - Layout System implementado
      </p>
    </footer>
  );
}
```

**App.jsx con layouts anidados:**

```jsx
// src/App.jsx - Con layouts
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas con MainLayout */}
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
          </Route>

          {/* Rutas de auth sin layout */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

### ⚡ FASE ENHANCED (20 min) - DASHBOARD LAYOUT

```jsx
// src/layouts/DashboardLayout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
        minHeight: '100vh',
      }}>
      {/* Sidebar */}
      <aside
        style={{
          background: '#2c3e50',
          color: 'white',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>📊 Dashboard</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
            {user.name}
          </p>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link
                to="/dashboard"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  transition: 'background 0.3s',
                }}>
                🏠 Inicio
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link
                to="/dashboard/perfil"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  padding: '0.75rem',
                  borderRadius: '4px',
                }}>
                👤 Mi Perfil
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link
                to="/dashboard/configuracion"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  padding: '0.75rem',
                  borderRadius: '4px',
                }}>
                ⚙️ Configuración
              </Link>
            </li>
            {user.role === 'admin' && (
              <li style={{ marginBottom: '0.5rem' }}>
                <Link
                  to="/dashboard/admin"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    display: 'block',
                    padding: '0.75rem',
                    borderRadius: '4px',
                  }}>
                  👑 Admin Panel
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '1rem',
          }}>
          <Link
            to="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              display: 'block',
              padding: '0.5rem',
              marginBottom: '0.5rem',
            }}>
            🏠 Ir al sitio
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '4px',
              width: '100%',
              cursor: 'pointer',
            }}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          padding: '2rem',
          background: '#f8f9fa',
          overflow: 'auto',
        }}>
        <Outlet />
      </main>
    </div>
  );
}
```

**Actualizar App.jsx con DashboardLayout:**

```jsx
// Agregar rutas anidadas para dashboard
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  }>
  <Route
    index
    element={<DashboardHome />}
  />
  <Route
    path="perfil"
    element={<DashboardPerfil />}
  />
  <Route
    path="configuracion"
    element={<DashboardConfig />}
  />
  <Route
    path="admin"
    element={<DashboardAdmin />}
  />
</Route>
```

### ✨ FASE POLISH (15 min) - RESPONSIVE Y BREADCRUMBS

```jsx
// src/components/Breadcrumbs.jsx
import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbNames = {
    productos: '📦 Productos',
    producto: '📦 Producto',
    dashboard: '📊 Dashboard',
    perfil: '👤 Perfil',
    configuracion: '⚙️ Configuración',
    admin: '👑 Admin',
  };

  return (
    <nav
      style={{
        padding: '1rem 0',
        fontSize: '0.9rem',
        color: '#6c757d',
      }}>
      <Link
        to="/"
        style={{ color: '#007bff', textDecoration: 'none' }}>
        🏠 Inicio
      </Link>

      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = breadcrumbNames[pathname] || pathname;

        return (
          <span key={routeTo}>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            {isLast ? (
              <span style={{ color: '#6c757d' }}>{displayName}</span>
            ) : (
              <Link
                to={routeTo}
                style={{ color: '#007bff', textDecoration: 'none' }}>
                {displayName}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
```

```css
/* src/layouts/responsive.css */
/* Responsive para DashboardLayout */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr !important;
    grid-template-rows: auto 1fr;
  }

  .dashboard-sidebar {
    order: 2;
    padding: 1rem !important;
  }

  .dashboard-main {
    order: 1;
    padding: 1rem !important;
  }

  .sidebar-nav {
    display: flex !important;
    overflow-x: auto;
    gap: 0.5rem;
  }

  .sidebar-nav li {
    margin-bottom: 0 !important;
    white-space: nowrap;
  }
}
```

## ✅ VALIDACIÓN (5 min finales)

### Checklist Obligatorio:

- [ ] ✅ Outlet funcionando correctamente en MainLayout
- [ ] ✅ Navegación entre layouts sin problemas
- [ ] ✅ DashboardLayout con sidebar funcional
- [ ] ✅ Breadcrumbs mostrando ruta actual
- [ ] ✅ Responsive design para móvil
- [ ] ✅ Rutas anidadas navegables
- [ ] ✅ Transición fluida entre layouts

### Test Rápido:

1. **Layouts**: Navegar entre rutas públicas y dashboard
2. **Outlet**: Verificar que el contenido cambia correctamente
3. **Sidebar**: Probar navegación en dashboard
4. **Breadcrumbs**: Verificar en diferentes rutas
5. **Responsive**: Probar en móvil (DevTools)

## 🎯 RESULTADO ESPERADO

**Al final de 60 minutos:**

- ✅ **Sistema de layouts** completamente funcional
- ✅ **Outlet implementation** correcta para rutas anidadas
- ✅ **Dashboard layout** profesional con sidebar
- ✅ **Breadcrumbs automáticos** basados en URL
- ✅ **Responsive design** funcional en móvil
- ✅ **Arquitectura escalable** para proyectos grandes

---

**🎯 LOGRO**: Layout System dominado ✅  
**➡️ SIGUIENTE**: Sección 5 - Navegación Pro (4:30 PM - Post Break)

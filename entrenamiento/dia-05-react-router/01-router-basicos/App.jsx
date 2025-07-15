# 🎯 Router Básicos - App Principal

## FASE CORE ✅ (20 minutos) - Setup y Navegación Básica

```jsx
// App.jsx - Configuración básica de React Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Componentes de páginas básicas
const Home = () => (
  <div className="page">
    <h1>🏠 Página de Inicio</h1>
    <p>Bienvenido al sistema de navegación básico</p>
    <div className="stats">
      <div className="stat-card">
        <h3>Productos</h3>
        <p>150+ disponibles</p>
      </div>
      <div className="stat-card">
        <h3>Usuarios</h3>
        <p>500+ registrados</p>
      </div>
    </div>
  </div>
);

const Productos = () => (
  <div className="page">
    <h1>📦 Productos</h1>
    <div className="productos-grid">
      <div className="producto-card">
        <h3>Laptop Dell</h3>
        <p>$2,500,000</p>
      </div>
      <div className="producto-card">
        <h3>iPhone 15</h3>
        <p>$3,800,000</p>
      </div>
      <div className="producto-card">
        <h3>Samsung Galaxy</h3>
        <p>$2,800,000</p>
      </div>
    </div>
  </div>
);

const Usuarios = () => (
  <div className="page">
    <h1>👥 Usuarios</h1>
    <div className="usuarios-lista">
      <div className="usuario-item">
        <span>Juan Pérez</span>
        <span>juan@email.com</span>
      </div>
      <div className="usuario-item">
        <span>María García</span>
        <span>maria@email.com</span>
      </div>
      <div className="usuario-item">
        <span>Carlos López</span>
        <span>carlos@email.com</span>
      </div>
    </div>
  </div>
);

const Contacto = () => (
  <div className="page">
    <h1>📞 Contacto</h1>
    <div className="contacto-info">
      <p><strong>Teléfono:</strong> +57 300 123 4567</p>
      <p><strong>Email:</strong> info@empresa.com</p>
      <p><strong>Dirección:</strong> Calle 123 #45-67, Bogotá</p>
    </div>
    <form className="contacto-form">
      <div className="form-group">
        <label>Nombre:</label>
        <input type="text" placeholder="Tu nombre" />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" placeholder="tu@email.com" />
      </div>
      <div className="form-group">
        <label>Mensaje:</label>
        <textarea placeholder="Tu mensaje"></textarea>
      </div>
      <button type="submit" className="btn-enviar">Enviar</button>
    </form>
  </div>
);

// Navbar básica
const Navbar = () => (
  <nav className="navbar">
    <div className="nav-brand">
      <Link to="/">🚀 Mi App</Link>
    </div>
    <div className="nav-links">
      <Link to="/" className="nav-link">Inicio</Link>
      <Link to="/productos" className="nav-link">Productos</Link>
      <Link to="/usuarios" className="nav-link">Usuarios</Link>
      <Link to="/contacto" className="nav-link">Contacto</Link>
    </div>
  </nav>
);

// App principal
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2025 WorldSkills Training. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
```

## FASE ENHANCED ⚡ (25 minutos) - NavLink activo y 404

```jsx
// App.jsx - Versión mejorada con NavLink y manejo de 404
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';

// Página 404 personalizada
const PageNotFound = () => (
  <div className="page not-found">
    <h1>🚫 404 - Página No Encontrada</h1>
    <p>La página que buscas no existe.</p>
    <NavLink to="/" className="btn-home">🏠 Volver al Inicio</NavLink>
  </div>
);

// Navbar mejorada con NavLink activo
const Navbar = () => (
  <nav className="navbar">
    <div className="nav-brand">
      <NavLink to="/">🚀 Mi App</NavLink>
    </div>
    <div className="nav-links">
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        end
      >
        Inicio
      </NavLink>
      <NavLink 
        to="/productos" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Productos
      </NavLink>
      <NavLink 
        to="/usuarios" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Usuarios
      </NavLink>
      <NavLink 
        to="/contacto" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Contacto
      </NavLink>
    </div>
  </nav>
);

// App mejorada
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/contacto" element={<Contacto />} />
            {/* Ruta 404 - debe ir al final */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2025 WorldSkills Training. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
```

## FASE POLISH ✨ (15 minutos) - Breadcrumbs y Loading

```jsx
// components/Breadcrumbs.jsx - Componente de migas de pan
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  const breadcrumbMap = {
    '': 'Inicio',
    'productos': 'Productos',
    'usuarios': 'Usuarios',
    'contacto': 'Contacto'
  };

  return (
    <nav className="breadcrumbs">
      <NavLink to="/" className="breadcrumb-item">
        🏠 Inicio
      </NavLink>
      {pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;
        
        return (
          <React.Fragment key={path}>
            <span className="breadcrumb-separator"> / </span>
            {isLast ? (
              <span className="breadcrumb-current">
                {breadcrumbMap[segment] || segment}
              </span>
            ) : (
              <NavLink to={path} className="breadcrumb-item">
                {breadcrumbMap[segment] || segment}
              </NavLink>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
```

📝 **Notas de Implementación MVP:**
- **Prioridad 1**: Router básico funcionando (CORE)
- **Prioridad 2**: NavLink activo y 404 (ENHANCED)  
- **Prioridad 3**: Breadcrumbs y UX polish (POLISH)

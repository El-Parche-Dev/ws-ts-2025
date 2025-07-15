# ⚡ Sección 2: Navegación Profesional (60 min)

**⏰ TIEMPO**: 1:00 PM - 2:00 PM  
**🎯 OBJETIVO**: Navegación avanzada nivel WorldSkills

## ⚡ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Actividad                  |
| --------------- | --------- | -------------------------- |
| 🔧 **CORE**     | 0-25 min  | NavLink, navegación activa |
| ⚡ **ENHANCED** | 25-45 min | Breadcrumbs, search params |
| ✨ **POLISH**   | 45-60 min | Animaciones, UX avanzado   |

## 🚀 IMPLEMENTACIÓN RÁPIDA

### 🔧 FASE CORE (25 min) - NAVEGACIÓN ACTIVA

```jsx
// src/components/Navbar.jsx - Navegación profesional
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <NavLink to="/">🚀 Mi SPA</NavLink>
      </div>

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }>
          🏠 Inicio
        </NavLink>

        <NavLink
          to="/productos"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }>
          📦 Productos
        </NavLink>

        <NavLink
          to="/nosotros"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }>
          ℹ️ Nosotros
        </NavLink>

        <NavLink
          to="/contacto"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }>
          📧 Contacto
        </NavLink>
      </div>
    </nav>
  );
}
```

```css
/* src/styles.css - Estilos de navegación */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #2563eb;
  color: white;
}

.nav-brand a {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}
```

### ⚡ FASE ENHANCED (20 min) - BREADCRUMBS Y SEARCH

```jsx
// src/components/Breadcrumbs.jsx
import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav className="breadcrumbs">
      <Link to="/">🏠 Inicio</Link>
      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <span key={routeTo}>
            <span className="separator"> / </span>
            {isLast ? (
              <span className="current">{pathname}</span>
            ) : (
              <Link to={routeTo}>{pathname}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
```

```jsx
// src/pages/Search.jsx - Búsqueda con query params
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      // Simular búsqueda
      const mockResults = ['Producto 1', 'Producto 2', 'Servicio A'].filter(
        item => item.toLowerCase().includes(query.toLowerCase())
      );
      setResults(mockResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = e => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  return (
    <div className="search-page">
      <h1>🔍 Búsqueda</h1>

      <form
        onSubmit={handleSearch}
        className="search-form">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="search-input"
        />
        <button
          type="submit"
          className="search-btn">
          Buscar
        </button>
      </form>

      {results.length > 0 && (
        <div className="results">
          <h3>Resultados para "{query}":</h3>
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### ✨ FASE POLISH (15 min) - UX AVANZADO

```jsx
// src/components/NavbarWithSearch.jsx - Navegación completa
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function NavbarWithSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar-advanced">
      <div className="nav-brand">
        <NavLink to="/">🚀 WorldSkills SPA</NavLink>
      </div>

      <form
        onSubmit={handleSearch}
        className="nav-search">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input-nav"
        />
        <button
          type="submit"
          className="search-btn-nav">
          🔍
        </button>
      </form>

      <div className="nav-links">
        <NavLink
          to="/"
          end>
          Inicio
        </NavLink>
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/nosotros">Nosotros</NavLink>
        <NavLink to="/contacto">Contacto</NavLink>
      </div>
    </nav>
  );
}
```

```jsx
// src/hooks/useNavigation.js - Hook personalizado
import { useNavigate, useLocation } from 'react-router-dom';

export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => navigate(-1);
  const goForward = () => navigate(1);
  const goHome = () => navigate('/');

  const isActive = path => location.pathname === path;

  const navigateWithQuery = (path, params) => {
    const searchParams = new URLSearchParams(params);
    navigate(`${path}?${searchParams}`);
  };

  return {
    navigate,
    location,
    goBack,
    goForward,
    goHome,
    isActive,
    navigateWithQuery,
  };
}
```

## ✅ VALIDACIÓN (5 min finales)

### Checklist Obligatorio:

- [ ] ✅ NavLink con estados activos
- [ ] ✅ Breadcrumbs funcionando
- [ ] ✅ Búsqueda con query params
- [ ] ✅ Hook personalizado useNavigation
- [ ] ✅ Animaciones de transición
- [ ] ✅ Responsive en móvil
- [ ] ✅ UX pulida y profesional

### Test Rápido:

1. Navegación activa marcando la página actual
2. Breadcrumbs mostrando ruta correcta
3. Búsqueda funcionando con URL params
4. Navegación responsive en móvil

## 🎯 RESULTADO ESPERADO

**Al final de 60 minutos:**

- ✅ Navegación profesional nivel WorldSkills
- ✅ Estados activos y feedback visual
- ✅ Breadcrumbs automáticos
- ✅ Búsqueda integrada con URL
- ✅ Hooks personalizados reutilizables

**¡Listo para Sección 3! 📊**

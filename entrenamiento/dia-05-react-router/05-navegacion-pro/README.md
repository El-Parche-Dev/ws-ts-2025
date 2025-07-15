# ✨ Sección 5: Navegación Pro (60 min)

**⏰ TIEMPO**: 4:30 PM - 5:30 PM (Post Break 15 min)  
**🎯 OBJETIVO**: NavLink avanzado, search params y UX profesional

## ⚡ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Actividad                 |
| --------------- | --------- | ------------------------- |
| 🔧 **CORE**     | 0-25 min  | NavLink + estados activos |
| ⚡ **ENHANCED** | 25-45 min | Search params + filtros   |
| ✨ **POLISH**   | 45-60 min | Animaciones + UX avanzado |

## 🚀 IMPLEMENTACIÓN RÁPIDA

### 🔧 FASE CORE (25 min) - NAVLINK PROFESIONAL

```jsx
// src/components/NavbarPro.jsx
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavbarPro() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navLinkStyle = ({ isActive }) => ({
    color: 'white',
    textDecoration: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
    border: isActive
      ? '1px solid rgba(255,255,255,0.3)'
      : '1px solid transparent',
  });

  return (
    <nav
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <NavLink
          to="/"
          style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textDecoration: 'none',
          }}>
          🚀 Router Pro
        </NavLink>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <NavLink
            to="/"
            end
            style={navLinkStyle}>
            🏠 Inicio
          </NavLink>
          <NavLink
            to="/productos"
            style={navLinkStyle}>
            📦 Productos
          </NavLink>
          <NavLink
            to="/buscar"
            style={navLinkStyle}>
            🔍 Buscar
          </NavLink>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isAuthenticated() ? (
          <>
            <span style={{ color: 'white', fontSize: '0.9rem' }}>
              👤 {user.name}
            </span>
            <NavLink
              to="/dashboard"
              style={navLinkStyle}>
              📊 Dashboard
            </NavLink>
          </>
        ) : (
          <NavLink
            to="/login"
            style={navLinkStyle}>
            🔑 Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
```

```jsx
// src/pages/Buscar.jsx
import { useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const productos = [
  { id: 1, nombre: 'Laptop Gaming', categoria: 'computadoras', precio: 1200 },
  { id: 2, nombre: 'Mouse Gaming RGB', categoria: 'accesorios', precio: 45 },
  { id: 3, nombre: 'Teclado Mecánico', categoria: 'accesorios', precio: 80 },
  { id: 4, nombre: 'Monitor 4K', categoria: 'computadoras', precio: 300 },
  { id: 5, nombre: 'Webcam HD', categoria: 'accesorios', precio: 60 },
];

export default function Buscar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [categoria, setCategoria] = useState(
    searchParams.get('categoria') || ''
  );
  const [resultados, setResultados] = useState(productos);

  useEffect(() => {
    let filtered = productos;

    if (query) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (categoria) {
      filtered = filtered.filter(producto => producto.categoria === categoria);
    }

    setResultados(filtered);
  }, [query, categoria]);

  const handleBuscar = e => {
    e.preventDefault();
    const params = {};
    if (query) params.q = query;
    if (categoria) params.categoria = categoria;
    setSearchParams(params);
  };

  const limpiarFiltros = () => {
    setQuery('');
    setCategoria('');
    setSearchParams({});
  };

  return (
    <div>
      <h1>🔍 Buscar Productos</h1>

      <form
        onSubmit={handleBuscar}
        style={{
          background: '#f8f9fa',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr auto auto',
            gap: '1rem',
            alignItems: 'end',
          }}>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
              }}>
              Buscar por nombre:
            </label>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ej: laptop, mouse..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
              }}>
              Categoría:
            </label>
            <select
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}>
              <option value="">Todas las categorías</option>
              <option value="computadoras">Computadoras</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              background: '#007bff',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
            🔍 Buscar
          </button>

          <button
            type="button"
            onClick={limpiarFiltros}
            style={{
              background: '#6c757d',
              color: 'white',
              padding: '0.75rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
            🗑️ Limpiar
          </button>
        </div>
      </form>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
          {resultados.length > 0
            ? `Mostrando ${resultados.length} resultado(s)`
            : 'No se encontraron productos'}
          {(query || categoria) && (
            <span>
              {' '}
              para: {query && `"${query}"`} {categoria && `categoría "${categoria}"`}
            </span>
          )}
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {resultados.map(producto => (
          <div
            key={producto.id}
            style={{
              border: '1px solid #ddd',
              padding: '1.5rem',
              borderRadius: '8px',
              background: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{producto.nombre}</h3>
                <p
                  style={{
                    margin: '0 0 0.5rem 0',
                    color: '#6c757d',
                    fontSize: '0.9rem',
                  }}>
                  Categoría: {producto.categoria}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#28a745',
                  }}>
                  ${producto.precio}
                </p>
              </div>
              <Link
                to={`/producto/${producto.id}`}
                style={{
                  background: '#007bff',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  textDecoration: 'none',
                  borderRadius: '4px',
                }}>
                Ver Detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### ⚡ FASE ENHANCED (20 min) - SEARCH PARAMS AVANZADO

```jsx
// src/hooks/useSearch.js
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    const obj = {};
    for (const [key, value] of searchParams.entries()) {
      obj[key] = value;
    }
    return obj;
  }, [searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const updateParams = updates => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const clearParams = () => {
    setSearchParams({});
  };

  return {
    params,
    updateParam,
    updateParams,
    clearParams,
  };
}
```

```jsx
// src/components/ProductFilter.jsx
import { useSearch } from '../hooks/useSearch';

export default function ProductFilter() {
  const { params, updateParam, clearParams } = useSearch();

  return (
    <div
      style={{
        background: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
      }}>
      <h3 style={{ marginTop: 0 }}>🔧 Filtros</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
            }}>
            Ordenar por:
          </label>
          <select
            value={params.orden || ''}
            onChange={e => updateParam('orden', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}>
            <option value="">Sin ordenar</option>
            <option value="nombre">Nombre A-Z</option>
            <option value="precio-asc">Precio menor a mayor</option>
            <option value="precio-desc">Precio mayor a menor</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
            }}>
            Precio máximo:
          </label>
          <input
            type="number"
            value={params.maxPrecio || ''}
            onChange={e => updateParam('maxPrecio', e.target.value)}
            placeholder="Ej: 500"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'end' }}>
          <button
            onClick={clearParams}
            style={{
              background: '#dc3545',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
            }}>
            🗑️ Limpiar Filtros
          </button>
        </div>
      </div>

      {Object.keys(params).length > 0 && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'white',
            borderRadius: '4px',
          }}>
          <p
            style={{
              margin: '0 0 0.5rem 0',
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}>
            Filtros activos:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.entries(params).map(([key, value]) => (
              <span
                key={key}
                style={{
                  background: '#007bff',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                }}>
                {key}: {value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### ✨ FASE POLISH (15 min) - ANIMACIONES Y UX

```jsx
// src/components/PageTransition.jsx
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (transitionStage === 'fadeOut') {
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [transitionStage, location]);

  return (
    <div
      style={{
        opacity: transitionStage === 'fadeOut' ? 0 : 1,
        transition: 'opacity 150ms ease-in-out',
        minHeight: '50vh',
      }}>
      {children}
    </div>
  );
}
```

```jsx
// src/components/LoadingBar.jsx
import { useNavigation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function LoadingBar() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (navigation.state === 'loading') {
      setProgress(30);
      const timer = setTimeout(() => setProgress(70), 100);
      return () => clearTimeout(timer);
    } else if (navigation.state === 'idle') {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 200);
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);

  if (progress === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: 'rgba(0,123,255,0.1)',
        zIndex: 9999,
      }}>
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #007bff, #28a745)',
          transition: 'width 0.3s ease',
          boxShadow: '0 0 10px rgba(0,123,255,0.5)',
        }}
      />
    </div>
  );
}
```

```jsx
// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return null;
}
```

## ✅ VALIDACIÓN (5 min finales)

### Checklist Obligatorio

- [ ] ✅ NavLink con estados activos funcionando
- [ ] ✅ Search params implementados correctamente
- [ ] ✅ Filtros dinámicos operativos
- [ ] ✅ Custom hooks para search implementados
- [ ] ✅ Transiciones de página suaves
- [ ] ✅ Loading states y feedback visual
- [ ] ✅ UX profesional y pulida

### Test Rápido

1. **NavLink**: Verificar estados activos en navegación
2. **Search**: Probar búsqueda con query params
3. **Filters**: Aplicar y limpiar filtros
4. **Transitions**: Navegación suave entre páginas
5. **Responsive**: Verificar en móvil

## 🎯 RESULTADO ESPERADO

**Al final de 60 minutos:**

- ✅ **Navegación profesional** con estados activos
- ✅ **Search functionality** completa con URL params
- ✅ **Sistema de filtros** dinámico y funcional
- ✅ **Custom hooks** reutilizables implementados
- ✅ **Animaciones suaves** y transiciones UX
- ✅ **Loading states** y feedback profesional

---

**🎯 LOGRO**: Navegación Pro dominada ✅  
**➡️ SIGUIENTE**: Sección 6 - Integración Final (5:30 PM)

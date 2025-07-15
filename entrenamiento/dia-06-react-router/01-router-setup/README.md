# 🔧 Sección 1: Router Setup (60 min)

**⏰ TIEMPO**: 12:00 PM - 1:00 PM  
**🎯 OBJETIVO**: Router funcional en 60 minutos exactos

## ⚡ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Actividad                    |
| --------------- | --------- | ---------------------------- |
| 🔧 **CORE**     | 0-25 min  | Setup básico + navegación    |
| ⚡ **ENHANCED** | 25-45 min | 404, useNavigate, validación |
| ✨ **POLISH**   | 45-60 min | Lazy loading, optimización   |

## 🚀 IMPLEMENTACIÓN RÁPIDA

### 📦 1. Setup Inmediato (5 min)

```bash
# Crear proyecto
npm create vite@latest router-setup -- --template react
cd router-setup
npm install
npm install react-router-dom

# Iniciar desarrollo
npm run dev
```

### 🔧 2. FASE CORE (25 min) - FUNCIONALIDAD BÁSICA

**Crear estructura mínima:**

```jsx
// src/App.jsx - Router base funcional
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <a href="/">Home</a> |<a href="/about">About</a> |
        <a href="/products">Products</a>
      </nav>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/about"
          element={<About />}
        />
        <Route
          path="/products"
          element={<Products />}
        />
      </Routes>
    </BrowserRouter>
  );
}
```

**Páginas mínimas:**

```jsx
// src/pages/Home.jsx
export default function Home() {
  return <h1>🏠 Home Page</h1>;
}

// src/pages/About.jsx
export default function About() {
  return <h1>ℹ️ About Page</h1>;
}

// src/pages/Products.jsx
export default function Products() {
  return <h1>📦 Products Page</h1>;
}
```

### ⚡ 3. FASE ENHANCED (20 min) - NAVEGACIÓN PROFESIONAL

```jsx
// Mejorar App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/products">Products</Link>
      </nav>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/about"
          element={<About />}
        />
        <Route
          path="/products"
          element={<Products />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}
```

```jsx
// src/pages/NotFound.jsx
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>❌ 404 - Página no encontrada</h1>
      <button onClick={() => navigate('/')}>🏠 Volver al inicio</button>
    </div>
  );
}
```

### ✨ 4. FASE POLISH (15 min) - OPTIMIZACIÓN

```jsx
// src/App.jsx - Con lazy loading
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Lazy loading para optimización
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Products = React.lazy(() => import('./pages/Products'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/products">Products</Link>
      </nav>

      <Suspense fallback={<div>⏳ Cargando...</div>}>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/about"
            element={<About />}
          />
          <Route
            path="/products"
            element={<Products />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## ✅ VALIDACIÓN (5 min finales)

### Checklist Obligatorio:

- [ ] ✅ Router configurado y navegando
- [ ] ✅ 3+ páginas funcionando
- [ ] ✅ Links con `Link` component (no `<a>`)
- [ ] ✅ 404 page implementada
- [ ] ✅ useNavigate funcionando
- [ ] ✅ Lazy loading aplicado
- [ ] ✅ Sin errores en consola

### Test Rápido:

1. Navegar entre todas las páginas
2. Probar URL inexistente (404)
3. Usar botón "Volver" del navegador
4. Verificar que lazy loading funciona

## 🎯 RESULTADO ESPERADO

**Al final de 60 minutos:**

- ✅ SPA funcional con React Router
- ✅ Navegación profesional sin recargas
- ✅ Manejo de errores 404
- ✅ Optimización con lazy loading
- ✅ Base sólida para secciones siguientes

**¡Listo para Sección 2! ⚡**

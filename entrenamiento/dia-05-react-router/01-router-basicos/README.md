# 🔧 Sección 1: Router Básicos (60 min)

**⏰ TIEMPO**: 12:00 PM - 1:00 PM  
**🎯 OBJETIVO**: Setup React Router funcional y navegación básica

## ⚡ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Actividad                         |
| --------------- | --------- | --------------------------------- |
| 🔧 **CORE**     | 0-25 min  | Setup + rutas básicas funcionando |
| ⚡ **ENHANCED** | 25-45 min | Link components + 404 page        |
| ✨ **POLISH**   | 45-60 min | Navigation styling + validation   |

## 🚀 IMPLEMENTACIÓN RÁPIDA

### 📦 1. Setup Inmediato (5 min)

```bash
# Crear proyecto base
npm create vite@latest router-fundamentos -- --template react
cd router-fundamentos
npm install
npm install react-router-dom

# Iniciar desarrollo
npm run dev
```

### 🔧 2. FASE CORE (25 min) - ROUTER FUNCIONANDO

**App.jsx - Router mínimo funcional:**

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
        <a
          href="/"
          style={{ marginRight: '1rem' }}>
          Home
        </a>
        <a
          href="/about"
          style={{ marginRight: '1rem' }}>
          About
        </a>
        <a href="/contact">Contact</a>
      </nav>

      <main style={{ padding: '2rem' }}>
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
            path="/contact"
            element={<Contact />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
```

**Páginas básicas (10 min):**

```jsx
// src/pages/Home.jsx
export default function Home() {
  return (
    <div>
      <h1>🏠 Página de Inicio</h1>
      <p>Bienvenido a nuestra aplicación React Router.</p>
    </div>
  );
}

// src/pages/About.jsx
export default function About() {
  return (
    <div>
      <h1>ℹ️ Acerca de Nosotros</h1>
      <p>Información sobre nuestra empresa.</p>
    </div>
  );
}

// src/pages/Contact.jsx
export default function Contact() {
  return (
    <div>
      <h1>📧 Contacto</h1>
      <p>Ponte en contacto con nosotros.</p>
    </div>
  );
}
```

### ⚡ 3. FASE ENHANCED (20 min) - NAVEGACIÓN PROFESIONAL

```jsx
// src/App.jsx - Con Link components
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link
          to="/"
          className="nav-link">
          🏠 Home
        </Link>
        <Link
          to="/about"
          className="nav-link">
          ℹ️ About
        </Link>
        <Link
          to="/contact"
          className="nav-link">
          📧 Contact
        </Link>
      </nav>

      <main className="main-content">
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
            path="/contact"
            element={<Contact />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
```

```jsx
// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <h1>❌ 404 - Página No Encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link
        to="/"
        style={{
          background: '#007bff',
          color: 'white',
          padding: '0.5rem 1rem',
          textDecoration: 'none',
          borderRadius: '4px',
        }}>
        🏠 Volver al Inicio
      </Link>
    </div>
  );
}
```

### ✨ 4. FASE POLISH (15 min) - STYLING Y UX

```css
/* src/styles.css */
.navbar {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  min-height: 70vh;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-link {
    text-align: center;
  }
}
```

## ✅ VALIDACIÓN (5 min finales)

### Checklist Obligatorio:

- [ ] ✅ BrowserRouter configurado sin errores
- [ ] ✅ 3 páginas navegables (Home, About, Contact)
- [ ] ✅ Links usando `Link` component (no `<a>`)
- [ ] ✅ 404 page funcional para rutas inexistentes
- [ ] ✅ Navegación responsive en móvil
- [ ] ✅ Styling básico pero profesional
- [ ] ✅ Sin errores en consola del navegador

### Test Rápido:

1. **Navegación**: Clic en todos los links
2. **URL directa**: Escribir `/about` en URL
3. **404 Test**: Escribir `/inexistente` en URL
4. **Responsive**: Probar en móvil (DevTools)
5. **Back/Forward**: Botones del navegador funcionando

## 🎯 RESULTADO ESPERADO

**Al final de 60 minutos:**

- ✅ **SPA básica** funcionando sin recargas de página
- ✅ **Router configurado** correctamente con React Router v6
- ✅ **Navegación fluida** entre páginas con Link components
- ✅ **404 handling** para rutas no encontradas
- ✅ **Styling responsive** básico pero profesional
- ✅ **Base sólida** para secciones más avanzadas

---

**🎯 LOGRO**: Fundamentos Router sólidos ✅  
**➡️ SIGUIENTE**: Sección 2 - Rutas Dinámicas (1:00 PM)

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

## 🚀 FASE CORE (35 min) - Router Esencial

### ⚡ Paso 1: Instalación y Configuración (15 min)

**Instalar dependencias**:

```bash
# En proyecto React existente
npm install react-router-dom@6
npm install lucide-react  # Para iconos bonitos
```

**Configurar Router Principal** - `src/main.jsx`:

```jsx
// 🎯 FASE CORE: Setup básico de React Router
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

**Configurar App Principal** - `src/App.jsx`:

```jsx
// 🎯 React Router App Principal
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Layout />}>
          <Route
            index
            element={<Home />}
          />
          <Route
            path="about"
            element={<About />}
          />
          <Route
            path="products"
            element={<Products />}
          />
          <Route
            path="contact"
            element={<Contact />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
```

### 🏗️ Paso 2: Crear Páginas Básicas (20 min)

**Crear Layout Component** - `src/components/Layout.jsx`:

```jsx
// 🎯 Layout principal con Outlet para rutas anidadas
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Info, Package, Mail } from 'lucide-react';

function Layout() {
  const location = useLocation();

  // Helper para clases activas
  const isActive = path => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="layout">
      {/* Header con navegación */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>🚀 React Router Demo</h1>
          </div>

          <nav className="nav">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <Home size={18} />
              <span>Inicio</span>
            </Link>

            <Link
              to="/about"
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
              <Info size={18} />
              <span>Acerca</span>
            </Link>

            <Link
              to="/products"
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
              <Package size={18} />
              <span>Productos</span>
            </Link>

            <Link
              to="/contact"
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
              <Mail size={18} />
              <span>Contacto</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Contenido principal - aquí se renderizan las rutas */}
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 React Router Demo - WorldSkills 2025</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
```

**Crear páginas** - `src/pages/Home.jsx`:

```jsx
// 🎯 Página de inicio
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Zap } from 'lucide-react';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a React Router</h1>
          <p>Aprende navegación SPA profesional para WorldSkills 2025</p>
          <div className="hero-actions">
            <Link
              to="/products"
              className="btn primary">
              Ver Productos <ArrowRight size={18} />
            </Link>
            <Link
              to="/about"
              className="btn secondary">
              Conocer Más
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Características Principales</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Zap className="feature-icon" />
            <h3>Navegación Rápida</h3>
            <p>SPA con navegación instantánea entre páginas</p>
          </div>

          <div className="feature-card">
            <Star className="feature-icon" />
            <h3>UX Moderna</h3>
            <p>Experiencia de usuario fluida y profesional</p>
          </div>

          <div className="feature-card">
            <Users className="feature-icon" />
            <h3>Multi-Usuario</h3>
            <p>Soporte para diferentes tipos de usuarios</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>4</h3>
            <p>Páginas Principales</p>
          </div>
          <div className="stat-item">
            <h3>100%</h3>
            <p>Responsive Design</p>
          </div>
          <div className="stat-item">
            <h3>⚡</h3>
            <p>Carga Instantánea</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
```

**Página About** - `src/pages/About.jsx`:

```jsx
// 🎯 Página Acerca de
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Code, Target } from 'lucide-react';

function About() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Volver a la página anterior
  };

  return (
    <div className="about-page">
      <div className="page-header">
        <button
          onClick={handleGoBack}
          className="btn secondary">
          <ArrowLeft size={18} />
          Volver
        </button>
        <h1>Acerca del Proyecto</h1>
        <p>React Router para WorldSkills 2025</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>🎯 Objetivo del Entrenamiento</h2>
          <p>
            Este proyecto está diseñado para enseñar React Router de manera
            práctica y eficiente, preparando a los estudiantes para las
            competencias WorldSkills 2025.
          </p>
        </section>

        <section className="about-section">
          <h2>✅ Lo que Aprenderás</h2>
          <div className="learning-grid">
            <div className="learning-item">
              <CheckCircle className="learning-icon" />
              <div>
                <h3>Navegación SPA</h3>
                <p>Single Page Applications con React Router</p>
              </div>
            </div>

            <div className="learning-item">
              <Code className="learning-icon" />
              <div>
                <h3>Rutas Dinámicas</h3>
                <p>Parámetros, queries y rutas anidadas</p>
              </div>
            </div>

            <div className="learning-item">
              <Target className="learning-icon" />
              <div>
                <h3>Rutas Protegidas</h3>
                <p>Autenticación y guards de seguridad</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>🚀 Tecnologías Utilizadas</h2>
          <div className="tech-stack">
            <span className="tech-badge">React 18+</span>
            <span className="tech-badge">React Router v6</span>
            <span className="tech-badge">Lucide Icons</span>
            <span className="tech-badge">CSS3 Grid</span>
            <span className="tech-badge">Responsive Design</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
```

**Página Products** - `src/pages/Products.jsx`:

```jsx
// 🎯 Página de productos (básica por ahora)
import { Link } from 'react-router-dom';
import { Package, Star, DollarSign } from 'lucide-react';

function Products() {
  // Datos simulados
  const products = [
    { id: 1, name: 'Laptop Gaming', price: 2500000, rating: 4.8, image: '💻' },
    { id: 2, name: 'Mouse Gamer', price: 150000, rating: 4.6, image: '🖱️' },
    { id: 3, name: 'Teclado RGB', price: 300000, rating: 4.7, image: '⌨️' },
    { id: 4, name: 'Monitor 4K', price: 1200000, rating: 4.9, image: '🖥️' },
  ];

  const formatPrice = price => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(price);
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <Package className="page-icon" />
        <h1>Catálogo de Productos</h1>
        <p>Encuentra los mejores productos tecnológicos</p>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div
            key={product.id}
            className="product-card">
            <div className="product-image">
              <span className="product-emoji">{product.image}</span>
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>

              <div className="product-rating">
                <Star
                  className="star-icon"
                  fill="currentColor"
                />
                <span>{product.rating}</span>
              </div>

              <div className="product-price">
                <DollarSign size={16} />
                <span>{formatPrice(product.price)}</span>
              </div>

              <div className="product-actions">
                <Link
                  to={`/products/${product.id}`}
                  className="btn primary small">
                  Ver Detalles
                </Link>
                <button className="btn secondary small">
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
```

**Páginas restantes** - `src/pages/Contact.jsx`:

```jsx
// 🎯 Página de contacto
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = e => {
    e.preventDefault();
    alert('Mensaje enviado (demo)');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="contact-page">
      <div className="page-header">
        <Mail className="page-icon" />
        <h1>Contacto</h1>
        <p>Ponte en contacto con nosotros</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Información de Contacto</h2>

          <div className="contact-item">
            <Mail className="contact-icon" />
            <div>
              <h3>Email</h3>
              <p>info@reactrouter.com</p>
            </div>
          </div>

          <div className="contact-item">
            <Phone className="contact-icon" />
            <div>
              <h3>Teléfono</h3>
              <p>+57 (300) 123-4567</p>
            </div>
          </div>

          <div className="contact-item">
            <MapPin className="contact-icon" />
            <div>
              <h3>Dirección</h3>
              <p>Bogotá, Colombia</p>
            </div>
          </div>
        </div>

        <form
          className="contact-form"
          onSubmit={handleSubmit}>
          <h2>Enviar Mensaje</h2>

          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensaje</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required></textarea>
          </div>

          <button
            type="submit"
            className="btn primary">
            <Send size={18} />
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
```

**404 Page** - `src/pages/NotFound.jsx`:

```jsx
// 🎯 Página 404
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">🔍</div>
        <h1>404</h1>
        <h2>Página No Encontrada</h2>
        <p>La página que buscas no existe o fue movida.</p>

        <div className="not-found-actions">
          <Link
            to="/"
            className="btn primary">
            <Home size={18} />
            Ir al Inicio
          </Link>
          <button
            onClick={() => history.back()}
            className="btn secondary">
            <ArrowLeft size={18} />
            Volver Atrás
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
```

---

## ⚡ FASE ENHANCED (20 min) - Estilos y UX

### 🎨 Estilos CSS Completos

**Agregar a** `src/index.css`:

```css
/* Reset y base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Layout Styles */
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.logo h1 {
  color: #4f46e5;
  font-size: 1.5rem;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #64748b;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: #f1f5f9;
  color: #4f46e5;
  transform: translateY(-1px);
}

.nav-link.active {
  background: #4f46e5;
  color: white;
}

.main {
  flex: 1;
  padding: 2rem 0;
}

.footer {
  background: #1e293b;
  color: white;
  text-align: center;
  padding: 2rem;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.primary {
  background: #4f46e5;
  color: white;
}

.btn.primary:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

.btn.secondary {
  background: #e2e8f0;
  color: #475569;
}

.btn.secondary:hover {
  background: #cbd5e1;
}

.btn.small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

/* Page Styles */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.page-icon {
  width: 60px;
  height: 60px;
  color: #4f46e5;
  margin: 0 auto 1rem;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.page-header p {
  color: #64748b;
  font-size: 1.1rem;
}

/* Home Page Styles */
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.features {
  margin-bottom: 3rem;
}

.features h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #1e293b;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  color: #4f46e5;
  margin: 0 auto 1rem;
}

.stats {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-item h3 {
  font-size: 2rem;
  color: #4f46e5;
  margin-bottom: 0.5rem;
}

/* Products Page */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  background: #f8fafc;
  padding: 2rem;
  text-align: center;
}

.product-emoji {
  font-size: 3rem;
}

.product-info {
  padding: 1.5rem;
}

.product-info h3 {
  margin-bottom: 1rem;
  color: #1e293b;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #fbbf24;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  color: #059669;
  margin-bottom: 1rem;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

/* Contact Page */
.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contact-info {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.contact-icon {
  width: 40px;
  height: 40px;
  color: #4f46e5;
}

.contact-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4f46e5;
}

/* About Page */
.about-content {
  max-width: 800px;
  margin: 0 auto;
}

.about-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.learning-grid {
  display: grid;
  gap: 1.5rem;
}

.learning-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.learning-icon {
  width: 40px;
  height: 40px;
  color: #059669;
}

.tech-stack {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tech-badge {
  background: #4f46e5;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 404 Page */
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.not-found-content {
  text-align: center;
  max-width: 500px;
}

.not-found-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.not-found-content h1 {
  font-size: 4rem;
  color: #4f46e5;
  margin-bottom: 0.5rem;
}

.not-found-content h2 {
  margin-bottom: 1rem;
  color: #1e293b;
}

.not-found-content p {
  color: #64748b;
  margin-bottom: 2rem;
}

.not-found-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: 0.5rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .contact-content {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .header .container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .page-header {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }
}
```

---

## ✨ FASE POLISH (5 min) - Validación

### ✅ Checklist de Funcionalidad

**Navegación Básica**:

- [ ] ✅ Router configurado sin errores
- [ ] ✅ 5 páginas navegables (Home, About, Products, Contact, 404)
- [ ] ✅ Links funcionando correctamente
- [ ] ✅ URL cambiando apropiadamente
- [ ] ✅ Layout persistente entre rutas
- [ ] ✅ Navegación activa indicada visualmente

**Componentes**:

- [ ] ✅ Layout con Outlet funcionando
- [ ] ✅ Navegación responsive
- [ ] ✅ Páginas renderizando contenido
- [ ] ✅ 404 manejado correctamente

### 🔧 Test Rápido

1. **Navegación manual**: Hacer click en todos los links
2. **URL directa**: Escribir URLs directamente en navegador
3. **404 test**: Navegar a ruta inexistente
4. **Responsive**: Probar en móvil
5. **Back/Forward**: Usar botones navegador

---

## 🎯 Competencias Desarrolladas

Al completar esta sección:

1. ✅ **React Router Setup** - Configuración básica correcta
2. ✅ **Rutas Básicas** - Routes y Route components
3. ✅ **Navegación** - Link y navegación programática
4. ✅ **Layout Pattern** - Outlet para rutas anidadas
5. ✅ **404 Handling** - Manejo de rutas no encontradas
6. ✅ **Active Navigation** - Estados activos en links

---

## ⏭️ Próximo Paso

**Sección 2**: Navegación Avanzada (75 min)

- URL parameters (:id)
- Query parameters (?search=)
- Nested routes
- useParams hook

---

**⏰ TIEMPO LÍMITE: 60 MINUTOS**  
**🎯 ¡BASE SÓLIDA DE ROUTER ESTABLECIDA!**

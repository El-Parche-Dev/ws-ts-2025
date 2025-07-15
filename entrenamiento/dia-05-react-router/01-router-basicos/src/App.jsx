// App.jsx - React Router Básico (FASE CORE)
import {
  NavLink,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
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
        <button>Ver Detalles</button>
      </div>
      <div className="producto-card">
        <h3>iPhone 15</h3>
        <p>$3,800,000</p>
        <button>Ver Detalles</button>
      </div>
      <div className="producto-card">
        <h3>Samsung Galaxy</h3>
        <p>$2,800,000</p>
        <button>Ver Detalles</button>
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
        <span className="status activo">Activo</span>
      </div>
      <div className="usuario-item">
        <span>María García</span>
        <span>maria@email.com</span>
        <span className="status activo">Activo</span>
      </div>
      <div className="usuario-item">
        <span>Carlos López</span>
        <span>carlos@email.com</span>
        <span className="status inactivo">Inactivo</span>
      </div>
    </div>
  </div>
);

const Contacto = () => (
  <div className="page">
    <h1>📞 Contacto</h1>
    <div className="contacto-info">
      <p>
        <strong>Teléfono:</strong> +57 300 123 4567
      </p>
      <p>
        <strong>Email:</strong> info@empresa.com
      </p>
      <p>
        <strong>Dirección:</strong> Calle 123 #45-67, Bogotá
      </p>
    </div>
    <form className="contacto-form">
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          placeholder="Tu nombre"
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          placeholder="tu@email.com"
        />
      </div>
      <div className="form-group">
        <label>Mensaje:</label>
        <textarea placeholder="Tu mensaje"></textarea>
      </div>
      <button
        type="submit"
        className="btn-enviar">
        Enviar
      </button>
    </form>
  </div>
);

// Página 404 personalizada
const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page not-found">
      <h1>🚫 404 - Página No Encontrada</h1>
      <p>La página que buscas no existe.</p>
      <button
        onClick={() => navigate('/')}
        className="btn-home">
        🏠 Volver al Inicio
      </button>
    </div>
  );
};

// Navbar con NavLink activo
const Navbar = () => (
  <nav className="navbar">
    <div className="nav-brand">
      <NavLink to="/">🚀 Mi App</NavLink>
    </div>
    <div className="nav-links">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
        end>
        Inicio
      </NavLink>
      <NavLink
        to="/productos"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }>
        Productos
      </NavLink>
      <NavLink
        to="/usuarios"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }>
        Usuarios
      </NavLink>
      <NavLink
        to="/contacto"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }>
        Contacto
      </NavLink>
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
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/productos"
              element={<Productos />}
            />
            <Route
              path="/usuarios"
              element={<Usuarios />}
            />
            <Route
              path="/contacto"
              element={<Contacto />}
            />
            {/* Ruta 404 - debe ir al final */}
            <Route
              path="*"
              element={<PageNotFound />}
            />
          </Routes>
        </main>
        <footer className="footer">
          <p>
            &copy; 2025 WorldSkills Training. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

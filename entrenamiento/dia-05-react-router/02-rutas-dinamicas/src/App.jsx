// App.jsx - Rutas Dinámicas con Parámetros (FASE CORE)
import { useEffect, useState } from 'react';
import {
  NavLink,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import './App.css';

// Base de datos simulada
const productosDB = [
  {
    id: 1,
    nombre: 'Laptop Dell Inspiron',
    precio: 2500000,
    categoria: 'laptops',
    descripcion: 'Laptop potente para trabajo y estudio',
    imagen: '💻',
    stock: 15,
  },
  {
    id: 2,
    nombre: 'iPhone 15 Pro',
    precio: 3800000,
    categoria: 'smartphones',
    descripcion: 'Último iPhone con cámara profesional',
    imagen: '📱',
    stock: 8,
  },
  {
    id: 3,
    nombre: 'Samsung Galaxy S24',
    precio: 2800000,
    categoria: 'smartphones',
    descripcion: 'Android flagship con IA avanzada',
    imagen: '📱',
    stock: 12,
  },
  {
    id: 4,
    nombre: 'MacBook Air M3',
    precio: 4200000,
    categoria: 'laptops',
    descripcion: 'Ultrabook Apple con chip M3',
    imagen: '💻',
    stock: 6,
  },
  {
    id: 5,
    nombre: 'Tablet iPad Air',
    precio: 1800000,
    categoria: 'tablets',
    descripcion: 'Tablet profesional para creativos',
    imagen: '📱',
    stock: 10,
  },
  {
    id: 6,
    nombre: 'Monitor LG 27"',
    precio: 800000,
    categoria: 'monitores',
    descripcion: 'Monitor 4K para gaming y diseño',
    imagen: '🖥️',
    stock: 20,
  },
];

const usuariosDB = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@email.com',
    rol: 'admin',
    activo: true,
    fechaRegistro: '2024-01-15',
  },
  {
    id: 2,
    nombre: 'María García',
    email: 'maria@email.com',
    rol: 'usuario',
    activo: true,
    fechaRegistro: '2024-02-20',
  },
  {
    id: 3,
    nombre: 'Carlos López',
    email: 'carlos@email.com',
    rol: 'usuario',
    activo: false,
    fechaRegistro: '2024-03-10',
  },
  {
    id: 4,
    nombre: 'Ana Martínez',
    email: 'ana@email.com',
    rol: 'editor',
    activo: true,
    fechaRegistro: '2024-01-30',
  },
];

// Componente Home
const Home = () => (
  <div className="page">
    <h1>🏠 Dashboard Principal</h1>
    <p>Bienvenido al sistema de gestión con rutas dinámicas</p>
    <div className="stats">
      <div className="stat-card">
        <h3>Productos</h3>
        <p>{productosDB.length} disponibles</p>
        <NavLink
          to="/productos"
          className="stat-link">
          Ver Productos
        </NavLink>
      </div>
      <div className="stat-card">
        <h3>Usuarios</h3>
        <p>{usuariosDB.length} registrados</p>
        <NavLink
          to="/usuarios"
          className="stat-link">
          Ver Usuarios
        </NavLink>
      </div>
    </div>
  </div>
);

// Lista de Productos con búsqueda
const ProductosList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState(productosDB);
  const searchTerm = searchParams.get('search') || '';
  const categoria = searchParams.get('categoria') || '';

  useEffect(() => {
    let filtrados = productosDB;

    if (searchTerm) {
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoria) {
      filtrados = filtrados.filter(p => p.categoria === categoria);
    }

    setProductos(filtrados);
  }, [searchTerm, categoria]);

  const handleSearch = e => {
    const value = e.target.value;
    setSearchParams(prev => {
      if (value) {
        prev.set('search', value);
      } else {
        prev.delete('search');
      }
      return prev;
    });
  };

  const handleCategoriaFilter = cat => {
    setSearchParams(prev => {
      if (cat) {
        prev.set('categoria', cat);
      } else {
        prev.delete('categoria');
      }
      return prev;
    });
  };

  const categorias = [...new Set(productosDB.map(p => p.categoria))];

  return (
    <div className="page">
      <h1>📦 Lista de Productos</h1>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="categoria-filters">
          <button
            className={!categoria ? 'active' : ''}
            onClick={() => handleCategoriaFilter('')}>
            Todas
          </button>
          {categorias.map(cat => (
            <button
              key={cat}
              className={categoria === cat ? 'active' : ''}
              onClick={() => handleCategoriaFilter(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="productos-grid">
        {productos.map(producto => (
          <div
            key={producto.id}
            className="producto-card">
            <div className="producto-imagen">{producto.imagen}</div>
            <h3>{producto.nombre}</h3>
            <p className="precio">${producto.precio.toLocaleString()}</p>
            <p className="stock">Stock: {producto.stock}</p>
            <NavLink
              to={`/productos/${producto.id}`}
              className="btn-ver-detalle">
              Ver Detalles
            </NavLink>
          </div>
        ))}
      </div>

      {productos.length === 0 && (
        <div className="no-results">
          <p>No se encontraron productos</p>
        </div>
      )}
    </div>
  );
};

// Detalle de Producto Individual
const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const producto = productosDB.find(p => p.id === parseInt(id));

  if (!producto) {
    return (
      <div className="page not-found">
        <h1>🚫 Producto No Encontrado</h1>
        <p>El producto con ID {id} no existe.</p>
        <button
          onClick={() => navigate('/productos')}
          className="btn-back">
          ← Volver a Productos
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <button
        onClick={() => navigate('/productos')}
        className="btn-back">
        ← Volver a Productos
      </button>

      <div className="producto-detalle">
        <div className="producto-imagen-grande">{producto.imagen}</div>
        <div className="producto-info">
          <h1>{producto.nombre}</h1>
          <p className="precio-grande">${producto.precio.toLocaleString()}</p>
          <p className="descripcion">{producto.descripcion}</p>
          <div className="detalles-extra">
            <p>
              <strong>Categoría:</strong> {producto.categoria}
            </p>
            <p>
              <strong>Stock disponible:</strong> {producto.stock} unidades
            </p>
            <p>
              <strong>ID del producto:</strong> {producto.id}
            </p>
          </div>
          <div className="acciones">
            <button className="btn-comprar">🛒 Agregar al Carrito</button>
            <button className="btn-favorito">❤️ Favorito</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lista de Usuarios
const UsuariosList = () => (
  <div className="page">
    <h1>👥 Lista de Usuarios</h1>
    <div className="usuarios-lista">
      {usuariosDB.map(usuario => (
        <div
          key={usuario.id}
          className="usuario-item">
          <span className="usuario-nombre">{usuario.nombre}</span>
          <span className="usuario-email">{usuario.email}</span>
          <span className={`status ${usuario.activo ? 'activo' : 'inactivo'}`}>
            {usuario.activo ? 'Activo' : 'Inactivo'}
          </span>
          <NavLink
            to={`/usuarios/${usuario.id}`}
            className="btn-ver-usuario">
            Ver Perfil
          </NavLink>
        </div>
      ))}
    </div>
  </div>
);

// Perfil de Usuario Individual
const UsuarioPerfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = usuariosDB.find(u => u.id === parseInt(id));

  if (!usuario) {
    return (
      <div className="page not-found">
        <h1>🚫 Usuario No Encontrado</h1>
        <p>El usuario con ID {id} no existe.</p>
        <button
          onClick={() => navigate('/usuarios')}
          className="btn-back">
          ← Volver a Usuarios
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <button
        onClick={() => navigate('/usuarios')}
        className="btn-back">
        ← Volver a Usuarios
      </button>

      <div className="usuario-perfil">
        <div className="perfil-header">
          <div className="avatar">👤</div>
          <div className="perfil-info">
            <h1>{usuario.nombre}</h1>
            <p className="email">{usuario.email}</p>
            <span className={`badge ${usuario.rol}`}>{usuario.rol}</span>
          </div>
        </div>

        <div className="perfil-detalles">
          <div className="detalle-item">
            <strong>Estado:</strong>
            <span
              className={`status ${usuario.activo ? 'activo' : 'inactivo'}`}>
              {usuario.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div className="detalle-item">
            <strong>Fecha de registro:</strong>
            <span>{new Date(usuario.fechaRegistro).toLocaleDateString()}</span>
          </div>
          <div className="detalle-item">
            <strong>ID de usuario:</strong>
            <span>{usuario.id}</span>
          </div>
        </div>

        <div className="perfil-acciones">
          <button className="btn-editar">✏️ Editar Perfil</button>
          <button className="btn-mensajes">💬 Enviar Mensaje</button>
        </div>
      </div>
    </div>
  );
};

// Página 404
const PageNotFound = () => (
  <div className="page not-found">
    <h1>🚫 404 - Página No Encontrada</h1>
    <p>La página que buscas no existe.</p>
    <NavLink
      to="/"
      className="btn-home">
      🏠 Volver al Inicio
    </NavLink>
  </div>
);

// Navbar
const Navbar = () => (
  <nav className="navbar">
    <div className="nav-brand">
      <NavLink to="/">🚀 Mi App Dinámica</NavLink>
    </div>
    <div className="nav-links">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
        end>
        Dashboard
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
              element={<ProductosList />}
            />
            <Route
              path="/productos/:id"
              element={<ProductoDetalle />}
            />
            <Route
              path="/usuarios"
              element={<UsuariosList />}
            />
            <Route
              path="/usuarios/:id"
              element={<UsuarioPerfil />}
            />
            <Route
              path="*"
              element={<PageNotFound />}
            />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2025 WorldSkills Training - Rutas Dinámicas</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

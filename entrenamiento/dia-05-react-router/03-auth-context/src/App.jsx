// App.jsx - Autenticación y Context (FASE CORE)
import { createContext, useContext, useEffect, useState } from 'react';
import {
  NavLink,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import './App.css';

// Context de Autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Proveedor de Autenticación
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simular verificación de sesión al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }

    setLoading(false);
  }, []);

  // Función de login
  const login = async (email, password) => {
    setLoading(true);

    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Usuarios de prueba
    const users = [
      {
        id: 1,
        email: 'admin@test.com',
        password: 'admin123',
        nombre: 'Admin User',
        rol: 'admin',
      },
      {
        id: 2,
        email: 'user@test.com',
        password: 'user123',
        nombre: 'Regular User',
        rol: 'user',
      },
      {
        id: 3,
        email: 'editor@test.com',
        password: 'editor123',
        nombre: 'Editor User',
        rol: 'editor',
      },
    ];

    const foundUser = users.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password; // No guardar la contraseña

      setUser(userData);
      localStorage.setItem('authToken', 'fake-jwt-token');
      localStorage.setItem('userData', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: 'Credenciales inválidas' };
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  // Función para verificar permisos
  const hasPermission = requiredRole => {
    if (!user) return false;

    const roleHierarchy = {
      user: 1,
      editor: 2,
      admin: 3,
    };

    return roleHierarchy[user.rol] >= roleHierarchy[requiredRole];
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Componente de protección de rutas
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (requiredRole && !hasPermission(requiredRole)) {
    return (
      <div className="page access-denied">
        <h1>🚫 Acceso Denegado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
        <p>
          Rol requerido: {requiredRole} | Tu rol: {user.rol}
        </p>
        <NavLink
          to="/"
          className="btn-home">
          🏠 Volver al Inicio
        </NavLink>
      </div>
    );
  }

  return children;
};

// Página de Login
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🔐 Iniciar Sesión</h1>

        <div className="demo-accounts">
          <h3>Cuentas de Prueba:</h3>
          <div className="demo-account">
            <strong>Admin:</strong> admin@test.com / admin123
          </div>
          <div className="demo-account">
            <strong>Editor:</strong> editor@test.com / editor123
          </div>
          <div className="demo-account">
            <strong>Usuario:</strong> user@test.com / user123
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-login">
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Dashboard protegido
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>🏠 Dashboard - Bienvenido {user.nombre}</h1>
      <div className="user-info">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Rol:</strong>{' '}
          <span className={`badge ${user.rol}`}>{user.rol}</span>
        </p>
        <p>
          <strong>ID:</strong> {user.id}
        </p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Mi Perfil</h3>
          <p>Información personal</p>
          <NavLink
            to="/perfil"
            className="stat-link">
            Ver Perfil
          </NavLink>
        </div>

        {user.rol === 'admin' && (
          <div className="stat-card admin">
            <h3>Panel Admin</h3>
            <p>Gestión del sistema</p>
            <NavLink
              to="/admin"
              className="stat-link">
              Ir a Admin
            </NavLink>
          </div>
        )}

        {(user.rol === 'admin' || user.rol === 'editor') && (
          <div className="stat-card editor">
            <h3>Panel Editor</h3>
            <p>Gestión de contenido</p>
            <NavLink
              to="/editor"
              className="stat-link">
              Ir a Editor
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

// Perfil de usuario
const Perfil = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>👤 Mi Perfil</h1>

      <div className="perfil-container">
        <div className="perfil-avatar">
          <div className="avatar-large">👤</div>
          <h2>{user.nombre}</h2>
        </div>

        <div className="perfil-details">
          <div className="detail-item">
            <label>Nombre:</label>
            <span>{user.nombre}</span>
          </div>
          <div className="detail-item">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="detail-item">
            <label>Rol:</label>
            <span className={`badge ${user.rol}`}>{user.rol}</span>
          </div>
          <div className="detail-item">
            <label>ID de Usuario:</label>
            <span>{user.id}</span>
          </div>
        </div>

        <div className="perfil-actions">
          <button className="btn-edit">✏️ Editar Perfil</button>
          <button className="btn-password">🔒 Cambiar Contraseña</button>
        </div>
      </div>
    </div>
  );
};

// Panel de Administración
const AdminPanel = () => {
  return (
    <div className="page">
      <h1>⚙️ Panel de Administración</h1>
      <p className="access-note">
        Solo usuarios con rol 'admin' pueden ver esta página.
      </p>

      <div className="admin-sections">
        <div className="admin-section">
          <h3>👥 Gestión de Usuarios</h3>
          <p>Administrar cuentas de usuario</p>
          <button className="btn-section">Gestionar Usuarios</button>
        </div>

        <div className="admin-section">
          <h3>🔧 Configuración del Sistema</h3>
          <p>Configurar parámetros globales</p>
          <button className="btn-section">Configuración</button>
        </div>

        <div className="admin-section">
          <h3>📊 Reportes</h3>
          <p>Ver estadísticas y reportes</p>
          <button className="btn-section">Ver Reportes</button>
        </div>
      </div>
    </div>
  );
};

// Panel de Editor
const EditorPanel = () => {
  return (
    <div className="page">
      <h1>✏️ Panel de Editor</h1>
      <p className="access-note">
        Usuarios con rol 'editor' o 'admin' pueden ver esta página.
      </p>

      <div className="editor-sections">
        <div className="editor-section">
          <h3>📝 Gestión de Contenido</h3>
          <p>Crear y editar artículos</p>
          <button className="btn-section">Gestionar Contenido</button>
        </div>

        <div className="editor-section">
          <h3>🖼️ Gestión de Media</h3>
          <p>Subir y organizar archivos</p>
          <button className="btn-section">Media Library</button>
        </div>
      </div>
    </div>
  );
};

// Navbar con estado de autenticación
const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <NavLink to="/">🔐 App Segura</NavLink>
      </div>

      {isAuthenticated ? (
        <div className="nav-authenticated">
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
              to="/perfil"
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }>
              Mi Perfil
            </NavLink>

            {user.rol === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }>
                Admin
              </NavLink>
            )}

            {(user.rol === 'admin' || user.rol === 'editor') && (
              <NavLink
                to="/editor"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }>
                Editor
              </NavLink>
            )}
          </div>

          <div className="nav-user">
            <span className="user-name">👋 {user.nombre}</span>
            <button
              onClick={handleLogout}
              className="btn-logout">
              🚪 Salir
            </button>
          </div>
        </div>
      ) : (
        <div className="nav-links">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }>
            🔐 Iniciar Sesión
          </NavLink>
        </div>
      )}
    </nav>
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

// App principal
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route
                path="/login"
                element={<Login />}
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Perfil />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/editor"
                element={
                  <ProtectedRoute requiredRole="editor">
                    <EditorPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={<PageNotFound />}
              />
            </Routes>
          </main>
          <footer className="footer">
            <p>&copy; 2025 WorldSkills Training - Autenticación</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

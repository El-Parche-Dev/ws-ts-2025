# 🔒 Sección 3: Auth Context (60 min)

**⏰ TIEMPO**: 2:15 PM - 3:15 PM (Post Break 15 min)  
**🎯 OBJETIVO**: Context API para autenticación y rutas protegidas

## ⚡ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Actividad                  |
| --------------- | --------- | -------------------------- |
| 🔧 **CORE**     | 0-25 min  | AuthContext + login básico |
| ⚡ **ENHANCED** | 25-45 min | PrivateRoute + protección  |
| ✨ **POLISH**   | 45-60 min | Persistencia + UX completa |

## 🚀 IMPLEMENTACIÓN RÁPIDA

### 🔧 FASE CORE (25 min) - AUTHCONTEXT FUNCIONANDO

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    // Simular login API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = {
      id: 1,
      email,
      name: email.includes('admin') ? 'Admin Usuario' : 'Usuario Normal',
      role: email.includes('admin') ? 'admin' : 'user',
    };

    setUser(mockUser);
    setLoading(false);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

```jsx
// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Error en las credenciales');
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '3rem auto',
        padding: '2rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        🔑 Iniciar Sesión
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="email"
            style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="password"
            style={{ display: 'block', marginBottom: '0.5rem' }}>
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
            required
          />
        </div>

        {error && (
          <div
            style={{
              color: '#dc3545',
              background: '#f8d7da',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
            }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#6c757d' : '#007bff',
            color: 'white',
            padding: '0.75rem',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div
        style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <p>
          <strong>Usuarios de prueba:</strong>
        </p>
        <p>admin@test.com / user@test.com</p>
        <p>Cualquier contraseña funciona</p>
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Link
          to="/"
          style={{ color: '#007bff' }}>
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
```

### ⚡ FASE ENHANCED (20 min) - RUTAS PROTEGIDAS

```jsx
// src/components/PrivateRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>⏳ Verificando autenticación...</h2>
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Guardar la ubicación a la que el usuario intentaba ir
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}
```

```jsx
// src/pages/Dashboard.jsx
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}>
        <h1>📊 Dashboard</h1>
        <p>
          Bienvenido, <strong>{user.name}</strong>
        </p>
        <p>
          Rol:{' '}
          <span
            style={{
              background: user.role === 'admin' ? '#28a745' : '#007bff',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.9rem',
            }}>
            {user.role}
          </span>
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        }}>
        <div
          style={{
            border: '1px solid #ddd',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
          <h3>👤 Mi Perfil</h3>
          <p>Gestiona tu información personal</p>
          <button
            style={{
              background: '#007bff',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
            }}>
            Ver Perfil
          </button>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
          <h3>📈 Estadísticas</h3>
          <p>Visualiza tus métricas</p>
          <button
            style={{
              background: '#28a745',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
            }}>
            Ver Stats
          </button>
        </div>

        {user.role === 'admin' && (
          <div
            style={{
              border: '1px solid #ddd',
              padding: '1.5rem',
              borderRadius: '8px',
              textAlign: 'center',
            }}>
            <h3>⚙️ Admin Panel</h3>
            <p>Configuración avanzada</p>
            <button
              style={{
                background: '#dc3545',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
              }}>
              Admin Panel
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link
          to="/"
          style={{ marginRight: '1rem', color: '#007bff' }}>
          🏠 Ir al inicio
        </Link>
        <button
          onClick={logout}
          style={{
            background: '#6c757d',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
          }}>
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
```

### ✨ FASE POLISH (15 min) - PERSISTENCIA Y UX

```jsx
// src/context/AuthContext.jsx - Con persistencia
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = {
      id: 1,
      email,
      name: email.includes('admin') ? 'Admin Usuario' : 'Usuario Normal',
      role: email.includes('admin') ? 'admin' : 'user',
      loginTime: new Date().toISOString(),
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setLoading(false);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = role => {
    return user && user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated,
        hasRole,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

```jsx
// src/components/AuthStatus.jsx - Componente de estado
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AuthStatus() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link
          to="/login"
          style={{
            background: '#007bff',
            color: 'white',
            padding: '0.5rem 1rem',
            textDecoration: 'none',
            borderRadius: '4px',
          }}>
          🔑 Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <span style={{ color: 'white' }}>👤 Hola, {user.name}</span>
      <Link
        to="/dashboard"
        style={{
          color: 'white',
          textDecoration: 'none',
          padding: '0.5rem',
        }}>
        📊 Dashboard
      </Link>
      <button
        onClick={logout}
        style={{
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
        🚪 Salir
      </button>
    </div>
  );
}
```

## ✅ VALIDACIÓN (5 min finales)

### Checklist Obligatorio:

- [ ] ✅ AuthContext configurado y funcionando
- [ ] ✅ Login/logout operativo con simulación
- [ ] ✅ PrivateRoute protegiendo rutas sensibles
- [ ] ✅ Dashboard accesible solo autenticado
- [ ] ✅ Persistencia de sesión con localStorage
- [ ] ✅ Estados de loading apropiados
- [ ] ✅ UX completa con feedback visual

### Test Rápido:

1. **Login**: Probar con admin@test.com y user@test.com
2. **Protected**: Intentar acceder /dashboard sin login
3. **Logout**: Cerrar sesión y verificar redirección
4. **Persistence**: Recargar página con sesión activa
5. **Navigation**: Flow completo login → dashboard → logout

## 🎯 RESULTADO ESPERADO

**Al final de 60 minutos:**

- ✅ **Sistema de autenticación** completo y funcional
- ✅ **Context API** implementado correctamente
- ✅ **Rutas protegidas** funcionando sin errores
- ✅ **Persistencia de sesión** con localStorage
- ✅ **UX profesional** con estados de loading
- ✅ **Base sólida** para sistemas de autorización

---

**🎯 LOGRO**: Autenticación dominada ✅  
**➡️ SIGUIENTE**: Sección 4 - Layout System (3:15 PM)

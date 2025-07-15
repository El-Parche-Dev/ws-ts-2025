# 🔒 Sección 4: Auth & Guards (60 min)

**⏰ TIEMPO**: 3:15 PM - 4:15 PM  
**🎯 OBJETIVO**: Rutas protegidas nivel WorldSkills

## ⚡ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Actividad                  |
| --------------- | --------- | -------------------------- |
| 🔧 **CORE**     | 0-25 min  | AuthContext + PrivateRoute |
| ⚡ **ENHANCED** | 25-45 min | Role-based routes          |
| ✨ **POLISH**   | 45-60 min | Persistent auth, redirect  |

## 🚀 IMPLEMENTACIÓN RÁPIDA

### 🔧 FASE CORE (25 min)

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    // Simular login
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = {
      id: 1,
      email,
      name: 'Usuario Demo',
      role: email.includes('admin') ? 'admin' : 'user',
    };

    setUser(mockUser);
    setLoading(false);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

```jsx
// src/components/PrivateRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>⏳ Verificando autenticación...</div>;

  if (!user) {
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

### ⚡ FASE ENHANCED (20 min)

```jsx
// src/components/RoleBasedRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function RoleBasedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return children;
}
```

```jsx
// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      alert('Error de login');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h1>🔑 Iniciar Sesión</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p>Demo: admin@test.com / user@test.com</p>
      </form>
    </div>
  );
}
```

### ✨ FASE POLISH (15 min)

```jsx
// src/context/AuthContext.jsx - Con persistencia
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaurar sesión al cargar
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const mockUser = {
      id: 1,
      email,
      name: 'Usuario Demo',
      role: email.includes('admin') ? 'admin' : 'user',
      token: 'mock-jwt-token',
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

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## 🛣️ RUTAS CONFIGURADAS

```jsx
// App.jsx - Rutas con protección
<Routes>
  <Route
    path="/login"
    element={<Login />}
  />
  <Route
    path="/"
    element={<Home />}
  />

  <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    }
  />

  <Route
    path="/admin"
    element={
      <RoleBasedRoute allowedRoles={['admin']}>
        <AdminPanel />
      </RoleBasedRoute>
    }
  />
</Routes>
```

## ✅ VALIDACIÓN RÁPIDA

- [ ] ✅ AuthContext funcionando
- [ ] ✅ Login/logout operativo
- [ ] ✅ PrivateRoute protegiendo rutas
- [ ] ✅ Role-based access control
- [ ] ✅ Persistencia con localStorage
- [ ] ✅ Redirect después de login

**¡Listo para Sección 5! 🏗️**

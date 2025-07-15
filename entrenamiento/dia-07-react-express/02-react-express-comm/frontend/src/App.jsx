import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  // ========== FASE CORE ✅ (20 min) ==========
  // Funcionalidad: Conectar con backend y mostrar usuarios

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3001/api/users');

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // ========== FASE ENHANCED ⚡ (25 min) ==========
  // Mejoras: Crear usuarios, manejo de errores mejorado

  const createUser = async e => {
    e.preventDefault();

    if (!newUser.name || !newUser.email) {
      setError('Nombre y email son requeridos');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: No se pudo crear el usuario`
        );
      }

      const createdUser = await response.json();
      setUsers(prev => [...prev, createdUser]);
      setNewUser({ name: '', email: '' });
    } catch (err) {
      setError(err.message);
      console.error('Error creating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async id => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }

      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // ========== FASE POLISH ✨ (15 min) ==========
  // Optimizaciones: Loading states, mejor UX

  if (loading && users.length === 0) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 React + Express Communication</h1>
        <p>MVP Full-Stack: Gestión de Usuarios</p>
      </header>

      {error && (
        <div className="error-banner">
          <span>❌ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Formulario para crear usuario */}
      <section className="user-form-section">
        <h2>Crear Nuevo Usuario</h2>
        <form
          onSubmit={createUser}
          className="user-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Nombre completo"
              value={newUser.name}
              onChange={e =>
                setNewUser(prev => ({ ...prev, name: e.target.value }))
              }
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="email@ejemplo.com"
              value={newUser.email}
              onChange={e =>
                setNewUser(prev => ({ ...prev, email: e.target.value }))
              }
              className="form-input"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !newUser.name || !newUser.email}>
            {loading ? 'Creando...' : 'Crear Usuario'}
          </button>
        </form>
      </section>

      {/* Lista de usuarios */}
      <section className="users-section">
        <h2>Lista de Usuarios ({users.length})</h2>
        {users.length === 0 ? (
          <div className="empty-state">
            <p>No hay usuarios registrados</p>
            <p>Crea el primer usuario usando el formulario</p>
          </div>
        ) : (
          <div className="users-grid">
            {users.map(user => (
              <div
                key={user.id}
                className="user-card">
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <small>ID: {user.id}</small>
                </div>
                <div className="user-actions">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="btn btn-danger"
                    disabled={loading}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Status del servidor */}
      <footer className="server-status">
        <div className="status-indicator">
          <div className="status-dot connected"></div>
          <span>Backend conectado (Puerto 3001)</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

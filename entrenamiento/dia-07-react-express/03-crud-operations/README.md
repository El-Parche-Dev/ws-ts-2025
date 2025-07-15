# 🎯 03. CRUD Operations Complete

**⏰ Tiempo asignado**: 60 minutos (1:45 PM - 2:45 PM)  
**🎯 Objetivo**: Implementar CRUD completo (Create, Read, Update, Delete)  
**📋 Estrategia**: Full CRUD functionality con React + Express

---

## ⏱️ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Objetivo                  | Status |
| --------------- | --------- | ------------------------- | ------ |
| **🔧 CORE**     | 0-25 min  | UPDATE y DELETE endpoints | ⭐     |
| **⚡ ENHANCED** | 25-50 min | Frontend CRUD UI completa | 🚀     |
| **✨ POLISH**   | 50-60 min | Optimistic updates + UX   | 🎨     |

---

## 🔧 FASE CORE (0-25 min) - Backend CRUD

### ✅ Objetivo: PUT y DELETE endpoints funcionando

**Backend Complete CRUD (server.js)**:

```javascript
// PUT - Update todo
app.put('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo no encontrado',
      });
    }

    // Update todo
    if (title !== undefined) {
      if (!title || title.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: 'El título debe tener al menos 3 caracteres',
        });
      }
      todos[todoIndex].title = title.trim();
    }

    if (completed !== undefined) {
      todos[todoIndex].completed = Boolean(completed);
    }

    todos[todoIndex].updatedAt = new Date().toISOString();

    console.log('✅ PUT /api/todos/:id - Todo actualizado:', todos[todoIndex]);

    res.json({
      success: true,
      message: 'Todo actualizado exitosamente',
      data: todos[todoIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar todo',
      error: error.message,
    });
  }
});

// DELETE - Delete todo
app.delete('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo no encontrado',
      });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];

    console.log('✅ DELETE /api/todos/:id - Todo eliminado:', deletedTodo);

    res.json({
      success: true,
      message: 'Todo eliminado exitosamente',
      data: deletedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar todo',
      error: error.message,
    });
  }
});

// PATCH - Toggle completed status
app.patch('/api/todos/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo no encontrado',
      });
    }

    todos[todoIndex].completed = !todos[todoIndex].completed;
    todos[todoIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: `Todo ${
        todos[todoIndex].completed ? 'completado' : 'marcado como pendiente'
      }`,
      data: todos[todoIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar estado',
      error: error.message,
    });
  }
});
```

---

## ⚡ FASE ENHANCED (25-50 min) - Frontend CRUD UI

### ✅ Objetivo: UI completa para todas las operaciones CRUD

**Complete CRUD React Component:**

```jsx
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 📊 Fetch todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/todos');
      const result = await response.json();

      if (result.success) {
        setTodos(result.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Create todo
  const addTodo = async e => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch('http://localhost:3001/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo }),
      });

      const result = await response.json();

      if (result.success) {
        setTodos(prev => [...prev, result.data]);
        setNewTodo('');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // ✏️ Update todo
  const updateTodo = async (id, newTitle) => {
    try {
      const response = await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });

      const result = await response.json();

      if (result.success) {
        setTodos(prev =>
          prev.map(todo => (todo.id === id ? result.data : todo))
        );
        setEditingId(null);
        setEditTitle('');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // 🗑️ Delete todo
  const deleteTodo = async id => {
    if (!confirm('¿Estás seguro de eliminar este todo?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // ✅ Toggle completed
  const toggleTodo = async id => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/todos/${id}/toggle`,
        {
          method: 'PATCH',
        }
      );

      const result = await response.json();

      if (result.success) {
        setTodos(prev =>
          prev.map(todo => (todo.id === id ? result.data : todo))
        );
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle edit
  const startEdit = todo => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const saveEdit = () => {
    if (editTitle.trim()) {
      updateTodo(editingId, editTitle);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 Full CRUD Operations</h1>

        {/* Add Todo Form */}
        <form
          onSubmit={addTodo}
          className="add-form">
          <input
            type="text"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            placeholder="Nuevo todo..."
            className="add-input"
          />
          <button
            type="submit"
            className="add-btn">
            ➕ Agregar
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="error">
            ❌ {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* Todos List */}
        <div className="todos-container">
          <h2>📝 Todos ({todos.length})</h2>

          {loading && <div className="loading">🔄 Cargando...</div>}

          <div className="todos-list">
            {todos.map(todo => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                  />

                  {editingId === todo.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="edit-input"
                        onKeyPress={e => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                      />
                      <div className="edit-buttons">
                        <button
                          onClick={saveEdit}
                          className="save-btn">
                          ✅
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="cancel-btn">
                          ❌
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className="todo-title">{todo.title}</span>
                  )}
                </div>

                <div className="todo-actions">
                  <button
                    onClick={() => startEdit(todo)}
                    className="edit-btn"
                    disabled={editingId === todo.id}>
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn">
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {todos.length === 0 && !loading && (
              <p className="empty-state">
                📝 No hay todos. ¡Agrega el primero!
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat">
            <span>Total: {todos.length}</span>
          </div>
          <div className="stat">
            <span>Completados: {todos.filter(t => t.completed).length}</span>
          </div>
          <div className="stat">
            <span>Pendientes: {todos.filter(t => !t.completed).length}</span>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
```

---

## ✨ FASE POLISH (50-60 min) - Optimistic Updates

### ✅ Objetivo: UX instantáneo con rollback en error

**Optimistic Updates Pattern:**

```jsx
// Optimistic toggle - actualiza UI inmediatamente
const optimisticToggle = async id => {
  // 1. Update UI optimistically
  setTodos(prev =>
    prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  );

  try {
    // 2. Send request to server
    const response = await fetch(
      `http://localhost:3001/api/todos/${id}/toggle`,
      {
        method: 'PATCH',
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    // 3. Update with server response (optional - already optimistic)
    setTodos(prev => prev.map(todo => (todo.id === id ? result.data : todo)));
  } catch (error) {
    // 4. Rollback on error
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    setError(error.message);
  }
};
```

---

## 🎯 VALIDACIÓN CORE

### ✅ Checklist Obligatorio (CORE MVP)

- [ ] ✅ GET /api/todos - READ operation
- [ ] ✅ POST /api/todos - CREATE operation
- [ ] ✅ PUT /api/todos/:id - UPDATE operation
- [ ] ✅ DELETE /api/todos/:id - DELETE operation
- [ ] ✅ PATCH /api/todos/:id/toggle - Toggle operation

### ⚡ Checklist Enhanced (ENHANCED MVP)

- [ ] ⚡ Frontend UI para todas las operaciones CRUD
- [ ] ⚡ Edit mode con inline editing
- [ ] ⚡ Confirmation dialogs para delete
- [ ] ⚡ Error handling para cada operación
- [ ] ⚡ Loading states apropiados

### ✨ Checklist Polish (POLISH MVP)

- [ ] ✨ Optimistic updates implementadas
- [ ] ✨ Smooth animations y transitions
- [ ] ✨ Stats display (total, completed, pending)
- [ ] ✨ Keyboard shortcuts (Enter, Escape)
- [ ] ✨ UX feedback inmediato

---

## 🚨 TESTING ENDPOINTS

```bash
# Test all CRUD operations
curl -X GET http://localhost:3001/api/todos
curl -X POST http://localhost:3001/api/todos -H "Content-Type: application/json" -d '{"title":"Test Create"}'
curl -X PUT http://localhost:3001/api/todos/1 -H "Content-Type: application/json" -d '{"title":"Test Update"}'
curl -X PATCH http://localhost:3001/api/todos/1/toggle
curl -X DELETE http://localhost:3001/api/todos/1
```

---

## ⏭️ SIGUIENTE PASO

**CRUD Complete implementado:**

- ✅ All HTTP methods working
- ✅ Frontend UI complete
- ✅ Optimistic updates
- ✅ Error handling robust

**Próximo**: `04-state-management` - Patterns avanzados

**Tiempo objetivo**: ✅ **Completado en 60 minutos**

---

## 📋 RESUMEN EJECUTIVO

### 🎯 ¿Qué Logramos?

- CRUD completo funcional
- UI rica e interactiva
- Optimistic updates
- Error handling robusto

### ⏰ Time Investment

- **Backend CRUD**: 25 min
- **Frontend UI**: 25 min
- **Optimistic UX**: 10 min
- **Total**: 60 min ✅

**🏆 Full CRUD MVP completado - Ready for state management!**

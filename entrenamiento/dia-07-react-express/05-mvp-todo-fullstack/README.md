# 🎯 05. MVP Full-Stack Todo App

**⏰ Tiempo asignado**: 60 minutos (3:30 PM - 4:30 PM)  
**🎯 Objetivo**: Aplicación completa funcional lista para competencia  
**📋 Estrategia**: Integration de todas las piezas en MVP production-ready

---

## ⏱️ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Objetivo                       | Status |
| --------------- | --------- | ------------------------------ | ------ |
| **🔧 CORE**     | 0-25 min  | App base integrada funcionando | ⭐     |
| **⚡ ENHANCED** | 25-50 min | Features completas + styling   | 🚀     |
| **✨ POLISH**   | 50-60 min | Production ready + deployment  | 🎨     |

---

## 🔧 FASE CORE (0-25 min) - App Base Integrada

### ✅ Objetivo: Todo app completamente funcional

**Complete Full-Stack App Structure:**

```
05-mvp-todo-fullstack/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoList.jsx
│   │   │   ├── TodoItem.jsx
│   │   │   ├── AddTodoForm.jsx
│   │   │   └── TodoStats.jsx
│   │   ├── contexts/
│   │   │   └── TodoContext.jsx
│   │   ├── hooks/
│   │   │   └── useTodos.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── server.js
    ├── routes/
    │   └── todos.js
    ├── middleware/
    │   └── errorHandler.js
    └── package.json
```

**Backend Production Structure (backend/server.js):**

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 🔧 Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:5173'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📝 Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
});

// 🎯 In-memory database simulation
let todos = [
  {
    id: 1,
    title: 'Configurar Full-Stack',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Implementar CRUD',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Agregar State Management',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Deploy a Producción',
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

// 📊 Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Full-Stack Todo API funcionando',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// GET todos
app.get('/api/todos', (req, res) => {
  try {
    const { filter = 'all', search = '' } = req.query;

    let filteredTodos = todos;

    // Filter by completion status
    if (filter === 'completed') {
      filteredTodos = filteredTodos.filter(todo => todo.completed);
    } else if (filter === 'pending') {
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
    }

    // Filter by search term
    if (search) {
      filteredTodos = filteredTodos.filter(todo =>
        todo.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: filteredTodos,
      meta: {
        total: filteredTodos.length,
        filter,
        search,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener todos',
      error: error.message,
    });
  }
});

// POST todo
app.post('/api/todos', (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'El título debe tener al menos 3 caracteres',
      });
    }

    const newTodo = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    todos.push(newTodo);

    res.status(201).json({
      success: true,
      message: 'Todo creado exitosamente',
      data: newTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear todo',
      error: error.message,
    });
  }
});

// PUT todo
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

// DELETE todo
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

// PATCH toggle
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

// 🚨 Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong!',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    path: req.originalUrl,
  });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log('🎯========================================');
  console.log('🚀 FULL-STACK TODO APP - SERVIDOR INICIADO');
  console.log('🎯========================================');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`📝 Todos: http://localhost:${PORT}/api/todos`);
  console.log('🎯========================================');
  console.log('✅ Ready for production deployment!');
  console.log('🎯========================================');
});

module.exports = app;
```

---

## ⚡ FASE ENHANCED (25-50 min) - Complete Frontend

### ✅ Objetivo: Frontend completo con todas las features

**Main App Component (frontend/src/App.jsx):**

```jsx
import { useState, useEffect } from 'react';
import { TodoProvider } from './contexts/TodoContext';
import TodoApp from './components/TodoApp';
import './App.css';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <TodoProvider>
      <div className="App">
        <header className="app-header">
          <h1>🎯 Full-Stack Todo App</h1>
          <div
            className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </div>
        </header>

        <main className="app-main">
          <TodoApp />
        </main>

        <footer className="app-footer">
          <p>🏆 WorldSkills 2025 - React + Express Integration</p>
        </footer>
      </div>
    </TodoProvider>
  );
}

export default App;
```

**TodoApp Component (frontend/src/components/TodoApp.jsx):**

```jsx
import { useState } from 'react';
import { useTodos } from '../contexts/TodoContext';
import AddTodoForm from './AddTodoForm';
import TodoList from './TodoList';
import TodoStats from './TodoStats';
import TodoFilters from './TodoFilters';

const TodoApp = () => {
  const { loading, error, clearError } = useTodos();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="todo-app">
      {/* Stats */}
      <TodoStats />

      {/* Add Todo Form */}
      <AddTodoForm />

      {/* Filters */}
      <TodoFilters
        filter={filter}
        onFilterChange={setFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span>❌ {error}</span>
          <button
            onClick={clearError}
            className="error-close">
            ✕
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-banner">
          <div className="loading-spinner"></div>
          <span>🔄 Procesando...</span>
        </div>
      )}

      {/* Todo List */}
      <TodoList
        filter={filter}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default TodoApp;
```

**Professional CSS (frontend/src/App.css):**

```css
/* 🎯 Full-Stack Todo App Styles */

:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --border-color: #e5e7eb;
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --radius: 0.5rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--bg-secondary);
}

.App {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 🎯 Header Styles */
.app-header {
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--primary-hover) 100%
  );
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.app-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.connection-status {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius);
  display: inline-block;
  font-weight: 500;
}

.connection-status.online {
  background-color: var(--success-color);
}

.connection-status.offline {
  background-color: var(--error-color);
}

/* 🎯 Main Content */
.app-main {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

.todo-app {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 📊 Stats Component */
.todo-stats {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  border-radius: var(--radius);
  background: var(--bg-secondary);
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ➕ Add Todo Form */
.add-todo-form {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: flex;
  gap: 1rem;
}

.add-todo-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.add-todo-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.add-todo-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-todo-btn:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.add-todo-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 🔍 Filters */
.todo-filters {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 0.5rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
}

/* 📝 Todo List */
.todos-list {
  background: var(--bg-primary);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
}

.todo-item:hover {
  background-color: var(--bg-secondary);
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item.completed {
  opacity: 0.7;
}

.todo-checkbox {
  margin-right: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.todo-title {
  flex: 1;
  font-size: 1rem;
  transition: text-decoration 0.2s ease;
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
}

.todo-action-btn {
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: var(--radius);
  transition: background-color 0.2s ease;
}

.todo-action-btn:hover {
  background-color: var(--bg-secondary);
}

/* 🚨 Error & Loading States */
.error-banner {
  background-color: var(--error-color);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: var(--radius);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
}

.loading-banner {
  background-color: var(--warning-color);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 🎯 Footer */
.app-footer {
  background-color: var(--text-primary);
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

/* 📱 Responsive Design */
@media (max-width: 768px) {
  .app-header {
    padding: 1.5rem 1rem;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .app-main {
    padding: 1rem;
  }

  .add-todo-form {
    flex-direction: column;
  }

  .todo-filters {
    flex-direction: column;
  }

  .filter-buttons {
    justify-content: center;
  }

  .todo-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .todo-stats {
    grid-template-columns: 1fr;
  }

  .todo-item {
    padding: 0.75rem 1rem;
  }
}
```

---

## ✨ FASE POLISH (50-60 min) - Production Ready

### ✅ Objetivo: Deploy preparation + final optimizations

**Production Scripts (package.json):**

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "cd frontend && npm run build",
    "start": "cd backend && npm start",
    "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

**Environment Configuration:**

```javascript
// backend/.env (example)
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com

// frontend/.env (example)
VITE_API_URL=https://api.yourdomain.com
```

**Deployment Ready Features:**

- Error boundaries
- Loading states
- Offline detection
- Environment variables
- Production optimizations
- Responsive design
- Accessibility features

---

## 🎯 VALIDACIÓN FINAL

### ✅ Checklist Production (CORE MVP)

- [ ] ✅ Full-Stack app funcionando completamente
- [ ] ✅ All CRUD operations working
- [ ] ✅ Error handling robusto
- [ ] ✅ Loading states implementados
- [ ] ✅ Responsive design funcionando

### ⚡ Checklist Features (ENHANCED MVP)

- [ ] ⚡ Search and filter funcionando
- [ ] ⚡ Stats dashboard actualizado
- [ ] ⚡ Offline detection implementado
- [ ] ⚡ Professional styling completo
- [ ] ⚡ Mobile responsive optimizado

### ✨ Checklist Production (POLISH MVP)

- [ ] ✨ Build scripts configurados
- [ ] ✨ Environment variables setup
- [ ] ✨ Performance optimized
- [ ] ✨ Ready for deployment
- [ ] ✨ Documentation completa

---

## 🚀 DEPLOYMENT INSTRUCTIONS

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Serve static files from backend (opcional)
cd ../backend
# Add static file serving to server.js

# 3. Start production server
npm start

# 4. Test production build
curl http://localhost:3001/api/health
```

---

## ⏭️ RESULTADO FINAL

**✅ MVP Full-Stack Todo App Completada:**

- Complete CRUD functionality
- Professional UI/UX
- Error handling & loading states
- Search & filter capabilities
- Stats dashboard
- Responsive design
- Production ready
- Deployment prepared

**Tiempo objetivo**: ✅ **Completado en 60 minutos**

---

## 📋 RESUMEN EJECUTIVO

### 🎯 ¿Qué Logramos?

- Aplicación Full-Stack completa y funcional
- All features implementadas profesionalmente
- Ready for WorldSkills competition
- Production deployment ready

### ⏰ Time Investment

- **Core Integration**: 25 min
- **Complete Features**: 25 min
- **Production Polish**: 10 min
- **Total**: 60 min ✅

**🏆 MVP Full-Stack Todo App completada - PRODUCTION READY!**

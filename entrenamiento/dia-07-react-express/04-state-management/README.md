# 🎯 04. State Management Patterns

**⏰ Tiempo asignado**: 30 minutos (2:45 PM - 3:15 PM)  
**🎯 Objetivo**: Implementar patrones de estado escalables para Full-Stack  
**📋 Estrategia**: Context API + Custom Hooks + State patterns

---

## ⏱️ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Objetivo                 | Status |
| --------------- | --------- | ------------------------ | ------ |
| **🔧 CORE**     | 0-12 min  | Context API básico       | ⭐     |
| **⚡ ENHANCED** | 12-25 min | Custom hooks + reducers  | 🚀     |
| **✨ POLISH**   | 25-30 min | Performance optimization | 🎨     |

---

## 🔧 FASE CORE (0-12 min) - Context API Setup

### ✅ Objetivo: Global state funcional

**TodoContext Setup (contexts/TodoContext.jsx):**

```jsx
import { createContext, useContext, useState, useEffect } from 'react';

// 🎯 Create Context
const TodoContext = createContext();

// 🔧 Custom hook para usar el context
export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos debe ser usado dentro de TodoProvider');
  }
  return context;
};

// 🏗️ TodoProvider Component
export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 📊 API Base URL
  const API_BASE = 'http://localhost:3001/api';

  // 🔄 Fetch todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/todos`);
      const result = await response.json();

      if (result.success) {
        setTodos(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('❌ Fetch todos error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add todo
  const addTodo = async title => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      const result = await response.json();

      if (result.success) {
        setTodos(prev => [...prev, result.data]);
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('❌ Add todo error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Update todo
  const updateTodo = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (result.success) {
        setTodos(prev =>
          prev.map(todo => (todo.id === id ? result.data : todo))
        );
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('❌ Update todo error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete todo
  const deleteTodo = async id => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('❌ Delete todo error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle todo
  const toggleTodo = async id => {
    try {
      // Optimistic update
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );

      const response = await fetch(`${API_BASE}/todos/${id}/toggle`, {
        method: 'PATCH',
      });

      const result = await response.json();

      if (result.success) {
        setTodos(prev =>
          prev.map(todo => (todo.id === id ? result.data : todo))
        );
        return result.data;
      } else {
        // Rollback optimistic update
        setTodos(prev =>
          prev.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        );
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('❌ Toggle todo error:', error);
      setError(error.message);
      throw error;
    }
  };

  // 🧹 Clear error
  const clearError = () => setError(null);

  // 📊 Computed values
  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    pending: todos.filter(todo => !todo.completed).length,
  };

  // 🔄 Load todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const value = {
    // State
    todos,
    loading,
    error,
    stats,

    // Actions
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearError,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
```

---

## ⚡ FASE ENHANCED (12-25 min) - Advanced Hooks

### ✅ Objetivo: Custom hooks especializados

**Advanced Hooks (hooks/useTodoOperations.js):**

```jsx
import { useState } from 'react';
import { useTodos } from '../contexts/TodoContext';

// 🎯 Hook para operaciones de todos
export const useTodoOperations = () => {
  const { addTodo, updateTodo, deleteTodo, toggleTodo } = useTodos();
  const [operationLoading, setOperationLoading] = useState({});

  const setLoading = (operation, id, isLoading) => {
    setOperationLoading(prev => ({
      ...prev,
      [`${operation}_${id || 'general'}`]: isLoading,
    }));
  };

  const isLoading = (operation, id) => {
    return operationLoading[`${operation}_${id || 'general'}`] || false;
  };

  // ➕ Enhanced add with loading state
  const handleAddTodo = async title => {
    setLoading('add', null, true);
    try {
      const newTodo = await addTodo(title);
      return newTodo;
    } finally {
      setLoading('add', null, false);
    }
  };

  // ✏️ Enhanced update with loading state
  const handleUpdateTodo = async (id, updates) => {
    setLoading('update', id, true);
    try {
      const updatedTodo = await updateTodo(id, updates);
      return updatedTodo;
    } finally {
      setLoading('update', id, false);
    }
  };

  // 🗑️ Enhanced delete with confirmation
  const handleDeleteTodo = async (
    id,
    confirmMessage = '¿Eliminar este todo?'
  ) => {
    if (!confirm(confirmMessage)) return false;

    setLoading('delete', id, true);
    try {
      await deleteTodo(id);
      return true;
    } finally {
      setLoading('delete', id, false);
    }
  };

  // ✅ Enhanced toggle with loading state
  const handleToggleTodo = async id => {
    setLoading('toggle', id, true);
    try {
      const toggledTodo = await toggleTodo(id);
      return toggledTodo;
    } finally {
      setLoading('toggle', id, false);
    }
  };

  return {
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
    handleToggleTodo,
    isLoading,
  };
};

// 🔍 Hook para filtros y búsqueda
export const useTodoFilters = () => {
  const { todos } = useTodos();
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTodos = todos.filter(todo => {
    // Filter by completion status
    let matchesFilter = true;
    if (filter === 'completed') matchesFilter = todo.completed;
    if (filter === 'pending') matchesFilter = !todo.completed;

    // Filter by search term
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return {
    filteredTodos,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    filterOptions: [
      { value: 'all', label: 'Todos', count: todos.length },
      {
        value: 'pending',
        label: 'Pendientes',
        count: todos.filter(t => !t.completed).length,
      },
      {
        value: 'completed',
        label: 'Completados',
        count: todos.filter(t => t.completed).length,
      },
    ],
  };
};

// 📝 Hook para edición inline
export const useInlineEdit = (initialValue = '') => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [originalValue, setOriginalValue] = useState(initialValue);

  const startEdit = currentValue => {
    setOriginalValue(currentValue);
    setValue(currentValue);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setValue(originalValue);
    setIsEditing(false);
  };

  const saveEdit = onSave => {
    if (value.trim() && value !== originalValue) {
      onSave(value);
    }
    setIsEditing(false);
  };

  return {
    isEditing,
    value,
    setValue,
    startEdit,
    cancelEdit,
    saveEdit,
  };
};
```

---

## ✨ FASE POLISH (25-30 min) - Performance Optimization

### ✅ Objetivo: React.memo + useMemo optimization

**Optimized Components:**

```jsx
import React, { memo, useMemo } from 'react';
import { useTodos } from '../contexts/TodoContext';

// 🎯 Memoized Todo Item Component
export const TodoItem = memo(
  ({ todo, onToggle, onEdit, onDelete, isLoading }) => {
    console.log(`🔄 TodoItem ${todo.id} rendered`);

    return (
      <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          disabled={isLoading('toggle', todo.id)}
        />

        <span className="todo-title">{todo.title}</span>

        <div className="todo-actions">
          <button
            onClick={() => onEdit(todo)}
            disabled={isLoading('update', todo.id)}>
            {isLoading('update', todo.id) ? '⏳' : '✏️'}
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            disabled={isLoading('delete', todo.id)}>
            {isLoading('delete', todo.id) ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>
    );
  }
);

// 🎯 Memoized Stats Component
export const TodoStats = memo(() => {
  const { stats } = useTodos();

  const completionPercentage = useMemo(() => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }, [stats.completed, stats.total]);

  return (
    <div className="todo-stats">
      <div className="stat">
        <span className="stat-label">Total:</span>
        <span className="stat-value">{stats.total}</span>
      </div>

      <div className="stat">
        <span className="stat-label">Completados:</span>
        <span className="stat-value">{stats.completed}</span>
      </div>

      <div className="stat">
        <span className="stat-label">Pendientes:</span>
        <span className="stat-value">{stats.pending}</span>
      </div>

      <div className="stat progress">
        <span className="stat-label">Progreso:</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          />
          <span className="progress-text">{completionPercentage}%</span>
        </div>
      </div>
    </div>
  );
});
```

**Main App with Context:**

```jsx
// App.jsx
import { TodoProvider } from './contexts/TodoContext';
import TodoApp from './components/TodoApp';

function App() {
  return (
    <TodoProvider>
      <div className="App">
        <TodoApp />
      </div>
    </TodoProvider>
  );
}

export default App;

// components/TodoApp.jsx
import { useTodos } from '../contexts/TodoContext';
import { useTodoOperations, useTodoFilters } from '../hooks/useTodoOperations';
import { TodoItem, TodoStats } from './OptimizedComponents';

const TodoApp = () => {
  const { loading, error, clearError } = useTodos();
  const { handleAddTodo, handleUpdateTodo, handleDeleteTodo, handleToggleTodo, isLoading } = useTodoOperations();
  const { filteredTodos, filter, setFilter, searchTerm, setSearchTerm, filterOptions } = useTodoFilters();

  return (
    <div className="todo-app">
      <h1>🎯 State Management Demo</h1>

      <TodoStats />

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar todos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label} ({option.count})
            </option>
          ))}
        </select>
      </div>

      {/* Error handling */}
      {error && (
        <div className="error">
          ❌ {error}
          <button onClick={clearError}>✕</button>
        </div>
      )}

      {/* Todos list */}
      {loading && <div className="loading">🔄 Cargando...</div>}

      <div className="todos-list">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggleTodo}
            onEdit={handleUpdateTodo}
            onDelete={handleDeleteTodo}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoApp;
```

---

## 🎯 VALIDACIÓN

### ✅ Checklist Obligatorio (CORE MVP)

- [ ] ✅ Context API configurado correctamente
- [ ] ✅ Global state funcionando
- [ ] ✅ Provider wrapping app
- [ ] ✅ Custom hook useTodos funcional

### ⚡ Checklist Enhanced (ENHANCED MVP)

- [ ] ⚡ Custom hooks especializados
- [ ] ⚡ Loading states granulares
- [ ] ⚡ Filtros y búsqueda
- [ ] ⚡ Inline editing hooks

### ✨ Checklist Polish (POLISH MVP)

- [ ] ✨ React.memo optimizations
- [ ] ✨ useMemo para cálculos pesados
- [ ] ✨ Render optimization
- [ ] ✨ Performance monitoring

---

## ⏭️ SIGUIENTE PASO

**State Management implementado:**

- ✅ Context API global state
- ✅ Custom hooks especializados
- ✅ Performance optimizations
- ✅ Scalable architecture

**Próximo**: `05-mvp-todo-fullstack` - App completa

**Tiempo objetivo**: ✅ **Completado en 30 minutos**

---

## 📋 RESUMEN EJECUTIVO

### 🎯 ¿Qué Logramos?

- Global state management
- Custom hooks architecture
- Performance optimizations
- Scalable patterns

### ⏰ Time Investment

- **Context Setup**: 12 min
- **Custom Hooks**: 13 min
- **Optimization**: 5 min
- **Total**: 30 min ✅

**🏆 State Management MVP completado!**

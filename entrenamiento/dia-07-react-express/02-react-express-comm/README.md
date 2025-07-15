# 🎯 02. React + Express Communication

**⏰ Tiempo asignado**: 60 minutos (12:30 PM - 1:30 PM)  
**🎯 Objetivo**: Dominar comunicación bidireccional React ↔ Express  
**📋 Estrategia**: API calls avanzados con manejo de estado

---

## ⏱️ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Objetivo                       | Status |
| --------------- | --------- | ------------------------------ | ------ |
| **🔧 CORE**     | 0-25 min  | GET y POST básicos funcionando | ⭐     |
| **⚡ ENHANCED** | 25-50 min | Forms + error handling         | 🚀     |
| **✨ POLISH**   | 50-60 min | Loading states + UX            | 🎨     |

---

## 🔧 FASE CORE (0-25 min) - API Básica

### ✅ Objetivo: GET y POST funcionando perfectamente

**Backend: Endpoints Básicos (server.js)**:

```javascript
// 📊 Data storage simulado (en memoria)
let todos = [
  {
    id: 1,
    title: 'Aprender React',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Configurar Express',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Implementar CRUD',
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

// GET - Obtener todos los todos
app.get('/api/todos', (req, res) => {
  try {
    console.log('📊 GET /api/todos - Enviando todos');
    res.json({
      success: true,
      data: todos,
      count: todos.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener todos',
      error: error.message,
    });
  }
});

// POST - Crear nuevo todo
app.post('/api/todos', (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El título es requerido',
      });
    }

    const newTodo = {
      id: Date.now(), // Simple ID generation
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    todos.push(newTodo);

    console.log('✅ POST /api/todos - Todo creado:', newTodo);

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
```

**Frontend: API Communication (App.jsx)**:

```jsx
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 📊 Fetch todos from API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/todos');
      const result = await response.json();

      if (result.success) {
        setTodos(result.data);
        console.log('✅ Todos cargados:', result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('❌ Error fetchTodos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add new todo
  const addTodo = async e => {
    e.preventDefault();

    if (!newTodo.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo }),
      });

      const result = await response.json();

      if (result.success) {
        setTodos(prev => [...prev, result.data]);
        setNewTodo('');
        console.log('✅ Todo agregado:', result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('❌ Error addTodo:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Load todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 React ↔ Express Communication</h1>

        {/* ➕ Add Todo Form */}
        <form
          onSubmit={addTodo}
          className="add-todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            placeholder="Nuevo todo..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newTodo.trim()}>
            {loading ? '⏳' : '➕'} Agregar
          </button>
        </form>

        {/* 📊 Todos List */}
        <div className="todos-section">
          <h2>📝 Lista de Todos ({todos.length})</h2>

          {error && (
            <div className="error">
              ❌ Error: {error}
              <button onClick={fetchTodos}>🔄 Reintentar</button>
            </div>
          )}

          {loading && <div className="loading">🔄 Cargando...</div>}

          <div className="todos-list">
            {todos.map(todo => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <span>{todo.title}</span>
                <small>#{todo.id}</small>
              </div>
            ))}

            {todos.length === 0 && !loading && (
              <p className="empty-state">
                📝 No hay todos. ¡Agrega el primero!
              </p>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
```

---

## ⚡ FASE ENHANCED (25-50 min) - Forms + Error Handling

### ✅ Objetivo: Validación robusta y manejo de errores

**Enhanced Form Validation:**

```jsx
// 🔧 Custom hook para manejo de forms
const useFormHandler = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validate = val => {
    if (!val || val.trim().length < 3) {
      setError('Mínimo 3 caracteres requeridos');
      return false;
    }
    if (val.length > 100) {
      setError('Máximo 100 caracteres permitidos');
      return false;
    }
    setError('');
    return true;
  };

  const handleChange = e => {
    const newValue = e.target.value;
    setValue(newValue);
    if (touched) validate(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
    validate(value);
  };

  const reset = () => {
    setValue(initialValue);
    setError('');
    setTouched(false);
  };

  return {
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    validate: () => validate(value),
    reset,
  };
};
```

**Enhanced Error Handling Backend:**

```javascript
// 🚨 Enhanced error handling middleware
app.use('/api', (req, res, next) => {
  // Request logging
  console.log(`📥 ${req.method} ${req.path}`, req.body);
  next();
});

// POST with validation
app.post('/api/todos', (req, res) => {
  try {
    const { title } = req.body;

    // Enhanced validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'El título es requerido',
        field: 'title',
      });
    }

    if (title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'El título debe tener al menos 3 caracteres',
        field: 'title',
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'El título no puede exceder 100 caracteres',
        field: 'title',
      });
    }

    // Check for duplicates
    const exists = todos.find(
      todo => todo.title.toLowerCase() === title.trim().toLowerCase()
    );

    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un todo con ese título',
        field: 'title',
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
    console.error('❌ POST /api/todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
});
```

---

## ✨ FASE POLISH (50-60 min) - Loading States + UX

### ✅ Objetivo: UX profesional y feedback visual

**Loading States y Toast Notifications:**

```jsx
// 🎨 Toast notification system
const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  return { toast, showToast };
};

// Enhanced UX components
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <span>Procesando...</span>
  </div>
);

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <span>{toast.message}</span>
      <button onClick={onClose}>✕</button>
    </div>
  );
};
```

---

## 🎯 VALIDACIÓN ENHANCED

### ✅ Checklist Obligatorio (CORE MVP)

- [ ] ✅ GET /api/todos funcionando correctamente
- [ ] ✅ POST /api/todos creando todos nuevos
- [ ] ✅ Frontend renderizando lista desde API
- [ ] ✅ Form submission funcionando
- [ ] ✅ Estado sincronizado entre frontend y backend

### ⚡ Checklist Enhanced (ENHANCED MVP)

- [ ] ⚡ Validación de forms en frontend y backend
- [ ] ⚡ Error handling robusto implementado
- [ ] ⚡ Duplicates checking funcionando
- [ ] ⚡ Loading states durante requests
- [ ] ⚡ User feedback apropiado

### ✨ Checklist Polish (POLISH MVP)

- [ ] ✨ Toast notifications implementadas
- [ ] ✨ Loading spinners profesionales
- [ ] ✨ UX smooth y responsive
- [ ] ✨ Error recovery patterns
- [ ] ✨ Code optimizado y limpio

---

## 🚨 TROUBLESHOOTING

### ❌ Problemas Comunes

1. **CORS Errors**: Verificar frontend URL en cors config
2. **JSON Parse Errors**: Verificar Content-Type headers
3. **State No Sincronizado**: Verificar que callbacks actualicen estado
4. **Validation Errors**: Verificar consistencia frontend/backend

### ✅ Testing Rápido

```bash
# Test endpoints con curl
curl -X GET http://localhost:3001/api/todos
curl -X POST http://localhost:3001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test desde curl"}'
```

---

## ⏭️ SIGUIENTE PASO

**Comunicación establecida exitosamente:**

- ✅ API endpoints funcionando
- ✅ React consuming API
- ✅ Forms con validación
- ✅ Error handling implementado

**Próximo**: `03-crud-operations` - CRUD completo

**Tiempo objetivo**: ✅ **Completado en 60 minutos**

---

## 📋 RESUMEN EJECUTIVO

### 🎯 ¿Qué Logramos?

- Comunicación bidireccional React ↔ Express
- API endpoints con validación
- Form handling profesional
- Error handling robusto

### ⏰ Time Investment

- **API Setup**: 25 min
- **Validation**: 25 min
- **UX Polish**: 10 min
- **Total**: 60 min ✅

**🏆 Communication MVP completado - Ready for CRUD operations!**

# 🔄 Props & State | 25 minutos

## 🎯 OBJETIVO: Dominar useState y manejo de estado local

**TIMEBOXING**: 25 minutos exactos  
**RESULTADO**: Aplicación interactiva con estado dinámico

---

## ⏰ Cronograma Sección 3

| Tarea               | Tiempo | Estado |
| ------------------- | ------ | ------ |
| **useState básico** | 8 min  | ⏳     |
| **Estado complejo** | 8 min  | ⏳     |
| **Formularios**     | 6 min  | ⏳     |
| **Validación**      | 3 min  | ⏳     |

---

## 🚀 FASE CORE (15 min) - useState Esencial

### 🔢 Paso 1: Counter Básico (8 min)

**Crear**: `src/components/Counter.jsx`

```jsx
// 🎯 FASE CORE: useState básico - Patrón fundamental React
import { useState } from 'react';

function Counter() {
  // Hook useState: [valor, funcionParaCambiar] = useState(valorInicial)
  const [count, setCount] = useState(0);

  // Event handlers - Funciones que modifican el estado
  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="counter">
      <h3>🔢 Contador React</h3>

      {/* El estado se refleja automáticamente en la UI */}
      <div className="counter-display">
        <span className="count-value">{count}</span>
      </div>

      {/* Botones que modifican el estado */}
      <div className="counter-controls">
        <button
          className="btn secondary"
          onClick={handleDecrement}>
          ➖ Decrementar
        </button>

        <button
          className="btn primary"
          onClick={handleIncrement}>
          ➕ Incrementar
        </button>

        <button
          className="btn warning"
          onClick={handleReset}>
          🔄 Reset
        </button>
      </div>

      {/* Renderizado condicional basado en estado */}
      {count > 10 && (
        <div className="alert success">🎉 ¡Has superado los 10!</div>
      )}

      {count < 0 && <div className="alert warning">⚠️ Número negativo</div>}
    </div>
  );
}

export default Counter;
```

### 📝 Paso 2: Todo List con Estado (8 min)

**Crear**: `src/components/TodoList.jsx`

```jsx
// 🎯 Estado complejo: Arrays y objetos
import { useState } from 'react';

function TodoList() {
  // Estado para la lista de tareas
  const [todos, setTodos] = useState([
    { id: 1, text: 'Aprender React', completed: false },
    { id: 2, text: 'Practicar useState', completed: true },
    { id: 3, text: 'Dominar componentes', completed: false },
  ]);

  // Estado para el input de nueva tarea
  const [newTodo, setNewTodo] = useState('');

  // Agregar nueva tarea
  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      const newTask = {
        id: Date.now(), // ID simple para demo
        text: newTodo,
        completed: false,
      };

      // Actualizar estado inmutablemente
      setTodos([...todos, newTask]);
      setNewTodo(''); // Limpiar input
    }
  };

  // Marcar tarea como completada
  const handleToggleTodo = id => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Eliminar tarea
  const handleDeleteTodo = id => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Manejar cambio en input
  const handleInputChange = e => {
    setNewTodo(e.target.value);
  };

  // Estadísticas calculadas
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="todo-list">
      <header className="todo-header">
        <h3>📝 Lista de Tareas</h3>
        <p>
          Completadas: {completedCount}/{totalCount}
        </p>
      </header>

      {/* Formulario para agregar tareas */}
      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          placeholder="Nueva tarea..."
          className="input"
          onKeyPress={e => e.key === 'Enter' && handleAddTodo()}
        />
        <button
          onClick={handleAddTodo}
          className="btn primary">
          ➕ Agregar
        </button>
      </div>

      {/* Lista de tareas */}
      <div className="todos">
        {todos.map(todo => (
          <div
            key={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <label className="todo-label">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
              />
              <span className="todo-text">{todo.text}</span>
            </label>

            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="btn danger small">
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {todos.length === 0 && (
        <div className="empty-state">
          <p>📋 No hay tareas. ¡Agrega una nueva!</p>
        </div>
      )}
    </div>
  );
}

export default TodoList;
```

---

## ⚡ FASE ENHANCED (8 min) - Formularios

### 📋 Paso 3: Formulario Controlado (6 min)

**Crear**: `src/components/UserForm.jsx`

```jsx
// 🎯 Formularios controlados - Patrón clave para WorldSkills
import { useState } from 'react';

function UserForm() {
  // Estado para el formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    country: 'Colombia',
  });

  // Estado para errores
  const [errors, setErrors] = useState({});

  // Estado para envío
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en inputs
  const handleInputChange = e => {
    const { name, value } = e.target;

    // Actualizar estado del formulario
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.age) {
      newErrors.age = 'La edad es requerida';
    } else if (formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Edad debe estar entre 1 y 120';
    }

    return newErrors;
  };

  // Manejar envío del formulario
  const handleSubmit = async e => {
    e.preventDefault();

    // Validar
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simular envío
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    alert(
      `¡Usuario creado!\nNombre: ${formData.name}\nEmail: ${formData.email}`
    );

    // Reset form
    setFormData({ name: '', email: '', age: '', country: 'Colombia' });
    setIsSubmitting(false);
  };

  return (
    <div className="user-form">
      <h3>👤 Registro de Usuario</h3>

      <form
        onSubmit={handleSubmit}
        className="form">
        {/* Campo Nombre */}
        <div className="form-group">
          <label htmlFor="name">Nombre completo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`input ${errors.name ? 'error' : ''}`}
            placeholder="Tu nombre completo"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Campo Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`input ${errors.email ? 'error' : ''}`}
            placeholder="tu@email.com"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Campo Edad */}
        <div className="form-group">
          <label htmlFor="age">Edad</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className={`input ${errors.age ? 'error' : ''}`}
            placeholder="25"
            min="1"
            max="120"
          />
          {errors.age && <span className="error-text">{errors.age}</span>}
        </div>

        {/* Campo País */}
        <div className="form-group">
          <label htmlFor="country">País</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="input">
            <option value="Colombia">Colombia</option>
            <option value="México">México</option>
            <option value="Argentina">Argentina</option>
            <option value="Chile">Chile</option>
          </select>
        </div>

        {/* Botón envío */}
        <button
          type="submit"
          className="btn primary full-width"
          disabled={isSubmitting}>
          {isSubmitting ? '⏳ Creando...' : '✅ Crear Usuario'}
        </button>
      </form>

      {/* Mostrar datos actuales */}
      <div className="form-preview">
        <h4>Vista previa:</h4>
        <p>Nombre: {formData.name || 'Sin nombre'}</p>
        <p>Email: {formData.email || 'Sin email'}</p>
        <p>Edad: {formData.age || 'Sin edad'}</p>
        <p>País: {formData.country}</p>
      </div>
    </div>
  );
}

export default UserForm;
```

### 🎨 Estilos para Componentes

**Agregar a** `src/index.css`:

```css
/* Counter styles */
.counter {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 2rem;
}

.counter-display {
  margin: 2rem 0;
}

.count-value {
  font-size: 3rem;
  font-weight: bold;
  color: #4caf50;
}

.counter-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Todo List styles */
.todo-list {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.todo-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.todo-input {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.todo-input .input {
  flex: 1;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.todo-item:hover {
  background-color: #f9f9f9;
}

.todo-item.completed {
  background-color: #f0f8f0;
}

.todo-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  flex: 1;
}

.todo-text {
  transition: all 0.3s ease;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #999;
}

/* Form styles */
.user-form {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #4caf50;
}

.input.error {
  border-color: #f44336;
}

.error-text {
  color: #f44336;
  font-size: 0.9rem;
  margin-top: 0.3rem;
  display: block;
}

.form-preview {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
}

.form-preview h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

/* Button styles */
.btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn.primary {
  background: #4caf50;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #45a049;
}

.btn.secondary {
  background: #2196f3;
  color: white;
}

.btn.warning {
  background: #ff9800;
  color: white;
}

.btn.danger {
  background: #f44336;
  color: white;
}

.btn.small {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
}

.btn.full-width {
  width: 100%;
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Alert styles */
.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.alert.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert.warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
}
```

---

## ✨ FASE POLISH (2 min) - Integración

### 🔄 Actualizar App Principal

**Modificar** `src/App.jsx`:

```jsx
import Counter from './components/Counter';
import TodoList from './components/TodoList';
import UserForm from './components/UserForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🚀 React State Demo</h1>
        <p>WorldSkills 2025 - Props & State Management</p>
      </header>

      <main className="app-main">
        <div className="components-grid">
          <Counter />
          <TodoList />
          <UserForm />
        </div>
      </main>
    </div>
  );
}

export default App;
```

**Agregar a** `src/index.css`:

```css
.app-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .components-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## ✅ Checklist de Validación

**Verificar**:

- [ ] ✅ useState funcionando en Counter
- [ ] ✅ Estado complejo en TodoList
- [ ] ✅ Formularios controlados operativos
- [ ] ✅ Validación en tiempo real
- [ ] ✅ Event handlers funcionando
- [ ] ✅ Renderizado condicional activo

---

## 🎯 Competencias Desarrolladas

1. ✅ **useState Hook** - Estado local básico
2. ✅ **Estado Complejo** - Arrays y objetos
3. ✅ **Formularios Controlados** - Input handling
4. ✅ **Event Handling** - onClick, onChange, onSubmit
5. ✅ **Validación** - Errores y feedback
6. ✅ **Inmutabilidad** - Actualización correcta de estado

---

## ⏭️ Próximo Paso

**Sección 4**: Hooks Básicos (30 min)

- useEffect hook
- Lifecycle patterns
- Side effects

---

**⏰ TIEMPO LÍMITE: 25 MINUTOS**  
**🎯 ¡DOMINA useState PARA WORLDSKILLS!**

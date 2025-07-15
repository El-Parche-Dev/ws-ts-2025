import { useEffect, useState } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';

function App() {
  // ========== ESTADO PRINCIPAL ==========
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // ========== FASE CORE ✅ (25 min) ==========
  // Funcionalidad: CRUD básico - Create, Read, Update, Delete

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/tasks');
      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: No se pudieron cargar las tareas`
        );
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async taskData => {
    try {
      setError(null);

      const response = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la tarea');
      }

      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      setError(null);

      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la tarea');
      }

      const updatedTask = await response.json();
      setTasks(prev => prev.map(task => (task.id === id ? updatedTask : task)));

      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async id => {
    try {
      setError(null);

      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar la tarea');
      }

      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // ========== FASE ENHANCED ⚡ (25 min) ==========
  // Mejoras: Toggle completado, filtros, búsqueda

  const toggleTaskComplete = async id => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      await updateTask(id, {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null,
      });
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const handleEditTask = task => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleSaveEdit = async taskData => {
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } catch (err) {
      console.error('Error saving edit:', err);
    }
  };

  // ========== FASE POLISH ✨ (10 min) ==========
  // Optimizaciones: Loading states, animaciones, better UX

  if (loading && tasks.length === 0) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 CRUD Operations - Task Manager</h1>
        <p>Create, Read, Update, Delete - WorldSkills MVP</p>
      </header>

      {error && (
        <div className="error-banner">
          <span>❌ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="app-layout">
        <aside className="sidebar">
          <TaskStats tasks={tasks} />

          <div className="task-form-container">
            <h2>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
            <TaskForm
              onSubmit={editingTask ? handleSaveEdit : createTask}
              onCancel={editingTask ? handleCancelEdit : null}
              initialData={editingTask}
              loading={loading}
            />
          </div>
        </aside>

        <main className="main-content">
          <TaskList
            tasks={tasks}
            onToggleComplete={toggleTaskComplete}
            onEdit={handleEditTask}
            onDelete={deleteTask}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
}

export default App;

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// ========== MIDDLEWARE ==========
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// ========== DATA STORAGE (In-memory para MVP) ==========
let tasks = [
  {
    id: 1,
    title: 'Completar proyecto React',
    description:
      'Terminar la implementación del componente de tareas con todas las funcionalidades CRUD',
    priority: 'high',
    completed: false,
    dueDate: '2025-01-20',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Revisar documentación',
    description: 'Leer la documentación de Express.js para endpoints RESTful',
    priority: 'medium',
    completed: false,
    dueDate: '2025-01-18',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Preparar presentación',
    description: 'Crear slides para la demo del proyecto full-stack',
    priority: 'urgent',
    completed: true,
    dueDate: '2025-01-17',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
];

let nextId = 4;

// ========== HELPER FUNCTIONS ==========
const validateTask = (task, isUpdate = false) => {
  const errors = [];

  // Validar título
  if (!task.title || task.title.trim().length === 0) {
    errors.push('El título es requerido');
  } else if (task.title.trim().length < 3) {
    errors.push('El título debe tener al menos 3 caracteres');
  } else if (task.title.trim().length > 100) {
    errors.push('El título no puede exceder 100 caracteres');
  }

  // Validar descripción
  if (!task.description || task.description.trim().length === 0) {
    errors.push('La descripción es requerida');
  } else if (task.description.trim().length < 10) {
    errors.push('La descripción debe tener al menos 10 caracteres');
  }

  // Validar prioridad
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!task.priority || !validPriorities.includes(task.priority)) {
    errors.push('La prioridad debe ser: low, medium, high o urgent');
  }

  // Validar fecha de vencimiento
  if (!task.dueDate) {
    errors.push('La fecha de vencimiento es requerida');
  } else {
    const dueDate = new Date(task.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.push('La fecha de vencimiento no es válida');
    }
  }

  return errors;
};

const sanitizeTask = task => {
  return {
    title: task.title ? task.title.trim() : '',
    description: task.description ? task.description.trim() : '',
    priority: task.priority ? task.priority.toLowerCase() : 'medium',
    dueDate: task.dueDate,
    completed: Boolean(task.completed),
  };
};

// ========== API ENDPOINTS ==========

// 🔧 FASE CORE - CRUD básico
app.get('/api/test', (req, res) => {
  res.json({
    message: '¡Backend CRUD funcionando!',
    endpoints: ['/api/tasks', '/api/tasks/:id'],
    timestamp: new Date().toISOString(),
  });
});

// GET - Obtener todas las tareas
app.get('/api/tasks', (req, res) => {
  try {
    const {
      completed,
      priority,
      sortBy = 'dueDate',
      order = 'asc',
    } = req.query;
    let filteredTasks = [...tasks];

    // Filtrar por estado completado
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      filteredTasks = filteredTasks.filter(
        task => task.completed === isCompleted
      );
    }

    // Filtrar por prioridad
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }

    // Ordenar tareas
    filteredTasks.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorities = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = priorities[a.priority] - priorities[b.priority];
          break;
        case 'dueDate':
        default:
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
      }

      return order === 'desc' ? -comparison : comparison;
    });

    console.log(`📋 GET /api/tasks - Enviando ${filteredTasks.length} tareas`);
    res.json(filteredTasks);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
    });
  }
});

// GET - Obtener tarea por ID
app.get('/api/tasks/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
      return res.status(404).json({
        error: 'Tarea no encontrada',
        id: id,
      });
    }

    console.log(`📝 GET /api/tasks/${id} - Tarea encontrada`);
    res.json(task);
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
    });
  }
});

// POST - Crear nueva tarea
app.post('/api/tasks', (req, res) => {
  try {
    const sanitizedTask = sanitizeTask(req.body);

    // Validar datos
    const errors = validateTask(sanitizedTask);
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: errors,
      });
    }

    // Crear nueva tarea
    const newTask = {
      id: nextId++,
      ...sanitizedTask,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    console.log(`✅ POST /api/tasks - Tarea creada: ${newTask.title}`);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
    });
  }
});

// PUT - Actualizar tarea completa
app.put('/api/tasks/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        error: 'Tarea no encontrada',
        id: id,
      });
    }

    const sanitizedTask = sanitizeTask(req.body);

    // Validar datos
    const errors = validateTask(sanitizedTask, true);
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: errors,
      });
    }

    // Actualizar tarea
    const updatedTask = {
      ...tasks[taskIndex],
      ...sanitizedTask,
      updatedAt: new Date().toISOString(),
    };

    // Si se marca como completada y no estaba completada
    if (sanitizedTask.completed && !tasks[taskIndex].completed) {
      updatedTask.completedAt = new Date().toISOString();
    }
    // Si se desmarca como completada
    else if (!sanitizedTask.completed && tasks[taskIndex].completed) {
      delete updatedTask.completedAt;
    }

    tasks[taskIndex] = updatedTask;

    console.log(
      `📝 PUT /api/tasks/${id} - Tarea actualizada: ${updatedTask.title}`
    );
    res.json(updatedTask);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
    });
  }
});

// PATCH - Actualizar tarea parcialmente (útil para toggle completed)
app.patch('/api/tasks/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        error: 'Tarea no encontrada',
        id: id,
      });
    }

    const updates = req.body;
    const currentTask = tasks[taskIndex];

    // Actualizar campos específicos
    const updatedTask = {
      ...currentTask,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Manejar cambio de estado completado
    if ('completed' in updates) {
      if (updates.completed && !currentTask.completed) {
        updatedTask.completedAt = new Date().toISOString();
      } else if (!updates.completed && currentTask.completed) {
        delete updatedTask.completedAt;
      }
    }

    tasks[taskIndex] = updatedTask;

    console.log(`🔄 PATCH /api/tasks/${id} - Tarea parcialmente actualizada`);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error al actualizar tarea parcialmente:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
    });
  }
});

// DELETE - Eliminar tarea
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        error: 'Tarea no encontrada',
        id: id,
      });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    console.log(
      `🗑️ DELETE /api/tasks/${id} - Tarea eliminada: ${deletedTask.title}`
    );
    res.json({
      message: 'Tarea eliminada exitosamente',
      task: deletedTask,
    });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
    });
  }
});

// ⚡ FASE ENHANCED - Endpoints adicionales

// GET - Estadísticas de tareas
app.get('/api/tasks/stats/overview', (req, res) => {
  try {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    const today = new Date();
    const overdue = tasks.filter(
      t => !t.completed && new Date(t.dueDate) < today
    ).length;

    const dueToday = tasks.filter(t => {
      const taskDate = new Date(t.dueDate).toDateString();
      return !t.completed && taskDate === today.toDateString();
    }).length;

    const byPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      total,
      completed,
      pending,
      overdue,
      dueToday,
      byPriority,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };

    console.log('📊 GET /api/tasks/stats/overview - Estadísticas solicitadas');
    res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
    });
  }
});

// GET - Búsqueda de tareas
app.get('/api/tasks/search/:query', (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const filteredTasks = tasks.filter(
      task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
    );

    console.log(
      `🔍 GET /api/tasks/search/${query} - ${filteredTasks.length} resultados`
    );
    res.json(filteredTasks);
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
    });
  }
});

// POST - Operaciones en lote
app.post('/api/tasks/batch', (req, res) => {
  try {
    const { action, taskIds } = req.body;

    if (!action || !Array.isArray(taskIds)) {
      return res.status(400).json({
        error: 'Se requiere action y taskIds (array)',
      });
    }

    let updatedTasks = [];

    switch (action) {
      case 'markCompleted':
        taskIds.forEach(id => {
          const taskIndex = tasks.findIndex(t => t.id === parseInt(id));
          if (taskIndex !== -1) {
            tasks[taskIndex].completed = true;
            tasks[taskIndex].completedAt = new Date().toISOString();
            tasks[taskIndex].updatedAt = new Date().toISOString();
            updatedTasks.push(tasks[taskIndex]);
          }
        });
        break;

      case 'markPending':
        taskIds.forEach(id => {
          const taskIndex = tasks.findIndex(t => t.id === parseInt(id));
          if (taskIndex !== -1) {
            tasks[taskIndex].completed = false;
            delete tasks[taskIndex].completedAt;
            tasks[taskIndex].updatedAt = new Date().toISOString();
            updatedTasks.push(tasks[taskIndex]);
          }
        });
        break;

      case 'delete':
        taskIds.forEach(id => {
          const taskIndex = tasks.findIndex(t => t.id === parseInt(id));
          if (taskIndex !== -1) {
            const deleted = tasks.splice(taskIndex, 1)[0];
            updatedTasks.push(deleted);
          }
        });
        break;

      default:
        return res.status(400).json({
          error: 'Acción no válida. Use: markCompleted, markPending, delete',
        });
    }

    console.log(
      `🔄 POST /api/tasks/batch - ${action} en ${updatedTasks.length} tareas`
    );
    res.json({
      message: `Operación ${action} completada exitosamente`,
      affectedTasks: updatedTasks.length,
      tasks: updatedTasks,
    });
  } catch (error) {
    console.error('Error en operación en lote:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
    });
  }
});

// ========== ERROR HANDLING ==========
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.path,
    method: req.method,
  });
});

app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: error.message,
  });
});

// ========== SERVER START ==========
app.listen(PORT, () => {
  console.log(`🚀 Backend CRUD ejecutándose en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET    /api/tasks`);
  console.log(`   GET    /api/tasks/:id`);
  console.log(`   POST   /api/tasks`);
  console.log(`   PUT    /api/tasks/:id`);
  console.log(`   PATCH  /api/tasks/:id`);
  console.log(`   DELETE /api/tasks/:id`);
  console.log(`   GET    /api/tasks/stats/overview`);
  console.log(`   GET    /api/tasks/search/:query`);
  console.log(`   POST   /api/tasks/batch`);
  console.log(`🎯 Frontend esperado en: http://localhost:5173`);
  console.log(`📊 Tareas iniciales: ${tasks.length}`);
});

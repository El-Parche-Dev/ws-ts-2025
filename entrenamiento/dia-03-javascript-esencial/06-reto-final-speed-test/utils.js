// 🔧 Utils for Task Tracker Pro | WorldSkills 2025
// Utilidades y helpers para el speed challenge

// ============= CORE UTILITIES =============
const TaskUtils = {
  // Generar ID único para tareas
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Formatear fecha para display
  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (d.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return d.toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
      });
    }
  },

  // Verificar si una tarea está vencida
  isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < today;
  },

  // Obtener días hasta vencimiento
  getDaysUntilDue(dueDate) {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Validar datos de tarea
  validateTask(taskData) {
    const errors = [];

    if (!taskData.title || taskData.title.trim().length === 0) {
      errors.push('El título es obligatorio');
    }

    if (taskData.title && taskData.title.length > 100) {
      errors.push('El título no puede exceder 100 caracteres');
    }

    if (taskData.dueDate) {
      const due = new Date(taskData.dueDate);
      if (isNaN(due.getTime())) {
        errors.push('Fecha de vencimiento inválida');
      }
    }

    if (
      taskData.priority &&
      !['low', 'medium', 'high'].includes(taskData.priority)
    ) {
      errors.push('Prioridad inválida');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Sanitizar entrada del usuario
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
  },
};

// ============= STORAGE UTILITIES =============
const StorageUtils = {
  // Guardar datos con manejo de errores
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  // Cargar datos con valores por defecto
  load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  },

  // Eliminar datos
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  // Obtener tamaño del storage usado
  getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  },

  // Exportar todos los datos
  exportAll() {
    const data = {};
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        try {
          data[key] = JSON.parse(localStorage[key]);
        } catch {
          data[key] = localStorage[key];
        }
      }
    }
    return data;
  },
};

// ============= DOM UTILITIES =============
const DOMUtils = {
  // Crear elemento con propiedades
  createElement(tag, properties = {}, content = '') {
    const element = document.createElement(tag);

    Object.entries(properties).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else if (key.startsWith('data-')) {
        element.setAttribute(key, value);
      } else {
        element[key] = value;
      }
    });

    if (content) {
      element.textContent = content;
    }

    return element;
  },

  // Toggle clase con animación
  toggleClass(element, className, force = null) {
    if (force !== null) {
      element.classList.toggle(className, force);
    } else {
      element.classList.toggle(className);
    }
  },

  // Smooth scroll to element
  scrollTo(element, options = {}) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      ...options,
    });
  },

  // Crear notificación
  createNotification(message, type = 'info', duration = 3000) {
    const notification = this.createElement('div', {
      className: `notification notification-${type}`,
    });

    notification.innerHTML = `
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    `;

    // Styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      animation: slideInFromRight 0.3s ease;
      max-width: 400px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;

    // Type-specific colors
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    };

    notification.style.background = colors[type] || colors.info;

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    closeBtn.addEventListener('click', () => {
      this.removeNotification(notification);
    });

    document.body.appendChild(notification);

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, duration);
    }

    return notification;
  },

  removeNotification(notification) {
    notification.style.animation = 'slideOutToRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  },
};

// ============= PERFORMANCE UTILITIES =============
const PerformanceUtils = {
  // Debounce function
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Measure execution time
  measureTime(label, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  },

  // Request animation frame wrapper
  raf(callback) {
    return requestAnimationFrame(callback);
  },

  // Cancel animation frame
  cancelRaf(id) {
    cancelAnimationFrame(id);
  },
};

// ============= TASK COMPONENTS =============
const TaskComponents = {
  // Crear elemento de tarea
  createTaskElement(task) {
    const taskItem = DOMUtils.createElement('div', {
      className: `task-item ${task.completed ? 'completed' : ''}`,
      'data-task-id': task.id,
      'data-priority': task.priority,
    });

    const checkbox = this.createCheckbox(task);
    const content = this.createTaskContent(task);
    const actions = this.createTaskActions(task);

    taskItem.appendChild(checkbox);
    taskItem.appendChild(content);
    taskItem.appendChild(actions);

    // Drag and drop
    this.makeDraggable(taskItem);

    return taskItem;
  },

  createCheckbox(task) {
    const checkbox = DOMUtils.createElement('div', {
      className: `task-checkbox ${task.completed ? 'checked' : ''}`,
    });

    if (task.completed) {
      checkbox.innerHTML = '✓';
    }

    checkbox.addEventListener('click', e => {
      e.stopPropagation();
      window.taskApp?.toggleTask(task.id);
    });

    return checkbox;
  },

  createTaskContent(task) {
    const content = DOMUtils.createElement('div', {
      className: 'task-content',
    });

    const title = DOMUtils.createElement(
      'div',
      {
        className: 'task-title',
      },
      task.title
    );

    const meta = this.createTaskMeta(task);

    content.appendChild(title);
    content.appendChild(meta);

    return content;
  },

  createTaskMeta(task) {
    const meta = DOMUtils.createElement('div', {
      className: 'task-meta',
    });

    // Priority badge
    const priority = DOMUtils.createElement('span', {
      className: `task-priority ${task.priority}`,
    });

    const priorityLabels = {
      high: '🔴 Alta',
      medium: '🟡 Media',
      low: '🟢 Baja',
    };

    priority.textContent = priorityLabels[task.priority] || '🟡 Media';
    meta.appendChild(priority);

    // Due date
    if (task.dueDate) {
      const dueDate = DOMUtils.createElement('span', {
        className: `task-due ${
          TaskUtils.isOverdue(task.dueDate) ? 'overdue' : ''
        }`,
      });

      const formatted = TaskUtils.formatDate(task.dueDate);
      const days = TaskUtils.getDaysUntilDue(task.dueDate);

      if (TaskUtils.isOverdue(task.dueDate)) {
        dueDate.textContent = `⚠️ Vencida (${formatted})`;
      } else if (days === 0) {
        dueDate.textContent = `📅 Hoy`;
      } else if (days === 1) {
        dueDate.textContent = `📅 Mañana`;
      } else {
        dueDate.textContent = `📅 ${formatted}`;
      }

      meta.appendChild(dueDate);
    }

    // Created date
    const created = DOMUtils.createElement('span', {
      className: 'task-created',
    });
    created.textContent = `Creada: ${TaskUtils.formatDate(task.createdAt)}`;
    meta.appendChild(created);

    return meta;
  },

  createTaskActions(task) {
    const actions = DOMUtils.createElement('div', {
      className: 'task-actions',
    });

    // Edit button
    const editBtn = DOMUtils.createElement(
      'button',
      {
        className: 'task-edit',
        title: 'Editar tarea',
      },
      '✏️'
    );

    editBtn.addEventListener('click', e => {
      e.stopPropagation();
      window.taskApp?.editTask(task.id);
    });

    // Delete button
    const deleteBtn = DOMUtils.createElement(
      'button',
      {
        className: 'task-delete',
        title: 'Eliminar tarea',
      },
      '🗑️'
    );

    deleteBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        window.taskApp?.deleteTask(task.id);
      }
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    return actions;
  },

  makeDraggable(taskItem) {
    taskItem.draggable = true;

    taskItem.addEventListener('dragstart', e => {
      taskItem.classList.add('dragging');
      e.dataTransfer.setData('text/plain', taskItem.dataset.taskId);
      e.dataTransfer.effectAllowed = 'move';
    });

    taskItem.addEventListener('dragend', () => {
      taskItem.classList.remove('dragging');
    });
  },
};

// ============= ANALYTICS UTILITIES =============
const Analytics = {
  events: [],

  track(event, data = {}) {
    const eventData = {
      event,
      timestamp: new Date().toISOString(),
      data,
      phase: window.challengeTimer?.currentPhase || 'unknown',
      timeRemaining: window.challengeTimer?.remainingTime || 0,
    };

    this.events.push(eventData);
    console.log(`📊 Analytics: ${event}`, eventData);

    // Save to localStorage
    StorageUtils.save('analytics_events', this.events);
  },

  getEvents(eventType = null) {
    if (eventType) {
      return this.events.filter(e => e.event === eventType);
    }
    return [...this.events];
  },

  getSummary() {
    const summary = {};
    this.events.forEach(event => {
      summary[event.event] = (summary[event.event] || 0) + 1;
    });
    return summary;
  },

  exportEvents() {
    const blob = new Blob([JSON.stringify(this.events, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `task-tracker-analytics-${
      new Date().toISOString().split('T')[0]
    }.json`;
    a.click();

    URL.revokeObjectURL(url);
  },
};

// ============= KEYBOARD SHORTCUTS =============
const KeyboardShortcuts = {
  shortcuts: new Map(),

  register(key, callback, description = '') {
    this.shortcuts.set(key, { callback, description });
  },

  init() {
    document.addEventListener('keydown', e => {
      const key = this.getKeyString(e);
      const shortcut = this.shortcuts.get(key);

      if (shortcut) {
        e.preventDefault();
        shortcut.callback(e);
        Analytics.track('keyboard_shortcut_used', { key });
      }
    });
  },

  getKeyString(e) {
    const parts = [];
    if (e.ctrlKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    if (e.metaKey) parts.push('meta');
    parts.push(e.key.toLowerCase());
    return parts.join('+');
  },

  getShortcutsList() {
    return Array.from(this.shortcuts.entries()).map(([key, info]) => ({
      key,
      description: info.description,
    }));
  },
};

// ============= THEME UTILITIES =============
const ThemeUtils = {
  currentTheme: 'light',

  init() {
    // Load saved theme
    this.currentTheme = StorageUtils.load('theme', 'light');
    this.applyTheme(this.currentTheme);

    // Setup theme toggle
    this.setupThemeToggle();
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    StorageUtils.save('theme', theme);

    // Update theme toggle button
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    }

    Analytics.track('theme_changed', { theme });
  },

  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  },

  setupThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.toggle();
      });
    }
  },
};

// ============= IMPORT/EXPORT UTILITIES =============
const ImportExport = {
  exportTasks(tasks) {
    const data = {
      tasks,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    Analytics.track('tasks_exported', { count: tasks.length });
  },

  importTasks(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        try {
          const data = JSON.parse(e.target.result);

          if (data.tasks && Array.isArray(data.tasks)) {
            // Validate and clean tasks
            const validTasks = data.tasks.filter(task => {
              const validation = TaskUtils.validateTask(task);
              return validation.isValid;
            });

            Analytics.track('tasks_imported', {
              count: validTasks.length,
              originalCount: data.tasks.length,
            });

            resolve(validTasks);
          } else {
            reject(new Error('Formato de archivo inválido'));
          }
        } catch (error) {
          reject(new Error('Error al procesar el archivo: ' + error.message));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsText(file);
    });
  },
};

// ============= ANIMATIONS =============
const AnimationUtils = {
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';

    const start = performance.now();

    const animate = timestamp => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      element.style.opacity = progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  },

  slideDown(element, duration = 300) {
    element.style.maxHeight = '0';
    element.style.overflow = 'hidden';
    element.style.display = 'block';

    const targetHeight = element.scrollHeight;
    const start = performance.now();

    const animate = timestamp => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      element.style.maxHeight = targetHeight * progress + 'px';

      if (progress >= 1) {
        element.style.maxHeight = 'none';
        element.style.overflow = 'visible';
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  },
};

// Exportar utilidades globalmente
window.TaskUtils = TaskUtils;
window.StorageUtils = StorageUtils;
window.DOMUtils = DOMUtils;
window.PerformanceUtils = PerformanceUtils;
window.TaskComponents = TaskComponents;
window.Analytics = Analytics;
window.KeyboardShortcuts = KeyboardShortcuts;
window.ThemeUtils = ThemeUtils;
window.ImportExport = ImportExport;
window.AnimationUtils = AnimationUtils;

// Inicializar utilities automáticamente
document.addEventListener('DOMContentLoaded', () => {
  ThemeUtils.init();
  KeyboardShortcuts.init();

  // Load saved analytics events
  Analytics.events = StorageUtils.load('analytics_events', []);

  console.log('🔧 Task Tracker Utils initialized');
});

console.log('🔧 Utils module loaded successfully');

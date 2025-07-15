// 🚀 Task Tracker Pro - Main App | WorldSkills 2025
// Aplicación principal del speed challenge

class TaskTrackerApp {
  constructor() {
    this.tasks = [];
    this.filteredTasks = [];
    this.currentFilter = 'all';
    this.currentSort = 'created';
    this.searchTerm = '';
    this.draggedTaskId = null;
    this.featuresCompleted = new Set();

    this.init();
  }

  // ============= CORE PHASE (20 min) =============
  async init() {
    console.log('🚀 Initializing Task Tracker Pro...');
    Analytics.track('app_initialized');

    try {
      // 1. Bind DOM elements
      this.bindElements();

      // 2. Load saved data
      this.loadTasks();

      // 3. Setup event listeners
      this.setupEventListeners();

      // 4. Setup keyboard shortcuts
      this.setupKeyboardShortcuts();

      // 5. Setup drag and drop
      this.setupDragAndDrop();

      // 6. Initial render
      this.render();

      // 7. Mark Core phase complete
      this.markFeatureComplete('core_initialization');

      console.log('✅ Core phase completed');
      this.updatePhaseProgress();
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      DOMUtils.createNotification(
        'Error al inicializar la aplicación',
        'error'
      );
    }
  }

  bindElements() {
    this.elements = {
      // Form elements
      taskForm: document.getElementById('taskForm'),
      taskInput: document.getElementById('taskInput'),
      prioritySelect: document.getElementById('prioritySelect'),
      dueDateInput: document.getElementById('dueDateInput'),

      // Filter elements
      filterButtons: document.querySelectorAll('.filter-btn'),
      searchInput: document.getElementById('searchInput'),
      sortSelect: document.getElementById('sortSelect'),

      // Display elements
      tasksList: document.getElementById('tasksList'),
      emptyState: document.getElementById('emptyState'),

      // Stats elements
      totalTasks: document.getElementById('totalTasks'),
      pendingTasks: document.getElementById('pendingTasks'),
      completedTasks: document.getElementById('completedTasks'),
      progressPath: document.getElementById('progressPath'),
      progressText: document.getElementById('progressText'),

      // Modal elements
      editModal: document.getElementById('editModal'),
      editForm: document.getElementById('editForm'),
      editTaskId: document.getElementById('editTaskId'),
      editTaskTitle: document.getElementById('editTaskTitle'),
      editTaskPriority: document.getElementById('editTaskPriority'),
      editTaskDue: document.getElementById('editTaskDue'),
      closeModal: document.getElementById('closeModal'),
      cancelEdit: document.getElementById('cancelEdit'),

      // Header controls
      themeToggle: document.getElementById('themeToggle'),
      exportTasks: document.getElementById('exportTasks'),
      importTasks: document.getElementById('importTasks'),
      importBtn: document.getElementById('importBtn'),

      // Dev console
      tasksCreated: document.getElementById('tasksCreated'),
      currentPhase: document.getElementById('currentPhase'),
      timeLeft: document.getElementById('timeLeft'),
      featuresDone: document.getElementById('featuresDone'),
    };

    console.log('📋 Elements bound successfully');
  }

  setupEventListeners() {
    // Form submission
    this.elements.taskForm.addEventListener('submit', e => {
      e.preventDefault();
      this.addTask();
    });

    // Filter buttons
    this.elements.filterButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        this.setFilter(e.target.dataset.filter);
      });
    });

    // Search input
    const debouncedSearch = PerformanceUtils.debounce(term => {
      this.setSearchTerm(term);
    }, 300);

    this.elements.searchInput.addEventListener('input', e => {
      debouncedSearch(e.target.value);
    });

    // Sort select
    this.elements.sortSelect.addEventListener('change', e => {
      this.setSortBy(e.target.value);
    });

    // Modal events
    this.elements.closeModal.addEventListener('click', () => {
      this.closeEditModal();
    });

    this.elements.cancelEdit.addEventListener('click', () => {
      this.closeEditModal();
    });

    this.elements.editForm.addEventListener('submit', e => {
      e.preventDefault();
      this.saveEditTask();
    });

    // Import/Export
    this.elements.exportTasks.addEventListener('click', () => {
      this.exportTasks();
    });

    this.elements.importBtn.addEventListener('click', () => {
      this.elements.importTasks.click();
    });

    this.elements.importTasks.addEventListener('change', e => {
      this.importTasks(e.target.files[0]);
    });

    // Modal backdrop click
    this.elements.editModal.addEventListener('click', e => {
      if (e.target === this.elements.editModal) {
        this.closeEditModal();
      }
    });

    console.log('🎧 Event listeners setup complete');
    this.markFeatureComplete('event_listeners');
  }

  setupKeyboardShortcuts() {
    // Register shortcuts
    KeyboardShortcuts.register(
      'ctrl+n',
      () => {
        this.elements.taskInput.focus();
      },
      'Nueva tarea'
    );

    KeyboardShortcuts.register(
      'ctrl+f',
      () => {
        this.elements.searchInput.focus();
      },
      'Buscar'
    );

    KeyboardShortcuts.register(
      'escape',
      () => {
        this.closeEditModal();
      },
      'Cerrar modal'
    );

    KeyboardShortcuts.register(
      'ctrl+e',
      () => {
        this.exportTasks();
      },
      'Exportar tareas'
    );

    KeyboardShortcuts.register(
      'ctrl+i',
      () => {
        this.elements.importTasks.click();
      },
      'Importar tareas'
    );

    KeyboardShortcuts.register(
      '?',
      () => {
        this.showShortcutsHelp();
      },
      'Mostrar ayuda'
    );

    console.log('⌨️ Keyboard shortcuts configured');
    this.markFeatureComplete('keyboard_shortcuts');
  }

  // ============= CRUD OPERATIONS =============
  addTask() {
    const title = TaskUtils.sanitizeInput(this.elements.taskInput.value);
    const priority = this.elements.prioritySelect.value;
    const dueDate = this.elements.dueDateInput.value;

    // Validate input
    const validation = TaskUtils.validateTask({ title, priority, dueDate });
    if (!validation.isValid) {
      DOMUtils.createNotification(validation.errors[0], 'error');
      return;
    }

    // Create new task
    const task = {
      id: TaskUtils.generateId(),
      title,
      priority,
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.push(task);
    this.saveTasks();
    this.render();

    // Reset form
    this.elements.taskForm.reset();
    this.elements.taskInput.focus();

    // Analytics and feedback
    Analytics.track('task_created', { priority, hasDueDate: !!dueDate });
    DOMUtils.createNotification('Tarea agregada exitosamente', 'success', 2000);

    this.markFeatureComplete('create_task');
    this.updateDevConsole();

    console.log('✅ Task created:', task);
  }

  editTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    // Populate modal
    this.elements.editTaskId.value = task.id;
    this.elements.editTaskTitle.value = task.title;
    this.elements.editTaskPriority.value = task.priority;
    this.elements.editTaskDue.value = task.dueDate || '';

    // Show modal
    this.elements.editModal.classList.remove('hidden');
    this.elements.editTaskTitle.focus();

    Analytics.track('task_edit_started', { taskId });
  }

  saveEditTask() {
    const taskId = this.elements.editTaskId.value;
    const title = TaskUtils.sanitizeInput(this.elements.editTaskTitle.value);
    const priority = this.elements.editTaskPriority.value;
    const dueDate = this.elements.editTaskDue.value;

    // Validate
    const validation = TaskUtils.validateTask({ title, priority, dueDate });
    if (!validation.isValid) {
      DOMUtils.createNotification(validation.errors[0], 'error');
      return;
    }

    // Update task
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = {
        ...this.tasks[taskIndex],
        title,
        priority,
        dueDate: dueDate || null,
        updatedAt: new Date().toISOString(),
      };

      this.saveTasks();
      this.render();
      this.closeEditModal();

      Analytics.track('task_updated', { taskId });
      DOMUtils.createNotification('Tarea actualizada', 'success', 2000);

      this.markFeatureComplete('update_task');
    }
  }

  toggleTask(taskId) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
      this.tasks[taskIndex].updatedAt = new Date().toISOString();

      this.saveTasks();
      this.render();

      const action = this.tasks[taskIndex].completed
        ? 'completed'
        : 'uncompleted';
      Analytics.track('task_toggled', { taskId, action });

      this.markFeatureComplete('toggle_task');
    }
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const task = this.tasks[taskIndex];
      this.tasks.splice(taskIndex, 1);

      this.saveTasks();
      this.render();

      Analytics.track('task_deleted', { taskId });
      DOMUtils.createNotification('Tarea eliminada', 'success', 2000);

      this.markFeatureComplete('delete_task');
    }
  }

  // ============= ENHANCED PHASE (15 min) =============
  setFilter(filter) {
    this.currentFilter = filter;

    // Update UI
    this.elements.filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    this.render();
    Analytics.track('filter_changed', { filter });
    this.markFeatureComplete('filtering');
  }

  setSearchTerm(term) {
    this.searchTerm = term;
    this.render();

    if (term) {
      Analytics.track('search_performed', { term });
      this.markFeatureComplete('search');
    }
  }

  setSortBy(sortBy) {
    this.currentSort = sortBy;
    this.render();
    Analytics.track('sort_changed', { sortBy });
    this.markFeatureComplete('sorting');
  }

  filterTasks() {
    let filtered = [...this.tasks];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    switch (this.currentFilter) {
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      // 'all' shows everything
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.currentSort) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];

        case 'title':
          return a.title.localeCompare(b.title);

        case 'due':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);

        case 'created':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    this.filteredTasks = filtered;
  }

  setupDragAndDrop() {
    // Setup drop zone
    this.elements.tasksList.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    this.elements.tasksList.addEventListener('drop', e => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('text/plain');
      const dropZone = e.target.closest('.task-item');

      if (dropZone && draggedId) {
        this.reorderTasks(draggedId, dropZone.dataset.taskId);
      }
    });

    console.log('🎯 Drag and drop configured');
    this.markFeatureComplete('drag_drop');
  }

  reorderTasks(draggedId, targetId) {
    if (draggedId === targetId) return;

    const draggedIndex = this.tasks.findIndex(t => t.id === draggedId);
    const targetIndex = this.tasks.findIndex(t => t.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Remove dragged task and insert at new position
      const [draggedTask] = this.tasks.splice(draggedIndex, 1);
      this.tasks.splice(targetIndex, 0, draggedTask);

      this.saveTasks();
      this.render();

      Analytics.track('task_reordered', { draggedId, targetId });
      DOMUtils.createNotification('Tarea reordenada', 'success', 1500);
    }
  }

  // ============= POLISH PHASE (10 min) =============
  exportTasks() {
    if (this.tasks.length === 0) {
      DOMUtils.createNotification('No hay tareas para exportar', 'warning');
      return;
    }

    ImportExport.exportTasks(this.tasks);
    DOMUtils.createNotification(
      `${this.tasks.length} tareas exportadas`,
      'success'
    );
    this.markFeatureComplete('export');
  }

  async importTasks(file) {
    if (!file) return;

    try {
      const importedTasks = await ImportExport.importTasks(file);

      if (importedTasks.length === 0) {
        DOMUtils.createNotification(
          'No se encontraron tareas válidas',
          'warning'
        );
        return;
      }

      // Ask user what to do with existing tasks
      const action = confirm(
        '¿Reemplazar tareas existentes? (Cancelar para agregar a las existentes)'
      );

      if (action) {
        this.tasks = importedTasks;
      } else {
        // Add imported tasks with new IDs to avoid conflicts
        const newTasks = importedTasks.map(task => ({
          ...task,
          id: TaskUtils.generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        this.tasks.push(...newTasks);
      }

      this.saveTasks();
      this.render();

      DOMUtils.createNotification(
        `${importedTasks.length} tareas importadas exitosamente`,
        'success'
      );

      this.markFeatureComplete('import');
    } catch (error) {
      console.error('Error importing tasks:', error);
      DOMUtils.createNotification(error.message, 'error');
    }

    // Reset file input
    this.elements.importTasks.value = '';
  }

  showShortcutsHelp() {
    const helpModal = document.getElementById('shortcutsHelp');
    if (helpModal) {
      helpModal.classList.remove('hidden');

      const closeBtn = document.getElementById('closeShortcuts');
      closeBtn.addEventListener('click', () => {
        helpModal.classList.add('hidden');
      });

      Analytics.track('shortcuts_help_shown');
    }
  }

  closeEditModal() {
    this.elements.editModal.classList.add('hidden');
    this.elements.editForm.reset();
  }

  // ============= RENDERING =============
  render() {
    this.filterTasks();
    this.renderTasks();
    this.updateStats();
    this.updateEmptyState();
  }

  renderTasks() {
    const container = this.elements.tasksList;
    container.innerHTML = '';

    this.filteredTasks.forEach((task, index) => {
      const taskElement = TaskComponents.createTaskElement(task);

      // Add animation delay
      taskElement.style.animationDelay = `${index * 50}ms`;
      taskElement.classList.add('fade-in');

      container.appendChild(taskElement);
    });

    console.log(`📋 Rendered ${this.filteredTasks.length} tasks`);
  }

  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update numbers
    this.elements.totalTasks.textContent = total;
    this.elements.pendingTasks.textContent = pending;
    this.elements.completedTasks.textContent = completed;

    // Update progress circle
    const circumference = 2 * Math.PI * 15.9155; // SVG circle radius
    const strokeDasharray = `${
      (progress / 100) * circumference
    }, ${circumference}`;

    if (this.elements.progressPath) {
      this.elements.progressPath.style.strokeDasharray = strokeDasharray;
    }

    if (this.elements.progressText) {
      this.elements.progressText.textContent = `${progress}%`;
    }

    console.log(`📊 Stats updated: ${completed}/${total} (${progress}%)`);
  }

  updateEmptyState() {
    const hasFilteredTasks = this.filteredTasks.length > 0;

    if (this.elements.emptyState) {
      this.elements.emptyState.style.display = hasFilteredTasks
        ? 'none'
        : 'block';
    }

    this.elements.tasksList.style.display = hasFilteredTasks ? 'block' : 'none';
  }

  // ============= DATA PERSISTENCE =============
  saveTasks() {
    const success = StorageUtils.save('tasks', this.tasks);
    if (success) {
      console.log(`💾 Saved ${this.tasks.length} tasks`);
    } else {
      DOMUtils.createNotification('Error al guardar tareas', 'error');
    }
  }

  loadTasks() {
    this.tasks = StorageUtils.load('tasks', []);
    console.log(`📂 Loaded ${this.tasks.length} tasks`);
    this.markFeatureComplete('data_persistence');
  }

  // ============= DEVELOPMENT FEATURES =============
  markFeatureComplete(feature) {
    this.featuresCompleted.add(feature);
    this.updateDevConsole();

    console.log(`✅ Feature completed: ${feature}`);
  }

  updateDevConsole() {
    if (this.elements.tasksCreated) {
      this.elements.tasksCreated.textContent = this.tasks.length;
    }

    if (this.elements.featuresDone) {
      this.elements.featuresDone.textContent = `${this.featuresCompleted.size}/12`;
    }
  }

  updatePhaseProgress() {
    // Define required features for each phase
    const phaseFeatures = {
      core: [
        'core_initialization',
        'event_listeners',
        'create_task',
        'data_persistence',
      ],
      enhanced: ['filtering', 'search', 'sorting', 'drag_drop'],
      polish: ['keyboard_shortcuts', 'export', 'import', 'animations'],
    };

    // Check completion
    Object.entries(phaseFeatures).forEach(([phase, features]) => {
      const completed = features.every(feature =>
        this.featuresCompleted.has(feature)
      );
      const phaseElement = document.querySelector(
        `.phase-item:nth-child(${
          phase === 'core' ? 1 : phase === 'enhanced' ? 2 : 3
        })`
      );

      if (phaseElement && completed) {
        phaseElement.classList.add('completed');
      }
    });
  }

  // ============= ANALYTICS AND MONITORING =============
  getAppStats() {
    return {
      tasksTotal: this.tasks.length,
      tasksCompleted: this.tasks.filter(t => t.completed).length,
      tasksPending: this.tasks.filter(t => !t.completed).length,
      tasksOverdue: this.tasks.filter(t => TaskUtils.isOverdue(t.dueDate))
        .length,
      currentFilter: this.currentFilter,
      currentSort: this.currentSort,
      searchActive: !!this.searchTerm,
      featuresCompleted: Array.from(this.featuresCompleted),
      completionPercentage: (this.featuresCompleted.size / 12) * 100,
    };
  }
}

// ============= APP INITIALIZATION =============
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 DOM loaded, initializing Task Tracker Pro...');

  // Wait for timer to be ready
  if (window.challengeTimer) {
    // Listen to timer events
    window.challengeTimer.on('onStart', () => {
      console.log('⏱️ Challenge started, initializing app...');
      window.taskApp = new TaskTrackerApp();
    });

    window.challengeTimer.on('onTick', data => {
      // Update dev console time
      const timeLeft = document.getElementById('timeLeft');
      if (timeLeft) {
        timeLeft.textContent = window.challengeTimer.formatTime(
          data.remainingTime
        );
      }
    });

    window.challengeTimer.on('onPhaseChange', data => {
      console.log(`🎯 Phase changed to: ${data.to}`);
      const currentPhase = document.getElementById('currentPhase');
      if (currentPhase) {
        currentPhase.textContent = window.challengeTimer.getPhaseLabel(data.to);
      }
    });

    window.challengeTimer.on('onTimeUp', () => {
      console.log('⏰ Time up! Final stats:');
      if (window.taskApp) {
        console.table(window.taskApp.getAppStats());
        Analytics.track('challenge_completed', window.taskApp.getAppStats());
      }
    });
  }

  // Development shortcuts
  window.getAppStats = () => window.taskApp?.getAppStats();
  window.exportAnalytics = () => Analytics.exportEvents();
  window.clearAllData = () => {
    localStorage.clear();
    location.reload();
  };

  console.log('🛠️ Development tools available:');
  console.log('  - window.taskApp: Main app instance');
  console.log('  - window.getAppStats(): Get app statistics');
  console.log('  - window.exportAnalytics(): Export analytics data');
  console.log('  - window.clearAllData(): Clear all data and reload');
});

console.log('🚀 Task Tracker Pro module loaded successfully');

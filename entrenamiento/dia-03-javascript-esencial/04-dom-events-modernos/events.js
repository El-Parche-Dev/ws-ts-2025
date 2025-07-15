// 🎯 DOM Events Modernos - WorldSkills 2025
// Metodología MVP: Core (25min) → Enhanced (30min) → Polish (20min)

// ========== CONFIGURACIÓN INICIAL ==========
let eventCount = 0;
let tiempoRestante = 75 * 60; // 75 minutos en segundos

// Inicializar timer
function iniciarTimer() {
  const timerElement = document.getElementById('timer');

  const actualizarTimer = () => {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    timerElement.textContent = `Tiempo: ${minutos
      .toString()
      .padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

    if (tiempoRestante > 0) {
      tiempoRestante--;
      setTimeout(actualizarTimer, 1000);
    } else {
      timerElement.textContent = '⏰ ¡TIEMPO AGOTADO!';
      timerElement.style.background = '#e74c3c';
    }
  };

  actualizarTimer();
}

// Función para registrar eventos en el log
function logEvent(message, type = 'info') {
  eventCount++;
  const log = document.getElementById('event-log');
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = `[${timestamp}] #${eventCount} - ${message}\n`;

  log.textContent += logEntry;
  log.scrollTop = log.scrollHeight;

  console.log(`🎯 Event #${eventCount}:`, message);
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type} show`;

  setTimeout(() => {
    notification.classList.remove('show');
  }, duration);
}

// ========== FASE CORE ✅ (25 minutos) - Event Listeners Básicos ==========
console.log('🔧 FASE CORE - Event Delegation y Form Handling');

// 1. EVENT DELEGATION para la lista de tareas
let taskCounter = 0;

function setupTaskList() {
  const taskList = document.getElementById('task-list');
  const tasksContainer = document.getElementById('tasks');

  // Event delegation - UN solo listener para TODOS los elementos
  taskList.addEventListener('click', event => {
    const target = event.target;

    // Agregar nueva tarea
    if (target.classList.contains('add-task')) {
      taskCounter++;
      const taskHTML = `
                <li class="task-item" data-id="${taskCounter}">
                    <span>Tarea ${taskCounter}</span>
                    <button class="btn btn-success complete-task" data-action="complete">✓</button>
                    <button class="btn btn-danger delete-task" data-action="delete">✗</button>
                </li>
            `;
      tasksContainer.insertAdjacentHTML('beforeend', taskHTML);
      logEvent(`Tarea ${taskCounter} creada`);
      showNotification('Nueva tarea agregada', 'success');
    }

    // Completar tarea
    if (target.classList.contains('complete-task')) {
      const taskItem = target.closest('.task-item');
      const taskId = taskItem.dataset.id;
      taskItem.style.textDecoration = 'line-through';
      taskItem.style.opacity = '0.6';
      target.disabled = true;
      logEvent(`Tarea ${taskId} completada`);
      showNotification('Tarea completada', 'success');
    }

    // Eliminar tarea
    if (target.classList.contains('delete-task')) {
      const taskItem = target.closest('.task-item');
      const taskId = taskItem.dataset.id;
      taskItem.remove();
      logEvent(`Tarea ${taskId} eliminada`);
      showNotification('Tarea eliminada', 'error');
    }
  });

  logEvent('Sistema de tareas inicializado con event delegation');
}

// 2. FORM HANDLING con validación avanzada
function setupFormHandling() {
  const form = document.getElementById('user-form');
  const resetBtn = document.getElementById('reset-form');

  // Validación en tiempo real
  form.addEventListener('input', event => {
    const field = event.target;
    validateField(field);
  });

  // Submit con preventDefault
  form.addEventListener('submit', event => {
    event.preventDefault(); // ¡CRÍTICO para WorldSkills!

    const formData = new FormData(form);
    const userData = {
      username: formData.get('username'),
      email: formData.get('email'),
    };

    if (validateForm(form)) {
      logEvent(`Formulario enviado: ${JSON.stringify(userData)}`);
      showNotification('Formulario enviado exitosamente', 'success');

      // Simular envío
      setTimeout(() => {
        form.reset();
        showNotification('Datos guardados en el servidor', 'info');
      }, 1000);
    } else {
      logEvent('Error de validación en formulario');
      showNotification('Corrige los errores del formulario', 'error');
    }
  });

  // Reset form
  resetBtn.addEventListener('click', () => {
    form.reset();
    clearFieldErrors(form);
    logEvent('Formulario reiniciado');
    showNotification('Formulario limpiado', 'info');
  });

  logEvent('Sistema de formularios inicializado');
}

// Funciones de validación
function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  // Remover errores previos
  clearFieldError(field);

  // Validaciones específicas
  switch (field.type) {
    case 'text':
      if (value.length < 3) {
        isValid = false;
        errorMessage = 'Mínimo 3 caracteres';
      }
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Email inválido';
      }
      break;
  }

  // Mostrar error si es inválido
  if (!isValid) {
    showFieldError(field, errorMessage);
  }

  return isValid;
}

function validateForm(form) {
  const fields = form.querySelectorAll('input[required]');
  let isValid = true;

  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

function showFieldError(field, message) {
  field.style.borderColor = '#e74c3c';

  let errorDiv = field.parentNode.querySelector('.error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    field.parentNode.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
}

function clearFieldError(field) {
  field.style.borderColor = '#ddd';
  const errorDiv = field.parentNode.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.remove();
  }
}

function clearFieldErrors(form) {
  const fields = form.querySelectorAll('input');
  fields.forEach(clearFieldError);
}

// ========== FASE ENHANCED ⚡ (30 minutos) - APIs Modernas ==========
console.log(
  '⚡ FASE ENHANCED - Drag & Drop, Intersection Observer, Custom Events'
);

// 3. DRAG & DROP API
function setupDragAndDrop() {
  const dragItem = document.getElementById('drag-item');
  const dropZone = document.getElementById('drop-zone');

  // Drag start
  dragItem.addEventListener('dragstart', event => {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.effectAllowed = 'move';
    logEvent('Drag iniciado');
    dragItem.style.opacity = '0.5';
  });

  // Drag end
  dragItem.addEventListener('dragend', event => {
    logEvent('Drag finalizado');
    dragItem.style.opacity = '1';
  });

  // Drop zone events
  dropZone.addEventListener('dragover', event => {
    event.preventDefault(); // ¡CRÍTICO para permitir drop!
    event.dataTransfer.dropEffect = 'move';
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', event => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(data);

    dropZone.appendChild(draggedElement);
    dropZone.classList.remove('dragover');
    dropZone.innerHTML = '<p>¡Elemento soltado exitosamente!</p>';

    logEvent('Drop completado exitosamente');
    showNotification('Drag & Drop completado', 'success');

    // Marcar checklist
    document.getElementById('check3').checked = true;
  });

  logEvent('Drag & Drop configurado');
}

// 4. INTERSECTION OBSERVER API
let observer = null;

function setupIntersectionObserver() {
  const toggleBtn = document.getElementById('toggle-observer');
  const targetElement = document.querySelector('.observe-me');

  toggleBtn.addEventListener('click', () => {
    if (observer) {
      observer.disconnect();
      observer = null;
      toggleBtn.textContent = 'Activar Observer';
      logEvent('Intersection Observer desactivado');
    } else {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.background = '#2ecc71';
              entry.target.textContent = '👁️ ¡VISIBLE!';
              logEvent('Elemento entró en viewport');
              showNotification('Elemento visible detectado', 'info');
            } else {
              entry.target.style.background = '#ecf0f1';
              entry.target.textContent = 'Elemento Observado';
              logEvent('Elemento salió del viewport');
            }
          });
        },
        {
          threshold: 0.5, // 50% visible
          rootMargin: '0px',
        }
      );

      observer.observe(targetElement);
      toggleBtn.textContent = 'Desactivar Observer';
      logEvent('Intersection Observer activado');

      // Marcar checklist
      document.getElementById('check4').checked = true;
    }
  });

  logEvent('Intersection Observer configurado');
}

// 5. CUSTOM EVENTS
function setupCustomEvents() {
  const triggerBtn = document.getElementById('trigger-custom');
  const listenBtn = document.getElementById('listen-custom');
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modal-message');
  const closeModal = document.getElementById('close-modal');

  let isListening = false;

  // Listener para custom events
  function customEventListener(event) {
    const data = event.detail;
    modalMessage.textContent = `Evento custom recibido: ${data.message} (ID: ${data.id})`;
    modal.style.display = 'block';
    logEvent(`Custom event recibido: ${JSON.stringify(data)}`);
  }

  // Toggle listening
  listenBtn.addEventListener('click', () => {
    if (isListening) {
      document.removeEventListener('customDataEvent', customEventListener);
      listenBtn.textContent = 'Escuchar Eventos';
      listenBtn.classList.remove('btn-success');
      isListening = false;
      logEvent('Dejó de escuchar custom events');
    } else {
      document.addEventListener('customDataEvent', customEventListener);
      listenBtn.textContent = 'Dejar de Escuchar';
      listenBtn.classList.add('btn-success');
      isListening = true;
      logEvent('Comenzó a escuchar custom events');

      // Marcar checklist
      document.getElementById('check5').checked = true;
    }
  });

  // Trigger custom event
  triggerBtn.addEventListener('click', () => {
    const customEvent = new CustomEvent('customDataEvent', {
      detail: {
        message: 'Datos importantes actualizados',
        id: Math.floor(Math.random() * 1000),
        timestamp: Date.now(),
      },
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(customEvent);
    logEvent('Custom event disparado');

    if (!isListening) {
      showNotification('Evento disparado, pero nadie escucha', 'error');
    }
  });

  // Close modal
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal clicking outside
  modal.addEventListener('click', event => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  logEvent('Custom events configurados');
}

// ========== FASE POLISH ✨ (20 minutos) - Performance Optimization ==========
console.log('✨ FASE POLISH - Debounce, Throttle, Performance');

// 6. DEBOUNCE Y THROTTLE
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function setupPerformanceOptimization() {
  const searchInput = document.getElementById('search-input');
  const throttleBtn = document.getElementById('throttle-btn');

  // Debounced search
  const debouncedSearch = debounce(query => {
    logEvent(`Búsqueda ejecutada: "${query}"`);
    showNotification(`Buscando: ${query}`, 'info', 2000);
    // Aquí iría la lógica de búsqueda real
  }, 300);

  searchInput.addEventListener('input', event => {
    const query = event.target.value.trim();
    if (query.length > 0) {
      debouncedSearch(query);
    }
  });

  // Throttled button
  let clickCount = 0;
  const throttledClick = throttle(() => {
    clickCount++;
    logEvent(`Click throttled ejecutado #${clickCount}`);
    showNotification(`Click #${clickCount} procesado`, 'info', 1500);
  }, 1000);

  throttleBtn.addEventListener('click', throttledClick);

  logEvent('Optimizaciones de performance configuradas');

  // Marcar checklist
  document.getElementById('check6').checked = true;
}

// 7. PERFORMANCE MONITORING
function setupPerformanceMonitoring() {
  const testBtn = document.getElementById('performance-test');
  const resultsDiv = document.getElementById('performance-results');

  testBtn.addEventListener('click', () => {
    logEvent('Iniciando test de performance');
    resultsDiv.innerHTML = '<p>Ejecutando tests...</p>';

    // Test 1: Event listener performance
    const start1 = performance.now();

    // Crear muchos elementos y eventos
    const container = document.createElement('div');
    for (let i = 0; i < 1000; i++) {
      const element = document.createElement('button');
      element.textContent = `Button ${i}`;
      element.addEventListener('click', () => {}); // Event listener individual
      container.appendChild(element);
    }

    const end1 = performance.now();

    // Test 2: Event delegation performance
    const start2 = performance.now();

    const container2 = document.createElement('div');
    container2.addEventListener('click', event => {
      if (event.target.tagName === 'BUTTON') {
        // Handle click
      }
    });

    for (let i = 0; i < 1000; i++) {
      const element = document.createElement('button');
      element.textContent = `Button ${i}`;
      container2.appendChild(element);
    }

    const end2 = performance.now();

    // Mostrar resultados
    const results = `
            <h4>📊 Resultados del Test de Performance</h4>
            <p><strong>Listeners individuales:</strong> ${(
              end1 - start1
            ).toFixed(2)}ms</p>
            <p><strong>Event delegation:</strong> ${(end2 - start2).toFixed(
              2
            )}ms</p>
            <p><strong>Mejora:</strong> ${(
              (end1 - start1) /
              (end2 - start2)
            ).toFixed(1)}x más rápido</p>
            <p><strong>Conclusión:</strong> Event delegation es más eficiente</p>
        `;

    resultsDiv.innerHTML = results;
    logEvent(
      `Performance test completado - Delegation: ${(end2 - start2).toFixed(
        2
      )}ms vs Individual: ${(end1 - start1).toFixed(2)}ms`
    );
  });

  logEvent('Performance monitoring configurado');
}

// ========== UTILIDADES ==========

// Clear log
function setupLogClear() {
  const clearBtn = document.getElementById('clear-log');
  clearBtn.addEventListener('click', () => {
    document.getElementById('event-log').textContent = '';
    eventCount = 0;
    logEvent('Log limpiado y contador reiniciado');
  });
}

// Auto-check para event delegation cuando se complete
function autoCheckProgress() {
  // Observar clicks en tareas para marcar delegation
  const taskList = document.getElementById('task-list');
  let taskClicks = 0;

  taskList.addEventListener('click', () => {
    taskClicks++;
    if (taskClicks >= 3) {
      document.getElementById('check1').checked = true;
    }
  });

  // Observar form submission
  const form = document.getElementById('user-form');
  form.addEventListener('submit', () => {
    document.getElementById('check2').checked = true;
  });
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 DOM Events Modernos - Inicializando...');

  // Inicializar timer
  iniciarTimer();

  // Configurar todas las funcionalidades
  setupTaskList();
  setupFormHandling();
  setupDragAndDrop();
  setupIntersectionObserver();
  setupCustomEvents();
  setupPerformanceOptimization();
  setupPerformanceMonitoring();
  setupLogClear();
  autoCheckProgress();

  // Log inicial
  logEvent('🚀 DOM Events Modernos inicializado correctamente');
  showNotification(
    'Sistema iniciado - ¡Comienza a interactuar!',
    'success',
    5000
  );

  console.log('✅ Todas las funcionalidades configuradas');
  console.log('⏱️ Timer iniciado: 75 minutos para completar');
  console.log('🎯 Meta: Completar todas las fases y marcar checklist');
});

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', event => {
  // Ctrl + T = Nueva tarea
  if (event.ctrlKey && event.key === 't') {
    event.preventDefault();
    document.querySelector('.add-task').click();
    logEvent('Tarea creada via teclado (Ctrl+T)');
  }

  // Ctrl + L = Limpiar log
  if (event.ctrlKey && event.key === 'l') {
    event.preventDefault();
    document.getElementById('clear-log').click();
    logEvent('Log limpiado via teclado (Ctrl+L)');
  }

  // Escape = Cerrar modal
  if (event.key === 'Escape') {
    const modal = document.getElementById('modal');
    if (modal.style.display === 'block') {
      modal.style.display = 'none';
      logEvent('Modal cerrado via Escape');
    }
  }
});

console.log('🎯 DOM Events Modernos cargado completamente');
console.log('⌨️ Shortcuts: Ctrl+T (tarea), Ctrl+L (limpiar), Escape (cerrar)');

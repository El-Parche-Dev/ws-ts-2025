// 🔧 Utils Module - WorldSkills 2025
// Utilidades y helpers para la aplicación

// ✅ FASE CORE - Utilidades básicas
const Utils = {
  // Formateo de texto
  truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  // Capitalizar primera letra
  capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  // Formatear fecha
  formatDate(date = new Date()) {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },

  // Generar ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
};

// ⚡ FASE ENHANCED - Utilities avanzadas
const DOMUtils = {
  // Crear elemento con atributos
  createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });

    if (content) {
      element.textContent = content;
    }

    return element;
  },

  // Toggle de clases
  toggleClass(element, className) {
    element.classList.toggle(className);
  },

  // Mostrar/ocultar elementos
  show(element) {
    element.classList.remove('hidden');
    element.classList.add('fade-in');
  },

  hide(element) {
    element.classList.add('hidden');
    element.classList.remove('fade-in');
  },

  // Limpiar contenido
  clearContent(element) {
    element.innerHTML = '';
  },
};

// 🎨 Componentes UI reutilizables
const UIComponents = {
  // Crear card de post
  createPostCard(post) {
    const card = DOMUtils.createElement('article', {
      className: 'post-card fade-in',
      'data-post-id': post.id,
      'data-user-id': post.userId,
    });

    card.innerHTML = `
      <div class="post-header">
        <span class="post-id">#${post.id}</span>
      </div>
      <h3 class="post-title">${Utils.capitalize(post.title)}</h3>
      <p class="post-body">${Utils.truncateText(post.body)}</p>
      <div class="post-footer">
        <span class="post-author" data-user-id="${post.userId}">
          👤 ${post.user ? post.user.name : 'Usuario ' + post.userId}
        </span>
        <button class="read-more" data-post-id="${post.id}">
          Leer más
        </button>
      </div>
    `;

    return card;
  },

  // Crear comentario
  createComment(comment) {
    const commentEl = DOMUtils.createElement('div', {
      className: 'comment fade-in',
    });

    commentEl.innerHTML = `
      <div class="comment-author">${Utils.capitalize(comment.name)}</div>
      <div class="comment-email">${comment.email}</div>
      <div class="comment-body">${comment.body}</div>
    `;

    return commentEl;
  },

  // Crear opción de select
  createSelectOption(value, text, selected = false) {
    const option = DOMUtils.createElement(
      'option',
      {
        value: value,
      },
      text
    );

    if (selected) {
      option.selected = true;
    }

    return option;
  },

  // Mostrar notificación
  showNotification(message, type = 'info') {
    const notification = DOMUtils.createElement('div', {
      className: `notification notification-${type} fade-in`,
    });

    notification.innerHTML = `
      <span>${message}</span>
      <button class="close-notification">✖️</button>
    `;

    document.body.appendChild(notification);

    // Auto-remove después de 5 segundos
    setTimeout(() => {
      notification.remove();
    }, 5000);

    // Close button
    notification
      .querySelector('.close-notification')
      .addEventListener('click', () => {
        notification.remove();
      });
  },
};

// ✨ FASE POLISH - Utilities avanzadas
const Performance = {
  // Debounce para búsquedas
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  // Throttle para scroll events
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

  // Measure performance
  measureTime(label, func) {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  },
};

// 🔄 Estado de la aplicación
class AppState {
  constructor() {
    this.state = {
      posts: [],
      users: [],
      filteredPosts: [],
      currentUser: null,
      searchTerm: '',
      isLoading: false,
      error: null,
      currentPage: 1,
      postsPerPage: 12,
    };

    this.subscribers = [];
  }

  // Suscribirse a cambios de estado
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Actualizar estado
  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };

    // Notificar a suscriptores
    this.subscribers.forEach(callback => {
      callback(this.state, prevState);
    });
  }

  // Getters
  getState() {
    return { ...this.state };
  }

  getPaginatedPosts() {
    const startIndex = (this.state.currentPage - 1) * this.state.postsPerPage;
    const endIndex = startIndex + this.state.postsPerPage;
    return this.state.filteredPosts.slice(startIndex, endIndex);
  }

  getTotalPages() {
    return Math.ceil(this.state.filteredPosts.length / this.state.postsPerPage);
  }
}

// 🎯 Validation utilities
const Validator = {
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },
};

// 📊 Analytics y tracking
const Analytics = {
  events: [],

  track(eventName, data = {}) {
    const event = {
      name: eventName,
      data: data,
      timestamp: new Date().toISOString(),
      id: Utils.generateId(),
    };

    this.events.push(event);
    console.log(`📊 Event tracked: ${eventName}`, event);
  },

  getEvents() {
    return [...this.events];
  },

  getEventsByName(eventName) {
    return this.events.filter(event => event.name === eventName);
  },

  clearEvents() {
    this.events = [];
  },
};

// 🚀 Storage utilities
const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('❌ Error guardando en localStorage:', error);
      return false;
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('❌ Error leyendo de localStorage:', error);
      return defaultValue;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('❌ Error removiendo de localStorage:', error);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('❌ Error limpiando localStorage:', error);
      return false;
    }
  },
};

// 🎨 Animations utilities
const Animations = {
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;
    element.classList.remove('hidden');

    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);
  },

  fadeOut(element, duration = 300) {
    element.style.opacity = '1';
    element.style.transition = `opacity ${duration}ms ease`;

    setTimeout(() => {
      element.style.opacity = '0';
      setTimeout(() => {
        element.classList.add('hidden');
      }, duration);
    }, 10);
  },

  slideDown(element, duration = 300) {
    element.style.maxHeight = '0';
    element.style.overflow = 'hidden';
    element.style.transition = `max-height ${duration}ms ease`;
    element.classList.remove('hidden');

    setTimeout(() => {
      element.style.maxHeight = element.scrollHeight + 'px';
    }, 10);
  },
};

// Exportar utilidades globalmente
window.Utils = Utils;
window.DOMUtils = DOMUtils;
window.UIComponents = UIComponents;
window.Performance = Performance;
window.AppState = AppState;
window.Validator = Validator;
window.Analytics = Analytics;
window.Storage = Storage;
window.Animations = Animations;

console.log('🔧 Utils module loaded successfully');
console.log('💡 Available utilities:');
console.log('  - Utils: Text formatting, dates, etc.');
console.log('  - DOMUtils: DOM manipulation helpers');
console.log('  - UIComponents: Reusable UI components');
console.log('  - Performance: Debounce, throttle, etc.');
console.log('  - AppState: State management');
console.log('  - Analytics: Event tracking');
console.log('  - Storage: localStorage utilities');
console.log('  - Animations: CSS animation helpers');

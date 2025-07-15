# 🎯 DOM Events Modernos - Implementación MVP

**⏰ Duración:** 60 minutos  
**🎯 Objetivo:** Dominar manejo de eventos modernos para interactividad

## 📚 Metodología MVP

### **FASE CORE ✅ (20 minutos) - Event Listeners Básicos**

**Funcionalidad esencial:** addEventListener moderno funcionando

#### **🔧 Event Handling Fundamentals**

```javascript
// ========== FASE CORE ✅ ==========
// Funcionalidad: Event listeners básicos pero robustos

// Event listener básico
document.getElementById('boton').addEventListener('click', event => {
  console.log('Botón clickeado:', event.target);
});

// Event con arrow functions
const handleClick = event => {
  event.preventDefault(); // Prevenir comportamiento por defecto
  console.log('Click manejado:', event.type);
};

// Múltiples eventos en un elemento
const elemento = document.getElementById('elemento');
elemento.addEventListener('mouseenter', () => console.log('Mouse entró'));
elemento.addEventListener('mouseleave', () => console.log('Mouse salió'));
elemento.addEventListener('click', handleClick);

// Remover event listeners
function limpiarEventos() {
  elemento.removeEventListener('click', handleClick);
}

// Event object properties esenciales
element.addEventListener('click', event => {
  console.log('Target:', event.target);
  console.log('Current Target:', event.currentTarget);
  console.log('Tipo:', event.type);
  console.log('Timestamp:', event.timeStamp);
});
```

### **FASE ENHANCED ⚡ (25 minutos) - Event Delegation y Patterns**

**Mejoras:** Event delegation, custom events, performance

#### **⚡ Event Delegation y Custom Events**

```javascript
// ========== FASE ENHANCED ⚡ ==========
// Mejoras: Event delegation y patrones avanzados

// Event delegation (crítico para performance)
document.getElementById('contenedor').addEventListener('click', event => {
  // Verificar si el click fue en un botón
  if (event.target.matches('button.action-btn')) {
    const accion = event.target.dataset.action;
    console.log(`Acción ejecutada: ${accion}`);
  }

  // Verificar si fue en un item de lista
  if (event.target.closest('.list-item')) {
    const item = event.target.closest('.list-item');
    const id = item.dataset.id;
    console.log(`Item seleccionado: ${id}`);
  }
});

// Custom events
function dispararEventoCustom(data) {
  const evento = new CustomEvent('datosActualizados', {
    detail: { data, timestamp: Date.now() },
    bubbles: true,
    cancelable: true,
  });

  document.dispatchEvent(evento);
}

// Escuchar custom events
document.addEventListener('datosActualizados', event => {
  console.log('Datos actualizados:', event.detail);
});

// Event capturing y bubbling
element.addEventListener('click', handler, true); // Capturing phase
element.addEventListener('click', handler, false); // Bubbling phase (default)

// Prevenir propagación
function stopPropagation(event) {
  event.stopPropagation(); // Detener bubbling
  event.stopImmediatePropagation(); // Detener otros listeners
}
```

### **FASE POLISH ✨ (15 minutos) - Performance y Patterns**

**Optimizaciones:** Debounce, throttle, passive listeners

#### **✨ Performance Optimization**

```javascript
// ========== FASE POLISH ✨ ==========
// Optimizaciones: Debounce, throttle, passive events

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Throttle function
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

// Uso práctico de debounce/throttle
const busquedaInput = document.getElementById('busqueda');
const debouncedSearch = debounce(event => {
  console.log('Buscando:', event.target.value);
  // Realizar búsqueda API
}, 300);

busquedaInput.addEventListener('input', debouncedSearch);

// Scroll throttled
const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', throttledScroll);

// Passive event listeners (mejor performance)
element.addEventListener('scroll', handler, { passive: true });
element.addEventListener('touchstart', handler, { passive: true });

// Event listener con opciones completas
element.addEventListener('click', handler, {
  once: true, // Solo ejecutar una vez
  passive: false, // Permite preventDefault
  capture: true, // Capturing phase
  signal: abortController.signal, // AbortController support
});
```

## 🎯 Ejercicios Prácticos

### **Ejercicio 1: Interactive Dashboard (25 min)**

```javascript
// Crear dashboard interactivo con:
// 1. Filtros dinámicos
// 2. Búsqueda en tiempo real
// 3. Ordenamiento por columnas
// 4. Selección múltiple
// 5. Drag and drop

class InteractiveDashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.data = [];
    this.filteredData = [];
    this.selectedItems = new Set();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadData();
  }

  setupEventListeners() {
    // TODO: Implementar event listeners
    // - Click delegation para botones
    // - Input events para filtros
    // - Drag/drop events
    // - Keyboard shortcuts
  }

  // Tu implementación aquí:
}
```

### **Ejercicio 2: Form Validator Avanzado (20 min)**

```javascript
// Crear validador de formularios en tiempo real

class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.rules = new Map();
    this.errors = new Map();
    this.init();
  }

  addRule(fieldName, validator, message) {
    // TODO: Agregar reglas de validación
  }

  validateField(field) {
    // TODO: Validar campo individual
  }

  validateForm() {
    // TODO: Validar formulario completo
  }

  // Tu implementación aquí:
}

// Uso:
const validator = new FormValidator('#mi-form');
validator.addRule(
  'email',
  value => /\S+@\S+\.\S+/.test(value),
  'Email inválido'
);
validator.addRule(
  'password',
  value => value.length >= 8,
  'Mínimo 8 caracteres'
);
```

## 📝 Checklist de Validación

### **CORE (✅ Obligatorio)**

- [ ] addEventListener básico funcionando
- [ ] Event object properties accesibles
- [ ] preventDefault() implementado
- [ ] Event removal funcionando

### **ENHANCED (⚡ Importante)**

- [ ] Event delegation implementado
- [ ] Custom events creados y manejados
- [ ] Event bubbling/capturing entendido
- [ ] stopPropagation() usado apropiadamente

### **POLISH (✨ Opcional)**

- [ ] Debounce/throttle implementados
- [ ] Passive listeners para performance
- [ ] AbortController para cleanup
- [ ] Event patterns optimizados

## ⏱️ Timeboxing Estricto

- **00:00-20:00**: CORE - addEventListener básico + event object
- **20:00-45:00**: ENHANCED - delegation + custom events
- **45:00-60:00**: POLISH - performance optimization

## 🎖️ Patrones Críticos para WorldSkills

### **1. Event Delegation Pattern**

```javascript
// En lugar de múltiples listeners
buttons.forEach(btn => btn.addEventListener('click', handler));

// Usar delegation
container.addEventListener('click', e => {
  if (e.target.matches('button')) handler(e);
});
```

### **2. Custom Event Communication**

```javascript
// Componente A dispara evento
this.element.dispatchEvent(
  new CustomEvent('itemSelected', {
    detail: { id: this.id, data: this.data },
  })
);

// Componente B escucha
document.addEventListener('itemSelected', e => {
  this.updateUI(e.detail.data);
});
```

### **3. Performance Optimization**

```javascript
// Búsqueda optimizada
const searchInput = debounce(query => {
  this.search(query);
}, 300);

// Scroll optimizado
const scrollHandler = throttle(() => {
  this.updateScrollPosition();
}, 16); // 60fps
```

## 🚨 Errores Comunes a Evitar

1. **Memory leaks** - No remover event listeners
2. **Event delegation incorrecta** - No verificar target
3. **No usar preventDefault()** cuando es necesario
4. **Múltiples listeners** en lugar de delegation
5. **No optimizar eventos frecuentes** (scroll, resize, input)
6. **Mixing event patterns** - Inconsistencia en el código

## 💡 Tips para Competencia

- Usa event delegation para mejor performance
- Siempre limpia event listeners en cleanup
- Optimiza eventos frecuentes con debounce/throttle
- Usa custom events para comunicación entre componentes
- Implementa keyboard shortcuts para mejor UX
- Maneja eventos de touch para móviles

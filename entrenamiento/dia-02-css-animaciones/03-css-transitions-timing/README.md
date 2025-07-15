# 🎯 CSS Transitions y Timing Functions - Implementación MVP

**⏰ Duración:** 30 minutos  
**🎯 Objetivo:** Crear transiciones fluidas y timing functions personalizados

## 📚 Metodología MVP

### **FASE CORE ✅ (10 minutos) - Transitions Básicas**

**Funcionalidad esencial:** Transiciones CSS fundamentales

#### **🔧 Transitions Básicas**

```css
/* ========== FASE CORE ✅ ========== */
/* Funcionalidad: Transiciones básicas */

.transition-basic {
  background-color: #3498db;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.transition-basic:hover {
  background-color: #2980b9;
}

/* Multiple property transitions */
.transition-multiple {
  background: white;
  color: #333;
  transform: scale(1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
}

.transition-multiple:hover {
  background: #f8f9fa;
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* All properties shorthand */
.transition-all {
  transition: all 0.3s ease;
}
```

#### **💻 Ejercicio Core: Botones con Transiciones**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Transitions Básicas - MVP Core</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f5f6fa;
        padding: 2rem;
        margin: 0;
      }

      .container {
        max-width: 800px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
      }

      /* FASE CORE: Transiciones básicas */
      .btn {
        padding: 1rem 2rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        text-align: center;
        transition: all 0.3s ease;
      }

      .btn-primary {
        background: #3498db;
        color: white;
      }

      .btn-primary:hover {
        background: #2980b9;
        transform: translateY(-2px);
      }

      .btn-success {
        background: #27ae60;
        color: white;
      }

      .btn-success:hover {
        background: #219a52;
        box-shadow: 0 6px 20px rgba(39, 174, 96, 0.3);
      }

      .btn-warning {
        background: #f39c12;
        color: white;
      }

      .btn-warning:hover {
        background: #e67e22;
        transform: scale(1.05);
      }

      .btn-danger {
        background: #e74c3c;
        color: white;
      }

      .btn-danger:hover {
        background: #c0392b;
        border-radius: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <button class="btn btn-primary">Hover Translate</button>
      <button class="btn btn-success">Hover Shadow</button>
      <button class="btn btn-warning">Hover Scale</button>
      <button class="btn btn-danger">Hover Border Radius</button>
    </div>
  </body>
</html>
```

### **FASE ENHANCED ⚡ (15 minutos) - Timing Functions y Delays**

**Mejoras:** Timing functions personalizados, delays, transiciones complejas

#### **🔧 Timing Functions Avanzados**

```css
/* ========== FASE ENHANCED ⚡ ========== */
/* Mejoras: Timing functions y delays avanzados */

/* Built-in timing functions */
.ease-linear {
  transition: all 0.5s linear;
}
.ease-in {
  transition: all 0.5s ease-in;
}
.ease-out {
  transition: all 0.5s ease-out;
}
.ease-in-out {
  transition: all 0.5s ease-in-out;
}

/* Custom cubic-bezier timing */
.ease-bounce {
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.ease-swift-out {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.ease-material {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Transition delays for staging */
.card-staged {
  transition: transform 0.3s ease 0s, box-shadow 0.3s ease 0.1s,
    background-color 0.3s ease 0.2s;
}

.card-staged:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background-color: #3498db;
}

/* Complex multi-step transitions */
.progress-bar {
  width: 100%;
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  width: 0%;
  transition: width 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.progress-bar:hover .progress-fill {
  width: 100%;
}
```

#### **💻 Ejercicio Enhanced: Timing Functions Showcase**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Timing Functions Enhanced - MVP</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        margin: 0;
        padding: 2rem;
        min-height: 100vh;
      }

      .container {
        max-width: 1000px;
        margin: 0 auto;
      }

      .demo-section {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      /* FASE ENHANCED: Timing functions showcase */
      .timing-demo {
        display: grid;
        grid-template-columns: 1fr 200px;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        border-radius: 8px;
        background: #f8f9fa;
        margin-bottom: 1rem;
      }

      .timing-ball {
        width: 50px;
        height: 50px;
        background: #3498db;
        border-radius: 50%;
        transform: translateX(0);
      }

      .timing-demo:hover .timing-ball {
        transform: translateX(140px);
      }

      .linear {
        transition: transform 0.8s linear;
      }
      .ease-in {
        transition: transform 0.8s ease-in;
      }
      .ease-out {
        transition: transform 0.8s ease-out;
      }
      .ease-in-out {
        transition: transform 0.8s ease-in-out;
      }
      .bounce {
        transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      .swift {
        transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      /* Staged animations */
      .card-complex {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transform: translateY(0) scale(1);
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s, box-shadow
            0.3s ease 0.1s, background-color 0.3s ease 0.2s;
      }

      .card-complex:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        background-color: #f8f9fa;
      }

      /* Progress bar demo */
      .progress-container {
        margin: 2rem 0;
      }

      .progress-bar {
        width: 100%;
        height: 12px;
        background: #ecf0f1;
        border-radius: 6px;
        overflow: hidden;
        cursor: pointer;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3498db, #9b59b6);
        width: 0%;
        transition: width 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .progress-bar:hover .progress-fill {
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="demo-section">
        <h2>Timing Functions Comparison</h2>
        <p>Hover sobre cada demo para ver las diferencias:</p>

        <div class="timing-demo">
          <div class="timing-ball linear"></div>
          <span>Linear</span>
        </div>

        <div class="timing-demo">
          <div class="timing-ball ease-in"></div>
          <span>Ease-in</span>
        </div>

        <div class="timing-demo">
          <div class="timing-ball ease-out"></div>
          <span>Ease-out</span>
        </div>

        <div class="timing-demo">
          <div class="timing-ball ease-in-out"></div>
          <span>Ease-in-out</span>
        </div>

        <div class="timing-demo">
          <div class="timing-ball bounce"></div>
          <span>Bounce (Custom)</span>
        </div>

        <div class="timing-demo">
          <div class="timing-ball swift"></div>
          <span>Swift Out</span>
        </div>
      </div>

      <div class="demo-section">
        <h2>Staged Transitions</h2>
        <div class="card-complex">
          <h3>Card con Transiciones Escalonadas</h3>
          <p>Hover para ver efecto con delays</p>
        </div>
      </div>

      <div class="demo-section">
        <h2>Progress Bar Animation</h2>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <p>Hover sobre la barra de progreso</p>
        </div>
      </div>
    </div>
  </body>
</html>
```

### **FASE POLISH ✨ (5 minutos) - Transiciones Complejas**

**Optimizaciones:** Performance, transiciones condicionales, estados complejos

#### **🔧 Transiciones Avanzadas y Performance**

```css
/* ========== FASE POLISH ✨ ========== */
/* Optimizaciones: Transiciones complejas y performance */

/* Performance optimized transitions */
.optimized-transition {
  will-change: transform, opacity;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* State-based transitions */
.state-machine {
  background: #3498db;
  transform: scale(1) rotate(0deg);
  transition: all 0.3s ease;
}

.state-machine.active {
  background: #27ae60;
  transform: scale(1.1) rotate(45deg);
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.state-machine.disabled {
  background: #95a5a6;
  transform: scale(0.9) rotate(0deg);
  opacity: 0.5;
  transition: all 0.2s ease-out;
}

/* Complex keyframe-like transitions with steps */
.multi-step-transition {
  position: relative;
  background: #e74c3c;
  transition: background-color 0.3s ease 0s, transform 0.3s ease 0.1s,
    border-radius 0.3s ease 0.2s, box-shadow 0.3s ease 0.3s;
}

.multi-step-transition:hover {
  background-color: #9b59b6;
  transform: translateY(-5px) scale(1.05);
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(155, 89, 182, 0.3);
}

/* Conditional transitions based on viewport */
@media (prefers-reduced-motion: reduce) {
  .accessible-transition {
    transition: none;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .accessible-transition {
    transition: all 0.3s ease;
  }
}

/* Advanced easing functions */
.spring-bounce {
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.anticipation {
  transition: transform 0.6s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

.overshoot {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## 🚀 Ejercicios Prácticos

### **⚡ Challenge 1: Button State Machine (10 min)**

Crear botones con múltiples estados y transiciones

### **⚡ Challenge 2: Loading States (10 min)**

Implementar diferentes estados de carga con transiciones

### **⚡ Challenge 3: Form Validation Feedback (10 min)**

Sistema de validación visual con transiciones fluidas

## 📝 Checklist MVP

### **✅ FASE CORE (10 min)**

- [ ] Transiciones básicas de una propiedad
- [ ] Hover effects con transition
- [ ] Duration y timing function básicos

### **⚡ FASE ENHANCED (15 min)**

- [ ] Multiple property transitions
- [ ] Custom cubic-bezier timing functions
- [ ] Transition delays y staging
- [ ] Timing functions comparison

### **✨ FASE POLISH (5 min)**

- [ ] Performance optimization con will-change
- [ ] State-based conditional transitions
- [ ] Accessibility considerations
- [ ] Advanced easing functions

## 🎯 Objetivos de Aprendizaje

**Al finalizar esta sección, el aprendiz podrá:**

- Implementar transiciones CSS fluidas y naturales
- Crear timing functions personalizados con cubic-bezier
- Escalonar transiciones con delays para efectos complejos
- Optimizar performance de transiciones
- Aplicar consideraciones de accesibilidad

## 🏆 Criterios WorldSkills

- **Fluidez:** Transiciones naturales y bien cronometradas
- **Performance:** Uso eficiente de propiedades animables
- **UX:** Feedback visual apropiado para interacciones
- **Accesibilidad:** Respeto por preferencias de movimiento

---

**📝 Notas importantes:**

- Solo animar propiedades que no causan reflow/repaint
- Usar `will-change` con moderación y limpiar después
- Considerar `prefers-reduced-motion` para accesibilidad
- Duraciones típicas: micro-interacciones 0.1-0.3s, transiciones 0.3-0.5s

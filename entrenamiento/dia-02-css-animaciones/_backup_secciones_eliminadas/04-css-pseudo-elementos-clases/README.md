# 🎯 CSS Pseudo-elementos y Pseudo-clases - Implementación MVP

**⏰ Duración:** 30 minutos  
**🎯 Objetivo:** Dominar pseudo-elementos y pseudo-clases para efectos creativos

## 📚 Metodología MVP

### **FASE CORE ✅ (10 minutos) - Pseudo-clases Básicas**

**Funcionalidad esencial:** Pseudo-clases fundamentales para interacciones

#### **🔧 Pseudo-clases Básicas**

```css
/* ========== FASE CORE ✅ ========== */
/* Funcionalidad: Pseudo-clases básicas */

/* Estados de interacción básicos */
.btn-interactive {
  background: #3498db;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-interactive:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-interactive:active {
  background: #1f4e79;
  transform: translateY(0);
}

.btn-interactive:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
}

/* Pseudo-clases estructurales básicas */
.list-item:first-child {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.list-item:last-child {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.list-item:nth-child(even) {
  background-color: #f8f9fa;
}

.list-item:nth-child(odd) {
  background-color: white;
}
```

#### **💻 Ejercicio Core: Lista Interactiva**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Pseudo-clases Básicas - MVP Core</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f5f6fa;
        padding: 2rem;
        margin: 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
      }

      /* FASE CORE: Pseudo-clases básicas */
      .interactive-list {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        margin-bottom: 2rem;
      }

      .list-item {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #ecf0f1;
        transition: background-color 0.3s ease;
        cursor: pointer;
      }

      .list-item:hover {
        background-color: #e3f2fd !important;
      }

      .list-item:first-child {
        border-top: none;
      }

      .list-item:last-child {
        border-bottom: none;
      }

      .list-item:nth-child(even) {
        background-color: #f8f9fa;
      }

      .list-item:nth-child(odd) {
        background-color: white;
      }

      /* Botones con estados */
      .btn-group {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .btn {
        background: #3498db;
        color: white;
        padding: 1rem 2rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .btn:hover {
        background: #2980b9;
        transform: translateY(-2px);
      }

      .btn:active {
        background: #1f4e79;
        transform: translateY(0);
      }

      .btn:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
      }

      .btn-success {
        background: #27ae60;
      }

      .btn-success:hover {
        background: #229954;
      }

      .btn-warning {
        background: #f39c12;
      }

      .btn-warning:hover {
        background: #e67e22;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Pseudo-clases Básicas Demo</h1>

      <div class="btn-group">
        <button class="btn">Primary</button>
        <button class="btn btn-success">Success</button>
        <button class="btn btn-warning">Warning</button>
      </div>

      <div class="interactive-list">
        <div class="list-item">Primer elemento (first-child)</div>
        <div class="list-item">Segundo elemento (par)</div>
        <div class="list-item">Tercer elemento (impar)</div>
        <div class="list-item">Cuarto elemento (par)</div>
        <div class="list-item">Quinto elemento (impar)</div>
        <div class="list-item">Último elemento (last-child)</div>
      </div>
    </div>
  </body>
</html>
```

### **FASE ENHANCED ⚡ (15 minutos) - Pseudo-elementos Creativos**

**Mejoras:** ::before, ::after, pseudo-clases avanzadas, efectos creativos

#### **🔧 Pseudo-elementos Avanzados**

```css
/* ========== FASE ENHANCED ⚡ ========== */
/* Mejoras: Pseudo-elementos creativos */

/* ::before y ::after básicos */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.tooltip::before {
  content: '';
  position: absolute;
  bottom: 115%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #333;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.tooltip:hover::after,
.tooltip:hover::before {
  opacity: 1;
  visibility: visible;
}

/* Efectos decorativos con pseudo-elementos */
.card-fancy {
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  overflow: hidden;
}

.card-fancy::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: left 0.5s ease;
}

.card-fancy:hover::before {
  left: 100%;
}

/* Iconos con pseudo-elementos */
.icon-arrow::after {
  content: '→';
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
}

.icon-arrow:hover::after {
  transform: translateX(5px);
}

/* Contadores con pseudo-elementos */
.counter {
  counter-reset: item-counter;
}

.counter-item {
  counter-increment: item-counter;
  position: relative;
  padding-left: 3rem;
}

.counter-item::before {
  content: counter(item-counter);
  position: absolute;
  left: 0;
  top: 0;
  background: #3498db;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
```

#### **💻 Ejercicio Enhanced: Cards con Efectos**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Pseudo-elementos Enhanced - MVP</title>
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
        display: grid;
        gap: 2rem;
      }

      /* FASE ENHANCED: Pseudo-elementos creativos */

      /* Tooltips */
      .tooltip-demo {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      .tooltip {
        position: relative;
        display: inline-block;
        background: #3498db;
        color: white;
        padding: 1rem 2rem;
        border-radius: 6px;
        cursor: pointer;
        margin: 0 1rem;
      }

      .tooltip::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.9rem;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
      }

      .tooltip::before {
        content: '';
        position: absolute;
        bottom: 115%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: #333;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .tooltip:hover::after,
      .tooltip:hover::before {
        opacity: 1;
        visibility: visible;
      }

      /* Cards con efecto shine */
      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .card-shine {
        position: relative;
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        cursor: pointer;
      }

      .card-shine::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.4),
          transparent
        );
        transition: left 0.6s ease;
      }

      .card-shine:hover::before {
        left: 100%;
      }

      /* Botones con iconos */
      .btn-icon {
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .btn-icon::after {
        content: '→';
        margin-left: 0.5rem;
        transition: transform 0.3s ease;
      }

      .btn-icon:hover::after {
        transform: translateX(5px);
      }

      /* Lista con contadores */
      .counter-list {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        counter-reset: step-counter;
      }

      .counter-item {
        counter-increment: step-counter;
        position: relative;
        padding: 1rem 0 1rem 4rem;
        border-bottom: 1px solid #ecf0f1;
      }

      .counter-item:last-child {
        border-bottom: none;
      }

      .counter-item::before {
        content: counter(step-counter);
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background: #3498db;
        color: white;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.1rem;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="tooltip-demo">
        <h2>Tooltips con Pseudo-elementos</h2>
        <div
          class="tooltip"
          data-tooltip="¡Información útil!">
          Hover aquí
        </div>
        <div
          class="tooltip"
          data-tooltip="Otro tooltip genial">
          Y aquí también
        </div>
      </div>

      <div class="cards-grid">
        <div class="card-shine">
          <h3>Card con Efecto Shine</h3>
          <p>Hover para ver el efecto de brillo</p>
          <button class="btn-icon">Ver más</button>
        </div>

        <div class="card-shine">
          <h3>Otra Card Brillante</h3>
          <p>El efecto se aplica a toda la card</p>
          <button class="btn-icon">Continuar</button>
        </div>
      </div>

      <div class="counter-list">
        <h2>Lista con Contadores Automáticos</h2>
        <div class="counter-item">Configurar el entorno de desarrollo</div>
        <div class="counter-item">Crear la estructura HTML semántica</div>
        <div class="counter-item">Aplicar estilos CSS básicos</div>
        <div class="counter-item">Agregar interactividad con JavaScript</div>
        <div class="counter-item">Optimizar para dispositivos móviles</div>
      </div>
    </div>
  </body>
</html>
```

### **FASE POLISH ✨ (5 minutos) - Pseudo-selectores Complejos**

**Optimizaciones:** Selectores avanzados, estados complejos, efectos sofisticados

#### **🔧 Pseudo-selectores Avanzados**

```css
/* ========== FASE POLISH ✨ ========== */
/* Optimizaciones: Pseudo-selectores complejos */

/* Selectores nth-child avanzados */
.grid-item:nth-child(3n + 1) {
  background: #e74c3c;
}

.grid-item:nth-child(3n + 2) {
  background: #3498db;
}

.grid-item:nth-child(3n + 3) {
  background: #27ae60;
}

/* Pseudo-clases de estado avanzadas */
.form-input:valid {
  border-color: #27ae60;
  background-image: linear-gradient(
    45deg,
    transparent 40%,
    rgba(39, 174, 96, 0.1) 40%
  );
}

.form-input:invalid {
  border-color: #e74c3c;
  background-image: linear-gradient(
    45deg,
    transparent 40%,
    rgba(231, 76, 60, 0.1) 40%
  );
}

.form-input:placeholder-shown {
  border-color: #bdc3c7;
}

/* Estados de UI complejos */
.tab:target {
  background: #3498db;
  color: white;
}

.checkbox:checked + .custom-checkbox::after {
  content: '✓';
  color: #27ae60;
  font-weight: bold;
}

/* Pseudo-elementos con contenido dinámico */
.notification::before {
  content: attr(data-count);
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

/* Efectos complejos con múltiples pseudo-elementos */
.button-complex {
  position: relative;
  overflow: hidden;
}

.button-complex::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.6s ease;
}

.button-complex::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.button-complex:hover::before {
  left: 100%;
}

.button-complex:active::after {
  width: 300px;
  height: 300px;
  transition: width 0.1s ease, height 0.1s ease;
}

/* Pseudo-clases de estructura avanzadas */
.list-advanced:not(:last-child) {
  border-bottom: 1px solid #ecf0f1;
}

.card:has(.featured) {
  border: 2px solid #f39c12;
  transform: scale(1.02);
}

.parent:not(:has(.child-active)) {
  opacity: 0.6;
}
```

## 🚀 Ejercicios Prácticos

### **⚡ Challenge 1: Tooltip System (10 min)**

Sistema completo de tooltips con diferentes posiciones

### **⚡ Challenge 2: Custom Form Elements (10 min)**

Elementos de formulario personalizados con pseudo-elementos

### **⚡ Challenge 3: Progress Indicators (10 min)**

Indicadores de progreso creativos con contadores

## 📝 Checklist MVP

### **✅ FASE CORE (10 min)**

- [ ] Pseudo-clases básicas (:hover, :active, :focus)
- [ ] Selectores estructurales (:first-child, :last-child, :nth-child)
- [ ] Estados básicos de formulario

### **⚡ FASE ENHANCED (15 min)**

- [ ] Pseudo-elementos ::before y ::after
- [ ] Tooltips con pseudo-elementos
- [ ] Efectos decorativos creativos
- [ ] Contadores automáticos con content

### **✨ FASE POLISH (5 min)**

- [ ] Selectores nth-child avanzados
- [ ] Pseudo-clases de estado complejas (:valid, :invalid, :target)
- [ ] Múltiples pseudo-elementos combinados
- [ ] Selectores :has() y :not() avanzados

## 🎯 Objetivos de Aprendizaje

**Al finalizar esta sección, el aprendiz podrá:**

- Utilizar pseudo-clases para estados interactivos
- Crear contenido decorativo con pseudo-elementos
- Implementar tooltips y efectos sin JavaScript
- Aplicar selectores estructurales complejos
- Combinar múltiples pseudo-elementos para efectos sofisticados

## 🏆 Criterios WorldSkills

- **Creatividad:** Uso innovador de pseudo-elementos para efectos visuales
- **Eficiencia:** Reducir dependencia de JavaScript para interacciones básicas
- **Semántica:** Mantener HTML limpio usando pseudo-elementos decorativos
- **Interactividad:** Estados claros y feedback visual apropiado

---

**📝 Notas importantes:**

- Los pseudo-elementos ::before y ::after requieren la propiedad `content`
- Usar pseudo-elementos para decoración, no para contenido esencial
- Los contadores CSS son ideales para numeración automática
- Considerar accesibilidad al usar pseudo-elementos para información importante

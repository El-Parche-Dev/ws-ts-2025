# 🎯 MVP PRÁCTICA: Loading Animations y Microinteracciones

**⏰ Duración:** 30 minutos  
**🎯 Objetivo:** Implementar microinteracciones profesionales para UX mejorada

## 📚 Metodología MVP

### **FASE CORE ✅ (10 minutos) - Loading Básicos**

**Funcionalidad esencial:** Spinners y loading states básicos

#### **🔧 Loading Animations Básicos**

```css
/* ========== FASE CORE ✅ ========== */
/* Funcionalidad: Loading animations básicos */

/* Spinner básico */
.spinner-basic {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Dots loading */
.dots-loading {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dot {
  width: 12px;
  height: 12px;
  background: #3498db;
  border-radius: 50%;
  animation: bounce-dot 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}
.dot:nth-child(2) {
  animation-delay: -0.16s;
}
.dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes bounce-dot {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Progress bar básica */
.progress-basic {
  width: 100%;
  height: 6px;
  background: #ecf0f1;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3498db;
  width: 0%;
  animation: fill-progress 3s ease-in-out infinite;
}

@keyframes fill-progress {
  0% {
    width: 0%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 100%;
  }
}

/* Button loading state */
.btn-loading {
  position: relative;
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-loading.loading {
  color: transparent;
  pointer-events: none;
}

.btn-loading.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

#### **💻 Ejercicio Core: Loading States**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Loading Animations Core - MVP</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f5f6fa;
        margin: 0;
        padding: 2rem;
        min-height: 100vh;
      }

      .container {
        max-width: 800px;
        margin: 0 auto;
      }

      .demo-section {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      h1,
      h2 {
        color: #2c3e50;
        text-align: center;
      }

      /* FASE CORE: Loading animations básicos */

      .loading-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
      }

      .loading-demo {
        text-align: center;
        padding: 2rem;
        border: 2px dashed #bdc3c7;
        border-radius: 8px;
      }

      /* Spinner circular */
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #ecf0f1;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      /* Dots bouncing */
      .dots-container {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-bottom: 1rem;
      }

      .dot {
        width: 12px;
        height: 12px;
        background: #e74c3c;
        border-radius: 50%;
        animation: bounce-dot 1.4s ease-in-out infinite both;
      }

      .dot:nth-child(1) {
        animation-delay: -0.32s;
      }
      .dot:nth-child(2) {
        animation-delay: -0.16s;
      }
      .dot:nth-child(3) {
        animation-delay: 0s;
      }

      @keyframes bounce-dot {
        0%,
        80%,
        100% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }

      /* Progress bar */
      .progress-container {
        margin: 2rem 0;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: #ecf0f1;
        border-radius: 4px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #27ae60, #2ecc71);
        width: 0%;
        animation: fill-progress 3s ease-in-out infinite;
        border-radius: 4px;
      }

      @keyframes fill-progress {
        0% {
          width: 0%;
        }
        50% {
          width: 70%;
        }
        100% {
          width: 100%;
        }
      }

      /* Botones con loading */
      .button-demos {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin: 2rem 0;
      }

      .btn {
        position: relative;
        background: #3498db;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        min-width: 120px;
      }

      .btn:hover {
        background: #2980b9;
        transform: translateY(-2px);
      }

      .btn.loading {
        color: transparent;
        pointer-events: none;
      }

      .btn.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .btn-success {
        background: #27ae60;
      }

      .btn-success:hover {
        background: #229954;
      }

      /* Pulse loading */
      .pulse-loader {
        width: 60px;
        height: 60px;
        background: #9b59b6;
        border-radius: 50%;
        animation: pulse-scale 1.5s ease-in-out infinite;
        margin: 0 auto 1rem;
      }

      @keyframes pulse-scale {
        0%,
        100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.3);
          opacity: 0.7;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Loading Animations - Básicos</h1>

      <div class="demo-section">
        <h2>Spinners y Loaders</h2>

        <div class="loading-grid">
          <div class="loading-demo">
            <div class="spinner"></div>
            <p>
              <strong>Spinner Circular</strong><br />Clásico loading spinner
            </p>
          </div>

          <div class="loading-demo">
            <div class="dots-container">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
            <p><strong>Bouncing Dots</strong><br />Animación escalonada</p>
          </div>

          <div class="loading-demo">
            <div class="pulse-loader"></div>
            <p><strong>Pulse Loader</strong><br />Efecto de pulsación</p>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2>Progress Bars</h2>

        <div class="progress-container">
          <p>Progress Bar Animada:</p>
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2>Button Loading States</h2>

        <div class="button-demos">
          <button
            class="btn"
            onclick="this.classList.add('loading'); setTimeout(() => this.classList.remove('loading'), 3000)">
            Simular Loading
          </button>

          <button
            class="btn btn-success"
            onclick="this.classList.add('loading'); setTimeout(() => this.classList.remove('loading'), 2000)">
            Guardar Datos
          </button>
        </div>

        <p style="text-align: center; color: #7f8c8d; font-size: 0.9rem;">
          Haz clic en los botones para ver el estado de loading
        </p>
      </div>
    </div>
  </body>
</html>
```

### **FASE ENHANCED ⚡ (15 minutos) - Microinteracciones Avanzadas**

**Mejoras:** Hover effects sofisticados, estados interactivos, feedback visual

#### **🔧 Microinteracciones Sofisticadas**

```css
/* ========== FASE ENHANCED ⚡ ========== */
/* Mejoras: Microinteracciones avanzadas */

/* Button hover effects complejos */
.btn-ripple {
  position: relative;
  overflow: hidden;
  background: #3498db;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-ripple::before {
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

.btn-ripple:active::before {
  width: 300px;
  height: 300px;
  transition: width 0.1s ease, height 0.1s ease;
}

/* Card hover interactions */
.interactive-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.interactive-card::before {
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

.interactive-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.interactive-card:hover::before {
  left: 100%;
}

/* Toggle switches */
.toggle-switch {
  position: relative;
  width: 60px;
  height: 30px;
  background: #bdc3c7;
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-switch::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active {
  background: #27ae60;
}

.toggle-switch.active::before {
  transform: translateX(30px);
}

/* Form input interactions */
.floating-label {
  position: relative;
  margin: 1rem 0;
}

.floating-input {
  width: 100%;
  padding: 1rem 0.5rem 0.5rem;
  border: none;
  border-bottom: 2px solid #bdc3c7;
  background: transparent;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.floating-input:focus {
  outline: none;
  border-bottom-color: #3498db;
}

.floating-label-text {
  position: absolute;
  top: 1rem;
  left: 0.5rem;
  color: #7f8c8d;
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.3s ease;
}

.floating-input:focus + .floating-label-text,
.floating-input:not(:placeholder-shown) + .floating-label-text {
  top: 0.2rem;
  font-size: 0.8rem;
  color: #3498db;
}

/* Icon animations */
.animated-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3498db;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.animated-icon:hover {
  background: #2980b9;
  transform: scale(1.1);
}

.icon-heart {
  transition: all 0.3s ease;
}

.animated-icon:hover .icon-heart {
  transform: scale(1.2);
  color: #e74c3c;
}

/* Notification toast */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 1000;
}

.toast.show {
  transform: translateX(0);
}

.toast.success {
  border-left: 4px solid #27ae60;
}

.toast.error {
  border-left: 4px solid #e74c3c;
}
```

#### **💻 Ejercicio Enhanced: Dashboard Interactivo**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Microinteracciones Enhanced - MVP</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        margin: 0;
        padding: 2rem;
        min-height: 100vh;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        color: white;
        text-align: center;
        margin-bottom: 3rem;
      }

      /* FASE ENHANCED: Microinteracciones avanzadas */

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      }

      /* Interactive cards */
      .card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .card::before {
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

      .card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      }

      .card:hover::before {
        left: 100%;
      }

      .card h3 {
        margin: 0 0 1rem 0;
        color: #2c3e50;
      }

      .card p {
        color: #7f8c8d;
        line-height: 1.6;
        margin: 0;
      }

      /* Button collection */
      .button-collection {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .buttons-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      /* Ripple button */
      .btn-ripple {
        position: relative;
        overflow: hidden;
        background: #3498db;
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .btn-ripple::before {
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

      .btn-ripple:active::before {
        width: 300px;
        height: 300px;
        transition: width 0.1s ease, height 0.1s ease;
      }

      .btn-glow {
        background: #e74c3c;
        box-shadow: 0 0 0 rgba(231, 76, 60, 0.4);
        transition: all 0.3s ease;
      }

      .btn-glow:hover {
        box-shadow: 0 0 20px rgba(231, 76, 60, 0.6);
      }

      .btn-scale {
        background: #27ae60;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .btn-scale:hover {
        transform: scale(1.05);
      }

      /* Toggle switches */
      .controls-section {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .control-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #ecf0f1;
      }

      .control-item:last-child {
        border-bottom: none;
      }

      .toggle-switch {
        position: relative;
        width: 60px;
        height: 30px;
        background: #bdc3c7;
        border-radius: 15px;
        cursor: pointer;
        transition: background 0.3s ease;
      }

      .toggle-switch::before {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 24px;
        height: 24px;
        background: white;
        border-radius: 50%;
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }

      .toggle-switch.active {
        background: #27ae60;
      }

      .toggle-switch.active::before {
        transform: translateX(30px);
      }

      /* Form section */
      .form-section {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      .floating-label {
        position: relative;
        margin: 2rem 0;
      }

      .floating-input {
        width: 100%;
        padding: 1rem 0.5rem 0.5rem;
        border: none;
        border-bottom: 2px solid #bdc3c7;
        background: transparent;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }

      .floating-input:focus {
        outline: none;
        border-bottom-color: #3498db;
      }

      .floating-label-text {
        position: absolute;
        top: 1rem;
        left: 0.5rem;
        color: #7f8c8d;
        font-size: 1rem;
        pointer-events: none;
        transition: all 0.3s ease;
      }

      .floating-input:focus + .floating-label-text,
      .floating-input:not(:placeholder-shown) + .floating-label-text {
        top: 0.2rem;
        font-size: 0.8rem;
        color: #3498db;
      }

      /* Icons animados */
      .icons-demo {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin: 2rem 0;
      }

      .animated-icon {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #3498db;
        color: white;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1.5rem;
      }

      .animated-icon:hover {
        transform: scale(1.15) rotate(5deg);
      }

      .icon-heart:hover {
        background: #e74c3c;
        animation: heartbeat 0.6s ease-in-out;
      }

      @keyframes heartbeat {
        0%,
        100% {
          transform: scale(1.15);
        }
        50% {
          transform: scale(1.3);
        }
      }

      .icon-star:hover {
        background: #f39c12;
        animation: spin 0.6s ease-in-out;
      }

      .icon-check:hover {
        background: #27ae60;
        animation: bounce 0.6s ease-in-out;
      }

      @keyframes bounce {
        0%,
        100% {
          transform: scale(1.15);
        }
        50% {
          transform: scale(1.3) translateY(-5px);
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Dashboard con Microinteracciones</h1>

      <div class="dashboard-grid">
        <div class="card">
          <h3>Analytics</h3>
          <p>
            Vista general de métricas y estadísticas. Hover para ver el efecto
            shine.
          </p>
        </div>

        <div class="card">
          <h3>Usuarios</h3>
          <p>Gestión de usuarios y perfiles. Efectos de elevación en hover.</p>
        </div>

        <div class="card">
          <h3>Configuración</h3>
          <p>Ajustes del sistema y preferencias. Interacciones fluidas.</p>
        </div>
      </div>

      <div class="button-collection">
        <h2>Colección de Botones Interactivos</h2>
        <div class="buttons-grid">
          <button class="btn-ripple">Ripple Effect</button>
          <button class="btn-ripple btn-glow">Glow Effect</button>
          <button class="btn-ripple btn-scale">Scale Effect</button>
        </div>
      </div>

      <div class="controls-section">
        <h2>Controles Toggle</h2>
        <div class="control-item">
          <span>Notificaciones</span>
          <div
            class="toggle-switch"
            onclick="this.classList.toggle('active')"></div>
        </div>
        <div class="control-item">
          <span>Modo Oscuro</span>
          <div
            class="toggle-switch"
            onclick="this.classList.toggle('active')"></div>
        </div>
        <div class="control-item">
          <span>Sonidos</span>
          <div
            class="toggle-switch active"
            onclick="this.classList.toggle('active')"></div>
        </div>
      </div>

      <div class="form-section">
        <h2>Formulario con Labels Flotantes</h2>
        <div class="floating-label">
          <input
            type="text"
            class="floating-input"
            placeholder=" " />
          <label class="floating-label-text">Nombre completo</label>
        </div>
        <div class="floating-label">
          <input
            type="email"
            class="floating-input"
            placeholder=" " />
          <label class="floating-label-text">Correo electrónico</label>
        </div>
        <div class="floating-label">
          <input
            type="password"
            class="floating-input"
            placeholder=" " />
          <label class="floating-label-text">Contraseña</label>
        </div>

        <h3>Iconos Animados</h3>
        <div class="icons-demo">
          <div class="animated-icon icon-heart">❤️</div>
          <div class="animated-icon icon-star">⭐</div>
          <div class="animated-icon icon-check">✓</div>
          <div class="animated-icon">🚀</div>
        </div>
      </div>
    </div>
  </body>
</html>
```

### **FASE POLISH ✨ (5 minutos) - Sistemas Avanzados**

**Optimizaciones:** Performance, accessibility, sistemas complejos

#### **🔧 Sistemas de Microinteracciones Avanzados**

```css
/* ========== FASE POLISH ✨ ========== */
/* Optimizaciones: Sistemas avanzados y performance */

/* Sistema de notificaciones avanzado */
.notification-system {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  pointer-events: none;
}

.notification {
  background: white;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: all;
  max-width: 300px;
}

.notification.show {
  transform: translateX(0);
  opacity: 1;
}

.notification.success {
  border-left: 4px solid #27ae60;
}
.notification.error {
  border-left: 4px solid #e74c3c;
}
.notification.warning {
  border-left: 4px solid #f39c12;
}
.notification.info {
  border-left: 4px solid #3498db;
}

/* Loading states complejos */
.skeleton-loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Drag and drop interactions */
.drag-zone {
  border: 2px dashed #bdc3c7;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  transition: all 0.3s ease;
}

.drag-zone.drag-over {
  border-color: #3498db;
  background: rgba(52, 152, 219, 0.1);
  transform: scale(1.02);
}

/* Accessible focus states */
.focus-visible {
  outline: none;
}

.focus-visible:focus-visible {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* Performance optimized animations */
.optimized-animation {
  will-change: transform;
  transform: translateZ(0);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .respect-motion-preferences {
    animation: none;
    transition: none;
  }
}

/* State management con CSS custom properties */
.dynamic-component {
  --state-color: #3498db;
  --state-scale: 1;
  --state-rotation: 0deg;

  background: var(--state-color);
  transform: scale(var(--state-scale)) rotate(var(--state-rotation));
  transition: all 0.3s ease;
}

.dynamic-component.active {
  --state-color: #27ae60;
  --state-scale: 1.1;
  --state-rotation: 5deg;
}

.dynamic-component.error {
  --state-color: #e74c3c;
  --state-scale: 0.95;
  --state-rotation: -2deg;
}
```

## 🚀 Ejercicios Prácticos

### **⚡ Challenge 1: Loading System Completo (10 min)**

Sistema de loading con múltiples estados y transiciones

### **⚡ Challenge 2: Form Validation Interactiva (10 min)**

Formulario con validación visual en tiempo real

### **⚡ Challenge 3: Dashboard con Estados (10 min)**

Dashboard completo con microinteracciones cohesivas

## 📝 Checklist MVP

### **✅ FASE CORE (10 min)**

- [ ] Spinners básicos (circular, dots, pulse)
- [ ] Progress bars animadas
- [ ] Button loading states
- [ ] Transiciones suaves básicas

### **⚡ FASE ENHANCED (15 min)**

- [ ] Hover effects complejos (ripple, glow, scale)
- [ ] Interactive cards con shine effect
- [ ] Toggle switches animados
- [ ] Floating labels en formularios
- [ ] Icon animations

### **✨ FASE POLISH (5 min)**

- [ ] Sistema de notificaciones toast
- [ ] Skeleton loading para performance percibida
- [ ] Drag and drop interactions
- [ ] Accessibility y reduced motion
- [ ] State management con custom properties

## 🎯 Objetivos de Aprendizaje

**Al finalizar esta sección, el aprendiz podrá:**

- Implementar loading states profesionales
- Crear microinteracciones que mejoren UX
- Desarrollar sistemas de feedback visual
- Optimizar performance de animaciones
- Aplicar principios de accesibilidad en interacciones

## 🏆 Criterios WorldSkills

- **UX Excellence:** Microinteracciones que guían al usuario intuitivamente
- **Performance:** Animaciones fluidas sin impacto en rendimiento
- **Accessibility:** Respeto por preferencias de movimiento
- **Consistency:** Sistema cohesivo de interacciones
- **Innovation:** Uso creativo de efectos para mejorar usabilidad

---

**📝 Notas importantes:**

- Las microinteracciones deben tener propósito, no ser decorativas
- Usar `will-change` solo durante animaciones activas
- Implementar `prefers-reduced-motion` para accesibilidad
- Loading states mejoran la percepción de performance
- Feedback visual inmediato es clave para buena UX

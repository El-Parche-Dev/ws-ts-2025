# 🎬 CSS Animations y Keyframes | WorldSkills 2025

## 📋 Información General

- **Duración**: 45 minutos
- **Competencia**: CSS Animations, @keyframes, timing functions
- **Metodología MVP**: Core (18min) → Enhanced (16min) → Polish (11min)

## 🎯 Objetivos de Aprendizaje

Al finalizar esta sección, el aprendiz será capaz de:

1. **Crear animaciones CSS básicas** usando @keyframes
2. **Controlar el timing y duración** de las animaciones
3. **Implementar animaciones complejas** con múltiples estados
4. **Optimizar animaciones** para rendimiento

## 🏗️ Estructura MVP - CSS Animations

### 🔧 FASE CORE (18 minutos) - Fundamentos Esenciales

#### ✅ Checklist Core

- [ ] @keyframes básico funcionando
- [ ] animation-duration aplicada
- [ ] animation-iteration-count configurada
- [ ] Animación visible y sin errores

#### 📝 Ejercicio Core: Bounce Animation

```css
/* Animación básica funcional */
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-50px);
  }
  100% {
    transform: translateY(0);
  }
}

.bounce-element {
  width: 100px;
  height: 100px;
  background-color: #3498db;
  border-radius: 50%;
  animation: bounce 2s infinite;
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* Animación de rebote */
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}
```

#### **2. Propiedades de Animation (10 minutos)**

```css
/* Clases base para aplicar animaciones */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.slide-in-left {
  animation: slideInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.spin-loader {
  animation: spin 1s linear infinite;
}

.pulse-button {
  animation: pulse 2s ease-in-out infinite;
}

.bounce-icon {
  animation: bounce 1s ease-in-out infinite;
}

/* Propiedades de animation detalladas */
.animation-completa {
  animation-name: slideInLeft;
  animation-duration: 1s;
  animation-timing-function: ease-out;
  animation-delay: 0.2s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
}

/* Shorthand equivalente */
.animation-shorthand {
  animation: slideInLeft 1s ease-out 0.2s 1 normal both running;
}

/* Múltiples animaciones */
.multiple-animations {
  animation: fadeIn 0.5s ease-in, slideInLeft 0.8s ease-out 0.1s,
    pulse 2s ease-in-out 0.6s infinite;
}

/* Control de animaciones */
.paused {
  animation-play-state: paused;
}

.delayed {
  animation-delay: 1s;
}

.infinite {
  animation-iteration-count: infinite;
}

.reverse {
  animation-direction: reverse;
}

.alternate {
  animation-direction: alternate;
}
```

### **FASE ENHANCED ⚡ (8 minutos) - Timing Avanzado y Performance**

#### **3. Timing Functions Avanzadas (8 minutos)**

```css
/* Timing functions básicas */
.ease-in {
  animation: slideInLeft 1s ease-in;
}

.ease-out {
  animation: slideInLeft 1s ease-out;
}

.ease-in-out {
  animation: slideInLeft 1s ease-in-out;
}

.linear {
  animation: slideInLeft 1s linear;
}

/* Cubic-bezier personalizadas */
.smooth-bounce {
  animation: bounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.elastic {
  animation: pulse 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.back-ease {
  animation: slideInLeft 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Steps para animaciones discretas */
.typing-effect {
  animation: typing 4s steps(40, end);
  white-space: nowrap;
  overflow: hidden;
  border-right: 2px solid var(--color-primario);
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* Animaciones en cadena con delays */
.cascade-animation .item:nth-child(1) {
  animation-delay: 0s;
}
.cascade-animation .item:nth-child(2) {
  animation-delay: 0.1s;
}
.cascade-animation .item:nth-child(3) {
  animation-delay: 0.2s;
}
.cascade-animation .item:nth-child(4) {
  animation-delay: 0.3s;
}
.cascade-animation .item:nth-child(5) {
  animation-delay: 0.4s;
}

.cascade-animation .item {
  animation: fadeInUp 0.6s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Performance optimizations */
.gpu-accelerated {
  animation: slideInLeft 1s ease-out;
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0); /* Force hardware acceleration */
}

/* Animaciones responsivas */
@media (prefers-reduced-motion: reduce) {
  .respect-motion-preference {
    animation: none;
  }
}

@media (max-width: 768px) {
  .mobile-friendly {
    animation-duration: 0.3s; /* Animaciones más rápidas en móvil */
  }
}
```

### **FASE POLISH ✨ (4 minutos) - Efectos Complejos y Creativos**

#### **4. Animaciones Complejas (4 minutos)**

```css
/* Animación de morphing */
@keyframes morph {
  0% {
    border-radius: 50%;
    background: var(--color-primario);
    transform: scale(1) rotate(0deg);
  }
  25% {
    border-radius: 25%;
    background: var(--color-secundario);
    transform: scale(1.2) rotate(90deg);
  }
  50% {
    border-radius: 0;
    background: var(--color-exito);
    transform: scale(0.8) rotate(180deg);
  }
  75% {
    border-radius: 25%;
    background: var(--color-advertencia);
    transform: scale(1.1) rotate(270deg);
  }
  100% {
    border-radius: 50%;
    background: var(--color-primario);
    transform: scale(1) rotate(360deg);
  }
}

.morph-element {
  animation: morph 3s ease-in-out infinite;
  width: 100px;
  height: 100px;
}

/* Animación de partículas flotantes */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
}

.floating-particles .particle {
  animation: float 3s ease-in-out infinite;
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--color-primario);
  border-radius: 50%;
}

.floating-particles .particle:nth-child(1) {
  animation-delay: 0s;
  left: 10%;
}
.floating-particles .particle:nth-child(2) {
  animation-delay: 0.5s;
  left: 30%;
}
.floating-particles .particle:nth-child(3) {
  animation-delay: 1s;
  left: 50%;
}

/* Animación de progress bar */
@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: var(--progress-width, 100%);
  }
}

.progress-bar {
  height: 10px;
  background: var(--color-gris-claro);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-primario),
    var(--color-secundario)
  );
  animation: progress 2s ease-out forwards;
}

/* Animación de loader con múltiples elementos */
.loader-complex {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.loader-complex div {
  position: absolute;
  border: 4px solid var(--color-primario);
  opacity: 1;
  border-radius: 50%;
  animation: ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.loader-complex div:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
```

## 📋 HTML de Ejemplo

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>CSS Animations Showcase</title>
    <link
      rel="stylesheet"
      href="animations.css" />
  </head>
  <body>
    <!-- Animaciones básicas -->
    <section class="demo-section">
      <h2>Animaciones Básicas</h2>

      <div class="demo-grid">
        <div class="demo-item fade-in">Fade In</div>
        <div class="demo-item slide-in-left">Slide Left</div>
        <div class="demo-item spin-loader">Spinner</div>
        <div class="demo-item pulse-button">Pulse</div>
        <div class="demo-item bounce-icon">Bounce</div>
      </div>
    </section>

    <!-- Animaciones en cascada -->
    <section class="demo-section">
      <h2>Animaciones en Cascada</h2>

      <div class="cascade-animation">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
        <div class="item">Item 4</div>
        <div class="item">Item 5</div>
      </div>
    </section>

    <!-- Efectos complejos -->
    <section class="demo-section">
      <h2>Efectos Complejos</h2>

      <div class="morph-element"></div>

      <div class="floating-particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>

      <div class="progress-bar">
        <div
          class="progress-fill"
          style="--progress-width: 75%;"></div>
      </div>

      <div class="loader-complex">
        <div></div>
        <div></div>
      </div>
    </section>

    <!-- Texto con efecto typing -->
    <section class="demo-section">
      <div class="typing-effect">Texto escribiéndose automáticamente...</div>
    </section>
  </body>
</html>
```

## 🎯 Ejercicio Práctico (Últimos 5 minutos)

**Crear una página con 5 animaciones diferentes:**

1. **Loading spinner** con rotación infinita
2. **Card entrance** con fadeInUp
3. **Button hover** con pulse effect
4. **Progress bar** animada
5. **Text reveal** con typing effect

**Aplicar metodología MVP:**

- **Core:** Animaciones básicas funcionando
- **Enhanced:** Timing functions personalizadas
- **Polish:** Efectos complejos y optimización

## ✅ Checklist Verificación

### **✅ FASE CORE**

- [ ] @keyframes básicos implementados
- [ ] Propiedades de animation funcionando
- [ ] Animaciones infinitas y temporales
- [ ] CSS aplicado correctamente

### **⚡ FASE ENHANCED**

- [ ] Timing functions personalizadas
- [ ] Animaciones en cascada
- [ ] Performance optimizada
- [ ] Responsive considerations

### **✨ FASE POLISH**

- [ ] Efectos complejos creativos
- [ ] Múltiples animaciones sincronizadas
- [ ] Accessibility considerations
- [ ] Browser compatibility

## 📝 Recursos

- [CSS Animation Generator](https://animista.net/)
- [Cubic Bezier Tool](https://cubic-bezier.com/)
- [Can I Use - CSS Animations](https://caniuse.com/css-animation)

**¡Animaciones CSS dominadas! Siguiente: CSS Transforms 2D/3D 🚀**

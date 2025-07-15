# ⚡ Speed Test: CSS Animations

**⏰ Duración:** 15 minutos  
**🎯 Objetivo:** Demostrar velocidad y precisión en implementación de efectos CSS  
**🏅 Modalidad:** Prueba cronometrada individual

## 📋 Descripción del Speed Test

**Reto:** Implementar **6 efectos de animación específicos** en el menor tiempo posible manteniendo calidad profesional.

### **⚡ Efectos a Implementar (15 min total)**

#### **1. Loading Spinner Personalizado (2 min)**

```css
/* OBJETIVO: Crear spinner con 3 círculos que rotan */
.custom-spinner {
  /* Tu código aquí */
}
```

**Criterios:**

- 3 círculos de diferentes colores
- Rotación infinita a velocidades diferentes
- Centrado en contenedor de 100px x 100px

#### **2. Button Ripple Effect (2 min)**

```css
/* OBJETIVO: Efecto ripple al hacer click */
.ripple-btn {
  /* Tu código aquí */
}
```

**Criterios:**

- Efecto circular que se expande desde punto de click
- Duración de 0.6 segundos
- Color semi-transparente

#### **3. Card 3D Flip (3 min)**

```css
/* OBJETIVO: Card que se voltea en hover */
.flip-card {
  /* Tu código aquí */
}
```

**Criterios:**

- Flip vertical de 180 grados
- Perspectiva 3D realista
- Transición suave de 0.8 segundos

#### **4. Morphing Shape (3 min)**

```css
/* OBJETIVO: Forma que cambia con clip-path */
.morph-shape {
  /* Tu código aquí */
}
```

**Criterios:**

- De círculo a hexágono en hover
- Usar clip-path
- Cambio de color simultáneo

#### **5. Text Reveal Animation (2 min)**

```css
/* OBJETIVO: Texto que se revela con máscara */
.text-reveal {
  /* Tu código aquí */
}
```

**Criterios:**

- Efecto de escritura de izquierda a derecha
- Usar CSS mask o clip-path
- Duración de 2 segundos

#### **6. Glassmorphism Card (3 min)**

```css
/* OBJETIVO: Card con efecto cristal */
.glass-card {
  /* Tu código aquí */
}
```

**Criterios:**

- Background blur con backdrop-filter
- Borde semi-transparente
- Hover effect con mayor transparencia

## 🚀 Estructura de Archivos Base

### **index.html**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Speed Test - CSS Animations</title>
    <link
      rel="stylesheet"
      href="speedtest.css" />
  </head>
  <body>
    <div class="container">
      <h1>Speed Test: CSS Animations</h1>

      <!-- 1. Loading Spinner -->
      <section class="test-section">
        <h2>1. Custom Spinner (2 min)</h2>
        <div class="spinner-container">
          <div class="custom-spinner">
            <div class="spinner-circle circle-1"></div>
            <div class="spinner-circle circle-2"></div>
            <div class="spinner-circle circle-3"></div>
          </div>
        </div>
      </section>

      <!-- 2. Ripple Button -->
      <section class="test-section">
        <h2>2. Ripple Effect (2 min)</h2>
        <button class="ripple-btn">Click for Ripple</button>
      </section>

      <!-- 3. 3D Flip Card -->
      <section class="test-section">
        <h2>3. 3D Flip Card (3 min)</h2>
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front">Front</div>
            <div class="flip-card-back">Back</div>
          </div>
        </div>
      </section>

      <!-- 4. Morphing Shape -->
      <section class="test-section">
        <h2>4. Morphing Shape (3 min)</h2>
        <div class="morph-shape"></div>
      </section>

      <!-- 5. Text Reveal -->
      <section class="test-section">
        <h2>5. Text Reveal (2 min)</h2>
        <div class="text-reveal">Amazing CSS Animation!</div>
      </section>

      <!-- 6. Glassmorphism -->
      <section class="test-section">
        <h2>6. Glassmorphism Card (3 min)</h2>
        <div class="glass-background">
          <div class="glass-card">
            <h3>Glass Effect</h3>
            <p>Hover for enhanced transparency</p>
          </div>
        </div>
      </section>
    </div>

    <script>
      // Timer y funcionalidad de ripple
      let startTime = Date.now();

      // Ripple effect para botones
      document
        .querySelector('.ripple-btn')
        .addEventListener('click', function (e) {
          const ripple = document.createElement('span');
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;

          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          ripple.classList.add('ripple');

          this.appendChild(ripple);

          setTimeout(() => {
            ripple.remove();
          }, 600);
        });

      // Timer display
      setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.title = `Speed Test - ${elapsed}s elapsed`;
      }, 1000);
    </script>
  </body>
</html>
```

### **speedtest.css (Base estructura)**

```css
/* ========== BASE STYLES ========== */
:root {
  --primary: #3498db;
  --secondary: #e74c3c;
  --accent: #f39c12;
  --success: #27ae60;
  --text: #2c3e50;
  --bg: #ecf0f1;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--text);
  min-height: 100vh;
  padding: 2rem;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

.test-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.test-section h2 {
  margin-bottom: 1rem;
  color: var(--primary);
}

/* ========== TU CÓDIGO AQUÍ ========== */

/* 1. CUSTOM SPINNER */
.spinner-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.custom-spinner {
  /* IMPLEMENTAR: Spinner con 3 círculos rotativos */
}

/* 2. RIPPLE BUTTON */
.ripple-btn {
  /* IMPLEMENTAR: Button con ripple effect */
}

/* 3. 3D FLIP CARD */
.flip-card {
  /* IMPLEMENTAR: Card que se voltea en 3D */
}

/* 4. MORPHING SHAPE */
.morph-shape {
  /* IMPLEMENTAR: Shape que cambia forma con clip-path */
}

/* 5. TEXT REVEAL */
.text-reveal {
  /* IMPLEMENTAR: Texto con animación de revelado */
}

/* 6. GLASSMORPHISM CARD */
.glass-background {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="25" cy="25" r="20" fill="rgba(255,0,150,0.3)"/><circle cx="75" cy="75" r="25" fill="rgba(0,255,150,0.3)"/></svg>');
  background-size: 200px 200px;
  padding: 2rem;
  border-radius: 8px;
}

.glass-card {
  /* IMPLEMENTAR: Card con efecto glassmorphism */
}
```

## 📊 Sistema de Puntuación

### **Criterios de Evaluación (100 pts total)**

#### **Velocidad (40 pts)**

- **15 min o menos:** 40 pts
- **15-18 min:** 30 pts
- **18-20 min:** 20 pts
- **Más de 20 min:** 10 pts

#### **Funcionalidad (35 pts)**

- Cada efecto funcionando: 5-6 pts
- Cumple especificaciones exactas
- Efectos suaves y profesionales

#### **Calidad del Código (25 pts)**

- CSS limpio y organizado (10 pts)
- Uso apropiado de propiedades (10 pts)
- Performance optimizada (5 pts)

### **Bonificaciones (+10 pts cada una)**

- **Creatividad:** Mejoras visuales sin especificar
- **Performance:** 60fps constantes en todos los efectos
- **Accesibilidad:** Implementación de `prefers-reduced-motion`

## ⏰ Estrategia de Tiempo

### **Minutos 0-2: Spinner**

- Estructura básica con 3 divs
- Animación `@keyframes` de rotación
- Posicionamiento absoluto

### **Minutos 2-4: Ripple Button**

- JavaScript ya incluido
- CSS para `.ripple` class
- Overflow hidden en button

### **Minutos 4-7: 3D Flip Card**

- Perspective en contenedor
- Transform-style preserve-3d
- RotateY para flip

### **Minutos 7-10: Morphing Shape**

- Clip-path inicial (circle)
- Clip-path hover (polygon)
- Transition smooth

### **Minutos 10-12: Text Reveal**

- Mask o clip-path animado
- Animación de 0% a 100%
- Timing apropiado

### **Minutos 12-15: Glassmorphism**

- Backdrop-filter blur
- Background rgba
- Border semi-transparente
- Hover enhancement

## 🎯 Tips para Velocidad

### **Preparación Mental**

- Visualizar cada efecto antes de codificar
- Recordar propiedades CSS clave
- Planificar estructura HTML necesaria

### **Atajos de Código**

```css
/* Shortcuts útiles */
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.smooth {
  transition: all 0.3s ease;
}
.hardware {
  transform: translateZ(0);
  will-change: transform;
}
```

### **Debugging Rápido**

- Usar inspector para ajustar valores
- Comentar partes problemáticas
- Priorizar funcionalidad sobre perfección

## 🏆 Resultados Esperados

### **Nivel Principiante (60-70 pts)**

- Algunos efectos funcionando
- Código básico pero efectivo
- Tiempo dentro del límite

### **Nivel Intermedio (70-85 pts)**

- Mayoría de efectos funcionando
- Buena calidad de código
- Timing eficiente

### **Nivel Avanzado (85-100+ pts)**

- Todos los efectos perfectos
- Código optimizado y limpio
- Creatividad y bonificaciones
- Menos de 15 minutos

---

**⚡ ¡Prepárate para demostrar tu velocidad y precisión en CSS Animations!**

**Recuerda:** Precisión es más importante que velocidad. Un efecto perfecto vale más que tres efectos a medias.

# 🔄 CSS Transforms 2D y 3D | WorldSkills 2025

## 📋 Información General

- **Duración**: 45 minutos
- **Competencia**: CSS Transforms, perspective, 3D effects
- **Metodología MVP**: Core (18min) → Enhanced (16min) → Polish (11min)

## 🎯 Objetivos de Aprendizaje

Al finalizar esta sección, el aprendiz será capaz de:

1. **Aplicar transformaciones 2D** (translate, rotate, scale, skew)
2. **Crear efectos 3D** con perspective y transform-style
3. **Combinar transformaciones** para efectos complejos
4. **Optimizar transforms** para rendimiento GPU

## 🏗️ Estructura MVP - CSS Transforms

### 🔧 FASE CORE (18 minutos) - Transformaciones Básicas

#### ✅ Checklist Core

- [ ] translate() funcionando
- [ ] rotate() aplicado
- [ ] scale() implementado
- [ ] transform-origin configurado

#### � Ejercicio Core: Card Flip Básico

```css
/* Transformaciones 2D básicas */
.card-container {
  perspective: 1000px;
  width: 200px;
  height: 300px;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card:hover {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
}

.card-back {
  transform: rotateY(180deg);
}
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Transform 2D Básico - MVP Core</title>
    <style>
      .container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
      }

      .card {
        background: #3498db;
        color: white;
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        transition: transform 0.3s ease;
      }

      /* FASE CORE: Transforms básicos */
      .card:hover {
        transform: translateY(-10px);
      }

      .card-rotate:hover {
        transform: rotate(5deg);
      }

      .card-scale:hover {
        transform: scale(1.05);
      }

      .card-skew:hover {
        transform: skewX(5deg);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <h3>Translate Y</h3>
        <p>Hover para mover verticalmente</p>
      </div>

      <div class="card card-rotate">
        <h3>Rotate</h3>
        <p>Hover para rotar</p>
      </div>

      <div class="card card-scale">
        <h3>Scale</h3>
        <p>Hover para escalar</p>
      </div>

      <div class="card card-skew">
        <h3>Skew</h3>
        <p>Hover para inclinar</p>
      </div>
    </div>
  </body>
</html>
```

### ⚡ FASE ENHANCED (16 minutos) - Efectos 3D Avanzados

#### ✅ Checklist Enhanced

- [ ] Perspective implementada correctamente
- [ ] transform-style: preserve-3d funcionando
- [ ] Combinaciones de transforms complejas
- [ ] Transform-origin avanzado

#### 📝 Ejercicio Enhanced: Cubo 3D Interactivo

```css
.cube-container {
  perspective: 1000px;
  width: 200px;
  height: 200px;
  margin: 100px auto;
}

.cube {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  animation: rotateCube 20s infinite linear;
}

.cube-face {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid #333;
  opacity: 0.8;
}

.front {
  transform: rotateY(0deg) translateZ(100px);
}
.back {
  transform: rotateY(180deg) translateZ(100px);
}
.right {
  transform: rotateY(90deg) translateZ(100px);
}
.left {
  transform: rotateY(-90deg) translateZ(100px);
}
.top {
  transform: rotateX(90deg) translateZ(100px);
}
.bottom {
  transform: rotateX(-90deg) translateZ(100px);
}

@keyframes rotateCube {
  from {
    transform: rotateX(0) rotateY(0);
  }
  to {
    transform: rotateX(360deg) rotateY(360deg);
  }
}
```

### ✨ FASE POLISH (11 minutos) - Optimización y Efectos Complejos

#### ✅ Checklist Polish

- [ ] Hardware acceleration optimizada
- [ ] Efectos de parallax
- [ ] Transforms responsivos
- [ ] Animaciones performantes

#### 📝 Ejercicio Polish: Sistema de Transforms Avanzado

```css
/* Sistema optimizado con will-change */
.transform-system {
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

/* Parallax scrolling effect */
.parallax-container {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  perspective: 1px;
}

.parallax-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.parallax-back {
  transform: translateZ(-1px) scale(2);
}

.parallax-base {
  transform: translateZ(0);
}

.parallax-front {
  transform: translateZ(1px);
}
```

## 🚀 Ejercicios Prácticos

### **⚡ Challenge 1: Transform Gallery (10 min)**

Crear una galería con efectos 3D en hover

### **⚡ Challenge 2: Card Flip Menu (10 min)**

Menú de navegación con cards que se voltean

### **⚡ Challenge 3: 3D Cube Animation (10 min)**

Cubo 3D rotando con información en cada cara

## 📝 Checklist MVP

### **✅ FASE CORE (10 min)**

- [ ] Transform 2D básicos (translate, rotate, scale, skew)
- [ ] Hover effects simples
- [ ] Transiciones básicas

### ⚡ FASE ENHANCED (15 min)

- [ ] Transform 3D (rotateX, rotateY, rotateZ)
- [ ] Transform-origin control
- [ ] Card flip effects
- [ ] Perspective y preserve-3d

### ✨ FASE POLISH (5 min)

- [ ] Combinaciones complejas de transforms
- [ ] Optimización de performance
- [ ] Animaciones 3D avanzadas

## 🎯 Objetivos de Aprendizaje

**Al finalizar esta sección, el aprendiz podrá:**

- Aplicar transforms 2D y 3D de manera efectiva
- Crear efectos de profundidad y perspectiva
- Optimizar transforms para mejor performance
- Combinar múltiples transformaciones
- Implementar card flips y efectos 3D complejos

## 🏆 Criterios WorldSkills

- **Precisión visual:** Transforms exactos y fluidos
- **Performance:** Uso eficiente de hardware acceleration
- **Creatividad:** Efectos innovadores con transforms
- **Responsive:** Adaptabilidad en diferentes dispositivos

---

**📝 Notas importantes:**

- Usar `will-change: transform` para mejor performance
- `translateZ(0)` fuerza hardware acceleration
- `perspective` debe estar en el contenedor padre
- `transform-style: preserve-3d` mantiene contexto 3D

---

**🎯 Tip de Performance**: Siempre usa `transform3d()` en lugar de `transform` para activar aceleración GPU, incluso para transforms 2D.

**⚡ Siguiente**: CSS Transitions y Timing Functions

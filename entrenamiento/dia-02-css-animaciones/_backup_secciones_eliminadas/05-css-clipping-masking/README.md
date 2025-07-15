# 🎯 CSS Clipping y Masking - Implementación MVP

**⏰ Duración:** 30 minutos  
**🎯 Objetivo:** Crear formas complejas y efectos de recorte con CSS

## 📚 Metodología MVP

### **FASE CORE ✅ (10 minutos) - Clip-path Básico**

**Funcionalidad esencial:** Formas básicas con clip-path

#### **🔧 Clip-path Básico**

```css
/* ========== FASE CORE ✅ ========== */
/* Funcionalidad: Clip-path básico para formas simples */

/* Formas geométricas básicas */
.clip-circle {
  clip-path: circle(50%);
  background: #3498db;
  width: 200px;
  height: 200px;
}

.clip-ellipse {
  clip-path: ellipse(40% 50%);
  background: #e74c3c;
  width: 200px;
  height: 150px;
}

.clip-triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background: #27ae60;
  width: 200px;
  height: 200px;
}

.clip-hexagon {
  clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
  background: #9b59b6;
  width: 200px;
  height: 200px;
}

/* Clip-path con transiciones */
.clip-animated {
  background: #f39c12;
  width: 200px;
  height: 200px;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  transition: clip-path 0.5s ease;
}

.clip-animated:hover {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
```

#### **💻 Ejercicio Core: Galería de Formas**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Clip-path Básico - MVP Core</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #2c3e50;
        margin: 0;
        padding: 2rem;
        min-height: 100vh;
      }

      .container {
        max-width: 1000px;
        margin: 0 auto;
        text-align: center;
      }

      h1 {
        color: white;
        margin-bottom: 3rem;
      }

      /* FASE CORE: Formas básicas con clip-path */
      .shapes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 3rem;
        margin-bottom: 4rem;
      }

      .shape-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .shape {
        width: 200px;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.2rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;
      }

      .shape:hover {
        transform: scale(1.1);
      }

      .shape-label {
        color: white;
        font-size: 1.1rem;
        margin-top: 1rem;
      }

      /* Formas específicas */
      .circle {
        clip-path: circle(50%);
        background: linear-gradient(135deg, #3498db, #2980b9);
      }

      .triangle {
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        background: linear-gradient(135deg, #e74c3c, #c0392b);
      }

      .hexagon {
        clip-path: polygon(
          30% 0%,
          70% 0%,
          100% 50%,
          70% 100%,
          30% 100%,
          0% 50%
        );
        background: linear-gradient(135deg, #9b59b6, #8e44ad);
      }

      .diamond {
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        background: linear-gradient(135deg, #27ae60, #229954);
      }

      /* Formas animadas */
      .morphing {
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        background: linear-gradient(135deg, #f39c12, #e67e22);
        transition: clip-path 0.6s ease;
      }

      .morphing:hover {
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      }

      .pentagon {
        clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        background: linear-gradient(135deg, #1abc9c, #16a085);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Galería de Formas con Clip-path</h1>

      <div class="shapes-grid">
        <div class="shape-container">
          <div class="shape circle">Círculo</div>
          <div class="shape-label">circle(50%)</div>
        </div>

        <div class="shape-container">
          <div class="shape triangle">Triángulo</div>
          <div class="shape-label">polygon(50% 0%, 0% 100%, 100% 100%)</div>
        </div>

        <div class="shape-container">
          <div class="shape hexagon">Hexágono</div>
          <div class="shape-label">polygon(30% 0%, 70% 0%, ...)</div>
        </div>

        <div class="shape-container">
          <div class="shape diamond">Diamante</div>
          <div class="shape-label">polygon(50% 0%, 100% 50%, ...)</div>
        </div>

        <div class="shape-container">
          <div class="shape morphing">Morphing</div>
          <div class="shape-label">Hover para transformar</div>
        </div>

        <div class="shape-container">
          <div class="shape pentagon">Pentágono</div>
          <div class="shape-label">polygon(50% 0%, 100% 38%, ...)</div>
        </div>
      </div>
    </div>
  </body>
</html>
```

### **FASE ENHANCED ⚡ (15 minutos) - CSS Masks y Efectos Avanzados**

**Mejoras:** CSS masks, gradientes como máscaras, shape-outside

#### **🔧 CSS Masks y Shape-outside**

```css
/* ========== FASE ENHANCED ⚡ ========== */
/* Mejoras: CSS Masks y efectos avanzados */

/* CSS Masks básicas */
.mask-gradient {
  background: linear-gradient(45deg, #3498db, #9b59b6);
  mask: linear-gradient(45deg, transparent 30%, black 70%);
  -webkit-mask: linear-gradient(45deg, transparent 30%, black 70%);
}

.mask-radial {
  background: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400');
  background-size: cover;
  background-position: center;
  mask: radial-gradient(circle at center, black 40%, transparent 60%);
  -webkit-mask: radial-gradient(circle at center, black 40%, transparent 60%);
}

/* Shape-outside para text wrapping */
.float-shape {
  width: 200px;
  height: 200px;
  float: left;
  margin: 0 20px 20px 0;
  background: #e74c3c;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  shape-outside: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

/* Máscaras con imágenes SVG */
.mask-svg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  mask: url('#mask-shape');
  -webkit-mask: url('#mask-shape');
}

/* Múltiples máscaras combinadas */
.mask-multiple {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  mask: radial-gradient(circle at 25% 25%, black 30%, transparent 50%),
    radial-gradient(circle at 75% 75%, black 30%, transparent 50%);
  -webkit-mask: radial-gradient(circle at 25% 25%, black 30%, transparent 50%),
    radial-gradient(circle at 75% 75%, black 30%, transparent 50%);
  mask-composite: intersect;
  -webkit-mask-composite: source-in;
}

/* Efectos de reveal con mask */
.reveal-mask {
  background: linear-gradient(90deg, #667eea, #764ba2);
  mask: linear-gradient(90deg, transparent, black var(--reveal, 0%));
  -webkit-mask: linear-gradient(90deg, transparent, black var(--reveal, 0%));
  transition: --reveal 0.6s ease;
}

.reveal-mask:hover {
  --reveal: 100%;
}
```

#### **💻 Ejercicio Enhanced: Efectos con Masks**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>CSS Masks Enhanced - MVP</title>
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

      .section {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      /* FASE ENHANCED: CSS Masks */

      /* Gradient masks */
      .mask-demo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
      }

      .mask-item {
        height: 200px;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
      }

      .mask-gradient-fade {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
        mask: linear-gradient(180deg, black 0%, black 70%, transparent 100%);
        -webkit-mask: linear-gradient(
          180deg,
          black 0%,
          black 70%,
          transparent 100%
        );
      }

      .mask-radial-spotlight {
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ff6b6b"/><circle cx="50" cy="50" r="30" fill="%234ecdc4"/></svg>');
        background-size: cover;
        mask: radial-gradient(circle at center, black 40%, transparent 60%);
        -webkit-mask: radial-gradient(
          circle at center,
          black 40%,
          transparent 60%
        );
        transition: mask 0.3s ease;
      }

      .mask-radial-spotlight:hover {
        mask: radial-gradient(circle at center, black 60%, transparent 80%);
        -webkit-mask: radial-gradient(
          circle at center,
          black 60%,
          transparent 80%
        );
      }

      .mask-diagonal {
        background: linear-gradient(135deg, #667eea, #764ba2);
        mask: linear-gradient(45deg, black 50%, transparent 50%);
        -webkit-mask: linear-gradient(45deg, black 50%, transparent 50%);
      }

      /* Text wrapping con shape-outside */
      .shape-text-demo {
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 8px;
        line-height: 1.6;
      }

      .float-diamond {
        width: 150px;
        height: 150px;
        float: left;
        margin: 0 20px 20px 0;
        background: linear-gradient(135deg, #ff6b6b, #feca57);
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        shape-outside: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      }

      .float-circle {
        width: 120px;
        height: 120px;
        float: right;
        margin: 0 0 20px 20px;
        background: linear-gradient(135deg, #a8edea, #fed6e3);
        border-radius: 50%;
        shape-outside: circle(50%);
      }

      /* Reveal effect con custom properties */
      .reveal-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .reveal-card {
        height: 150px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 8px;
        mask: linear-gradient(90deg, transparent, black var(--reveal, 0%));
        -webkit-mask: linear-gradient(
          90deg,
          transparent,
          black var(--reveal, 0%)
        );
        transition: --reveal 0.8s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.2rem;
      }

      .reveal-card:hover {
        --reveal: 100%;
      }

      /* Mask animations */
      @keyframes maskSlide {
        0% {
          mask-position: -100% 0;
          -webkit-mask-position: -100% 0;
        }
        100% {
          mask-position: 100% 0;
          -webkit-mask-position: 100% 0;
        }
      }

      .mask-animated {
        background: linear-gradient(45deg, #ff9a9e, #fecfef);
        mask: linear-gradient(
          90deg,
          transparent 30%,
          black 50%,
          transparent 70%
        );
        -webkit-mask: linear-gradient(
          90deg,
          transparent 30%,
          black 50%,
          transparent 70%
        );
        mask-size: 200% 100%;
        -webkit-mask-size: 200% 100%;
        animation: maskSlide 2s ease-in-out infinite alternate;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="section">
        <h2>CSS Masks - Efectos Avanzados</h2>

        <div class="mask-demo-grid">
          <div class="mask-item mask-gradient-fade">
            <div style="padding: 1rem; color: white; font-weight: bold;">
              Gradient Fade
            </div>
          </div>

          <div class="mask-item mask-radial-spotlight">
            <div
              style="padding: 1rem; color: white; font-weight: bold; text-align: center;">
              Radial Spotlight<br /><small>Hover para expandir</small>
            </div>
          </div>

          <div class="mask-item mask-diagonal">
            <div style="padding: 1rem; color: white; font-weight: bold;">
              Diagonal Cut
            </div>
          </div>

          <div class="mask-item mask-animated">
            <div style="padding: 1rem; color: white; font-weight: bold;">
              Animated Mask
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Shape-outside: Text Wrapping</h2>

        <div class="shape-text-demo">
          <div class="float-diamond"></div>
          <div class="float-circle"></div>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>

          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>

          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </p>
        </div>
      </div>

      <div class="section">
        <h2>Reveal Effects</h2>
        <p>Hover sobre las cards para ver el efecto de revelado:</p>

        <div class="reveal-cards">
          <div class="reveal-card">Card 1</div>
          <div class="reveal-card">Card 2</div>
          <div class="reveal-card">Card 3</div>
          <div class="reveal-card">Card 4</div>
        </div>
      </div>
    </div>
  </body>
</html>
```

### **FASE POLISH ✨ (5 minutos) - SVG Clipping y Efectos Complejos**

**Optimizaciones:** SVG clip-paths, máscaras complejas, performance

#### **🔧 SVG Clipping y Optimizaciones**

```css
/* ========== FASE POLISH ✨ ========== */
/* Optimizaciones: SVG clipping y efectos complejos */

/* SVG clip-paths para formas complejas */
.svg-clip {
  clip-path: url('#custom-shape');
  background: linear-gradient(135deg, #667eea, #764ba2);
}

/* Máscaras SVG reutilizables */
.svg-mask {
  mask: url('#organic-mask');
  -webkit-mask: url('#organic-mask');
}

/* Animaciones complejas de clip-path */
@keyframes morphShape {
  0% {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
  25% {
    clip-path: polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%);
  }
  50% {
    clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
  }
  75% {
    clip-path: polygon(0% 15%, 100% 0%, 100% 85%, 0% 100%);
  }
  100% {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
}

.morph-animation {
  animation: morphShape 4s ease-in-out infinite;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}

/* Performance optimized clipping */
.optimized-clip {
  will-change: clip-path;
  transform: translateZ(0); /* Force hardware acceleration */
}

/* Complex mask compositions */
.advanced-mask {
  background: url('complex-pattern.jpg');
  mask: radial-gradient(
      circle at 20% 20%,
      transparent 30%,
      black 31%,
      black 60%,
      transparent 61%
    ), radial-gradient(
      circle at 80% 80%,
      transparent 30%,
      black 31%,
      black 60%,
      transparent 61%
    ), linear-gradient(45deg, black 40%, transparent 50%);
  mask-composite: subtract, add;
  -webkit-mask-composite: source-out, source-over;
}

/* Responsive clipping */
@media (max-width: 768px) {
  .responsive-clip {
    clip-path: none; /* Simplify on mobile */
  }
}

@media (min-width: 769px) {
  .responsive-clip {
    clip-path: polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%);
  }
}
```

#### **💻 Ejercicio Polish: SVG Clipping Avanzado**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>SVG Clipping Avanzado - MVP Polish</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #2c3e50;
        margin: 0;
        padding: 2rem;
        min-height: 100vh;
      }

      .container {
        max-width: 1000px;
        margin: 0 auto;
      }

      /* FASE POLISH: SVG clipping avanzado */
      .svg-demo {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
      }

      .svg-item {
        height: 250px;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
      }

      .organic-shape {
        background: linear-gradient(135deg, #667eea, #764ba2);
        clip-path: url('#organic-clip');
      }

      .wave-clip {
        background: linear-gradient(135deg, #ff6b6b, #feca57);
        clip-path: url('#wave-path');
      }

      /* Morphing animations */
      @keyframes morphComplex {
        0% {
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
        20% {
          clip-path: polygon(0% 0%, 100% 20%, 80% 100%, 0% 80%);
        }
        40% {
          clip-path: polygon(20% 0%, 100% 0%, 100% 80%, 0% 100%);
        }
        60% {
          clip-path: polygon(0% 20%, 80% 0%, 100% 100%, 20% 100%);
        }
        80% {
          clip-path: polygon(0% 0%, 100% 0%, 80% 80%, 20% 100%);
        }
        100% {
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
      }

      .morph-complex {
        background: linear-gradient(45deg, #4ecdc4, #44a08d);
        animation: morphComplex 6s ease-in-out infinite;
        will-change: clip-path;
      }

      .content-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        text-align: center;
        font-weight: bold;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      h1,
      h2 {
        color: white;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <!-- SVG Definitions -->
    <svg
      width="0"
      height="0">
      <defs>
        <clipPath
          id="organic-clip"
          clipPathUnits="objectBoundingBox">
          <path
            d="M0.1,0.2 C0.3,0.1 0.7,0.1 0.9,0.2 C0.95,0.4 0.9,0.6 0.8,0.8 C0.6,0.9 0.4,0.9 0.2,0.8 C0.05,0.6 0.1,0.4 0.1,0.2 Z" />
        </clipPath>

        <clipPath
          id="wave-path"
          clipPathUnits="objectBoundingBox">
          <path d="M0,0 L1,0 L1,0.8 Q0.75,0.9 0.5,0.8 T0,0.8 Z" />
        </clipPath>

        <mask id="organic-mask">
          <rect
            width="100%"
            height="100%"
            fill="white" />
          <circle
            cx="25%"
            cy="25%"
            r="15%"
            fill="black" />
          <circle
            cx="75%"
            cy="75%"
            r="20%"
            fill="black" />
        </mask>
      </defs>
    </svg>

    <div class="container">
      <h1>SVG Clipping y Máscaras Avanzadas</h1>

      <div class="svg-demo">
        <div class="svg-item organic-shape">
          <div class="content-overlay">
            <h3>Forma Orgánica</h3>
            <p>SVG Clip-path</p>
          </div>
        </div>

        <div class="svg-item wave-clip">
          <div class="content-overlay">
            <h3>Onda</h3>
            <p>Path personalizado</p>
          </div>
        </div>

        <div class="svg-item morph-complex">
          <div class="content-overlay">
            <h3>Morphing</h3>
            <p>Animación compleja</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

## 🚀 Ejercicios Prácticos

### **⚡ Challenge 1: Logo Reveal Effect (10 min)**

Efecto de revelado de logo con masks animadas

### **⚡ Challenge 2: Image Gallery con Clipping (10 min)**

Galería de imágenes con formas dinámicas

### **⚡ Challenge 3: Text Wrapping Creativo (10 min)**

Layout de revista con shape-outside

## 📝 Checklist MVP

### **✅ FASE CORE (10 min)**

- [ ] Formas básicas con clip-path (circle, polygon)
- [ ] Transiciones de clip-path
- [ ] Formas geométricas simples

### **⚡ FASE ENHANCED (15 min)**

- [ ] CSS masks con gradientes
- [ ] Shape-outside para text wrapping
- [ ] Múltiples máscaras combinadas
- [ ] Efectos de reveal

### **✨ FASE POLISH (5 min)**

- [ ] SVG clip-paths personalizados
- [ ] Animaciones complejas de morphing
- [ ] Optimización de performance
- [ ] Máscaras avanzadas con composición

## 🎯 Objetivos de Aprendizaje

**Al finalizar esta sección, el aprendiz podrá:**

- Crear formas complejas con clip-path
- Aplicar máscaras CSS para efectos creativos
- Implementar text wrapping con shape-outside
- Usar SVG para clipping avanzado
- Optimizar performance en efectos de clipping

## 🏆 Criterios WorldSkills

- **Creatividad:** Uso innovador de clipping para diseños únicos
- **Técnica:** Precisión en paths SVG y máscaras complejas
- **Performance:** Optimización de efectos pesados
- **Versatilidad:** Adaptación responsive de efectos

---

**📝 Notas importantes:**

- Los clip-paths son compatibles con la mayoría de navegadores modernos
- Usar `will-change: clip-path` para animaciones complejas
- Las máscaras requieren prefijo `-webkit-` para compatibilidad
- SVG clip-paths ofrecen mayor flexibilidad que CSS básico

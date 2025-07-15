# 🎯 CSS Filters y Blend Modes - Implementación MVP

**⏰ Duración:** 30 minutos  
**🎯 Objetivo:** Efectos visuales avanzados con filtros y modos de mezcla

## 📚 Metodología MVP

### **FASE CORE ✅ (10 minutos) - Filtros Básicos**

**Funcionalidad esencial:** Filtros CSS fundamentales

#### **🔧 Filtros CSS Básicos**

```css
/* ========== FASE CORE ✅ ========== */
/* Funcionalidad: Filtros básicos para efectos visuales */

/* Filtros individuales básicos */
.filter-blur {
  filter: blur(5px);
  transition: filter 0.3s ease;
}

.filter-blur:hover {
  filter: blur(0px);
}

.filter-brightness {
  filter: brightness(0.7);
  transition: filter 0.3s ease;
}

.filter-brightness:hover {
  filter: brightness(1.2);
}

.filter-contrast {
  filter: contrast(1.5);
  transition: filter 0.3s ease;
}

.filter-contrast:hover {
  filter: contrast(1);
}

.filter-grayscale {
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.filter-grayscale:hover {
  filter: grayscale(0%);
}

.filter-saturate {
  filter: saturate(2);
  transition: filter 0.3s ease;
}

.filter-saturate:hover {
  filter: saturate(1);
}

/* Filtros combinados básicos */
.filter-combo-basic {
  filter: brightness(1.1) contrast(1.2) saturate(1.3);
  transition: filter 0.3s ease;
}

.filter-combo-basic:hover {
  filter: brightness(1) contrast(1) saturate(1);
}
```

#### **💻 Ejercicio Core: Galería con Filtros**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>CSS Filters Básicos - MVP Core</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f5f6fa;
        margin: 0;
        padding: 2rem;
        min-height: 100vh;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 3rem;
      }

      /* FASE CORE: Filtros básicos */
      .filters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      }

      .filter-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }

      .filter-card:hover {
        transform: translateY(-5px);
      }

      .filter-image {
        width: 100%;
        height: 200px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="30" cy="30" r="20" fill="rgba(255,255,255,0.3)"/><circle cx="70" cy="70" r="15" fill="rgba(255,255,255,0.2)"/><rect x="20" y="60" width="40" height="20" fill="rgba(255,255,255,0.1)" rx="5"/></svg>');
        background-size: cover;
        background-position: center;
        transition: filter 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.2rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .filter-info {
        padding: 1.5rem;
        text-align: center;
      }

      .filter-info h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
      }

      .filter-info p {
        margin: 0;
        color: #7f8c8d;
        font-size: 0.9rem;
      }

      /* Efectos específicos */
      .blur-effect {
        filter: blur(3px);
      }

      .blur-effect:hover {
        filter: blur(0px);
      }

      .brightness-effect {
        filter: brightness(0.6);
      }

      .brightness-effect:hover {
        filter: brightness(1.2);
      }

      .contrast-effect {
        filter: contrast(1.8);
      }

      .contrast-effect:hover {
        filter: contrast(1);
      }

      .grayscale-effect {
        filter: grayscale(100%);
      }

      .grayscale-effect:hover {
        filter: grayscale(0%);
      }

      .saturate-effect {
        filter: saturate(2.5);
      }

      .saturate-effect:hover {
        filter: saturate(1);
      }

      .sepia-effect {
        filter: sepia(100%);
      }

      .sepia-effect:hover {
        filter: sepia(0%);
      }

      .hue-effect {
        filter: hue-rotate(120deg);
      }

      .hue-effect:hover {
        filter: hue-rotate(0deg);
      }

      .invert-effect {
        filter: invert(100%);
      }

      .invert-effect:hover {
        filter: invert(0%);
      }

      /* Combinaciones */
      .combo-vintage {
        filter: sepia(50%) contrast(1.2) brightness(1.1);
      }

      .combo-vintage:hover {
        filter: sepia(0%) contrast(1) brightness(1);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Galería de Filtros CSS</h1>
      <p style="text-align: center; color: #7f8c8d; margin-bottom: 2rem;">
        Hover sobre cada imagen para ver el efecto de transición
      </p>

      <div class="filters-grid">
        <div class="filter-card">
          <div class="filter-image blur-effect">Blur</div>
          <div class="filter-info">
            <h3>Blur</h3>
            <p>filter: blur(3px)</p>
          </div>
        </div>

        <div class="filter-card">
          <div class="filter-image brightness-effect">Brightness</div>
          <div class="filter-info">
            <h3>Brightness</h3>
            <p>filter: brightness(0.6)</p>
          </div>
        </div>

        <div class="filter-card">
          <div class="filter-image contrast-effect">Contrast</div>
          <div class="filter-info">
            <h3>Contrast</h3>
            <p>filter: contrast(1.8)</p>
          </div>
        </div>

        <div class="filter-card">
          <div class="filter-image grayscale-effect">Grayscale</div>
          <div class="filter-info">
            <h3>Grayscale</h3>
            <p>filter: grayscale(100%)</p>
          </div>
        </div>

        <div class="filter-card">
          <div class="filter-image saturate-effect">Saturate</div>
          <div class="filter-info">
            <h3>Saturate</h3>
            <p>filter: saturate(2.5)</p>
          </div>
        </div>

        <div class="filter-card">
          <div class="filter-image sepia-effect">Sepia</div>
          <div class="filter-info">
            <h3>Sepia</h3>
            <p>filter: sepia(100%)</p>
          </div>
        </div>

        <div class="filter-card">
          <div class="filter-image hue-effect">Hue Rotate</div>
          <div class="filter-info">
            <h3>Hue Rotate</h3>
            <p>filter: hue-rotate(120deg)</p>
          </div>
        </div>

        <div class="filter-card">
          <div class="filter-image invert-effect">Invert</div>
          <div class="filter-info">
            <h3>Invert</h3>
            <p>filter: invert(100%)</p>
          </div>
        </div>

        <div class="filter-card">
          <div class="filter-image combo-vintage">Vintage</div>
          <div class="filter-info">
            <h3>Vintage Combo</h3>
            <p>sepia + contrast + brightness</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

### **FASE ENHANCED ⚡ (15 minutos) - Blend Modes y Filtros Avanzados**

**Mejoras:** Mix-blend-mode, backdrop-filter, combinaciones complejas

#### **🔧 Blend Modes y Backdrop Filter**

```css
/* ========== FASE ENHANCED ⚡ ========== */
/* Mejoras: Blend modes y filtros avanzados */

/* Mix-blend-mode básicos */
.blend-multiply {
  mix-blend-mode: multiply;
  background: #e74c3c;
}

.blend-screen {
  mix-blend-mode: screen;
  background: #3498db;
}

.blend-overlay {
  mix-blend-mode: overlay;
  background: #9b59b6;
}

.blend-color-dodge {
  mix-blend-mode: color-dodge;
  background: #f39c12;
}

/* Background-blend-mode para fondos */
.bg-blend-demo {
  background: linear-gradient(
      45deg,
      rgba(231, 76, 60, 0.8),
      rgba(52, 152, 219, 0.8)
    ), url('pattern.jpg');
  background-blend-mode: multiply;
}

/* Backdrop-filter para glassmorphism */
.glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px) brightness(1.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Filtros complejos combinados */
.filter-instagram-valencia {
  filter: contrast(1.08) brightness(1.08) saturate(1.2) sepia(0.02);
}

.filter-instagram-clarendon {
  filter: contrast(1.2) saturate(1.35) hue-rotate(-15deg);
}

.filter-duotone {
  filter: grayscale(100%) contrast(1) brightness(0.9);
  mix-blend-mode: multiply;
}

/* Hover effects con filtros */
.image-hover-effects {
  overflow: hidden;
  position: relative;
}

.image-hover-effects::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  mix-blend-mode: overlay;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-hover-effects:hover::before {
  opacity: 0.7;
}

.image-hover-effects img {
  transition: filter 0.3s ease, transform 0.3s ease;
}

.image-hover-effects:hover img {
  filter: contrast(1.2) saturate(1.3);
  transform: scale(1.05);
}
```

#### **💻 Ejercicio Enhanced: Blend Modes Showcase**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Blend Modes Enhanced - MVP</title>
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
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      h1,
      h2 {
        color: white;
        text-align: center;
      }

      /* FASE ENHANCED: Blend modes showcase */

      /* Blend modes comparison */
      .blend-demo {
        background: linear-gradient(
            45deg,
            rgba(255, 107, 107, 0.8),
            rgba(78, 205, 196, 0.8)
          ), repeating-linear-gradient(45deg, #fff 0px, #fff 10px, #f8f9fa 10px, #f8f9fa
              20px);
        min-height: 300px;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
      }

      .blend-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        padding: 1rem;
      }

      .blend-item {
        height: 100px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        position: relative;
      }

      .multiply {
        background: #e74c3c;
        mix-blend-mode: multiply;
      }

      .screen {
        background: #3498db;
        mix-blend-mode: screen;
      }

      .overlay {
        background: #9b59b6;
        mix-blend-mode: overlay;
      }

      .soft-light {
        background: #27ae60;
        mix-blend-mode: soft-light;
      }

      .hard-light {
        background: #f39c12;
        mix-blend-mode: hard-light;
      }

      .color-dodge {
        background: #e67e22;
        mix-blend-mode: color-dodge;
      }

      .color-burn {
        background: #8e44ad;
        mix-blend-mode: color-burn;
      }

      .difference {
        background: #1abc9c;
        mix-blend-mode: difference;
      }

      /* Glassmorphism cards */
      .glass-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
      }

      .glass-card {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .glass-card:hover {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(25px) saturate(200%);
        transform: translateY(-5px);
      }

      .glass-card h3 {
        color: white;
        margin: 0 0 1rem 0;
      }

      .glass-card p {
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
        line-height: 1.6;
      }

      /* Instagram-style filters */
      .filter-showcase {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .filter-item {
        height: 150px;
        background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        transition: transform 0.3s ease;
      }

      .filter-item:hover {
        transform: scale(1.05);
      }

      .valencia {
        filter: contrast(1.08) brightness(1.08) saturate(1.2) sepia(0.02);
      }

      .clarendon {
        filter: contrast(1.2) saturate(1.35) hue-rotate(-15deg);
      }

      .gingham {
        filter: brightness(1.05) hue-rotate(-10deg);
      }

      .moon {
        filter: grayscale(1) contrast(1.1) brightness(1.1);
      }

      .lark {
        filter: contrast(0.9) brightness(1.1) saturate(1.2);
      }

      .juno {
        filter: contrast(1.2) brightness(1.1) saturate(1.4) sepia(0.2);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Blend Modes y Filtros Avanzados</h1>

      <div class="section">
        <h2>Mix-blend-mode Showcase</h2>
        <div class="blend-demo">
          <div class="blend-grid">
            <div class="blend-item multiply">Multiply</div>
            <div class="blend-item screen">Screen</div>
            <div class="blend-item overlay">Overlay</div>
            <div class="blend-item soft-light">Soft Light</div>
            <div class="blend-item hard-light">Hard Light</div>
            <div class="blend-item color-dodge">Color Dodge</div>
            <div class="blend-item color-burn">Color Burn</div>
            <div class="blend-item difference">Difference</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Glassmorphism con Backdrop-filter</h2>
        <div class="glass-grid">
          <div class="glass-card">
            <h3>Card Transparente</h3>
            <p>Efecto glassmorphism con backdrop-filter: blur() y saturate()</p>
          </div>
          <div class="glass-card">
            <h3>Hover Interactivo</h3>
            <p>
              Los efectos cambian dinámicamente en hover para mayor
              interactividad
            </p>
          </div>
          <div class="glass-card">
            <h3>Bordes Sutiles</h3>
            <p>
              Bordes semi-transparentes que complementan el efecto de cristal
            </p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Filtros Estilo Instagram</h2>
        <div class="filter-showcase">
          <div class="filter-item valencia">Valencia</div>
          <div class="filter-item clarendon">Clarendon</div>
          <div class="filter-item gingham">Gingham</div>
          <div class="filter-item moon">Moon</div>
          <div class="filter-item lark">Lark</div>
          <div class="filter-item juno">Juno</div>
        </div>
      </div>
    </div>
  </body>
</html>
```

### **FASE POLISH ✨ (5 minutos) - Filtros Avanzados y Performance**

**Optimizaciones:** Filtros complejos, optimización, casos especiales

#### **🔧 Filtros Avanzados y Optimización**

```css
/* ========== FASE POLISH ✨ ========== */
/* Optimizaciones: Filtros complejos y performance */

/* Filtros SVG personalizados */
.svg-filter {
  filter: url('#custom-filter');
}

/* Combinaciones complejas optimizadas */
.filter-complex-optimized {
  filter: brightness(1.1) contrast(1.2) saturate(1.3) hue-rotate(15deg) blur(0.5px);
  will-change: filter;
  transition: filter 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Drop-shadow personalizado */
.custom-drop-shadow {
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3)) drop-shadow(
      0 6px 6px rgba(0, 0, 0, 0.2)
    );
}

/* Filtros condicionales según contexto */
@media (prefers-reduced-motion: reduce) {
  .filter-animated {
    filter: none;
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .filter-adaptive {
    filter: invert(1) hue-rotate(180deg);
  }
}

/* Performance optimization */
.filter-performance {
  filter: brightness(1.1);
  will-change: filter;
  transform: translateZ(0); /* Force layer creation */
}

/* Filtros responsivos */
@media (max-width: 768px) {
  .filter-mobile-optimized {
    filter: none; /* Remove heavy filters on mobile */
  }
}

@media (min-width: 769px) {
  .filter-mobile-optimized {
    filter: blur(2px) saturate(1.2) contrast(1.1);
  }
}

/* Blend modes complejos */
.multi-layer-blend {
  position: relative;
}

.multi-layer-blend::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  mix-blend-mode: overlay;
  opacity: 0.3;
}

.multi-layer-blend::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.1) 70%);
  mix-blend-mode: multiply;
}

/* CSS variables para filtros dinámicos */
.dynamic-filter {
  --brightness: 1;
  --contrast: 1;
  --saturation: 1;
  filter: brightness(var(--brightness)) contrast(var(--contrast)) saturate(var(--saturation));
  transition: filter 0.3s ease;
}

.dynamic-filter:hover {
  --brightness: 1.2;
  --contrast: 1.3;
  --saturation: 1.4;
}
```

## 🚀 Ejercicios Prácticos

### **⚡ Challenge 1: Instagram Filter Creator (10 min)**

Crear un sistema de filtros personalizables tipo Instagram

### **⚡ Challenge 2: Glassmorphism UI (10 min)**

Interface completa con efectos glassmorphism

### **⚡ Challenge 3: Blend Mode Art (10 min)**

Composiciones artísticas usando solo blend modes

## 📝 Checklist MVP

### **✅ FASE CORE (10 min)**

- [ ] Filtros básicos (blur, brightness, contrast, saturate)
- [ ] Transiciones de filtros en hover
- [ ] Combinaciones simples de filtros

### **⚡ FASE ENHANCED (15 min)**

- [ ] Mix-blend-mode y background-blend-mode
- [ ] Backdrop-filter para glassmorphism
- [ ] Filtros estilo Instagram
- [ ] Efectos de hover complejos

### **✨ FASE POLISH (5 min)**

- [ ] Filtros SVG personalizados
- [ ] Optimización de performance
- [ ] Filtros adaptativos y responsivos
- [ ] Múltiples capas de blend modes

## 🎯 Objetivos de Aprendizaje

**Al finalizar esta sección, el aprendiz podrá:**

- Aplicar filtros CSS para efectos visuales
- Implementar glassmorphism con backdrop-filter
- Crear blend modes creativos
- Optimizar performance de filtros complejos
- Desarrollar sistemas de filtros personalizables

## 🏆 Criterios WorldSkills

- **Creatividad:** Uso innovador de filtros para efectos únicos
- **Performance:** Optimización de efectos pesados
- **Usabilidad:** Efectos que mejoran la experiencia sin comprometer funcionalidad
- **Adaptabilidad:** Filtros que funcionan en diferentes contextos

---

**📝 Notas importantes:**

- Los filtros pueden impactar la performance, usar con moderación
- `backdrop-filter` requiere hardware acceleration
- Combinar filtros en una sola declaración es más eficiente
- Considerar accesibilidad al usar efectos intensos

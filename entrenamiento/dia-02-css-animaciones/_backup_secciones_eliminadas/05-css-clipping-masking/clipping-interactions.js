// ============================================
// CLIPPING INTERACTIONS - WorldSkills 2025
// Interacciones específicas para efectos de clipping
// ============================================

class ClippingEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupClippingDemos();
    this.setupMaskingDemos();
    this.setupAdvancedInteractions();
    console.log('🎨 Clipping Effects initialized');
  }

  // ============================================
  // CLIPPING DEMOS BÁSICOS
  // ============================================

  setupClippingDemos() {
    // Efecto hover para formas básicas
    document.querySelectorAll('.shape').forEach(shape => {
      shape.addEventListener('mouseenter', e => {
        e.target.style.willChange = 'clip-path, transform';
      });

      shape.addEventListener('mouseleave', e => {
        e.target.style.willChange = 'auto';
      });
    });

    // Clip-path interactivo con mouse
    const interactiveClip = document.querySelector('.triangle-clip');
    if (interactiveClip) {
      interactiveClip.addEventListener('mousemove', e => {
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Crear triángulo que sigue el mouse
        const clipPath = `polygon(${x}% ${y}%, 0% 100%, 100% 100%)`;
        e.target.style.clipPath = clipPath;
      });

      interactiveClip.addEventListener('mouseleave', e => {
        e.target.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
      });
    }
  }

  // ============================================
  // MASKING DEMOS
  // ============================================

  setupMaskingDemos() {
    // Máscara que sigue el cursor
    const maskElements = document.querySelectorAll('.mask-circle, .mask-fade');

    maskElements.forEach(element => {
      element.addEventListener('mousemove', e => {
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (element.classList.contains('mask-circle')) {
          element.style.mask = `radial-gradient(circle at ${x}% ${y}%, black 30%, transparent 50%)`;
        } else if (element.classList.contains('mask-fade')) {
          element.style.mask = `linear-gradient(${x}deg, transparent 0%, black 20%, black 80%, transparent 100%)`;
        }
      });

      element.addEventListener('mouseleave', e => {
        if (e.target.classList.contains('mask-circle')) {
          e.target.style.mask =
            'radial-gradient(circle at center, black 40%, transparent 60%)';
        } else if (e.target.classList.contains('mask-fade')) {
          e.target.style.mask =
            'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)';
        }
      });
    });
  }

  // ============================================
  // INTERACCIONES AVANZADAS
  // ============================================

  setupAdvancedInteractions() {
    // Clip-path con scroll parallax
    this.setupScrollEffects();

    // Gestos touch para móviles
    this.setupTouchInteractions();

    // Animaciones basadas en viewport
    this.setupViewportAnimations();
  }

  setupScrollEffects() {
    const scrollElements = document.querySelectorAll('.animated-reveal');

    window.addEventListener('scroll', () => {
      const scrollPercent =
        window.pageYOffset /
        (document.documentElement.scrollHeight - window.innerHeight);

      scrollElements.forEach(element => {
        const clipValue = Math.max(0, Math.min(100, scrollPercent * 100));
        element.style.clipPath = `polygon(0 0, ${clipValue}% 0, ${clipValue}% 100%, 0 100%)`;
      });
    });
  }

  setupTouchInteractions() {
    const touchElements = document.querySelectorAll('.micro-interaction');

    touchElements.forEach(element => {
      let touchStartX = 0;
      let touchStartY = 0;

      element.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        element.classList.add('touch-active');
      });

      element.addEventListener('touchmove', e => {
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        const rect = element.getBoundingClientRect();
        const rotateX = (deltaY / rect.height) * 30;
        const rotateY = (deltaX / rect.width) * 30;

        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      element.addEventListener('touchend', () => {
        element.classList.remove('touch-active');
        element.style.transform = '';
      });
    });
  }

  setupViewportAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-viewport');
          this.animateOnViewport(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.shape').forEach(shape => {
      observer.observe(shape);
    });
  }

  animateOnViewport(element) {
    if (element.classList.contains('hexagon-clip')) {
      element.style.animation = 'hexagon-entrance 1s ease-out forwards';
    } else if (element.classList.contains('animated-morph')) {
      element.style.animationPlayState = 'running';
    }
  }
}

// ============================================
// UTILIDADES PARA CLIPPING
// ============================================

class ClippingUtils {
  static createRandomPolygon(sides = 6) {
    const points = [];
    const centerX = 50;
    const centerY = 50;
    const radius = 40;

    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle) + (Math.random() - 0.5) * 10;
      const y = centerY + radius * Math.sin(angle) + (Math.random() - 0.5) * 10;
      points.push(`${x}% ${y}%`);
    }

    return `polygon(${points.join(', ')})`;
  }

  static morphBetweenShapes(element, shape1, shape2, duration = 1000) {
    let start = null;

    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      // Interpolación básica entre dos clip-paths
      const easing = ClippingUtils.easeInOutCubic(progress);
      element.style.clipPath = ClippingUtils.interpolateClipPath(
        shape1,
        shape2,
        easing
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  static easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  static interpolateClipPath(path1, path2, t) {
    // Implementación básica - en producción usar una librería como Flubber
    return t < 0.5 ? path1 : path2;
  }

  static generateMaskPattern(type = 'dots') {
    switch (type) {
      case 'dots':
        return 'radial-gradient(circle at 50% 50%, black 20%, transparent 20%)';
      case 'stripes':
        return 'linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%)';
      case 'waves':
        return 'radial-gradient(ellipse at center, black 40%, transparent 40%)';
      default:
        return 'linear-gradient(to right, black, transparent)';
    }
  }
}

// ============================================
// PERFORMANCE MONITOR
// ============================================

class ClippingPerformance {
  constructor() {
    this.animationFrames = 0;
    this.lastTime = performance.now();
    this.fps = 0;
    this.monitor();
  }

  monitor() {
    const showFPS = localStorage.getItem('showFPS') === 'true';

    if (showFPS) {
      this.createFPSDisplay();
      this.trackFPS();
    }
  }

  createFPSDisplay() {
    const fpsDisplay = document.createElement('div');
    fpsDisplay.id = 'fps-display';
    fpsDisplay.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
        `;
    document.body.appendChild(fpsDisplay);
  }

  trackFPS() {
    const now = performance.now();
    this.animationFrames++;

    if (now - this.lastTime >= 1000) {
      this.fps = this.animationFrames;
      this.animationFrames = 0;
      this.lastTime = now;

      const display = document.getElementById('fps-display');
      if (display) {
        display.textContent = `FPS: ${this.fps}`;
        display.style.color = this.fps < 30 ? '#ff6b6b' : '#4ecdc4';
      }
    }

    requestAnimationFrame(() => this.trackFPS());
  }
}

// ============================================
// EXPORTAR CONFIGURACIONES
// ============================================

function exportClippingConfig() {
  const config = {
    completed: Array.from(document.querySelectorAll('.checklist input:checked'))
      .length,
    total: document.querySelectorAll('.checklist input').length,
    timestamp: new Date().toISOString(),
    phase: document.querySelector('.phase-section.active')?.id || 'core-phase',
  };

  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'clipping-masking-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  new ClippingEffects();

  // Habilitar monitor de performance en desarrollo
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    new ClippingPerformance();
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.altKey) {
      switch (e.key) {
        case '1':
          showPhase('core');
          break;
        case '2':
          showPhase('enhanced');
          break;
        case '3':
          showPhase('polish');
          break;
        case 'e':
          exportClippingConfig();
          break;
      }
    }
  });
});

// ============================================
// ESTILOS ADICIONALES
// ============================================

const additionalStyles = `
<style>
.touch-active {
    transition: transform 0.1s ease;
}

.in-viewport {
    animation-play-state: running;
}

@keyframes hexagon-entrance {
    from {
        clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%);
        transform: scale(0);
    }
    to {
        clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
        transform: scale(1);
    }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .demo-grid {
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
}

@media (max-width: 480px) {
    .demo-grid {
        grid-template-columns: 1fr;
    }
    
    .shape {
        max-width: 200px;
        margin: 0 auto;
    }
}

/* High performance mode */
@media (prefers-reduced-motion: no-preference) {
    .shape {
        will-change: clip-path, transform;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

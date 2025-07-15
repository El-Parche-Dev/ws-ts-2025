# ⚡ CSS Transitions y Timing | WorldSkills 2025

## 📋 Información General

- **Duración**: 1 hora (16:15-17:15)
- **Competencia**: CSS Transitions, timing functions, performance
- **Metodología MVP**: Core (20min) → Enhanced (20min) → Polish (20min)

## 🎯 Objetivos de Aprendizaje

Al finalizar esta sección, el aprendiz será capaz de:

1. **Crear transiciones suaves** para estados hover/focus
2. **Controlar timing** con cubic-bezier personalizado
3. **Optimizar performance** de las transiciones
4. **Aplicar UX principles** en microinteracciones

## 🏗️ Estructura MVP - CSS Transitions

### 🔧 FASE CORE (20 minutos) - Transiciones Básicas

#### ✅ Checklist Core

- [ ] transition básica funcionando
- [ ] Múltiples propiedades animándose
- [ ] Duración apropiada (0.3s máximo)
- [ ] Estados hover/focus suaves

#### 📝 Ejercicio Core: Button States

```css
/* Transiciones básicas esenciales */
.btn {
  background: #3498db;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  /* CORE: Transición básica */
  transition: background-color 0.3s ease;
}

.btn:hover {
  background: #2980b9;
}
```

### ⚡ FASE ENHANCED (20 minutos) - Timing Avanzado

#### ✅ Checklist Enhanced

- [ ] Cubic-bezier personalizado
- [ ] Delays estratégicos
- [ ] Transiciones encadenadas
- [ ] Multiple properties smooth

### ✨ FASE POLISH (20 minutos) - Performance y UX

#### ✅ Checklist Polish

- [ ] Performance optimizada (GPU)
- [ ] Accessibility considerations
- [ ] Responsive timing
- [ ] Sistema reutilizable

## 📊 Timing Functions Cheat Sheet

```css
/* Timing functions más usadas en WorldSkills */
.ease-out {
  transition-timing-function: ease-out;
}
.ease-back {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
.material {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🎯 Mejores Prácticas WorldSkills

### Performance Rules:

1. **Solo animar propiedades que no causen layout**: `transform`, `opacity`
2. **Usar `will-change`** para elementos que van a cambiar
3. **Duración máxima 0.3s** para interacciones directas

### UX Rules:

1. **Feedback inmediato**: Hover states < 100ms
2. **Consistency**: Mismo timing para elementos similares
3. **Accessibility**: Respetar `prefers-reduced-motion`

## 📝 Entregables

### Checklist Final MVP

- [ ] **CORE**: 3 transiciones básicas smooth
- [ ] **ENHANCED**: 2 timing functions custom
- [ ] **POLISH**: 1 sistema optimizado completo

---

**🎯 Regla de Oro**: En WorldSkills, **consistency beats creativity**.

# 🎯 Día 5: React Router Fundamentos

**⏰ HORARIO ESTRICTO**: 12:00 PM - 6:00 PM (6 horas exactas)  
**🎯 OBJETIVO**: Dominar React Router para SPAs WorldSkills  
**📱 ENFOQUE**: Single Page Applications profesionales

## ⏱️ CRONOGRAMA TIMEBOXED (360 minutos exactos)

| Hora           | Sección            | Tiempo | MVP Focus             |
| -------------- | ------------------ | ------ | --------------------- |
| **12:00-1:00** | 1. Router Básicos  | 60 min | 🔧 Setup + navegación |
| **1:00-2:00**  | 2. Rutas Dinámicas | 60 min | ⚡ Params + data      |
| **2:00-2:15**  | ☕ BREAK           | 15 min | Descanso obligatorio  |
| **2:15-3:15**  | 3. Auth Context    | 60 min | 🔒 Autenticación      |
| **3:15-4:15**  | 4. Layout System   | 60 min | 🏗️ Layouts anidados   |
| **4:15-4:30**  | ☕ BREAK           | 15 min | Descanso obligatorio  |
| **4:30-5:30**  | 5. Navegación Pro  | 60 min | ✨ UX avanzado        |
| **5:30-6:00**  | 6. Integración     | 30 min | 🚀 Testing final      |

## 🎯 OBJETIVOS WORLDSKILLS 2025

### ✅ Competencias Core

- **React Router v6** setup profesional
- **SPA Navigation** patterns esenciales
- **Dynamic Routes** con parámetros
- **Authentication** rutas protegidas
- **Nested Layouts** arquitectura escalable
- Parámetros dinámicos (:id)
- Query parameters (?search=)
- Navegación programática
- Rutas protegidas (auth guards)
- Layout components
- 404 handling
- Navigation menus

### ❌ QUÉ NO incluir (Aplazar para días avanzados)

- Server-side rendering
- Code splitting avanzado
- Lazy loading complejo
- Router testing detallado
- Performance optimization extrema
- SEO optimization

---

## 🚀 Estrategia de Ejecución MVP

### FASE CORE (40% del tiempo - 144 min)

✅ **Router básico funcional** → App navegable sin errores
✅ **Rutas dinámicas operativas** → Parámetros y filtros funcionando
✅ **Autenticación simple** → Login/logout básico
✅ **Layout base** → Estructura navegable
✅ **Navegación MVP** → UX mínima pero completa

### FASE ENHANCED (35% del tiempo - 126 min)

⚡ **Mejoras de navegación** → NavLink activo, 404, breadcrumbs
⚡ **Search y filtros** → Query parameters y búsqueda
⚡ **Context avanzado** → Roles, permisos, persistencia
⚡ **Layouts anidados** → Outlet, navegación jerárquica
⚡ **UX mejorada** → Loading states, feedback visual

### FASE POLISH (25% del tiempo - 90 min)

✨ **Optimizaciones** → Performance, code splitting
✨ **UX profesional** → Búsqueda global, atajos teclado
✨ **Testing completo** → Validación funcional
✨ **Documentación** → Checklist WorldSkills

---

## 📁 Estructura Completa del Día 5

```
dia-05-react-router/
├── README.md (Plan maestro)
├── 01-router-basicos/           # 60 min - Setup fundamental
│   ├── src/
│   │   ├── App.jsx             # Router básico + NavLink
│   │   ├── App.css             # Estilos responsive
│   │   └── main.jsx            # Entry point
│   ├── package.json            # Dependencies React Router
│   ├── vite.config.js          # Vite config
│   └── index.html              # HTML base
├── 02-rutas-dinamicas/          # 60 min - Params + Query
│   ├── src/
│   │   ├── App.jsx             # useParams + useSearchParams
│   │   └── App.css             # Estilos para filtros
│   └── README.md               # Instrucciones específicas
├── 03-auth-context/             # 60 min - Autenticación
│   ├── src/
│   │   ├── App.jsx             # Context + ProtectedRoute
│   │   └── App.css             # Estilos auth
│   └── README.md               # Guía auth completa
├── 04-layout-system/            # 60 min - Layouts anidados
│   ├── src/
│   │   ├── App.jsx             # Outlet + Breadcrumbs
│   │   └── App.css             # Layout system styles
│   └── README.md               # Arquitectura layouts
├── 05-navegacion-pro/           # 60 min - UX avanzado
│   ├── src/
│   │   ├── App.jsx             # Búsqueda global + UX pro
│   │   └── App.css             # Estilos profesionales
│   └── README.md               # Features avanzadas
└── 06-integracion/              # 30 min - Testing final
    ├── README.md               # Checklist validación
    └── test-scripts/           # Scripts de testing
```

## 📚 Archivos Clave Creados

### ✅ Funcionales Inmediatamente

- Router setup funcional
- Rutas básicas operativas
- Navegación entre páginas
- Parámetros básicos funcionando

### FASE ENHANCED (35% del tiempo - 126 min)

- Rutas anidadas completas
- Guards de autenticación
- Navigation components
- UX patterns avanzados

### FASE POLISH (25% del tiempo - 90 min)

- E-commerce SPA completo
- Optimizaciones finales
- Testing y validación
- Documentation completa

---

## 📚 Secciones Estratégicas

### 1. Router Setup & Básicos (60 min)

**Objetivo**: Router funcionando con navegación básica

- BrowserRouter setup
- Routes y Route components
- Link y NavLink
- Navegación básica operativa

### 2. Navegación Avanzada (75 min)

**Objetivo**: Parámetros y rutas dinámicas

- URL params (:id, :slug)
- Query parameters
- useParams y useSearchParams
- Nested routes architecture

### 3. Rutas Protegidas (75 min)

**Objetivo**: Sistema de autenticación completo

- PrivateRoute component
- Auth context setup
- Login/logout functionality
- Route guards operativos

### 4. Layouts y UX (60 min)

**Objetivo**: Navigation components profesionales

- Layout components
- Navbar responsive
- Breadcrumbs navigation
- Loading states

### 5. E-commerce SPA (90 min)

**Objetivo**: Aplicación completa estilo WorldSkills

- Multi-page e-commerce
- Product catalog con router
- Cart management
- User authentication
- Admin panel básico

---

## 🎯 Criterios de Éxito

Al final de las 6 horas, el estudiante DEBE poder:

1. ✅ **Configurar** React Router en proyecto existente
2. ✅ **Crear rutas** básicas y anidadas
3. ✅ **Manejar parámetros** dinámicos y query strings
4. ✅ **Implementar** rutas protegidas con autenticación
5. ✅ **Desarrollar** navigation components responsivos
6. ✅ **Construir** SPA multi-página completa
7. ✅ **Manejar** 404 y error boundaries

**SI NO CUMPLE**: Revisar timeboxing de secciones individuales.

---

## 📖 Tecnologías y Librerías

### Core Dependencies

```bash
npm install react-router-dom@6
npm install lucide-react  # Para iconos
```

### Herramientas de Desarrollo

- React Developer Tools
- Router DevTools (extensión)
- VS Code con ES7+ React snippets

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
src/
├── components/
│   ├── layout/          # Layout components
│   ├── navigation/      # Nav components
│   ├── auth/           # Auth components
│   └── common/         # Shared components
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Login.jsx
│   └── Dashboard.jsx
├── contexts/           # React contexts
├── hooks/             # Custom hooks
├── utils/             # Utilities
└── styles/            # CSS modules/Styled
```

---

## 🚨 PLAN DE CONTINGENCIA

**Si nos quedamos cortos de tiempo**:

### Prioridad 1 (Mínimo viable - 4 horas)

- Router setup básico
- 3-4 rutas funcionando
- Navegación entre páginas
- Un parámetro dinámico

### Prioridad 2 (Funcional - 5 horas)

- - Rutas protegidas básicas
- - Navigation component
- - 404 handling

### Prioridad 3 (Completo - 6 horas)

- - E-commerce SPA completo
- - Todas las funcionalidades avanzadas

---

## ✅ VALIDACIÓN CONTINUA

### Checkpoint cada 75 minutos

- ¿Router configurado correctamente?
- ¿Navegación funcionando sin errores?
- ¿Parámetros siendo capturados?
- ¿Código alineado con estándares WorldSkills?

### Test final (últimos 15 min)

- Crear nueva ruta desde cero
- Implementar parámetro dinámico
- Agregar protección de ruta
- Verificar responsive navigation

---

## 🏆 COMPETENCIAS WORLDSKILLS DESARROLLADAS

### Técnicas Específicas

- **Single Page Applications** (SPA) architecture
- **Client-side routing** implementation
- **Navigation patterns** profesionales
- **URL management** avanzado
- **Authentication flows** completos

### Patrones de Desarrollo

- **Component composition** para layouts
- **Context API** para estado global
- **Custom hooks** para router logic
- **Error boundaries** para manejo de errores
- **Responsive design** en navigation

---

## ✅ Competencias de Velocidad

- **Setup rápido** (< 10 min por proyecto)
- **Navegación fluida** implementación directa
- **Debugging eficiente** errores de routing
- **Code patterns** reutilizables WorldSkills

## 📁 ESTRUCTURA MVP

```
dia-05-react-router/
├── 01-router-basicos/         # 60min - Setup fundamental
├── 02-rutas-dinamicas/        # 60min - Params y data
├── 03-auth-context/           # 60min - Autenticación
├── 04-layout-system/          # 60min - Layouts anidados
├── 05-navegacion-pro/         # 60min - UX avanzado
└── 06-integracion/           # 30min - Testing y validación
```

## 🚀 METODOLOGÍA MVP ESTRICTA

### 🔧 FASE CORE (40% tiempo) - LO ESENCIAL

- ✅ Router configurado sin errores
- ✅ Navegación básica funcionando
- ✅ Componentes mínimos pero completos

### ⚡ FASE ENHANCED (35% tiempo) - UX MEJORADO

- ⚡ Estados de loading y error handling
- ⚡ Navegación intuitiva y responsive
- ⚡ Validaciones y feedback visual

### ✨ FASE POLISH (25% tiempo) - OPTIMIZACIÓN

- ✨ Lazy loading y performance
- ✨ Animaciones y microinteracciones
- ✨ Testing manual y documentación

## 🏆 PREPARACIÓN COMPETENCIA

**Para WorldSkills 2025:**

- ⚡ **Speed Development**: Patterns rápidos y reutilizables
- 🎯 **Error-free Code**: Testing continuo mientras desarrollas
- 🚀 **Professional Quality**: Código listo para producción
- 📱 **Responsive First**: Mobile-first approach obligatorio

## 🎮 DIFERENCIAS CON DÍA 6

**Día 5** se enfoca en **fundamentos sólidos**:

- Router setup básico pero correcto
- Navegación esencial para SPAs
- Patrones fundamentales reutilizables
- Base sólida para proyectos complejos

**Día 6** será **Router avanzado**:

- Navegación compleja y professional
- Optimizaciones y performance
- Proyectos integradores completos

## ▶️ INSTRUCCIONES INICIO

1. **Navegar** a `01-router-basicos/`
2. **Seguir** README de la sección
3. **Respetar** timeboxing estricto
4. **Validar** funcionalidad antes de continuar
5. **Documentar** problemas y soluciones

---

**🎯 META: Fundamentos Router sólidos en 6 horas - ¡Empezamos! 🚀**

---

## 📝 NOTAS IMPORTANTES

### Pre-requisitos

- Día 4 (React Fundamentals) completado
- Conocimiento sólido de useState y useEffect
- Familiaridad con component composition

### Resultados Esperados

- **E-commerce SPA** completamente funcional
- **Navigation system** profesional
- **Authentication flow** operativo
- **Code quality** nivel WorldSkills

### Próximos Días

- **Día 6**: State Management (Context API + Zustand)
- **Día 7**: React + TypeScript
- **Día 8**: Testing & Performance

# ⚡ React Setup Rápido | 20 minutos

## 🎯 OBJETIVO: App React funcionando en 20 minutos

**TIMEBOXING**: 20 minutos exactos  
**RESULTADO**: Aplicación React ejecutándose sin errores

---

## ⏰ Cronograma Sección 1

| Tarea                    | Tiempo | Estado |
| ------------------------ | ------ | ------ |
| **Vite Setup**           | 5 min  | ⏳     |
| **Estructura básica**    | 5 min  | ⏳     |
| **Primer componente**    | 7 min  | ⏳     |
| **Validación funcional** | 3 min  | ⏳     |

---

## 🚀 FASE CORE (12 min) - Lo Esencial

### ⚡ Paso 1: Setup con Vite (5 min)

```bash
# 1. Crear proyecto React con Vite
npm create vite@latest react-ws2025 -- --template react
cd react-ws2025

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor desarrollo
npm run dev
```

**✅ Checkpoint**: ¿Se ve "Vite + React" en el navegador?

### 🏗️ Paso 2: Estructura Básica (5 min)

```
src/
├── App.jsx          # Componente principal
├── main.jsx         # Punto de entrada
├── index.css        # Estilos globales
└── components/      # Carpeta componentes
    └── Welcome.jsx  # Primer componente
```

**Crear estructura**:

```bash
# Crear carpeta components
mkdir src/components
```

### 📝 Paso 3: Primer Componente (7 min)

**Archivo**: `src/components/Welcome.jsx`

```jsx
// 🎯 FASE CORE: Componente funcional básico
function Welcome() {
  return (
    <div className="welcome">
      <h1>🚀 React Setup Completado</h1>
      <p>WorldSkills 2025 - React Fundamentals</p>
      <div className="status">
        <span className="badge success">✅ Vite funcionando</span>
        <span className="badge success">✅ React cargado</span>
        <span className="badge success">✅ JSX renderizando</span>
      </div>
    </div>
  );
}

export default Welcome;
```

**Actualizar** `src/App.jsx`:

```jsx
import Welcome from './components/Welcome';
import './App.css';

function App() {
  return (
    <div className="App">
      <Welcome />
    </div>
  );
}

export default App;
```

---

## ⚡ FASE ENHANCED (6 min) - Mejoras Rápidas

### 🎨 Estilos Básicos

**Actualizar** `src/index.css`:

```css
/* Reset y base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

/* Welcome component */
.welcome {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.welcome h1 {
  color: #4caf50;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.welcome p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

/* Status badges */
.status {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.badge.success {
  background: #4caf50;
  color: white;
}
```

### 🔧 Props Básicos

**Mejorar** `src/components/Welcome.jsx`:

```jsx
// 🎯 FASE ENHANCED: Props y datos dinámicos
function Welcome({ studentName = 'Estudiante', timeRemaining = '120' }) {
  return (
    <div className="welcome">
      <h1>🚀 React Setup Completado</h1>
      <p>
        Hola <strong>{studentName}</strong> - WorldSkills 2025
      </p>
      <p>
        Tiempo restante: <strong>{timeRemaining} minutos</strong>
      </p>

      <div className="status">
        <span className="badge success">✅ Vite funcionando</span>
        <span className="badge success">✅ React cargado</span>
        <span className="badge success">✅ JSX renderizando</span>
        <span className="badge success">✅ Props funcionando</span>
      </div>
    </div>
  );
}

export default Welcome;
```

**Actualizar** `src/App.jsx`:

```jsx
import Welcome from './components/Welcome';
import './App.css';

function App() {
  return (
    <div className="App">
      <Welcome
        studentName="Competidor WS2025"
        timeRemaining="100"
      />
    </div>
  );
}

export default App;
```

---

## ✨ FASE POLISH (2 min) - Validación Final

### ✅ Checklist de Validación

**Verificar en navegador**:

- [ ] ✅ App carga sin errores
- [ ] ✅ Estilos aplicados correctamente
- [ ] ✅ Props dinámicos funcionando
- [ ] ✅ Sin errores en consola
- [ ] ✅ Hot reload funciona

### 🚨 Solución Rápida de Problemas

**Si hay errores**:

1. **Puerto ocupado**: Cambiar a puerto diferente
2. **Dependencias**: Ejecutar `npm install` nuevamente
3. **Import errors**: Verificar rutas de archivos
4. **JSX errors**: Revisar sintaxis de componentes

---

## 🎯 Resultado Esperado

Al completar esta sección en 20 minutos, deberías tener:

1. ✅ **Proyecto React** funcionando con Vite
2. ✅ **Estructura** organizada de carpetas
3. ✅ **Componente personalizado** renderizando
4. ✅ **Props básicos** pasando datos
5. ✅ **Estilos** aplicados y responsivos
6. ✅ **Confianza** para continuar con JSX

---

## ⏭️ Próximo Paso

**Sección 2**: Componentes JSX (25 min)

- JSX syntax avanzado
- Múltiples componentes
- Composición de componentes

---

## 🆘 Si hay Problemas de Tiempo

**Mínimo viable** (10 min):

- App React corriendo
- Un componente básico renderizando
- Sin estilos complejos

**Continuar solo si**:

- Setup completamente funcional
- Sin errores en consola
- Tiempo suficiente restante

---

**⏰ TIEMPO LÍMITE: 20 MINUTOS**  
**🎯 ¡MANTÉN EL ENFOQUE EN LO ESENCIAL!**

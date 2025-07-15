# 🎯 01. Setup Full-Stack Project

**⏰ Tiempo asignado**: 30 minutos (12:00 PM - 12:30 PM)  
**🎯 Objetivo**: Configurar proyecto React + Express funcionando coordinadamente  
**📋 Estrategia**: MVP Core → Enhanced → Polish

---

## ⏱️ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Objetivo                       | Status |
| --------------- | --------- | ------------------------------ | ------ |
| **🔧 CORE**     | 0-15 min  | Proyectos básicos ejecutándose | ⭐     |
| **⚡ ENHANCED** | 15-25 min | CORS + comunicación inicial    | 🚀     |
| **✨ POLISH**   | 25-30 min | Scripts coordinados            | 🎨     |

---

## 🔧 FASE CORE (0-15 min) - Proyectos Base

### ✅ Objetivo: Ambos proyectos ejecutándose

```bash
# 1. Crear estructura base (2 min)
mkdir fullstack-project
cd fullstack-project

# 2. Setup Frontend React (5 min)
npm create vite@latest frontend -- --template react
cd frontend
npm install
cd ..

# 3. Setup Backend Express (5 min)
mkdir backend
cd backend
npm init -y
npm install express cors
cd ..

# 4. Test inicial (3 min)
# Frontend: npm run dev (puerto 5173)
# Backend: node server.js (puerto 3001)
```

### 📁 Estructura Esperada

```
fullstack-project/
├── frontend/          # React + Vite
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── backend/           # Express.js
    ├── server.js
    └── package.json
```

---

## ⚡ FASE ENHANCED (15-25 min) - Comunicación Básica

### ✅ Objetivo: Primera comunicación exitosa

**Backend Server (backend/server.js)**:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: '¡Backend conectado!',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend ejecutándose en http://localhost:${PORT}`);
});
```

**Frontend Connection (frontend/src/App.jsx)**:

```jsx
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [backendMessage, setBackendMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test comunicación con backend
    fetch('http://localhost:3001/api/test')
      .then(response => response.json())
      .then(data => {
        setBackendMessage(data.message);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setBackendMessage('Error conectando con backend');
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 Full-Stack Setup</h1>
        <div className="connection-test">
          <h2>Test de Conexión:</h2>
          {loading ? (
            <p>Conectando...</p>
          ) : (
            <p
              className={
                backendMessage.includes('Error') ? 'error' : 'success'
              }>
              {backendMessage}
            </p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
```

---

## ✨ FASE POLISH (25-30 min) - Scripts Coordinados

### ✅ Objetivo: Desarrollo eficiente

**Package.json Scripts Coordinados**:

```json
// backend/package.json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}

// frontend/package.json - ya incluye scripts Vite
```

**Instalación nodemon**:

```bash
cd backend
npm install -D nodemon
```

**Scripts de desarrollo simultaneo** (opcional):

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

---

## 🎯 VALIDACIÓN CORE

### ✅ Checklist Obligatorio (CORE MVP)

- [ ] ✅ Frontend React ejecutándose en puerto 5173
- [ ] ✅ Backend Express ejecutándose en puerto 3001
- [ ] ✅ CORS configurado correctamente
- [ ] ✅ Endpoint `/api/test` respondiendo JSON
- [ ] ✅ Frontend conectando al backend exitosamente
- [ ] ✅ Mensaje de éxito mostrandose en React

### ⚡ Checklist Enhanced (ENHANCED MVP)

- [ ] ⚡ Scripts `dev` funcionando con nodemon
- [ ] ⚡ Error handling básico implementado
- [ ] ⚡ Console logs claros en ambos lados
- [ ] ⚡ CSS básico para feedback visual

### ✨ Checklist Polish (POLISH MVP)

- [ ] ✨ Scripts coordinados eficientemente
- [ ] ✨ Code organizado y limpio
- [ ] ✨ Ready para desarrollo rápido

---

## 🚨 TROUBLESHOOTING COMÚN

### ❌ Problemas Frecuentes

1. **CORS Error**: Verificar `app.use(cors())` en backend
2. **Port Conflict**: Cambiar puertos si hay conflictos
3. **Fetch Error**: Verificar URL exacta del backend
4. **JSON Parse**: Verificar `express.json()` middleware

### ✅ Soluciones Rápidas

```bash
# Verificar puertos en uso
lsof -i :3001
lsof -i :5173

# Reset si hay problemas
cd frontend && rm -rf node_modules && npm install
cd backend && rm -rf node_modules && npm install
```

---

## ⏭️ SIGUIENTE PASO

Una vez completado este setup:

- **✅ Comunicación básica establecida**
- **🎯 Listos para implementar API endpoints**
- **🚀 Base sólida para CRUD operations**

**Tiempo objetivo**: ✅ **Completado en 30 minutos**  
**Próximo**: `02-react-express-comm` - Comunicación avanzada

---

## 📋 RESUMEN EJECUTIVO

### 🎯 ¿Qué Logramos?

- Proyecto Full-Stack funcional
- Comunicación React ↔ Express establecida
- Base para desarrollo rápido
- Scripts de desarrollo eficientes

### ⏰ Time Investment

- **Setup**: 15 min
- **Comunicación**: 10 min
- **Scripts**: 5 min
- **Total**: 30 min ✅

**🏆 MVP completado - Ready for WorldSkills competition!**

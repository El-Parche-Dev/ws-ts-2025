# 🚀 Proyecto API Consumer | WorldSkills 2025

## 🎯 Sección 5: Proyecto API Consumer - Implementación MVP

### ⏱️ Timeboxing: 75 minutos

- **FASE CORE** ✅ (30 min): App funcional con lista de posts
- **FASE ENHANCED** ⚡ (30 min): Filtros, búsqueda y UI mejorada
- **FASE POLISH** ✨ (15 min): Loading states y error handling

---

## 📋 Descripción del Proyecto

Crear una aplicación web que consuma la API de JSONPlaceholder para mostrar posts, usuarios y comentarios con interfaz moderna y funcionalidad completa.

### 🎯 Objetivos de Aprendizaje

1. **Integración de APIs RESTful** con fetch()
2. **Estado de aplicación** con manejo de datos dinámicos
3. **Interfaz de usuario interactiva** con filtros y búsqueda
4. **Error handling** y loading states profesionales

---

## 🏗️ Estructura MVP

### ✅ FASE CORE (30 minutos)

**Funcionalidad mínima indispensable:**

- [x] Consumir API de posts de JSONPlaceholder
- [x] Mostrar lista de posts con título y cuerpo
- [x] Interfaz básica funcional y responsive
- [x] Manejo básico de errores

```javascript
// Funcionalidad CORE esencial
const fetchPosts = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  return response.json();
};
```

### ⚡ FASE ENHANCED (30 minutos)

**Mejoras y funcionalidades adicionales:**

- [x] Filtro por usuario
- [x] Búsqueda por título
- [x] Mostrar detalles de usuario
- [x] Navegación entre posts
- [x] UI mejorada con animaciones

### ✨ FASE POLISH (15 minutos)

**Refinamientos y optimización:**

- [x] Loading states elegantes
- [x] Error handling robusto
- [x] Optimización de performance
- [x] Microinteracciones

---

## 🛠️ Tecnologías Utilizadas

- **HTML5** semántico
- **CSS3** con Grid y Flexbox
- **JavaScript ES6+** (async/await, modules)
- **Fetch API** para consumo de datos
- **JSONPlaceholder API** como backend

---

## 📁 Archivos del Proyecto

```
05-proyecto-api-consumer/
├── README.md           # Esta documentación
├── index.html          # Estructura principal
├── styles.css          # Estilos modernos
├── app.js              # Lógica principal de la aplicación
├── api.js              # Módulo para llamadas a la API
└── utils.js            # Utilidades y helpers
```

---

## 🚀 Instrucciones de Ejecución

1. **Abrir `index.html`** en el navegador
2. **Verificar conexión** a internet (se consume API externa)
3. **Interactuar** con filtros y búsqueda
4. **Probar** diferentes escenarios de error

---

## ✅ Checklist de Validación

### 📝 Funcionalidad Core

- [ ] La aplicación carga y muestra posts
- [ ] Los datos se obtienen de la API correctamente
- [ ] La interfaz es responsive y funcional
- [ ] Los errores básicos se manejan adecuadamente

### 📝 Funcionalidad Enhanced

- [ ] El filtro por usuario funciona correctamente
- [ ] La búsqueda por título filtra en tiempo real
- [ ] Se muestran detalles adicionales del usuario
- [ ] La navegación entre posts es fluida

### 📝 Funcionalidad Polish

- [ ] Los loading states se muestran apropiadamente
- [ ] El error handling es robusto y user-friendly
- [ ] Las animaciones mejoran la experiencia
- [ ] La aplicación maneja edge cases correctamente

---

## 🎯 Criterios de Evaluación

### ⭐ Básico (60-70 puntos)

- App funcional que consume API
- Interfaz básica responsive
- Manejo básico de errores

### ⭐⭐ Intermedio (71-85 puntos)

- Filtros y búsqueda implementados
- UI mejorada con buena UX
- Error handling más robusto

### ⭐⭐⭐ Avanzado (86-100 puntos)

- Loading states elegantes
- Optimización de performance
- Código limpio y mantenible
- Manejo completo de edge cases

---

## 🔗 APIs Utilizadas

### JSONPlaceholder Endpoints

```
GET https://jsonplaceholder.typicode.com/posts
GET https://jsonplaceholder.typicode.com/users
GET https://jsonplaceholder.typicode.com/posts/{id}/comments
```

### Estructura de Datos

```javascript
// Post
{
  userId: 1,
  id: 1,
  title: "sunt aut facere repellat provident...",
  body: "quia et suscipit suscipit recusandae..."
}

// User
{
  id: 1,
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz"
}
```

---

## 💡 Tips para WorldSkills

1. **Velocidad de desarrollo**: Usar la metodología MVP
2. **Código limpio**: Comentarios claros y estructura modular
3. **User Experience**: Feedback visual en todas las interacciones
4. **Error handling**: Siempre anticipar y manejar errores
5. **Performance**: Optimizar llamadas a API y renderizado

---

## 🔍 Debugging y Testing

### Verificaciones Rápidas

```javascript
// Verificar conexión a API
console.log('Testing API connection...');
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(data => console.log('API working:', data));

// Verificar estado de la aplicación
console.log('App state:', {
  posts: posts.length,
  currentUser: currentUser,
  searchTerm: searchTerm,
});
```

### Common Issues

- **CORS**: JSONPlaceholder permite CORS
- **Rate limiting**: No aplica para JSONPlaceholder
- **Network errors**: Manejar con try-catch y user feedback

---

## 📚 Recursos Adicionales

- [JSONPlaceholder Guide](https://jsonplaceholder.typicode.com/guide/)
- [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Async/Await Best Practices](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)

---

**🏆 ¡Objetivo**: Crear una aplicación funcional, bien diseñada y optimizada que demuestre dominio completo de JavaScript ES6+ y APIs modernas!\*\*

# 🌐 Async/Await + Fetch API - Implementación MVP

**⏰ Duración:** 60 minutos  
**🎯 Objetivo:** Dominar asincronía moderna para consumir APIs

## 📚 Metodología MVP

### **FASE CORE ✅ (20 minutos) - Async/Await Básico**

**Funcionalidad esencial:** Promesas y async/await funcionando

#### **🔧 Async/Await Fundamentals**

```javascript
// ========== FASE CORE ✅ ==========
// Funcionalidad: Async/await básico

// Función async básica
async function obtenerDatos() {
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { mensaje: 'Datos obtenidos exitosamente', timestamp: new Date() };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Uso básico
async function ejemplo1() {
  console.log('Iniciando...');
  const resultado = await obtenerDatos();
  console.log('Resultado:', resultado);
}

// Múltiples await
async function ejemplo2() {
  const datos1 = await obtenerDatos();
  const datos2 = await obtenerDatos();
  const datos3 = await obtenerDatos();

  return [datos1, datos2, datos3];
}

// Promise.all para paralelismo
async function ejemplo3() {
  const promesas = [obtenerDatos(), obtenerDatos(), obtenerDatos()];

  const resultados = await Promise.all(promesas);
  return resultados;
}
```

### **FASE ENHANCED ⚡ (25 minutos) - Fetch API + Error Handling**

**Mejoras:** Fetch API real, manejo robusto de errores

#### **⚡ Fetch API con Error Handling**

```javascript
// ========== FASE ENHANCED ⚡ ==========
// Mejoras: Fetch API real con manejo de errores

// Fetch básico con error handling
async function fetchConErrorHandling(url) {
  try {
    console.log(`🌐 Fetching: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Datos recibidos:', data);
    return data;
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('❌ Error de red:', error.message);
    } else {
      console.error('❌ Error HTTP:', error.message);
    }
    throw error;
  }
}

// Funciones específicas para diferentes APIs
async function obtenerUsuarios() {
  return await fetchConErrorHandling(
    'https://jsonplaceholder.typicode.com/users'
  );
}

async function obtenerPosts() {
  return await fetchConErrorHandling(
    'https://jsonplaceholder.typicode.com/posts'
  );
}

async function obtenerPokemon(nombre) {
  return await fetchConErrorHandling(
    `https://pokeapi.co/api/v2/pokemon/${nombre}`
  );
}

// Fetch con opciones (POST, headers, etc.)
async function crearPost(datos) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creando post:', error);
    throw error;
  }
}
```

### **FASE POLISH ✨ (15 minutos) - Loading States y UX**

**Optimizaciones:** Loading, cache, timeout, retry logic

#### **✨ UX Completa con Loading States**

```javascript
// ========== FASE POLISH ✨ ==========
// Optimizaciones: Loading states, cache, timeout

class ApiManager {
  constructor() {
    this.cache = new Map();
    this.loadingStates = new Map();
  }

  // Fetch con cache y loading states
  async fetchWithCache(url, options = {}) {
    const cacheKey = `${url}-${JSON.stringify(options)}`;

    // Verificar cache
    if (this.cache.has(cacheKey)) {
      console.log('📦 Datos desde cache');
      return this.cache.get(cacheKey);
    }

    // Verificar si ya está cargando
    if (this.loadingStates.has(cacheKey)) {
      console.log('⏳ Esperando request existente');
      return await this.loadingStates.get(cacheKey);
    }

    // Crear promesa de loading
    const loadingPromise = this.fetchWithTimeout(url, options);
    this.loadingStates.set(cacheKey, loadingPromise);

    try {
      const result = await loadingPromise;
      this.cache.set(cacheKey, result);
      this.loadingStates.delete(cacheKey);
      return result;
    } catch (error) {
      this.loadingStates.delete(cacheKey);
      throw error;
    }
  }

  // Fetch con timeout
  async fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Retry logic
  async fetchWithRetry(url, options = {}, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Intento ${attempt}/${maxRetries}`);
        return await this.fetchWithTimeout(url, options);
      } catch (error) {
        if (attempt === maxRetries) {
          throw new Error(
            `Failed after ${maxRetries} attempts: ${error.message}`
          );
        }

        // Delay exponencial
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`⏸️ Esperando ${delay}ms antes del siguiente intento...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

// UI Loading helpers
function mostrarLoading(elemento) {
  elemento.innerHTML = '<div class="spinner">🔄 Cargando...</div>';
}

function ocultarLoading(elemento) {
  const spinner = elemento.querySelector('.spinner');
  if (spinner) spinner.remove();
}

function mostrarError(elemento, mensaje) {
  elemento.innerHTML = `<div class="error">❌ Error: ${mensaje}</div>`;
}
```

## 🎯 Ejercicios Prácticos

### **Ejercicio 1: API Explorer (20 min)**

```javascript
// Crear un explorador de APIs con las siguientes funciones:

// 1. Obtener lista de usuarios y mostrar en tabla
async function cargarUsuarios() {
  // TODO: Implementar con error handling
}

// 2. Buscar posts por usuario ID
async function buscarPostsPorUsuario(userId) {
  // TODO: Implementar filtro
}

// 3. Crear nuevo post
async function crearNuevoPost(titulo, contenido, userId) {
  // TODO: Implementar POST request
}

// 4. Obtener datos de Pokémon
async function obtenerDatosPokemon(nombre) {
  // TODO: Implementar con PokeAPI
}

// Tu código aquí:
```

### **Ejercicio 2: Weather Dashboard (15 min)**

```javascript
// Crear dashboard del clima usando OpenWeatherMap API
// (Usar API key: demo o crear cuenta gratuita)

const API_KEY = 'demo'; // Reemplazar con key real
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

async function obtenerClima(ciudad) {
  // TODO: Implementar con error handling y loading
}

async function obtenerPronostico(ciudad) {
  // TODO: Obtener pronóstico de 5 días
}

function actualizarUI(datos) {
  // TODO: Actualizar interfaz con datos del clima
}

// Tu código aquí:
```

## 📝 Checklist de Validación

### **CORE (✅ Obligatorio)**

- [ ] async/await syntax correcto
- [ ] Promesas se resuelven apropiadamente
- [ ] Error handling básico implementado
- [ ] Fetch API hace requests exitosos

### **ENHANCED (⚡ Importante)**

- [ ] Error handling robusto con diferentes tipos
- [ ] Headers y métodos HTTP correctos
- [ ] JSON parsing sin errores
- [ ] Múltiples APIs consumidas exitosamente

### **POLISH (✨ Opcional)**

- [ ] Loading states implementados
- [ ] Cache básico funcionando
- [ ] Timeout handling
- [ ] Retry logic para requests fallidos

## ⏱️ Timeboxing Estricto

- **00:00-20:00**: CORE - async/await básico + promesas
- **20:00-45:00**: ENHANCED - Fetch API + error handling
- **45:00-60:00**: POLISH - UX completa con loading

**¡Si no terminas en tiempo, documenta problemas y avanza!**

## 🎖️ APIs Recomendadas para Práctica

### **APIs Públicas (No requieren key)**

- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - Posts, users, comments
- [PokeAPI](https://pokeapi.co/) - Pokémon data
- [Cat Facts](https://catfact.ninja/) - Datos de gatos
- [REST Countries](https://restcountries.com/) - Información de países

### **APIs con Key Gratuita**

- [OpenWeatherMap](https://openweathermap.org/api) - Clima
- [News API](https://newsapi.org/) - Noticias
- [The Movie DB](https://www.themoviedb.org/documentation/api) - Películas

## 🚨 Errores Comunes a Evitar

1. **No usar try/catch** con async/await
2. **No verificar response.ok** antes de parsear JSON
3. **No manejar errores de red** vs errores HTTP
4. **Olvidar await** en funciones async
5. **No mostrar loading states** al usuario
6. **Hardcodear URLs** en lugar de usar constantes
7. **No validar datos** antes de usar

## 💡 Tips para WorldSkills

- Siempre maneja errores de red y HTTP por separado
- Usa loading states para mejor UX
- Implementa timeout para requests lentos
- Usa Promise.all para requests paralelos
- Cachea datos cuando sea apropiado
- Valida datos antes de procesarlos

// 🌐 Async/Await + Fetch API - WorldSkills 2025
// Metodología MVP: Core (20min) → Enhanced (25min) → Polish (15min)

// ========== TIMER SETUP ==========
let tiempoRestante = 60 * 60; // 60 minutos en segundos

function actualizarTimer() {
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  document.getElementById('timer').textContent = `⏱️ ${minutos
    .toString()
    .padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

  if (tiempoRestante > 0) {
    tiempoRestante--;
    setTimeout(actualizarTimer, 1000);
  } else {
    document.getElementById('timer').textContent = '⏰ ¡TIEMPO AGOTADO!';
    document.getElementById('timer').style.background =
      'rgba(231, 76, 60, 0.9)';
  }
}

// Iniciar timer
actualizarTimer();

// ========== UTILIDADES GENERALES ==========

function mostrarLoading(elementId) {
  const element = document.getElementById(elementId);
  element.innerHTML =
    '<div class="loading"><div class="spinner"></div>Cargando...</div>';
}

function mostrarError(elementId, mensaje) {
  const element = document.getElementById(elementId);
  element.innerHTML = `<div class="error">❌ Error: ${mensaje}</div>`;
}

function mostrarExito(elementId, mensaje) {
  const element = document.getElementById(elementId);
  element.innerHTML = `<div class="success">✅ ${mensaje}</div>`;
}

function log(elementId, mensaje) {
  const element = document.getElementById(elementId);
  if (element.textContent) {
    element.textContent += '\n' + mensaje;
  } else {
    element.textContent = mensaje;
  }
  element.scrollTop = element.scrollHeight;
}

// ========== FASE CORE ✅ (20 minutos) - Async/Await Básico ==========
console.log('🔧 FASE CORE - Promesas y Async/Await');

// Función para simular operación asíncrona
function simularOperacionAsincrona(nombre, tiempo) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`✅ ${nombre} completada en ${tiempo}ms`);
    }, tiempo);
  });
}

// Demo 1: Promesas básicas
async function demoPromesasBasicas() {
  const output = document.getElementById('promesas-output');
  output.textContent = '';

  log('promesas-output', '🚀 Iniciando demo de promesas...');

  try {
    // Promesa simple
    log('promesas-output', '1. Promesa simple:');
    const resultado1 = await simularOperacionAsincrona('Operación 1', 1000);
    log('promesas-output', resultado1);

    // Promesas encadenadas
    log('promesas-output', '\n2. Promesas encadenadas:');
    const resultado2 = await simularOperacionAsincrona('Operación 2', 800);
    log('promesas-output', resultado2);
    const resultado3 = await simularOperacionAsincrona('Operación 3', 600);
    log('promesas-output', resultado3);

    // Promise.resolve y Promise.reject
    log('promesas-output', '\n3. Promise resolve/reject:');
    const rapida = await Promise.resolve('⚡ Promesa inmediata');
    log('promesas-output', rapida);

    try {
      await Promise.reject(new Error('Error simulado'));
    } catch (error) {
      log('promesas-output', `❌ Error capturado: ${error.message}`);
    }
  } catch (error) {
    log('promesas-output', `❌ Error: ${error.message}`);
  }
}

// Demo 2: Async/Await patterns
async function demoAsyncAwait() {
  const output = document.getElementById('async-output');
  output.textContent = '';

  log('async-output', '🔄 Demo Async/Await patterns...');

  // Función async básica
  async function operacionBasica() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      mensaje: 'Operación exitosa',
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  // Múltiples await secuenciales
  async function operacionesSecuenciales() {
    log('async-output', '\n📋 Operaciones secuenciales:');
    const inicio = Date.now();

    const op1 = await operacionBasica();
    log('async-output', `Operación 1: ${op1.mensaje} - ${op1.timestamp}`);

    const op2 = await operacionBasica();
    log('async-output', `Operación 2: ${op2.mensaje} - ${op2.timestamp}`);

    const op3 = await operacionBasica();
    log('async-output', `Operación 3: ${op3.mensaje} - ${op3.timestamp}`);

    const fin = Date.now();
    log('async-output', `⏱️ Tiempo total: ${fin - inicio}ms`);

    return { op1, op2, op3, tiempo: fin - inicio };
  }

  // Error handling con async/await
  async function manejoErrores() {
    log('async-output', '\n⚠️ Manejo de errores:');

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Error simulado')), 300);
      });
    } catch (error) {
      log('async-output', `❌ Error capturado: ${error.message}`);
    }

    try {
      const resultado = await operacionBasica();
      log('async-output', `✅ Recuperación exitosa: ${resultado.mensaje}`);
    } catch (error) {
      log('async-output', `❌ Error en recuperación: ${error.message}`);
    }
  }

  // Ejecutar demos
  await operacionesSecuenciales();
  await manejoErrores();
}

// Demo 3: Paralelismo vs Secuencial
async function demoParalelismo() {
  const output = document.getElementById('paralelismo-output');
  output.textContent = '';

  log('paralelismo-output', '🏃‍♂️ Comparando: Secuencial vs Paralelo');

  // Secuencial
  log('paralelismo-output', '\n📋 Ejecución SECUENCIAL:');
  const inicioSeq = Date.now();

  await simularOperacionAsincrona('Tarea 1', 800);
  await simularOperacionAsincrona('Tarea 2', 600);
  await simularOperacionAsincrona('Tarea 3', 700);

  const finSeq = Date.now();
  log('paralelismo-output', `⏱️ Tiempo secuencial: ${finSeq - inicioSeq}ms`);

  // Paralelo con Promise.all
  log('paralelismo-output', '\n🚀 Ejecución PARALELA:');
  const inicioParalelo = Date.now();

  const promesas = [
    simularOperacionAsincrona('Tarea 1', 800),
    simularOperacionAsincrona('Tarea 2', 600),
    simularOperacionAsincrona('Tarea 3', 700),
  ];

  const resultados = await Promise.all(promesas);
  const finParalelo = Date.now();

  resultados.forEach(resultado => log('paralelismo-output', resultado));
  log(
    'paralelismo-output',
    `⏱️ Tiempo paralelo: ${finParalelo - inicioParalelo}ms`
  );

  // Comparación
  const mejora =
    ((finSeq - inicioSeq) / (finParalelo - inicioParalelo)) * 100 - 100;
  log(
    'paralelismo-output',
    `\n📊 Mejora de rendimiento: ${mejora.toFixed(1)}%`
  );

  // Promise.allSettled para manejar errores parciales
  log('paralelismo-output', '\n🛡️ Promise.allSettled:');
  const promesasConError = [
    simularOperacionAsincrona('Éxito 1', 300),
    Promise.reject(new Error('Error simulado')),
    simularOperacionAsincrona('Éxito 2', 200),
  ];

  const resultadosMixtos = await Promise.allSettled(promesasConError);
  resultadosMixtos.forEach((resultado, index) => {
    if (resultado.status === 'fulfilled') {
      log('paralelismo-output', `✅ Promesa ${index + 1}: ${resultado.value}`);
    } else {
      log(
        'paralelismo-output',
        `❌ Promesa ${index + 1}: ${resultado.reason.message}`
      );
    }
  });
}

// ========== FASE ENHANCED ⚡ (25 minutos) - Fetch API + Error Handling ==========
console.log('⚡ FASE ENHANCED - Fetch API Real');

// Clase para manejar requests con error handling
class ApiClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = this.baseURL + endpoint;

    try {
      console.log(`🌐 Fetch: ${url}`);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error('❌ Error en request:', error);

      if (error.name === 'TypeError') {
        throw new Error('Error de conexión - Verifica tu internet');
      } else if (error.message.includes('HTTP')) {
        throw new Error(`Error del servidor: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Instancias de clientes API
const jsonPlaceholderAPI = new ApiClient(
  'https://jsonplaceholder.typicode.com'
);
const pokeAPI = new ApiClient('https://pokeapi.co/api/v2');

// Cargar usuarios
async function cargarUsuarios() {
  const container = document.getElementById('usuarios-container');
  mostrarLoading('usuarios-container');

  try {
    const usuarios = await jsonPlaceholderAPI.get('/users');

    const tabla = `
            <table class="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Ciudad</th>
                        <th>Empresa</th>
                    </tr>
                </thead>
                <tbody>
                    ${usuarios
                      .map(
                        user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.address.city}</td>
                            <td>${user.company.name}</td>
                        </tr>
                    `
                      )
                      .join('')}
                </tbody>
            </table>
        `;

    container.innerHTML = tabla;
  } catch (error) {
    mostrarError('usuarios-container', error.message);
  }
}

// Cargar posts por usuario
async function cargarPostsUsuario() {
  const userId = document.getElementById('user-id').value;
  const container = document.getElementById('posts-container');

  if (!userId) {
    mostrarError('posts-container', 'Por favor ingresa un ID de usuario');
    return;
  }

  mostrarLoading('posts-container');

  try {
    const posts = await jsonPlaceholderAPI.get(`/posts?userId=${userId}`);

    if (posts.length === 0) {
      container.innerHTML = '<p>No se encontraron posts para este usuario.</p>';
      return;
    }

    const postsHTML = `
            <h4>📝 Posts del Usuario ${userId} (${posts.length} posts)</h4>
            ${posts
              .slice(0, 5)
              .map(
                post => `
                <div class="demo-card" style="margin: 10px 0; padding: 15px;">
                    <h5>${post.title}</h5>
                    <p>${post.body.substring(0, 100)}...</p>
                    <small>Post ID: ${post.id}</small>
                </div>
            `
              )
              .join('')}
            ${
              posts.length > 5
                ? `<p><strong>... y ${posts.length - 5} posts más</strong></p>`
                : ''
            }
        `;

    container.innerHTML = postsHTML;
  } catch (error) {
    mostrarError('posts-container', error.message);
  }
}

// Crear nuevo post
async function crearPost() {
  const titulo = document.getElementById('post-titulo').value;
  const contenido = document.getElementById('post-contenido').value;
  const container = document.getElementById('crear-post-resultado');

  if (!titulo || !contenido) {
    mostrarError(
      'crear-post-resultado',
      'Por favor completa título y contenido'
    );
    return;
  }

  mostrarLoading('crear-post-resultado');

  try {
    const nuevoPost = {
      title: titulo,
      body: contenido,
      userId: 1,
    };

    const resultado = await jsonPlaceholderAPI.post('/posts', nuevoPost);

    const exitoHTML = `
            <div class="success">
                <h4>✅ Post creado exitosamente!</h4>
                <p><strong>ID:</strong> ${resultado.id}</p>
                <p><strong>Título:</strong> ${resultado.title}</p>
                <p><strong>Contenido:</strong> ${resultado.body}</p>
                <small>Nota: Este es un post de prueba (JSONPlaceholder)</small>
            </div>
        `;

    container.innerHTML = exitoHTML;

    // Limpiar formulario
    document.getElementById('post-titulo').value = '';
    document.getElementById('post-contenido').value = '';
  } catch (error) {
    mostrarError('crear-post-resultado', error.message);
  }
}

// Buscar Pokémon
async function buscarPokemon() {
  const nombre = document
    .getElementById('pokemon-nombre')
    .value.toLowerCase()
    .trim();
  const container = document.getElementById('pokemon-container');

  if (!nombre) {
    mostrarError(
      'pokemon-container',
      'Por favor ingresa el nombre de un Pokémon'
    );
    return;
  }

  mostrarLoading('pokemon-container');

  try {
    const pokemon = await pokeAPI.get(`/pokemon/${nombre}`);

    const pokemonHTML = `
            <div class="pokemon-card">
                <h3>${
                  pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
                }</h3>
                <img src="${pokemon.sprites.front_default}" alt="${
      pokemon.name
    }" class="pokemon-image">
                <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                <p><strong>Tipos:</strong> ${pokemon.types
                  .map(type => type.type.name)
                  .join(', ')}</p>
                
                <h4>📊 Estadísticas Base:</h4>
                <div class="stats-grid">
                    ${pokemon.stats
                      .map(
                        stat => `
                        <div class="stat-item">
                            <strong>${stat.stat.name}</strong><br>
                            ${stat.base_stat}
                        </div>
                    `
                      )
                      .join('')}
                </div>
                
                <h4>⚡ Habilidades:</h4>
                <p>${pokemon.abilities
                  .map(ability => ability.ability.name)
                  .join(', ')}</p>
            </div>
        `;

    container.innerHTML = pokemonHTML;
  } catch (error) {
    if (error.message.includes('404')) {
      mostrarError(
        'pokemon-container',
        `Pokémon "${nombre}" no encontrado. Intenta con: pikachu, charizard, blastoise, etc.`
      );
    } else {
      mostrarError('pokemon-container', error.message);
    }
  }
}

// ========== FASE POLISH ✨ (15 minutos) - UX Completa ==========
console.log('✨ FASE POLISH - Request Manager Avanzado');

// Request Manager con cache, timeout y retry
class AdvancedRequestManager {
  constructor() {
    this.cache = new Map();
    this.activeRequests = new Map();
  }

  // Fetch con cache
  async fetchWithCache(url, options = {}, cacheTime = 300000) {
    // 5 min por defecto
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    const now = Date.now();

    // Verificar cache
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      if (now - timestamp < cacheTime) {
        console.log('📦 Datos desde cache');
        return data;
      } else {
        this.cache.delete(cacheKey);
      }
    }

    // Verificar request activo
    if (this.activeRequests.has(cacheKey)) {
      console.log('⏳ Esperando request activo');
      return await this.activeRequests.get(cacheKey);
    }

    // Nuevo request
    const requestPromise = this.fetchWithTimeout(url, options);
    this.activeRequests.set(cacheKey, requestPromise);

    try {
      const data = await requestPromise;
      this.cache.set(cacheKey, { data, timestamp: now });
      this.activeRequests.delete(cacheKey);
      return data;
    } catch (error) {
      this.activeRequests.delete(cacheKey);
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

  // Fetch con retry logic
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

        const delay = Math.pow(2, attempt) * 1000; // Delay exponencial
        console.log(`⏸️ Esperando ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

const requestManager = new AdvancedRequestManager();

// Demo cache
async function demoCache() {
  const output = document.getElementById('cache-output');
  output.textContent = '';

  log('cache-output', '💾 Demo Cache System:');

  // Primera request
  log('cache-output', '\n1. Primera request (sin cache):');
  const inicio1 = Date.now();
  await requestManager.fetchWithCache(
    'https://jsonplaceholder.typicode.com/posts/1'
  );
  const fin1 = Date.now();
  log('cache-output', `⏱️ Tiempo: ${fin1 - inicio1}ms`);

  // Segunda request (desde cache)
  log('cache-output', '\n2. Segunda request (desde cache):');
  const inicio2 = Date.now();
  await requestManager.fetchWithCache(
    'https://jsonplaceholder.typicode.com/posts/1'
  );
  const fin2 = Date.now();
  log('cache-output', `⏱️ Tiempo: ${fin2 - inicio2}ms`);

  log(
    'cache-output',
    `\n📊 Mejora: ${((fin1 - inicio1) / (fin2 - inicio2)).toFixed(
      1
    )}x más rápido`
  );
}

// Demo timeout
async function demoTimeout() {
  const output = document.getElementById('timeout-output');
  output.textContent = '';

  log('timeout-output', '⏱️ Demo Timeout (simulando URL lenta):');

  try {
    // Intentar request a URL inexistente con timeout corto
    await requestManager.fetchWithTimeout(
      'https://httpstat.us/200?sleep=10000',
      {},
      2000
    );
  } catch (error) {
    log('timeout-output', `❌ ${error.message}`);
  }
}

// Demo retry
async function demoRetry() {
  const output = document.getElementById('timeout-output');

  log('timeout-output', '\n🔄 Demo Retry Logic:');

  try {
    // Simular requests que fallan y luego funciona
    await requestManager.fetchWithRetry('https://httpstat.us/500', {}, 3);
  } catch (error) {
    log('timeout-output', `❌ ${error.message}`);
  }
}

// Demo completo del Request Manager
async function demoRequestManager() {
  const output = document.getElementById('manager-output');
  output.textContent = '';

  log('manager-output', '🚀 Demo Request Manager Completo:');
  log('manager-output', '\n📦 Cache, ⏱️ Timeout, 🔄 Retry combinados');

  try {
    // Test 1: Request normal con cache
    log('manager-output', '\n1. Request con cache:');
    const posts = await requestManager.fetchWithCache(
      'https://jsonplaceholder.typicode.com/posts'
    );
    log('manager-output', `✅ Obtenidos ${posts.length} posts`);

    // Test 2: Mismo request (desde cache)
    log('manager-output', '\n2. Mismo request (cache):');
    const postsCached = await requestManager.fetchWithCache(
      'https://jsonplaceholder.typicode.com/posts'
    );
    log('manager-output', `✅ Obtenidos ${postsCached.length} posts (cache)`);

    // Test 3: Request con retry
    log('manager-output', '\n3. Request exitoso después de retry:');
    const users = await requestManager.fetchWithCache(
      'https://jsonplaceholder.typicode.com/users'
    );
    log('manager-output', `✅ Obtenidos ${users.length} usuarios`);
  } catch (error) {
    log('manager-output', `❌ Error: ${error.message}`);
  }
}

// Dashboard final multi-API
async function iniciarDashboard() {
  const container = document.getElementById('dashboard-final');
  container.innerHTML =
    '<div class="loading"><div class="spinner"></div>Cargando dashboard completo...</div>';

  try {
    // Requests paralelos a múltiples APIs
    const [usuarios, posts, pokemon] = await Promise.all([
      requestManager.fetchWithCache(
        'https://jsonplaceholder.typicode.com/users'
      ),
      requestManager.fetchWithCache(
        'https://jsonplaceholder.typicode.com/posts'
      ),
      requestManager.fetchWithCache('https://pokeapi.co/api/v2/pokemon/ditto'),
    ]);

    const dashboardHTML = `
            <h3>🏆 Multi-API Dashboard</h3>
            <div class="demo-grid">
                <div class="demo-card">
                    <h4>👥 Usuarios JSONPlaceholder</h4>
                    <p><strong>${
                      usuarios.length
                    }</strong> usuarios registrados</p>
                    <p>Ciudades: ${
                      [...new Set(usuarios.map(u => u.address.city))].length
                    }</p>
                </div>
                
                <div class="demo-card">
                    <h4>📝 Posts Disponibles</h4>
                    <p><strong>${posts.length}</strong> posts totales</p>
                    <p>Usuarios activos: ${
                      [...new Set(posts.map(p => p.userId))].length
                    }</p>
                </div>
                
                <div class="demo-card">
                    <h4>🎮 Pokémon del Día</h4>
                    <p><strong>${pokemon.name}</strong></p>
                    <img src="${pokemon.sprites.front_default}" alt="${
      pokemon.name
    }" style="width: 80px;">
                </div>
            </div>
            
            <div class="success">
                ✅ Dashboard cargado exitosamente con datos de 3 APIs diferentes
            </div>
        `;

    container.innerHTML = dashboardHTML;
  } catch (error) {
    container.innerHTML = `<div class="error">❌ Error cargando dashboard: ${error.message}</div>`;
  }
}

console.log('🌐 Async/Await + Fetch API cargado correctamente');
console.log('⏱️ Timer iniciado: 60 minutos para dominar asincronía');
console.log('🎯 Meta: Completar todas las fases y el dashboard final');

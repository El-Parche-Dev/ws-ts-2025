// 🌐 API Module - WorldSkills 2025
// Módulo para manejo de llamadas a la API

class ApiService {
  constructor() {
    this.baseURL = 'https://jsonplaceholder.typicode.com';
    this.cache = new Map();
    this.isOnline = navigator.onLine;
    this.setupNetworkListeners();
  }

  // ✅ FASE CORE (10 min) - Funcionalidad básica de API
  async get(endpoint, useCache = true) {
    try {
      // Verificar cache primero
      if (useCache && this.cache.has(endpoint)) {
        console.log(`📦 Cache hit para: ${endpoint}`);
        return this.cache.get(endpoint);
      }

      // Verificar conectividad
      if (!this.isOnline) {
        throw new Error('Sin conexión a internet');
      }

      console.log(`🌐 Fetching: ${this.baseURL}${endpoint}`);

      const response = await fetch(`${this.baseURL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Guardar en cache
      if (useCache) {
        this.cache.set(endpoint, data);
      }

      return data;
    } catch (error) {
      console.error(`❌ Error en API ${endpoint}:`, error);
      throw new Error(`Error al obtener datos: ${error.message}`);
    }
  }

  // ⚡ FASE ENHANCED (15 min) - Métodos específicos con mejor UX
  async getAllPosts() {
    try {
      const posts = await this.get('/posts');
      console.log(`✅ Posts obtenidos: ${posts.length}`);
      return posts;
    } catch (error) {
      console.error('❌ Error obteniendo posts:', error);
      return [];
    }
  }

  async getAllUsers() {
    try {
      const users = await this.get('/users');
      console.log(`✅ Usuarios obtenidos: ${users.length}`);
      return users;
    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      return [];
    }
  }

  async getPostById(id) {
    try {
      const post = await this.get(`/posts/${id}`);
      console.log(`✅ Post obtenido: ${post.title}`);
      return post;
    } catch (error) {
      console.error(`❌ Error obteniendo post ${id}:`, error);
      return null;
    }
  }

  async getUserById(id) {
    try {
      const user = await this.get(`/users/${id}`);
      console.log(`✅ Usuario obtenido: ${user.name}`);
      return user;
    } catch (error) {
      console.error(`❌ Error obteniendo usuario ${id}:`, error);
      return null;
    }
  }

  async getPostComments(postId) {
    try {
      const comments = await this.get(`/posts/${postId}/comments`);
      console.log(`✅ Comentarios obtenidos: ${comments.length}`);
      return comments;
    } catch (error) {
      console.error(
        `❌ Error obteniendo comentarios del post ${postId}:`,
        error
      );
      return [];
    }
  }

  // ✨ FASE POLISH (5 min) - Funcionalidades avanzadas
  async getPostsWithUsers() {
    try {
      const [posts, users] = await Promise.all([
        this.getAllPosts(),
        this.getAllUsers(),
      ]);

      // Combinar posts con información de usuarios
      const postsWithUsers = posts.map(post => {
        const user = users.find(u => u.id === post.userId);
        return {
          ...post,
          user: user || { name: 'Usuario desconocido', email: '' },
        };
      });

      console.log(`✅ Posts con usuarios combinados: ${postsWithUsers.length}`);
      return postsWithUsers;
    } catch (error) {
      console.error('❌ Error combinando posts y usuarios:', error);
      return [];
    }
  }

  async searchPosts(searchTerm) {
    try {
      const posts = await this.getAllPosts();

      if (!searchTerm || searchTerm.trim() === '') {
        return posts;
      }

      const filteredPosts = posts.filter(
        post =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.body.toLowerCase().includes(searchTerm.toLowerCase())
      );

      console.log(
        `🔍 Posts filtrados: ${filteredPosts.length} de ${posts.length}`
      );
      return filteredPosts;
    } catch (error) {
      console.error('❌ Error buscando posts:', error);
      return [];
    }
  }

  async getPostsByUserId(userId) {
    try {
      const posts = await this.getAllPosts();
      const userPosts = posts.filter(post => post.userId === parseInt(userId));

      console.log(`👤 Posts del usuario ${userId}: ${userPosts.length}`);
      return userPosts;
    } catch (error) {
      console.error(`❌ Error obteniendo posts del usuario ${userId}:`, error);
      return [];
    }
  }

  // Utilities y estado de conexión
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Conexión restaurada');
      this.notifyConnectivityChange(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📡 Sin conexión');
      this.notifyConnectivityChange(false);
    });
  }

  notifyConnectivityChange(isOnline) {
    const event = new CustomEvent('connectivityChange', {
      detail: { isOnline },
    });
    window.dispatchEvent(event);
  }

  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache limpiado');
  }

  getCacheInfo() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  // Health check de la API
  async checkApiHealth() {
    try {
      const start = Date.now();
      await this.get('/posts/1', false); // No usar cache
      const responseTime = Date.now() - start;

      return {
        status: 'online',
        responseTime: responseTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'offline',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Crear instancia global
const apiService = new ApiService();

// ✅ Función de test rápido para verificar la API
async function testApiConnection() {
  console.log('🧪 Probando conexión a la API...');

  try {
    const health = await apiService.checkApiHealth();
    console.log('📊 Estado de la API:', health);

    if (health.status === 'online') {
      console.log('✅ API funcionando correctamente');
      console.log(`⚡ Tiempo de respuesta: ${health.responseTime}ms`);
      return true;
    }
  } catch (error) {
    console.error('❌ Test de API falló:', error);
  }

  return false;
}

// 📊 Estadísticas de uso de la API
class ApiStats {
  constructor() {
    this.requests = 0;
    this.errors = 0;
    this.cacheHits = 0;
    this.startTime = Date.now();
  }

  recordRequest() {
    this.requests++;
  }

  recordError() {
    this.errors++;
  }

  recordCacheHit() {
    this.cacheHits++;
  }

  getStats() {
    const uptime = Date.now() - this.startTime;
    return {
      requests: this.requests,
      errors: this.errors,
      cacheHits: this.cacheHits,
      errorRate:
        this.requests > 0
          ? ((this.errors / this.requests) * 100).toFixed(1)
          : 0,
      cacheHitRate:
        this.requests > 0
          ? ((this.cacheHits / this.requests) * 100).toFixed(1)
          : 0,
      uptime: Math.floor(uptime / 1000),
    };
  }
}

const apiStats = new ApiStats();

// 🚀 Exportar para uso global
window.apiService = apiService;
window.testApiConnection = testApiConnection;
window.apiStats = apiStats;

console.log('📡 API Service inicializado correctamente');
console.log('💡 Usa window.apiService para acceder a la API');
console.log('🧪 Usa window.testApiConnection() para probar la conexión');

// 🚀 App Principal - API Consumer | WorldSkills 2025
// Aplicación principal que integra todos los módulos

// 🎯 Estado global de la aplicación
const appState = new AppState();

// ✅ FASE CORE (30 minutos) - Funcionalidad básica indispensable
class ApiConsumerApp {
  constructor() {
    this.elements = {};
    this.currentPhase = 'core';
    this.init();
  }

  async init() {
    console.log('🚀 Inicializando API Consumer App...');

    // Verificar estado de desarrollo
    this.updateDashboard('core', 'Iniciando...');

    try {
      // 1. Obtener referencias DOM
      this.initializeElements();

      // 2. Configurar event listeners
      this.setupEventListeners();

      // 3. Verificar API
      await this.checkApiConnection();

      // 4. Cargar datos iniciales
      await this.loadInitialData();

      // 5. Renderizar UI inicial
      this.renderInitialUI();

      console.log('✅ App inicializada correctamente');
      this.updateDashboard('core', 'Completado');
      this.advanceToEnhanced();
    } catch (error) {
      console.error('❌ Error inicializando app:', error);
      this.showError('Error al inicializar la aplicación', error.message);
      this.updateDashboard('core', 'Error');
    }
  }

  // Obtener referencias DOM
  initializeElements() {
    this.elements = {
      // Loading y Error states
      loadingState: document.getElementById('loadingState'),
      errorState: document.getElementById('errorState'),
      errorMessage: document.getElementById('errorMessage'),
      retryBtn: document.getElementById('retryBtn'),

      // Controls
      searchInput: document.getElementById('searchInput'),
      userFilter: document.getElementById('userFilter'),
      refreshBtn: document.getElementById('refreshBtn'),

      // Stats
      totalPosts: document.getElementById('totalPosts'),
      totalUsers: document.getElementById('totalUsers'),
      filteredPosts: document.getElementById('filteredPosts'),

      // Content
      postsGrid: document.getElementById('postsGrid'),
      userPanel: document.getElementById('userPanel'),
      userName: document.getElementById('userName'),
      userEmail: document.getElementById('userEmail'),
      userWebsite: document.getElementById('userWebsite'),
      closeUserPanel: document.getElementById('closeUserPanel'),

      // Modal
      postModal: document.getElementById('postModal'),
      modalTitle: document.getElementById('modalTitle'),
      modalAuthor: document.getElementById('modalAuthor'),
      modalDate: document.getElementById('modalDate'),
      modalBody: document.getElementById('modalBody'),
      commentsContainer: document.getElementById('commentsContainer'),
      closeModal: document.getElementById('closeModal'),

      // Pagination
      pagination: document.getElementById('pagination'),
      prevBtn: document.getElementById('prevBtn'),
      nextBtn: document.getElementById('nextBtn'),
      pageInfo: document.getElementById('pageInfo'),

      // Dashboard
      coreStatus: document.getElementById('coreStatus'),
      enhancedStatus: document.getElementById('enhancedStatus'),
      polishStatus: document.getElementById('polishStatus'),
      apiStatus: document.getElementById('apiStatus'),
    };

    console.log('📋 Elementos DOM inicializados');
  }

  // Configurar event listeners
  setupEventListeners() {
    // Búsqueda con debounce
    const debouncedSearch = Performance.debounce(
      searchTerm => this.handleSearch(searchTerm),
      300
    );

    this.elements.searchInput.addEventListener('input', e => {
      debouncedSearch(e.target.value);
    });

    // Filtro por usuario
    this.elements.userFilter.addEventListener('change', e => {
      this.handleUserFilter(e.target.value);
    });

    // Refresh button
    this.elements.refreshBtn.addEventListener('click', () => {
      this.refreshData();
    });

    // Retry button
    this.elements.retryBtn.addEventListener('click', () => {
      this.init();
    });

    // Close user panel
    this.elements.closeUserPanel.addEventListener('click', () => {
      this.hideUserPanel();
    });

    // Close modal
    this.elements.closeModal.addEventListener('click', () => {
      this.hideModal();
    });

    // Modal background click
    this.elements.postModal.addEventListener('click', e => {
      if (e.target === this.elements.postModal) {
        this.hideModal();
      }
    });

    // Pagination
    this.elements.prevBtn.addEventListener('click', () => {
      this.goToPreviousPage();
    });

    this.elements.nextBtn.addEventListener('click', () => {
      this.goToNextPage();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.hideModal();
        this.hideUserPanel();
      }
    });

    // Network status
    window.addEventListener('connectivityChange', e => {
      this.handleConnectivityChange(e.detail.isOnline);
    });

    console.log('🎧 Event listeners configurados');
  }

  // Verificar conexión API
  async checkApiConnection() {
    this.updateApiStatus('Verificando...', 'checking');

    try {
      const isConnected = await testApiConnection();
      if (isConnected) {
        this.updateApiStatus('Online', 'online');
        return true;
      } else {
        throw new Error('API no disponible');
      }
    } catch (error) {
      this.updateApiStatus('Offline', 'offline');
      throw error;
    }
  }

  // Cargar datos iniciales
  async loadInitialData() {
    this.showLoading('Cargando posts y usuarios...');

    try {
      // Cargar posts con usuarios
      const postsWithUsers = await apiService.getPostsWithUsers();
      const users = await apiService.getAllUsers();

      // Actualizar estado
      appState.setState({
        posts: postsWithUsers,
        users: users,
        filteredPosts: postsWithUsers,
        isLoading: false,
      });

      console.log(
        `✅ Datos cargados: ${postsWithUsers.length} posts, ${users.length} usuarios`
      );

      // Track analytics
      Analytics.track('data_loaded', {
        postsCount: postsWithUsers.length,
        usersCount: users.length,
      });
    } catch (error) {
      appState.setState({ isLoading: false, error: error.message });
      throw error;
    }
  }

  // Renderizar UI inicial
  renderInitialUI() {
    this.hideLoading();
    this.populateUserFilter();
    this.renderPosts();
    this.updateStats();
    this.updatePagination();
  }

  // ⚡ FASE ENHANCED (30 minutos) - Funcionalidades mejoradas
  advanceToEnhanced() {
    console.log('⚡ Iniciando FASE ENHANCED...');
    this.currentPhase = 'enhanced';
    this.updateDashboard('enhanced', 'Iniciando...');

    // Configurar funcionalidades avanzadas
    this.setupAdvancedFeatures();
    this.updateDashboard('enhanced', 'Completado');
    this.advanceToPolish();
  }

  setupAdvancedFeatures() {
    // Actualizar indicador de fase
    document.querySelectorAll('.phase').forEach(phase => {
      phase.classList.remove('active');
    });
    document.querySelectorAll('.phase')[1].classList.add('active');

    // Event delegation para posts
    this.elements.postsGrid.addEventListener('click', e => {
      // Read more button
      if (e.target.classList.contains('read-more')) {
        const postId = e.target.dataset.postId;
        this.showPostModal(postId);
      }

      // Author click
      if (e.target.classList.contains('post-author')) {
        const userId = e.target.dataset.userId;
        this.showUserInfo(userId);
      }
    });

    // Configurar filtros avanzados
    this.setupAdvancedFilters();

    console.log('⚡ Funcionalidades Enhanced configuradas');
  }

  setupAdvancedFilters() {
    // Filtro de búsqueda mejorado
    this.elements.searchInput.addEventListener('focus', () => {
      Analytics.track('search_focus');
    });

    // Auto-completado básico
    this.elements.searchInput.addEventListener('input', e => {
      const value = e.target.value;
      if (value.length > 2) {
        this.showSearchSuggestions(value);
      }
    });
  }

  // ✨ FASE POLISH (15 minutos) - Refinamientos finales
  advanceToPolish() {
    console.log('✨ Iniciando FASE POLISH...');
    this.currentPhase = 'polish';
    this.updateDashboard('polish', 'Iniciando...');

    // Configurar polish features
    this.setupPolishFeatures();
    this.updateDashboard('polish', 'Completado');

    console.log('🎉 Todas las fases completadas!');
  }

  setupPolishFeatures() {
    // Actualizar indicador de fase
    document.querySelectorAll('.phase').forEach(phase => {
      phase.classList.remove('active');
    });
    document.querySelectorAll('.phase')[2].classList.add('active');

    // Animaciones avanzadas
    this.setupAnimations();

    // Performance monitoring
    this.setupPerformanceMonitoring();

    // Error boundaries
    this.setupErrorBoundaries();

    console.log('✨ Funcionalidades Polish configuradas');
  }

  setupAnimations() {
    // Intersection Observer para animaciones de scroll
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observar posts
    document.querySelectorAll('.post-card').forEach(card => {
      observer.observe(card);
    });
  }

  setupPerformanceMonitoring() {
    // Monitorear métricas de performance
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'measure') {
          console.log(
            `📊 Performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`
          );
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    // Measure initial render
    performance.mark('app-init-start');
    setTimeout(() => {
      performance.mark('app-init-end');
      performance.measure(
        'app-initialization',
        'app-init-start',
        'app-init-end'
      );
    }, 100);
  }

  setupErrorBoundaries() {
    // Global error handler
    window.addEventListener('error', e => {
      console.error('🚨 Global error:', e.error);
      Analytics.track('error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', e => {
      console.error('🚨 Unhandled promise rejection:', e.reason);
      Analytics.track('promise_rejection', {
        reason: e.reason,
      });
    });
  }

  // 🎨 Métodos de renderizado
  renderPosts() {
    const state = appState.getState();
    const paginatedPosts = appState.getPaginatedPosts();

    DOMUtils.clearContent(this.elements.postsGrid);

    if (paginatedPosts.length === 0) {
      this.elements.postsGrid.innerHTML = `
        <div class="no-posts">
          <h3>🔍 No se encontraron posts</h3>
          <p>Intenta con otros términos de búsqueda o filtros</p>
        </div>
      `;
      return;
    }

    paginatedPosts.forEach(post => {
      const postCard = UIComponents.createPostCard(post);
      this.elements.postsGrid.appendChild(postCard);
    });

    // Animar entrada de cards
    setTimeout(() => {
      document.querySelectorAll('.post-card').forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('fade-in');
        }, index * 50);
      });
    }, 10);
  }

  populateUserFilter() {
    const state = appState.getState();
    DOMUtils.clearContent(this.elements.userFilter);

    // Opción por defecto
    this.elements.userFilter.appendChild(
      UIComponents.createSelectOption('', '👥 Todos los usuarios')
    );

    // Opciones de usuarios
    state.users.forEach(user => {
      this.elements.userFilter.appendChild(
        UIComponents.createSelectOption(user.id, user.name)
      );
    });
  }

  updateStats() {
    const state = appState.getState();

    this.elements.totalPosts.textContent = state.posts.length;
    this.elements.totalUsers.textContent = state.users.length;
    this.elements.filteredPosts.textContent = state.filteredPosts.length;
  }

  updatePagination() {
    const state = appState.getState();
    const totalPages = appState.getTotalPages();

    if (totalPages <= 1) {
      DOMUtils.hide(this.elements.pagination);
      return;
    }

    DOMUtils.show(this.elements.pagination);

    this.elements.prevBtn.disabled = state.currentPage === 1;
    this.elements.nextBtn.disabled = state.currentPage === totalPages;
    this.elements.pageInfo.textContent = `Página ${state.currentPage} de ${totalPages}`;
  }

  // 🎯 Handlers de eventos
  handleSearch(searchTerm) {
    console.log(`🔍 Buscando: "${searchTerm}"`);
    Analytics.track('search', { term: searchTerm });

    const state = appState.getState();
    let filteredPosts = state.posts;

    if (searchTerm.trim()) {
      filteredPosts = state.posts.filter(
        post =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.user &&
            post.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    appState.setState({
      filteredPosts,
      searchTerm,
      currentPage: 1,
    });

    this.renderPosts();
    this.updateStats();
    this.updatePagination();
  }

  handleUserFilter(userId) {
    console.log(`👤 Filtrando por usuario: ${userId}`);
    Analytics.track('filter_user', { userId });

    const state = appState.getState();
    let filteredPosts = state.posts;

    if (userId) {
      filteredPosts = state.posts.filter(
        post => post.userId === parseInt(userId)
      );
    }

    // Aplicar también filtro de búsqueda si existe
    if (state.searchTerm) {
      filteredPosts = filteredPosts.filter(
        post =>
          post.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          post.body.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }

    appState.setState({
      filteredPosts,
      currentUser: userId
        ? state.users.find(u => u.id === parseInt(userId))
        : null,
      currentPage: 1,
    });

    this.renderPosts();
    this.updateStats();
    this.updatePagination();
  }

  async showPostModal(postId) {
    console.log(`📖 Mostrando post ${postId}`);
    Analytics.track('post_view', { postId });

    try {
      const [post, comments] = await Promise.all([
        apiService.getPostById(postId),
        apiService.getPostComments(postId),
      ]);

      if (!post) {
        throw new Error('Post no encontrado');
      }

      const user = await apiService.getUserById(post.userId);

      // Llenar modal
      this.elements.modalTitle.textContent = Utils.capitalize(post.title);
      this.elements.modalAuthor.textContent = `Por: ${
        user ? user.name : 'Usuario desconocido'
      }`;
      this.elements.modalDate.textContent = Utils.formatDate();
      this.elements.modalBody.textContent = post.body;

      // Mostrar comentarios
      this.renderComments(comments);

      // Mostrar modal
      DOMUtils.show(this.elements.postModal);
    } catch (error) {
      console.error('❌ Error mostrando post:', error);
      UIComponents.showNotification('Error al cargar el post', 'error');
    }
  }

  renderComments(comments) {
    DOMUtils.clearContent(this.elements.commentsContainer);

    if (comments.length === 0) {
      this.elements.commentsContainer.innerHTML = `
        <p class="no-comments">No hay comentarios aún</p>
      `;
      return;
    }

    comments.forEach(comment => {
      const commentEl = UIComponents.createComment(comment);
      this.elements.commentsContainer.appendChild(commentEl);
    });
  }

  async showUserInfo(userId) {
    console.log(`👤 Mostrando info del usuario ${userId}`);
    Analytics.track('user_view', { userId });

    try {
      const user = await apiService.getUserById(userId);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      this.elements.userName.textContent = user.name;
      this.elements.userEmail.textContent = user.email;
      this.elements.userWebsite.textContent = user.website || 'No disponible';

      DOMUtils.show(this.elements.userPanel);
      document.querySelector('.main-content').classList.add('with-panel');
    } catch (error) {
      console.error('❌ Error mostrando usuario:', error);
      UIComponents.showNotification(
        'Error al cargar información del usuario',
        'error'
      );
    }
  }

  hideUserPanel() {
    DOMUtils.hide(this.elements.userPanel);
    document.querySelector('.main-content').classList.remove('with-panel');
  }

  hideModal() {
    DOMUtils.hide(this.elements.postModal);
  }

  // 🔄 Paginación
  goToPreviousPage() {
    const state = appState.getState();
    if (state.currentPage > 1) {
      appState.setState({ currentPage: state.currentPage - 1 });
      this.renderPosts();
      this.updatePagination();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToNextPage() {
    const state = appState.getState();
    const totalPages = appState.getTotalPages();
    if (state.currentPage < totalPages) {
      appState.setState({ currentPage: state.currentPage + 1 });
      this.renderPosts();
      this.updatePagination();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // 🔄 Actualización de datos
  async refreshData() {
    console.log('🔄 Refrescando datos...');
    Analytics.track('refresh_data');

    try {
      this.showLoading('Actualizando datos...');

      // Limpiar cache
      apiService.clearCache();

      // Recargar datos
      await this.loadInitialData();

      // Re-renderizar
      this.renderInitialUI();

      UIComponents.showNotification(
        'Datos actualizados correctamente',
        'success'
      );
    } catch (error) {
      console.error('❌ Error refrescando datos:', error);
      this.showError('Error al actualizar datos', error.message);
    }
  }

  // 🎛️ Estados de UI
  showLoading(message = 'Cargando...') {
    this.elements.loadingState.querySelector('p').textContent = message;
    DOMUtils.show(this.elements.loadingState);
    DOMUtils.hide(this.elements.errorState);
  }

  hideLoading() {
    DOMUtils.hide(this.elements.loadingState);
  }

  showError(title, message) {
    this.elements.errorMessage.textContent = `${title}: ${message}`;
    DOMUtils.show(this.elements.errorState);
    DOMUtils.hide(this.elements.loadingState);
  }

  hideError() {
    DOMUtils.hide(this.elements.errorState);
  }

  // 🛠️ Dashboard de desarrollo
  updateDashboard(phase, status) {
    const statusElement = this.elements[`${phase}Status`];
    if (statusElement) {
      statusElement.textContent = status;
      statusElement.className = `status-${status.toLowerCase()}`;
    }
  }

  updateApiStatus(status, className) {
    this.elements.apiStatus.textContent = status;
    this.elements.apiStatus.className = `status-indicator ${className}`;
  }

  // 🌐 Manejo de conectividad
  handleConnectivityChange(isOnline) {
    if (isOnline) {
      this.updateApiStatus('Online', 'online');
      UIComponents.showNotification('Conexión restaurada', 'success');
    } else {
      this.updateApiStatus('Offline', 'offline');
      UIComponents.showNotification('Sin conexión a internet', 'warning');
    }
  }

  // 💡 Sugerencias de búsqueda
  showSearchSuggestions(term) {
    // Implementación básica de sugerencias
    const state = appState.getState();
    const suggestions = state.posts
      .filter(post => post.title.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 5)
      .map(post => post.title);

    console.log('💡 Sugerencias:', suggestions);
  }
}

// 🚀 Inicialización automática cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 DOM listo, inicializando app...');

  // Crear instancia global de la app
  window.app = new ApiConsumerApp();

  // Configurar shortcuts de desarrollo
  window.appState = appState;
  window.showStats = () => console.table(Analytics.getEvents());
  window.clearCache = () => apiService.clearCache();
  window.getState = () => appState.getState();

  console.log('🛠️ Development tools available:');
  console.log('  - window.app: Main app instance');
  console.log('  - window.appState: App state management');
  console.log('  - window.showStats(): Show analytics');
  console.log('  - window.clearCache(): Clear API cache');
  console.log('  - window.getState(): Get current state');
});

console.log('🚀 App module loaded successfully');

// ============================================
// TIMER MANAGEMENT - WorldSkills 2025
// ============================================

let activeTimer = null;
let timerInterval = null;

function startTimer(phase, minutes) {
  // Detener timer anterior si existe
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  // Remover clase active de todos los timers
  document.querySelectorAll('.timer').forEach(timer => {
    timer.classList.remove('active');
  });

  // Activar el timer actual
  const currentTimer = document.querySelector(`.${phase}-timer`);
  currentTimer.classList.add('active');

  let totalSeconds = minutes * 60;
  activeTimer = phase;

  timerInterval = setInterval(() => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const display = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
    document.getElementById(`${phase}-time`).textContent = display;

    totalSeconds--;

    if (totalSeconds < 0) {
      clearInterval(timerInterval);
      notifyTimeUp(phase);
    }
  }, 1000);
}

function notifyTimeUp(phase) {
  // Mostrar notificación
  const notification = document.createElement('div');
  notification.className = 'time-notification';
  notification.innerHTML = `
        <div class="notification-content">
            <h3>⏰ ¡Tiempo terminado!</h3>
            <p>Fase ${phase.toUpperCase()} completada</p>
            <button onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;

  document.body.appendChild(notification);

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);

  // Reproducir sonido (opcional)
  if ('AudioContext' in window) {
    playNotificationSound();
  }
}

function playNotificationSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.5
  );

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);
}

// ============================================
// PHASE NAVIGATION
// ============================================

function showPhase(phaseName) {
  // Ocultar todas las secciones
  document.querySelectorAll('.phase-section').forEach(section => {
    section.classList.remove('active');
  });

  // Remover clase active de todos los botones
  document.querySelectorAll('.phase-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Mostrar la sección seleccionada
  document.getElementById(`${phaseName}-phase`).classList.add('active');

  // Activar el botón correspondiente
  event.target.classList.add('active');

  // Scroll suave al inicio de la sección
  document.getElementById(`${phaseName}-phase`).scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

// ============================================
// PROGRESS TRACKING
// ============================================

function updateProgress() {
  const checkboxes = document.querySelectorAll(
    '.checklist input[type="checkbox"]'
  );
  const totalTasks = checkboxes.length;
  const completedTasks = Array.from(checkboxes).filter(cb => cb.checked).length;

  const progress = (completedTasks / totalTasks) * 100;

  // Actualizar barra de progreso si existe
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  // Guardar progreso en localStorage
  const checklistState = Array.from(checkboxes).map(cb => cb.checked);
  localStorage.setItem('clipping-progress', JSON.stringify(checklistState));

  // Mostrar celebración si todo está completo
  if (completedTasks === totalTasks && totalTasks > 0) {
    showCompletionCelebration();
  }
}

function loadProgress() {
  const savedProgress = localStorage.getItem('clipping-progress');
  if (savedProgress) {
    const checklistState = JSON.parse(savedProgress);
    const checkboxes = document.querySelectorAll(
      '.checklist input[type="checkbox"]'
    );

    checkboxes.forEach((checkbox, index) => {
      if (checklistState[index]) {
        checkbox.checked = true;
      }
    });

    updateProgress();
  }
}

function showCompletionCelebration() {
  const celebration = document.createElement('div');
  celebration.className = 'completion-celebration';
  celebration.innerHTML = `
        <div class="celebration-content">
            <h2>🎉 ¡Felicitaciones!</h2>
            <p>Has completado todos los ejercicios de CSS Clipping y Masking</p>
            <p>Tiempo para continuar con: <strong>06-css-filters-blend-modes</strong></p>
            <button onclick="this.parentElement.parentElement.remove()">Continuar</button>
        </div>
    `;

  document.body.appendChild(celebration);

  // Crear confetti (opcional)
  createConfetti();
}

function createConfetti() {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            animation: confetti-fall 3s linear forwards;
            z-index: 9999;
        `;

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3000);
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  // Cargar progreso guardado
  loadProgress();

  // Event listeners para checkboxes
  document
    .querySelectorAll('.checklist input[type="checkbox"]')
    .forEach(checkbox => {
      checkbox.addEventListener('change', updateProgress);
    });

  // Event listeners para navegación de fases
  document.querySelectorAll('.phase-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const phaseName = this.textContent.includes('CORE')
        ? 'core'
        : this.textContent.includes('ENHANCED')
        ? 'enhanced'
        : 'polish';
      showPhase(phaseName);
    });
  });

  console.log('🎨 CSS Clipping y Masking - Sistema iniciado');
  console.log('⏱️ Timers disponibles para cada fase MVP');
  console.log('📊 Sistema de progreso activo');
});

// ============================================
// ESTILOS DINÁMICOS
// ============================================

// Agregar estilos para notificaciones y celebraciones
const styles = `
<style>
.time-notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 0;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease;
}

.notification-content {
    padding: 30px;
    text-align: center;
    position: relative;
}

.notification-content h3 {
    margin-bottom: 10px;
    color: #ffd700;
    font-size: 1.5rem;
}

.notification-content p {
    margin-bottom: 0;
    font-size: 1.1rem;
}

.notification-content button {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0.7;
}

.notification-content button:hover {
    opacity: 1;
}

.completion-celebration {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: fadeIn 0.5s ease;
}

.celebration-content {
    background: white;
    padding: 50px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 500px;
}

.celebration-content h2 {
    color: #27ae60;
    margin-bottom: 20px;
    font-size: 2.5rem;
}

.celebration-content p {
    margin-bottom: 15px;
    font-size: 1.2rem;
    color: #333;
}

.celebration-content button {
    background: #27ae60;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 20px;
    transition: background 0.3s ease;
}

.celebration-content button:hover {
    background: #229954;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes confetti-fall {
    from {
        transform: translateY(-100vh) rotate(0deg);
    }
    to {
        transform: translateY(100vh) rotate(360deg);
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', styles);

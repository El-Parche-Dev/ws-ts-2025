// ⏱️ Challenge Timer Module - WorldSkills 2025
// Módulo para manejo del timer del speed challenge

class ChallengeTimer {
  constructor() {
    this.totalTime = 45 * 60; // 45 minutos en segundos
    this.remainingTime = this.totalTime;
    this.isRunning = false;
    this.isPaused = false;
    this.interval = null;
    this.startTime = null;
    this.phaseMarkers = {
      core: 20 * 60, // 0-20 min
      enhanced: 35 * 60, // 20-35 min
      polish: 45 * 60, // 35-45 min
    };
    this.currentPhase = 'not-started';

    this.callbacks = {
      onTick: [],
      onPhaseChange: [],
      onTimeUp: [],
      onStart: [],
      onPause: [],
      onResume: [],
      onReset: [],
    };

    this.init();
  }

  init() {
    this.bindElements();
    this.setupEventListeners();
    this.updateDisplay();
    this.updatePhase();

    console.log('⏱️ Challenge Timer inicializado');
  }

  bindElements() {
    this.elements = {
      timer: document.getElementById('challengeTimer'),
      timeRemaining: document.getElementById('timeRemaining'),
      startBtn: document.getElementById('startChallenge'),
      pauseBtn: document.getElementById('pauseTimer'),
      resetBtn: document.getElementById('resetTimer'),
      appContainer: document.getElementById('appContainer'),
      currentPhase: document.getElementById('currentPhase'),
      timeLeft: document.getElementById('timeLeft'),
    };
  }

  setupEventListeners() {
    // Botón de inicio
    this.elements.startBtn.addEventListener('click', () => {
      this.start();
    });

    // Botón de pausa
    this.elements.pauseBtn.addEventListener('click', () => {
      if (this.isRunning) {
        this.pause();
      } else {
        this.resume();
      }
    });

    // Botón de reset
    this.elements.resetBtn.addEventListener('click', () => {
      this.reset();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case ' ':
            e.preventDefault();
            if (this.isRunning) {
              this.pause();
            } else if (this.isPaused) {
              this.resume();
            }
            break;
          case 'r':
            e.preventDefault();
            this.reset();
            break;
        }
      }
    });
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.startTime = Date.now();

    // Ocultar pantalla de timer y mostrar app
    this.elements.timer.classList.add('hidden');
    this.elements.appContainer.classList.remove('hidden');

    // Actualizar botones
    this.elements.startBtn.classList.add('hidden');
    this.elements.pauseBtn.classList.remove('hidden');
    this.elements.pauseBtn.textContent = '⏸️ Pausar';

    // Iniciar countdown
    this.interval = setInterval(() => {
      this.tick();
    }, 1000);

    // Notificar callbacks
    this.trigger('onStart');

    console.log('🚀 Challenge iniciado!');
    this.logEvent('challenge_started', { totalTime: this.totalTime });
  }

  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.isPaused = true;

    clearInterval(this.interval);
    this.elements.pauseBtn.textContent = '▶️ Continuar';

    this.trigger('onPause');
    console.log('⏸️ Challenge pausado');
    this.logEvent('challenge_paused', { timeRemaining: this.remainingTime });
  }

  resume() {
    if (!this.isPaused) return;

    this.isRunning = true;
    this.isPaused = false;

    this.interval = setInterval(() => {
      this.tick();
    }, 1000);

    this.elements.pauseBtn.textContent = '⏸️ Pausar';

    this.trigger('onResume');
    console.log('▶️ Challenge reanudado');
    this.logEvent('challenge_resumed', { timeRemaining: this.remainingTime });
  }

  reset() {
    // Limpiar timer
    clearInterval(this.interval);

    // Resetear estado
    this.isRunning = false;
    this.isPaused = false;
    this.remainingTime = this.totalTime;
    this.currentPhase = 'not-started';

    // Resetear UI
    this.elements.timer.classList.remove('hidden');
    this.elements.appContainer.classList.add('hidden');
    this.elements.startBtn.classList.remove('hidden');
    this.elements.pauseBtn.classList.add('hidden');
    this.elements.pauseBtn.textContent = '⏸️ Pausar';

    // Actualizar displays
    this.updateDisplay();
    this.updatePhase();

    this.trigger('onReset');
    console.log('🔄 Challenge reseteado');
    this.logEvent('challenge_reset');
  }

  tick() {
    this.remainingTime--;
    this.updateDisplay();
    this.checkPhaseChange();

    // Trigger tick callbacks
    this.trigger('onTick', {
      remainingTime: this.remainingTime,
      elapsedTime: this.totalTime - this.remainingTime,
      phase: this.currentPhase,
    });

    // Check if time is up
    if (this.remainingTime <= 0) {
      this.timeUp();
    }

    // Warning sounds
    if (this.remainingTime === 300) {
      // 5 minutos
      this.playWarningSound();
      console.log('⚠️ 5 minutos restantes!');
    }

    if (this.remainingTime === 60) {
      // 1 minuto
      this.playWarningSound();
      console.log('🚨 1 minuto restante!');
    }
  }

  timeUp() {
    clearInterval(this.interval);
    this.isRunning = false;

    // Mostrar overlay de tiempo terminado
    this.showTimeUpOverlay();

    this.trigger('onTimeUp');
    console.log('⏰ ¡Tiempo terminado!');
    this.logEvent('challenge_completed', {
      finalTime: this.totalTime,
      phase: this.currentPhase,
    });
  }

  checkPhaseChange() {
    const elapsedTime = this.totalTime - this.remainingTime;
    let newPhase = this.currentPhase;

    if (elapsedTime >= this.phaseMarkers.polish) {
      newPhase = 'polish';
    } else if (elapsedTime >= this.phaseMarkers.enhanced) {
      newPhase = 'enhanced';
    } else if (elapsedTime > 0) {
      newPhase = 'core';
    }

    if (newPhase !== this.currentPhase) {
      const prevPhase = this.currentPhase;
      this.currentPhase = newPhase;
      this.updatePhase();

      this.trigger('onPhaseChange', {
        from: prevPhase,
        to: newPhase,
        elapsedTime: elapsedTime,
      });

      console.log(`🎯 Cambio de fase: ${prevPhase} → ${newPhase}`);
      this.logEvent('phase_change', { from: prevPhase, to: newPhase });

      // Notificación visual
      this.showPhaseNotification(newPhase);
    }
  }

  updateDisplay() {
    const formatted = this.formatTime(this.remainingTime);
    this.elements.timeRemaining.textContent = formatted;

    if (this.elements.timeLeft) {
      this.elements.timeLeft.textContent = formatted;
    }

    // Color coding basado en tiempo restante
    if (this.remainingTime <= 300) {
      // 5 minutos
      this.elements.timeRemaining.style.color = '#ef4444';
    } else if (this.remainingTime <= 600) {
      // 10 minutos
      this.elements.timeRemaining.style.color = '#f59e0b';
    } else {
      this.elements.timeRemaining.style.color = '';
    }

    // Update page title
    if (this.isRunning) {
      document.title = `${formatted} - Task Tracker Pro`;
    }
  }

  updatePhase() {
    if (this.elements.currentPhase) {
      this.elements.currentPhase.textContent = this.getPhaseLabel(
        this.currentPhase
      );
    }

    // Update phase indicators in timer screen
    document.querySelectorAll('.phase-item').forEach((item, index) => {
      item.classList.remove('active', 'completed');

      const phases = ['core', 'enhanced', 'polish'];
      const phaseIndex = phases.indexOf(this.currentPhase);

      if (index < phaseIndex) {
        item.classList.add('completed');
      } else if (index === phaseIndex) {
        item.classList.add('active');
      }
    });
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  }

  getPhaseLabel(phase) {
    const labels = {
      'not-started': 'No iniciado',
      core: 'Core Phase',
      enhanced: 'Enhanced Phase',
      polish: 'Polish Phase',
    };
    return labels[phase] || phase;
  }

  showPhaseNotification(phase) {
    const notifications = {
      core: '✅ FASE CORE - Funcionalidad básica',
      enhanced: '⚡ FASE ENHANCED - Funcionalidades adicionales',
      polish: '✨ FASE POLISH - Refinamientos finales',
    };

    const message = notifications[phase];
    if (message) {
      this.createNotification(message, 'phase-change');
    }
  }

  showTimeUpOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'time-up-overlay';
    overlay.innerHTML = `
      <div class="time-up-content">
        <h2>⏰ ¡Tiempo Terminado!</h2>
        <p>El challenge ha finalizado</p>
        <div class="final-stats">
          <div class="stat">
            <span class="label">Fase alcanzada:</span>
            <span class="value">${this.getPhaseLabel(this.currentPhase)}</span>
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="close-overlay-btn">
          Cerrar
        </button>
      </div>
    `;

    // Styles for overlay
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    `;

    document.body.appendChild(overlay);

    // Play completion sound
    this.playCompletionSound();
  }

  createNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `challenge-notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #4caf50, #45a049);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 9999;
      animation: slideInFromRight 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  playWarningSound() {
    // Simple beep using Web Audio API
    if (
      typeof AudioContext !== 'undefined' ||
      typeof webkitAudioContext !== 'undefined'
    ) {
      const audioContext = new (AudioContext || webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  }

  playCompletionSound() {
    // Completion melody
    if (
      typeof AudioContext !== 'undefined' ||
      typeof webkitAudioContext !== 'undefined'
    ) {
      const audioContext = new (AudioContext || webkitAudioContext)();
      const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5

      notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = audioContext.currentTime + index * 0.2;
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.4);
      });
    }
  }

  // Event system
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(
        cb => cb !== callback
      );
    }
  }

  trigger(event, data = null) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in timer callback ${event}:`, error);
        }
      });
    }
  }

  // Logging for analytics
  logEvent(event, data = {}) {
    const logData = {
      event,
      timestamp: new Date().toISOString(),
      remainingTime: this.remainingTime,
      phase: this.currentPhase,
      ...data,
    };

    // Store in localStorage for later analysis
    const logs = JSON.parse(localStorage.getItem('challengeLogs') || '[]');
    logs.push(logData);

    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }

    localStorage.setItem('challengeLogs', JSON.stringify(logs));
  }

  // Utility methods
  getElapsedTime() {
    return this.totalTime - this.remainingTime;
  }

  getProgress() {
    return ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
  }

  getPhaseProgress() {
    const elapsed = this.getElapsedTime();

    switch (this.currentPhase) {
      case 'core':
        return (elapsed / this.phaseMarkers.core) * 100;
      case 'enhanced':
        return (
          ((elapsed - this.phaseMarkers.core) /
            (this.phaseMarkers.enhanced - this.phaseMarkers.core)) *
          100
        );
      case 'polish':
        return (
          ((elapsed - this.phaseMarkers.enhanced) /
            (this.phaseMarkers.polish - this.phaseMarkers.enhanced)) *
          100
        );
      default:
        return 0;
    }
  }

  getStats() {
    return {
      totalTime: this.totalTime,
      remainingTime: this.remainingTime,
      elapsedTime: this.getElapsedTime(),
      progress: this.getProgress(),
      phase: this.currentPhase,
      phaseProgress: this.getPhaseProgress(),
      isRunning: this.isRunning,
      isPaused: this.isPaused,
    };
  }

  // Export logs for analysis
  exportLogs() {
    const logs = JSON.parse(localStorage.getItem('challengeLogs') || '[]');
    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `challenge-logs-${
      new Date().toISOString().split('T')[0]
    }.json`;
    a.click();

    URL.revokeObjectURL(url);
  }
}

// Crear instancia global del timer
const challengeTimer = new ChallengeTimer();

// Exportar para uso global
window.challengeTimer = challengeTimer;

console.log('⏱️ Challenge Timer module loaded');
console.log('💡 Use window.challengeTimer to access timer controls');

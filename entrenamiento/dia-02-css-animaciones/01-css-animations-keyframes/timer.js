// Timer para sesión de entrenamiento WorldSkills
let totalTime = 45 * 60; // 45 minutos en segundos
let currentTime = totalTime;

function updateTimer() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.textContent = formattedTime;

    // Cambiar color basado en tiempo restante
    if (currentTime <= 300) {
      // Últimos 5 minutos
      timerElement.style.color = '#e74c3c';
    } else if (currentTime <= 600) {
      // Últimos 10 minutos
      timerElement.style.color = '#f39c12';
    } else {
      timerElement.style.color = '#f39c12';
    }
  }

  if (currentTime > 0) {
    currentTime--;
  } else {
    // Tiempo agotado
    if (timerElement) {
      timerElement.textContent = '¡TIEMPO!';
      timerElement.style.color = '#e74c3c';
      timerElement.style.fontWeight = 'bold';
      timerElement.style.fontSize = '1.5rem';
    }

    // Mostrar alerta
    alert(
      '¡Tiempo agotado! Revisa tu progreso MVP y prepárate para la siguiente sección.'
    );
  }
}

// Iniciar timer cuando la página carga
document.addEventListener('DOMContentLoaded', function () {
  updateTimer(); // Mostrar tiempo inicial
  setInterval(updateTimer, 1000); // Actualizar cada segundo

  // Agregar funcionalidad a checkboxes del ejercicio
  const checkboxes = document.querySelectorAll(
    '.exercise-checklist input[type="checkbox"]'
  );
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      if (this.checked) {
        this.parentElement.style.textDecoration = 'line-through';
        this.parentElement.style.opacity = '0.7';
      } else {
        this.parentElement.style.textDecoration = 'none';
        this.parentElement.style.opacity = '1';
      }

      // Contar progreso por fase
      updateProgress();
    });
  });

  // Agregar efectos de hover a las demo cards
  const demoCards = document.querySelectorAll('.demo-card');
  demoCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
});

function updateProgress() {
  const coreCheckboxes = document.querySelectorAll(
    '.checklist-group:nth-child(1) input[type="checkbox"]'
  );
  const enhancedCheckboxes = document.querySelectorAll(
    '.checklist-group:nth-child(2) input[type="checkbox"]'
  );
  const polishCheckboxes = document.querySelectorAll(
    '.checklist-group:nth-child(3) input[type="checkbox"]'
  );

  const coreCompleted = Array.from(coreCheckboxes).filter(
    cb => cb.checked
  ).length;
  const enhancedCompleted = Array.from(enhancedCheckboxes).filter(
    cb => cb.checked
  ).length;
  const polishCompleted = Array.from(polishCheckboxes).filter(
    cb => cb.checked
  ).length;

  const coreTotal = coreCheckboxes.length;
  const enhancedTotal = enhancedCheckboxes.length;
  const polishTotal = polishCheckboxes.length;

  // Mostrar progreso en consola para debug
  console.log(`Progreso MVP:
    CORE: ${coreCompleted}/${coreTotal} (${Math.round(
    (coreCompleted / coreTotal) * 100
  )}%)
    ENHANCED: ${enhancedCompleted}/${enhancedTotal} (${Math.round(
    (enhancedCompleted / enhancedTotal) * 100
  )}%)
    POLISH: ${polishCompleted}/${polishTotal} (${Math.round(
    (polishCompleted / polishTotal) * 100
  )}%)`);

  // Feedback visual basado en progreso MVP
  if (coreCompleted === coreTotal) {
    document.querySelector('.checklist-group:nth-child(1) h3').innerHTML =
      '✅ CORE (Completado)';
  }

  if (enhancedCompleted === enhancedTotal) {
    document.querySelector('.checklist-group:nth-child(2) h3').innerHTML =
      '⚡ ENHANCED (Completado)';
  }

  if (polishCompleted === polishTotal) {
    document.querySelector('.checklist-group:nth-child(3) h3').innerHTML =
      '✨ POLISH (Completado)';
  }
}

// Función para pausar/reanudar el timer (útil para debugging)
function toggleTimer() {
  if (window.timerInterval) {
    clearInterval(window.timerInterval);
    window.timerInterval = null;
    console.log('Timer pausado');
  } else {
    window.timerInterval = setInterval(updateTimer, 1000);
    console.log('Timer reanudado');
  }
}

// Función para agregar tiempo (útil para extensiones)
function addTime(minutes) {
  currentTime += minutes * 60;
  console.log(`Agregados ${minutes} minutos al timer`);
}

// Función para mostrar estadísticas finales
function showFinalStats() {
  const totalCheckboxes = document.querySelectorAll(
    '.exercise-checklist input[type="checkbox"]'
  ).length;
  const completedCheckboxes = document.querySelectorAll(
    '.exercise-checklist input[type="checkbox"]:checked'
  ).length;

  const completionPercentage = Math.round(
    (completedCheckboxes / totalCheckboxes) * 100
  );

  alert(`Estadísticas de la sesión:
    ✅ Tareas completadas: ${completedCheckboxes}/${totalCheckboxes}
    📊 Porcentaje de completitud: ${completionPercentage}%
    ⏱️ Tiempo transcurrido: ${Math.round(
      (totalTime - currentTime) / 60
    )} minutos
    
    ${
      completionPercentage >= 80
        ? '🎉 ¡Excelente trabajo!'
        : completionPercentage >= 60
        ? '👍 Buen progreso'
        : '📚 Necesitas más práctica'
    }`);
}

// Exponer funciones globalmente para uso en consola
window.toggleTimer = toggleTimer;
window.addTime = addTime;
window.showFinalStats = showFinalStats;

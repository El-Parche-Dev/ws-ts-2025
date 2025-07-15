const TaskStats = ({ tasks }) => {
  // Calcular estadísticas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Tareas por prioridad
  const tasksByPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  // Tareas vencidas
  const today = new Date();
  const overdueTasks = tasks.filter(
    task => !task.completed && new Date(task.dueDate) < today
  ).length;

  // Tareas que vencen hoy
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate).toDateString();
    return !task.completed && taskDate === today.toDateString();
  }).length;

  // Tareas que vencen en los próximos 3 días
  const upcoming = tasks.filter(task => {
    if (task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3;
  }).length;

  const getPriorityColor = priority => {
    switch (priority) {
      case 'urgent':
        return '#ff4757';
      case 'high':
        return '#ffa502';
      case 'medium':
        return '#3742fa';
      case 'low':
        return '#2ed573';
      default:
        return '#747d8c';
    }
  };

  const getPriorityLabel = priority => {
    switch (priority) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  };

  return (
    <div className="task-stats">
      <h3>📊 Estadísticas</h3>

      {/* Resumen general */}
      <div className="stats-overview">
        <div className="stat-card total">
          <div className="stat-number">{totalTasks}</div>
          <div className="stat-label">Total de Tareas</div>
        </div>

        <div className="stat-card completed">
          <div className="stat-number">{completedTasks}</div>
          <div className="stat-label">Completadas</div>
        </div>

        <div className="stat-card pending">
          <div className="stat-number">{pendingTasks}</div>
          <div className="stat-label">Pendientes</div>
        </div>
      </div>

      {/* Progreso */}
      <div className="progress-section">
        <div className="progress-header">
          <span>Progreso General</span>
          <span className="progress-percent">{completionRate}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}></div>
        </div>
      </div>

      {/* Alertas importantes */}
      {(overdueTasks > 0 || todayTasks > 0) && (
        <div className="alerts-section">
          <h4>⚠️ Alertas</h4>
          {overdueTasks > 0 && (
            <div className="alert overdue">
              <span className="alert-icon">🚨</span>
              <span>
                {overdueTasks} tarea{overdueTasks > 1 ? 's' : ''} vencida
                {overdueTasks > 1 ? 's' : ''}
              </span>
            </div>
          )}
          {todayTasks > 0 && (
            <div className="alert today">
              <span className="alert-icon">🔥</span>
              <span>
                {todayTasks} tarea{todayTasks > 1 ? 's' : ''} vence
                {todayTasks > 1 ? 'n' : ''} hoy
              </span>
            </div>
          )}
          {upcoming > 0 && (
            <div className="alert upcoming">
              <span className="alert-icon">⏰</span>
              <span>
                {upcoming} tarea{upcoming > 1 ? 's' : ''} próxima
                {upcoming > 1 ? 's' : ''} (3 días)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Distribución por prioridad */}
      {totalTasks > 0 && (
        <div className="priority-section">
          <h4>🎯 Por Prioridad</h4>
          <div className="priority-stats">
            {Object.entries(tasksByPriority).map(([priority, count]) => (
              <div
                key={priority}
                className="priority-item">
                <div className="priority-info">
                  <span
                    className="priority-dot"
                    style={{
                      backgroundColor: getPriorityColor(priority),
                    }}></span>
                  <span className="priority-name">
                    {getPriorityLabel(priority)}
                  </span>
                </div>
                <span className="priority-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje motivacional */}
      <div className="motivation-section">
        {completionRate === 100 && totalTasks > 0 ? (
          <div className="motivation success">
            🎉 ¡Excelente trabajo! Todas las tareas completadas.
          </div>
        ) : completionRate >= 80 ? (
          <div className="motivation good">
            💪 ¡Casi terminas! Solo te faltan {pendingTasks} tareas.
          </div>
        ) : completionRate >= 50 ? (
          <div className="motivation normal">📈 Buen progreso. ¡Sigue así!</div>
        ) : totalTasks > 0 ? (
          <div className="motivation encourage">
            🚀 ¡Puedes hacerlo! Comienza con las tareas más importantes.
          </div>
        ) : (
          <div className="motivation start">
            ✨ Crea tu primera tarea para comenzar.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskStats;

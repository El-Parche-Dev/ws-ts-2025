import { useState } from 'react';

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete, loading }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return;
    }

    try {
      setDeleting(true);
      await onDelete(task.id);
    } catch (err) {
      console.error('Error deleting task:', err);
    } finally {
      setDeleting(false);
    }
  };

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

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isOverdue = () => {
    if (task.completed) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  };

  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();
  const overdue = isOverdue();

  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''} ${
        overdue ? 'overdue' : ''
      }`}>
      {/* Header con checkbox y prioridad */}
      <div className="task-header">
        <div className="task-checkbox-container">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="task-checkbox"
            disabled={loading}
          />
          <span
            className="priority-badge"
            style={{ backgroundColor: getPriorityColor(task.priority) }}>
            {getPriorityLabel(task.priority)}
          </span>
        </div>

        <div className="task-actions">
          <button
            onClick={() => onEdit(task)}
            className="btn-icon edit"
            disabled={loading || deleting}
            title="Editar tarea">
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="btn-icon delete"
            disabled={loading || deleting}
            title="Eliminar tarea">
            {deleting ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>

      {/* Contenido de la tarea */}
      <div className="task-content">
        <h3 className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
          {task.title}
        </h3>
        <p className="task-description">{task.description}</p>
      </div>

      {/* Footer con fecha */}
      <div className="task-footer">
        <div className="task-date">
          <span className="date-label">Vencimiento:</span>
          <span className={`date-value ${overdue ? 'overdue' : ''}`}>
            {formatDate(task.dueDate)}
          </span>
        </div>

        {!task.completed && (
          <div className="task-status">
            {overdue ? (
              <span className="status-overdue">
                ⚠️ Vencida ({Math.abs(daysUntilDue)} días)
              </span>
            ) : daysUntilDue === 0 ? (
              <span className="status-today">🔥 Vence hoy</span>
            ) : daysUntilDue === 1 ? (
              <span className="status-tomorrow">⏰ Vence mañana</span>
            ) : daysUntilDue <= 3 ? (
              <span className="status-soon">
                📅 {daysUntilDue} días restantes
              </span>
            ) : (
              <span className="status-normal">
                📅 {daysUntilDue} días restantes
              </span>
            )}
          </div>
        )}

        {task.completed && task.completedAt && (
          <div className="completed-info">
            ✅ Completada el {formatDate(task.completedAt)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;

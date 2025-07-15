import { useState } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggleComplete, onEdit, onDelete, loading }) => {
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, priority, title
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar tareas según el filtro seleccionado
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  // Filtrar por búsqueda
  const searchedTasks = filteredTasks.filter(
    task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ordenar tareas
  const sortedTasks = [...searchedTasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorities = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorities[b.priority] - priorities[a.priority];
      case 'title':
        return a.title.localeCompare(b.title);
      case 'dueDate':
      default:
        return new Date(a.dueDate) - new Date(b.dueDate);
    }
  });

  const getFilterCount = filterType => {
    if (filterType === 'pending') return tasks.filter(t => !t.completed).length;
    if (filterType === 'completed')
      return tasks.filter(t => t.completed).length;
    return tasks.length;
  };

  return (
    <div className="task-list-container">
      {/* Controles de filtrado y búsqueda */}
      <div className="task-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}>
            Todas ({getFilterCount('all')})
          </button>
          <button
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}>
            Pendientes ({getFilterCount('pending')})
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}>
            Completadas ({getFilterCount('completed')})
          </button>
        </div>

        <div className="sort-controls">
          <label htmlFor="sortBy">Ordenar por:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="sort-select">
            <option value="dueDate">Fecha de vencimiento</option>
            <option value="priority">Prioridad</option>
            <option value="title">Título</option>
          </select>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="task-list">
        {loading && tasks.length === 0 ? (
          <div className="loading-tasks">
            <div className="loading-spinner small"></div>
            <p>Cargando tareas...</p>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="empty-state">
            {searchQuery ? (
              <>
                <h3>No se encontraron tareas</h3>
                <p>No hay tareas que coincidan con "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn btn-secondary">
                  Limpiar búsqueda
                </button>
              </>
            ) : filter === 'pending' ? (
              <>
                <h3>🎉 ¡No hay tareas pendientes!</h3>
                <p>Todas las tareas están completadas</p>
              </>
            ) : filter === 'completed' ? (
              <>
                <h3>No hay tareas completadas</h3>
                <p>Completa algunas tareas para verlas aquí</p>
              </>
            ) : (
              <>
                <h3>No hay tareas aún</h3>
                <p>Crea tu primera tarea usando el formulario</p>
              </>
            )}
          </div>
        ) : (
          <div className="tasks-grid">
            {sortedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                loading={loading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Resumen de resultados */}
      {sortedTasks.length > 0 && (
        <div className="task-summary">
          <p>
            Mostrando {sortedTasks.length} de {tasks.length} tareas
            {searchQuery && ` (filtradas por "${searchQuery}")`}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;

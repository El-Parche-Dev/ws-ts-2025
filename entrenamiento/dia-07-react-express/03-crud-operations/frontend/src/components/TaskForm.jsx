import { useEffect, useState } from 'react';

const TaskForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'La fecha de vencimiento es requerida';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (formData.dueDate < today) {
        newErrors.dueDate = 'La fecha no puede ser anterior a hoy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await onSubmit(formData);

      // Reset form if not editing
      if (!initialData) {
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          dueDate: '',
        });
      }

      setErrors({});
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    });
    setErrors({});
    if (onCancel) onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="task-form">
      <div className="form-group">
        <label htmlFor="title">Título *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`form-input ${errors.title ? 'error' : ''}`}
          placeholder="Escribe el título de la tarea"
          disabled={submitting || loading}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`form-input ${errors.description ? 'error' : ''}`}
          placeholder="Describe la tarea en detalle"
          rows="3"
          disabled={submitting || loading}
        />
        {errors.description && (
          <span className="error-text">{errors.description}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="priority">Prioridad</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="form-input"
          disabled={submitting || loading}>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="urgent">Urgente</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Fecha de Vencimiento *</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className={`form-input ${errors.dueDate ? 'error' : ''}`}
          disabled={submitting || loading}
        />
        {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
      </div>

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={submitting || loading}>
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || loading}>
          {submitting
            ? 'Guardando...'
            : initialData
            ? 'Actualizar'
            : 'Crear Tarea'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;

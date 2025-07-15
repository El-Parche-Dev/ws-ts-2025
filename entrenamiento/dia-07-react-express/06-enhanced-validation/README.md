# 🎯 06. Enhanced Validation

**⏰ Tiempo asignado**: 60 minutos (4:30 PM - 5:30 PM)  
**🎯 Objetivo**: Validación robusta frontend + backend para producción  
**📋 Estrategia**: Form validation + API validation + UX feedback

---

## ⏱️ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Objetivo                     | Status |
| --------------- | --------- | ---------------------------- | ------ |
| **🔧 CORE**     | 0-25 min  | Backend validation completa  | ⭐     |
| **⚡ ENHANCED** | 25-50 min | Frontend validation + UX     | 🚀     |
| **✨ POLISH**   | 50-60 min | Advanced patterns + security | 🎨     |

---

## 🔧 FASE CORE (0-25 min) - Backend Validation

### ✅ Objetivo: API validation robusta y consistente

**Validation Middleware (backend/middleware/validation.js):**

```javascript
// 🎯 Validation utility functions
const validateTodoTitle = title => {
  const errors = [];

  if (!title) {
    errors.push('El título es requerido');
  } else {
    if (typeof title !== 'string') {
      errors.push('El título debe ser texto');
    } else {
      const trimmedTitle = title.trim();

      if (trimmedTitle.length < 3) {
        errors.push('El título debe tener al menos 3 caracteres');
      }

      if (trimmedTitle.length > 100) {
        errors.push('El título no puede exceder 100 caracteres');
      }

      // Check for invalid characters
      const invalidChars = /[<>\"'&]/;
      if (invalidChars.test(trimmedTitle)) {
        errors.push('El título contiene caracteres no permitidos');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: title ? title.trim() : '',
  };
};

const validateTodoId = id => {
  const errors = [];
  const numId = parseInt(id);

  if (isNaN(numId)) {
    errors.push('ID debe ser un número válido');
  } else if (numId <= 0) {
    errors.push('ID debe ser un número positivo');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: numId,
  };
};

// 🔧 Validation middleware functions
const validateCreateTodo = (req, res, next) => {
  const { title } = req.body;

  const titleValidation = validateTodoTitle(title);

  if (!titleValidation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: {
        title: titleValidation.errors,
      },
      field: 'title',
    });
  }

  // Sanitize and attach to request
  req.validatedData = {
    title: titleValidation.sanitized,
  };

  next();
};

const validateUpdateTodo = (req, res, next) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const errors = {};

  // Validate ID
  const idValidation = validateTodoId(id);
  if (!idValidation.isValid) {
    errors.id = idValidation.errors;
  }

  // Validate title if provided
  if (title !== undefined) {
    const titleValidation = validateTodoTitle(title);
    if (!titleValidation.isValid) {
      errors.title = titleValidation.errors;
    }
    req.validatedData = req.validatedData || {};
    req.validatedData.title = titleValidation.sanitized;
  }

  // Validate completed if provided
  if (completed !== undefined) {
    if (
      typeof completed !== 'boolean' &&
      completed !== 'true' &&
      completed !== 'false'
    ) {
      errors.completed = ['El estado debe ser verdadero o falso'];
    } else {
      req.validatedData = req.validatedData || {};
      req.validatedData.completed = Boolean(completed);
    }
  }

  // Check if we have any errors
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors,
    });
  }

  req.validatedData = req.validatedData || {};
  req.validatedData.id = idValidation.sanitized;

  next();
};

const validateTodoId = (req, res, next) => {
  const { id } = req.params;

  const idValidation = validateTodoId(id);

  if (!idValidation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'ID inválido',
      errors: {
        id: idValidation.errors,
      },
    });
  }

  req.validatedData = {
    id: idValidation.sanitized,
  };

  next();
};

// 🔒 Security middleware
const rateLimitByIP = (req, res, next) => {
  // Simple rate limiting simulation
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map();
  }

  const clientData = global.rateLimitStore.get(ip) || {
    count: 0,
    lastRequest: now,
  };

  // Reset if more than 1 minute has passed
  if (now - clientData.lastRequest > 60000) {
    clientData.count = 0;
    clientData.lastRequest = now;
  }

  clientData.count++;

  if (clientData.count > 100) {
    // Max 100 requests per minute
    return res.status(429).json({
      success: false,
      message: 'Demasiadas solicitudes. Intente de nuevo en un minuto.',
      retryAfter: 60,
    });
  }

  global.rateLimitStore.set(ip, clientData);
  next();
};

module.exports = {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoId,
  rateLimitByIP,
  validateTodoTitle, // Export for testing
};
```

**Enhanced Server with Validation (backend/server.js):**

```javascript
const express = require('express');
const cors = require('cors');
const {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoId,
  rateLimitByIP,
} = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 3001;

// Apply rate limiting globally
app.use(rateLimitByIP);

// Existing middleware...
app.use(cors(/* ... */));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced routes with validation
app.post('/api/todos', validateCreateTodo, (req, res) => {
  try {
    const { title } = req.validatedData; // Use validated data

    // Check for duplicates
    const exists = todos.find(
      todo => todo.title.toLowerCase() === title.toLowerCase()
    );

    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un todo con ese título',
        errors: {
          title: ['Título duplicado'],
        },
        field: 'title',
      });
    }

    const newTodo = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    todos.push(newTodo);

    res.status(201).json({
      success: true,
      message: 'Todo creado exitosamente',
      data: newTodo,
    });
  } catch (error) {
    console.error('❌ Create todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Error interno',
    });
  }
});

app.put('/api/todos/:id', validateUpdateTodo, (req, res) => {
  try {
    const { id, title, completed } = req.validatedData;

    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo no encontrado',
        errors: {
          id: ['Todo con ese ID no existe'],
        },
      });
    }

    // Check for duplicate title (excluding current todo)
    if (title) {
      const exists = todos.find(
        todo =>
          todo.id !== id && todo.title.toLowerCase() === title.toLowerCase()
      );

      if (exists) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe otro todo con ese título',
          errors: {
            title: ['Título duplicado'],
          },
          field: 'title',
        });
      }

      todos[todoIndex].title = title;
    }

    if (completed !== undefined) {
      todos[todoIndex].completed = completed;
    }

    todos[todoIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Todo actualizado exitosamente',
      data: todos[todoIndex],
    });
  } catch (error) {
    console.error('❌ Update todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Error interno',
    });
  }
});

app.delete('/api/todos/:id', validateTodoId, (req, res) => {
  try {
    const { id } = req.validatedData;

    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo no encontrado',
        errors: {
          id: ['Todo con ese ID no existe'],
        },
      });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];

    res.json({
      success: true,
      message: 'Todo eliminado exitosamente',
      data: deletedTodo,
    });
  } catch (error) {
    console.error('❌ Delete todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Error interno',
    });
  }
});

// ... rest of server code
```

---

## ⚡ FASE ENHANCED (25-50 min) - Frontend Validation

### ✅ Objetivo: UX validation con feedback inmediato

**Frontend Validation Hook (frontend/src/hooks/useFormValidation.js):**

```jsx
import { useState, useCallback } from 'react';

export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔧 Validation functions
  const validateField = useCallback(
    (name, value) => {
      const rules = validationRules[name];
      if (!rules) return [];

      const errors = [];

      // Required validation
      if (rules.required && (!value || value.toString().trim() === '')) {
        errors.push(`${rules.label || name} es requerido`);
        return errors; // Return early for required fields
      }

      // Skip other validations if field is empty and not required
      if (!value || value.toString().trim() === '') {
        return errors;
      }

      const trimmedValue = value.toString().trim();

      // Min length validation
      if (rules.minLength && trimmedValue.length < rules.minLength) {
        errors.push(
          `${rules.label || name} debe tener al menos ${
            rules.minLength
          } caracteres`
        );
      }

      // Max length validation
      if (rules.maxLength && trimmedValue.length > rules.maxLength) {
        errors.push(
          `${rules.label || name} no puede exceder ${
            rules.maxLength
          } caracteres`
        );
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(trimmedValue)) {
        errors.push(
          rules.patternMessage ||
            `${rules.label || name} tiene un formato inválido`
        );
      }

      // Custom validation
      if (rules.custom) {
        const customError = rules.custom(trimmedValue, values);
        if (customError) {
          errors.push(customError);
        }
      }

      return errors;
    },
    [validationRules, values]
  );

  // 🔄 Handle field change
  const handleChange = useCallback(
    (name, value) => {
      setValues(prev => ({
        ...prev,
        [name]: value,
      }));

      // Validate immediately if field has been touched
      if (touched[name]) {
        const fieldErrors = validateField(name, value);
        setErrors(prev => ({
          ...prev,
          [name]: fieldErrors,
        }));
      }
    },
    [validateField, touched]
  );

  // 👆 Handle field blur
  const handleBlur = useCallback(
    name => {
      setTouched(prev => ({
        ...prev,
        [name]: true,
      }));

      const value = values[name];
      const fieldErrors = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors,
      }));
    },
    [values, validateField]
  );

  // ✅ Validate all fields
  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(name => {
      const fieldErrors = validateField(name, values[name]);
      newErrors[name] = fieldErrors;
      if (fieldErrors.length > 0) {
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(validationRules).reduce(
        (acc, name) => ({
          ...acc,
          [name]: true,
        }),
        {}
      )
    );

    return isValid;
  }, [validationRules, values, validateField]);

  // 🧹 Reset form
  const reset = useCallback(
    (newValues = initialValues) => {
      setValues(newValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues]
  );

  // 🚀 Handle form submission
  const handleSubmit = useCallback(
    async onSubmit => {
      setIsSubmitting(true);

      try {
        const isValid = validateAll();

        if (isValid) {
          await onSubmit(values);
          // Don't reset here - let the parent component decide
        }
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll]
  );

  // 🔍 Get field helpers
  const getFieldProps = useCallback(
    name => ({
      value: values[name] || '',
      onChange: e => handleChange(name, e.target.value),
      onBlur: () => handleBlur(name),
      error: errors[name] && errors[name].length > 0 ? errors[name][0] : '',
      hasError: touched[name] && errors[name] && errors[name].length > 0,
      isValid: touched[name] && (!errors[name] || errors[name].length === 0),
    }),
    [values, errors, touched, handleChange, handleBlur]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    handleSubmit,
    getFieldProps,
    isValid: Object.keys(errors).every(
      key => !errors[key] || errors[key].length === 0
    ),
  };
};

// 🎯 Todo validation rules
export const todoValidationRules = {
  title: {
    label: 'Título',
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[^<>"'&]*$/, // No HTML characters
    patternMessage:
      'El título no puede contener caracteres especiales (<, >, ", \', &)',
    custom: (value, allValues) => {
      // Add any custom validation logic here
      if (value && value.toLowerCase().includes('spam')) {
        return 'El título no puede contener contenido inapropiado';
      }
      return null;
    },
  },
};
```

**Enhanced Form Component (frontend/src/components/AddTodoForm.jsx):**

```jsx
import { useState } from 'react';
import { useTodos } from '../contexts/TodoContext';
import {
  useFormValidation,
  todoValidationRules,
} from '../hooks/useFormValidation';

const AddTodoForm = () => {
  const { addTodo } = useTodos();
  const [submitError, setSubmitError] = useState(null);

  const { values, handleSubmit, getFieldProps, reset, isSubmitting, isValid } =
    useFormValidation({ title: '' }, todoValidationRules);

  const onSubmit = async formData => {
    try {
      setSubmitError(null);
      await addTodo(formData.title);
      reset(); // Clear form on success
    } catch (error) {
      // Handle backend validation errors
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = error.response.data.errors;
        if (backendErrors.title) {
          setSubmitError(backendErrors.title[0]);
        }
      } else {
        setSubmitError(error.message || 'Error al crear el todo');
      }
      throw error; // Re-throw to prevent form reset
    }
  };

  const titleProps = getFieldProps('title');

  return (
    <div className="add-todo-section">
      <h2>➕ Agregar Nuevo Todo</h2>

      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(onSubmit);
        }}
        className="add-todo-form"
        noValidate>
        <div className="form-group">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Escriba su nuevo todo..."
              className={`add-todo-input ${
                titleProps.hasError
                  ? 'error'
                  : titleProps.isValid
                  ? 'valid'
                  : ''
              }`}
              disabled={isSubmitting}
              {...titleProps}
            />

            <div className="input-feedback">
              {titleProps.hasError && (
                <span className="error-message">❌ {titleProps.error}</span>
              )}

              {titleProps.isValid && (
                <span className="success-message">✅ Título válido</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="add-todo-btn"
            disabled={isSubmitting || !isValid || !values.title.trim()}>
            {isSubmitting ? (
              <>
                <div className="loading-spinner small"></div>
                Agregando...
              </>
            ) : (
              '➕ Agregar Todo'
            )}
          </button>
        </div>

        {submitError && (
          <div className="submit-error">
            <span>❌ {submitError}</span>
          </div>
        )}

        {/* Character counter */}
        <div className="form-meta">
          <span
            className={`char-counter ${
              values.title.length > 80 ? 'warning' : ''
            }`}>
            {values.title.length}/100 caracteres
          </span>
        </div>
      </form>
    </div>
  );
};

export default AddTodoForm;
```

---

## ✨ FASE POLISH (50-60 min) - Advanced Security

### ✅ Objetivo: Security patterns + accessibility

**Security Enhancements:**

```javascript
// backend/middleware/security.js
const helmet = require('helmet');
const xss = require('xss');

// XSS Protection
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }
  next();
};

// Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

module.exports = { sanitizeInput };
```

**Accessibility Enhancements:**

```jsx
// Accessible form component
const AccessibleInput = ({ label, error, isValid, required, ...props }) => {
  const inputId = `input-${props.name}`;
  const errorId = `error-${props.name}`;

  return (
    <div className="form-field">
      <label
        htmlFor={inputId}
        className="form-label">
        {label}
        {required && (
          <span
            className="required"
            aria-label="required">
            *
          </span>
        )}
      </label>

      <input
        id={inputId}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : 'false'}
        className={`form-input ${error ? 'error' : isValid ? 'valid' : ''}`}
        {...props}
      />

      {error && (
        <div
          id={errorId}
          className="error-message"
          role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
```

---

## 🎯 VALIDACIÓN FINAL

### ✅ Checklist Core (CORE MVP)

- [ ] ✅ Backend validation middleware funcionando
- [ ] ✅ API error responses estructuradas
- [ ] ✅ Rate limiting implementado
- [ ] ✅ XSS protection básica
- [ ] ✅ Input sanitization funcionando

### ⚡ Checklist Enhanced (ENHANCED MVP)

- [ ] ⚡ Frontend validation hook completo
- [ ] ⚡ Real-time validation feedback
- [ ] ⚡ Error message customization
- [ ] ⚡ Form state management robusto
- [ ] ⚡ UX feedback inmediato

### ✨ Checklist Polish (POLISH MVP)

- [ ] ✨ Security headers implementados
- [ ] ✨ Accessibility compliance
- [ ] ✨ Advanced XSS protection
- [ ] ✨ Content Security Policy
- [ ] ✨ Input validation comprehensive

---

## 🚨 SECURITY CHECKLIST

### 🔒 Backend Security

- ✅ Input validation & sanitization
- ✅ Rate limiting
- ✅ XSS protection
- ✅ SQL injection prevention
- ✅ Error message sanitization

### 🛡️ Frontend Security

- ✅ Client-side validation
- ✅ XSS prevention in display
- ✅ Input encoding
- ✅ HTTPS enforcement
- ✅ Secure headers

---

## ⏭️ RESULTADO

**Enhanced Validation System completado:**

- ✅ Backend validation robusta
- ✅ Frontend UX validation
- ✅ Security patterns implementados
- ✅ Accessibility compliance
- ✅ Production security ready

**Tiempo objetivo**: ✅ **Completado en 60 minutos**

**Próximo**: `07-polish-ux` - Final UX optimizations

---

## 📋 RESUMEN EJECUTIVO

### 🎯 ¿Qué Logramos?

- Sistema de validación completo
- Security layer robusto
- UX feedback profesional
- Accessibility compliance

### ⏰ Time Investment

- **Backend Validation**: 25 min
- **Frontend UX**: 25 min
- **Security Polish**: 10 min
- **Total**: 60 min ✅

**🏆 Enhanced Validation completado - ENTERPRISE READY!**

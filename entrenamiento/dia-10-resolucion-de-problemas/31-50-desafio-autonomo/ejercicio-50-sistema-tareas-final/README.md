# 🧩 Ejercicio 50: Sistema de Gestión de Tareas (Final Challenge)

## ⏱️ **Tiempo límite: 25 minutos**

## 🎯 **Nivel: 🏆 Experto (WorldSkills Final Challenge)**

### **Problema**

Implementa un sistema completo de gestión de tareas con las siguientes funcionalidades:

### **Funcionalidades Requeridas**

```javascript
// 1. Crear tarea
crearTarea(titulo, descripcion, prioridad, fechaLimite);

// 2. Listar tareas con filtros
listarTareas((filtros = { estado, prioridad, fecha }));

// 3. Actualizar tarea
actualizarTarea(id, cambios);

// 4. Marcar como completada
completarTarea(id);

// 5. Eliminar tarea
eliminarTarea(id);

// 6. Estadísticas
obtenerEstadisticas();

// 7. Buscar tareas
buscarTareas(termino);

// 8. Ordenar por criterios
ordenarTareas(criterio, direccion);
```

### **Estructura de Datos**

```javascript
{
  id: uuid(),
  titulo: "string",
  descripcion: "string",
  prioridad: "alta|media|baja",
  estado: "pendiente|en_progreso|completada",
  fechaCreacion: Date,
  fechaLimite: Date,
  fechaCompletada: Date | null
}
```

### **Características Avanzadas**

- **Validación completa** de datos
- **Persistencia** en localStorage
- **Búsqueda avanzada** con múltiples criterios
- **Ordenamiento dinámico**
- **Estadísticas** y métricas
- **Exportar/Importar** datos
- **Undo/Redo** operaciones

### **Criterios de Evaluación WorldSkills**

1. **Arquitectura (25%)**

   - Código modular y reutilizable
   - Separación de responsabilidades
   - Patrones de diseño aplicados

2. **Funcionalidad (30%)**

   - Todas las operaciones CRUD
   - Filtros y búsquedas funcionando
   - Validaciones robustas

3. **Calidad de Código (25%)**

   - Código limpio y legible
   - Manejo de errores
   - Testing comprensivo

4. **Características Avanzadas (20%)**
   - Persistencia
   - Performance
   - Características bonus

### **Entregables**

1. **sistema-tareas.js** - Implementación principal
2. **tests/** - Suite de tests completa
3. **demo.html** - Demostración funcional
4. **README.md** - Documentación técnica
5. **analisis-performance.md** - Análisis de rendimiento

### **Tiempo Recomendado por Fase**

- **Setup y estructura** (5 min)
- **CRUD básico** (8 min)
- **Filtros y búsqueda** (5 min)
- **Persistencia** (3 min)
- **Testing y validación** (4 min)

### **¡Este es tu examen final! 🏆**

Demuestra todo lo aprendido en este desafío integral que simula un escenario real de WorldSkills.

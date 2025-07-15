# 🗄️ Día 9: Laravel Models + SQLite - Database + Eloquent Básico

## 🎯 ENFOQUE: Database + Eloquent Básico

**Fecha:** 23 Julio 2025  
**Duración:** 6 horas EXACTAS (12:00 PM - 6:00 PM)  
**Modalidad:** Entrenamiento intensivo WorldSkills  
**Metodología:** MVP Timeboxing Estricto

## 📋 Cronograma del Día (12:00-18:00)

Continuación directa del **Día 8 (Laravel Setup)** enfocándose en la capa de datos que será crítica para el **Día 2 de la competencia WorldSkills 2025** (29 julio).

### **🎯 Meta Principal**

Dominar Eloquent ORM, SQLite, migrations y relaciones básicas para crear un sistema de productos completo y funcional.

## ⏱️ **CRONOGRAMA EJECUTABLE (6 horas NETAS)**

### **12:00-12:30 | Setup SQLite + Configuration (30min)**

**📂 `/01-sqlite-setup-config/`**

| Tiempo      | Fase         | Actividad                         | Entregable         |
| ----------- | ------------ | --------------------------------- | ------------------ |
| 12:00-12:10 | **CORE**     | SQLite installation + .env config | Database conectada |
| 12:10-12:20 | **ENHANCED** | Database path + permissions       | Config optimizada  |
| 12:20-12:30 | **POLISH**   | Backup strategy + tools           | Setup completo     |

### **12:30-13:30 | Migrations + Models Básicos (60min)**

**📂 `/02-migrations-models-basicos/`**

| Tiempo      | Fase         | Actividad                      | Entregable      |
| ----------- | ------------ | ------------------------------ | --------------- |
| 12:30-12:50 | **CORE**     | Primera migration + model      | Productos table |
| 12:50-13:10 | **ENHANCED** | Campos avanzados + constraints | Schema completo |
| 13:10-13:30 | **POLISH**   | Seeders + factories            | Data de prueba  |

### **13:30-13:45 | ☕ DESCANSO (15min)**

### **13:45-14:45 | Eloquent CRUD Operations (60min)**

**📂 `/03-eloquent-crud-operations/`**

| Tiempo      | Fase         | Actividad                     | Entregable        |
| ----------- | ------------ | ----------------------------- | ----------------- |
| 13:45-14:05 | **CORE**     | Create, Read, Update, Delete  | CRUD básico       |
| 14:05-14:25 | **ENHANCED** | Query Builder + where clauses | Queries avanzadas |
| 14:25-14:45 | **POLISH**   | Scopes + accessors/mutators   | Eloquent avanzado |

### **14:45-15:15 | Relationships Básicas (30min)**

**📂 `/04-relationships-basicas/`**

| Tiempo      | Fase         | Actividad                   | Entregable             |
| ----------- | ------------ | --------------------------- | ---------------------- |
| 14:45-14:55 | **CORE**     | hasMany + belongsTo         | Relaciones funcionando |
| 14:55-15:05 | **ENHANCED** | Eager loading + with()      | Performance optimizado |
| 15:05-15:15 | **POLISH**   | Pivot tables + many-to-many | Relaciones complejas   |

### **15:15-15:30 | ☕ DESCANSO (15min)**

### **15:30-16:30 | 🎯 MVP: Products Model + CRUD (60min)**

**📂 `/05-mvp-products-crud/`**

| Tiempo      | Fase         | Actividad                  | Entregable    |
| ----------- | ------------ | -------------------------- | ------------- |
| 15:30-15:50 | **CORE**     | Product model + controller | CRUD completo |
| 15:50-16:10 | **ENHANCED** | Blade views + forms        | UI funcional  |
| 16:10-16:30 | **POLISH**   | Search + pagination        | UX optimizada |

### **16:30-17:30 | 🏆 Enhanced: Form Validation (60min)**

**📂 `/06-enhanced-form-validation/`**

| Tiempo      | Fase         | Actividad                 | Entregable        |
| ----------- | ------------ | ------------------------- | ----------------- |
| 16:30-16:50 | **CORE**     | Request validation rules  | Validación básica |
| 16:50-17:10 | **ENHANCED** | Custom error messages     | UX mejorada       |
| 17:10-17:30 | **POLISH**   | Image upload + validation | Uploads seguros   |

### **17:30-18:00 | ⚡ Polish: Error Handling (30min)**

**📂 `/07-polish-error-handling/`**

| Tiempo      | Fase         | Actividad                | Entregable        |
| ----------- | ------------ | ------------------------ | ----------------- |
| 17:30-17:40 | **CORE**     | Try-catch + logging      | Errores manejados |
| 17:40-17:50 | **ENHANCED** | Custom exception pages   | UX profesional    |
| 17:50-18:00 | **POLISH**   | Debug tools + monitoring | Sistema robusto   |

## 📊 **DISTRIBUCIÓN MVP REALISTA**

### **Tiempo por Fase (Total 5h 45min efectivas)**

| Fase            | Tiempo Total | Porcentaje | Descripción                 |
| --------------- | ------------ | ---------- | --------------------------- |
| **🔧 CORE**     | 2h 30min     | 43%        | Database funcionando SÓLIDO |
| **⚡ ENHANCED** | 2h 00min     | 35%        | Features importantes        |
| **✨ POLISH**   | 1h 15min     | 22%        | Optimización final          |

## 🎯 **COMPETENCIAS WORLDSKILLS DESARROLLADAS**

### **Backend Development (Día 2 Competencia)**

✅ **Database Design:** Migrations, schema, constraints  
✅ **ORM Mastery:** Eloquent models, relationships, queries  
✅ **Data Validation:** Form requests, custom rules  
✅ **Error Handling:** Exception management, logging

### **Full-Stack Integration**

✅ **CRUD Operations:** Complete data lifecycle  
✅ **Form Handling:** Validation, sanitization, security  
✅ **File Uploads:** Images, validation, storage  
✅ **Search & Pagination:** Performance optimization

## 📚 **TECNOLOGÍAS A IMPLEMENTAR**

### **🗄️ Database Stack**

- **SQLite** database engine
- **Laravel Migrations** para schema
- **Eloquent ORM** para queries
- **Seeders & Factories** para testing data

### **🏗️ Backend Architecture**

- **Model-View-Controller** separation
- **Request Validation** classes
- **Resource Controllers** RESTful
- **Exception Handling** profesional

### **🎨 Frontend Integration**

- **Blade Templates** con forms
- **Bootstrap 5** UI framework
- **File Upload** components
- **Search & Filter** interfaces

## ✅ **ENTREGABLES CONCRETOS DEL DÍA**

### **Archivos Mínimos Requeridos:**

```
dia-09-laravel-models-sqlite/
├── 01-sqlite-setup-config/
│   ├── README.md
│   ├── .env.example
│   └── config-database.php
├── 02-migrations-models-basicos/
│   ├── README.md
│   ├── create_productos_table.php
│   ├── Producto.php
│   └── ProductoSeeder.php
├── 03-eloquent-crud-operations/
│   ├── README.md
│   ├── ProductoController.php
│   └── eloquent-examples.php
├── 04-relationships-basicas/
│   ├── README.md
│   ├── Categoria.php
│   ├── create_categorias_table.php
│   └── relationships-demo.php
├── 05-mvp-products-crud/
│   ├── README.md
│   ├── ProductoController.php
│   ├── productos/
│   │   ├── index.blade.php
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── show.blade.php
│   └── web.php (routes)
├── 06-enhanced-form-validation/
│   ├── README.md
│   ├── ProductoRequest.php
│   ├── upload-handler.php
│   └── validation-examples.php
└── 07-polish-error-handling/
    ├── README.md
    ├── Handler.php
    ├── error-pages/
    └── logging-config.php
```

### **Checklist Final MVP:**

#### **🔧 CORE (Obligatorio - 60% mínimo)**

- [ ] SQLite configurado y conectado
- [ ] Migration de productos creada y ejecutada
- [ ] Model Producto con CRUD básico
- [ ] Controller con métodos index, create, store, show, edit, update, destroy

#### **⚡ ENHANCED (Deseable - 80% para aprobar)**

- [ ] Relación Producto-Categoria funcionando
- [ ] Validación de forms con Request classes
- [ ] Blade views completas con Bootstrap
- [ ] Search y pagination implementados

#### **✨ POLISH (Excelencia - 100% para competencia)**

- [ ] Upload de imágenes seguro
- [ ] Error handling profesional
- [ ] Logging y debugging tools
- [ ] Performance optimizado con eager loading

## 🏆 **CRITERIOS DE EVALUACIÓN REALISTAS**

### **Por Bloque (14.3% cada uno):**

1. **SQLite Setup**: Configuración correcta + conexión
2. **Migrations/Models**: Schema válido + model funcional
3. **Eloquent CRUD**: Operaciones básicas sin errores
4. **Relationships**: Relaciones funcionando
5. **MVP Products**: CRUD completo con UI
6. **Form Validation**: Validación robusta
7. **Error Handling**: Manejo profesional de errores

### **Umbral de Aprobación:**

- **CORE completado (60%)**: APROBADO - Listo para competencia básica
- **ENHANCED completado (80%)**: BUENO - Competencia intermedia
- **POLISH completado (100%)**: EXCELENTE - Competencia avanzada

## 🛠️ **HERRAMIENTAS NECESARIAS**

### **Software Required:**

- PHP 8.2+ con extensiones SQLite
- Composer instalado globalmente
- Laravel proyecto del Día 8
- VS Code con extensiones PHP/Laravel
- SQLite Browser (opcional para debug)

### **Extensiones VS Code Útiles:**

- Laravel Extension Pack
- PHP Intelephense
- Laravel Blade Snippets
- SQLite Viewer

## 🔧 **METODOLOGÍA DE TRABAJO**

### **Regla de Oro: "Database First, UI Second"**

1. **CORE**: Hacer que la data funcione (sin errores de DB)
2. **ENHANCED**: Hacer que la UI funcione bien (forms + validation)
3. **POLISH**: Hacer que funcione perfecto (performance + UX)

### **Gestión de Tiempo Estricta:**

- ⏰ **Timer visible**: Cada bloque tiene tiempo fijo NO NEGOCIABLE
- 🚨 **Alertas**: 5 min antes del final de cada fase
- 📊 **Checkpoint**: Evaluación cada 30 min para ajustar ritmo
- 🔴 **Stop Rule**: Si CORE no funciona, NO avanzar a ENHANCED

## 📝 **PREPARACIÓN PARA DÍA 10**

### **Pre-requisitos verificados:**

- [ ] SQLite + Laravel funcionando perfectamente
- [ ] Modelo Producto con CRUD completo
- [ ] Relaciones básicas implementadas
- [ ] Validación de forms operativa

### **Día 10 Preview:**

- **Laravel API + JSON** para hacer el backend accessible
- **Resource Controllers** para endpoints RESTful
- **API Testing** con Postman/Thunder Client
- **CORS + Middleware** para frontend integration

## 🚨 **REGLAS ANTI-PROCRASTINACIÓN**

### **Timeboxing Estricto:**

- ❌ **NO EXTEND HORARIO** - 6 horas máximo
- ❌ **NO PERFECCIONISMO** en fase CORE
- ❌ **NO FEATURE CREEP** - seguir cronograma exacto
- ✅ **SÍ DOCUMENTAR** problemas para revisión posterior

### **Señales de Alerta para Instructor:**

- 🔴 **Más del 50% atrasado en CORE**: Reducir scope inmediatamente
- 🟡 **Database no conecta**: Prioridad 1 - detener todo hasta resolver
- 🟢 **Grupo muy avanzado**: Agregar challenges de relationships complejas

---

**🎯 Filosofía del Día**: Mejor tener **1 CRUD perfecto** que 5 CRUDs con errores.

**⏱️ Reality Check**: Database es FUNDACIÓN - Si no funciona aquí, Día 10 será imposible.

**🏆 Objetivo Final**: Tener un sistema de productos completamente funcional que sirva de base para la API del Día 10 y la competencia final.

# 🎯 Mini-Proyecto Final | 20 minutos

## 🚀 OBJETIVO: App React completa integrando todo lo aprendido

**TIMEBOXING**: 20 minutos exactos  
**RESULTADO**: Contact Manager App funcional y completa

---

## ⏰ Cronograma Sección 5

| Tarea                       | Tiempo | Estado |
| --------------------------- | ------ | ------ |
| **Setup y estructura**      | 5 min  | ⏳     |
| **Componentes principales** | 10 min | ⏳     |
| **Integración final**       | 3 min  | ⏳     |
| **Testing y validación**    | 2 min  | ⏳     |

---

## 🎯 PROYECTO: Contact Manager

### 📋 Especificaciones:

**Funcionalidades Core**:

- ✅ Agregar nuevo contacto
- ✅ Listar todos los contactos
- ✅ Editar contacto existente
- ✅ Eliminar contacto
- ✅ Búsqueda en tiempo real
- ✅ Persistencia con localStorage

**Tecnologías integradas**:

- ✅ Componentes funcionales
- ✅ Props y composición
- ✅ useState para estado local
- ✅ useEffect para side effects
- ✅ Custom hook para localStorage
- ✅ Formularios controlados
- ✅ Event handling

---

## 🚀 FASE CORE (15 min) - App Funcional

### 🏗️ Paso 1: Estructura Principal (5 min)

**Crear**: `src/components/ContactManager.jsx`

```jsx
// 🎯 MINI-PROYECTO FINAL: Contact Manager integrado
import { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

function ContactManager() {
  // Estado principal con custom hook para persistencia
  const [contacts, setContacts] = useLocalStorage('contacts', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'personal',
  });

  // Filtrar contactos basado en búsqueda
  const filteredContacts = contacts.filter(
    contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Limpiar formulario
  const clearForm = () => {
    setFormData({ name: '', email: '', phone: '', category: 'personal' });
    setEditingId(null);
  };

  // Manejar envío del formulario
  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Nombre y email son requeridos');
      return;
    }

    if (editingId) {
      // Editar contacto existente
      setContacts(
        contacts.map(contact =>
          contact.id === editingId ? { ...contact, ...formData } : contact
        )
      );
    } else {
      // Agregar nuevo contacto
      const newContact = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toLocaleDateString(),
      };
      setContacts([...contacts, newContact]);
    }

    clearForm();
  };

  // Editar contacto
  const handleEdit = contact => {
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      category: contact.category,
    });
    setEditingId(contact.id);
  };

  // Eliminar contacto
  const handleDelete = id => {
    if (window.confirm('¿Estás seguro de eliminar este contacto?')) {
      setContacts(contacts.filter(contact => contact.id !== id));
    }
  };

  // Manejar cambios en inputs
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="contact-manager">
      <header className="manager-header">
        <h2>📱 Contact Manager</h2>
        <p>Total contactos: {contacts.length}</p>
      </header>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Buscar contactos..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="manager-content">
        {/* Formulario */}
        <div className="contact-form-section">
          <h3>{editingId ? '✏️ Editar Contacto' : '➕ Nuevo Contacto'}</h3>

          <form
            onSubmit={handleSubmit}
            className="contact-form">
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="email@ejemplo.com"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>

            <div className="form-row">
              <input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={handleInputChange}
                className="input"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input">
                <option value="personal">👤 Personal</option>
                <option value="trabajo">💼 Trabajo</option>
                <option value="familia">👨‍👩‍👧‍👦 Familia</option>
                <option value="emergencia">🚨 Emergencia</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn primary">
                {editingId ? '💾 Actualizar' : '➕ Agregar'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="btn secondary">
                  ❌ Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de contactos */}
        <div className="contacts-section">
          <h3>📋 Lista de Contactos ({filteredContacts.length})</h3>

          {filteredContacts.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? (
                <p>🔍 No se encontraron contactos para "{searchTerm}"</p>
              ) : (
                <p>📭 No hay contactos. ¡Agrega el primero!</p>
              )}
            </div>
          ) : (
            <div className="contacts-list">
              {filteredContacts.map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente hijo para cada contacto
function ContactCard({ contact, onEdit, onDelete }) {
  const getCategoryIcon = category => {
    const icons = {
      personal: '👤',
      trabajo: '💼',
      familia: '👨‍👩‍👧‍👦',
      emergencia: '🚨',
    };
    return icons[category] || '👤';
  };

  return (
    <div className="contact-card">
      <div className="contact-info">
        <div className="contact-header">
          <h4>{contact.name}</h4>
          <span className="category">
            {getCategoryIcon(contact.category)} {contact.category}
          </span>
        </div>

        <div className="contact-details">
          <p>📧 {contact.email}</p>
          {contact.phone && <p>📞 {contact.phone}</p>}
          <p className="created-date">📅 {contact.createdAt}</p>
        </div>
      </div>

      <div className="contact-actions">
        <button
          onClick={() => onEdit(contact)}
          className="btn small secondary">
          ✏️
        </button>

        <button
          onClick={() => onDelete(contact.id)}
          className="btn small danger">
          🗑️
        </button>
      </div>
    </div>
  );
}

export default ContactManager;
```

---

## ⚡ FASE ENHANCED (3 min) - Estilos y UX

### 🎨 Estilos para Contact Manager

**Agregar a** `src/index.css`:

```css
/* Contact Manager Styles */
.contact-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.manager-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.search-bar {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid #ddd;
  border-radius: 25px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  border-color: #4caf50;
}

.manager-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .manager-content {
    grid-template-columns: 1fr;
  }
}

/* Form Section */
.contact-form-section {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.contact-form-section h3 {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.form-actions .btn {
  flex: 1;
}

/* Contacts Section */
.contacts-section {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.contacts-section h3 {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 500px;
  overflow-y: auto;
}

/* Contact Card */
.contact-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.contact-info {
  flex: 1;
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.contact-header h4 {
  margin: 0;
  color: #333;
}

.category {
  background: #e0f2e0;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #2e7d2e;
}

.contact-details {
  font-size: 0.9rem;
  color: #666;
}

.contact-details p {
  margin: 0.2rem 0;
}

.created-date {
  color: #999;
  font-size: 0.8rem;
}

.contact-actions {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1.1rem;
}

/* Button refinements */
.btn.small {
  padding: 0.5rem;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## ✨ FASE POLISH (2 min) - App Final

### 🔄 Actualizar App Principal

**Modificar** `src/App.jsx`:

```jsx
import ContactManager from './components/ContactManager';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🚀 React Fundamentals</h1>
        <p>WorldSkills 2025 - Mini Proyecto Final</p>
      </header>

      <main>
        <ContactManager />
      </main>

      <footer className="app-footer">
        <p>✅ React Fundamentals completado en 120 minutos</p>
      </footer>
    </div>
  );
}

export default App;
```

**Agregar footer a** `src/index.css`:

```css
.app-footer {
  text-align: center;
  padding: 2rem;
  background: white;
  margin-top: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  color: #666;
}
```

---

## ✅ VALIDACIÓN FINAL (2 min)

### 🧪 Checklist Completo

**Funcionalidades**:

- [ ] ✅ Agregar contacto nuevo
- [ ] ✅ Editar contacto existente
- [ ] ✅ Eliminar contacto con confirmación
- [ ] ✅ Buscar contactos en tiempo real
- [ ] ✅ Persistencia con localStorage
- [ ] ✅ Categorías de contactos
- [ ] ✅ Responsive design

**Tecnologías React**:

- [ ] ✅ Componentes funcionales
- [ ] ✅ Props y composición
- [ ] ✅ useState para estado
- [ ] ✅ useEffect para effects
- [ ] ✅ Custom hooks
- [ ] ✅ Event handling
- [ ] ✅ Formularios controlados
- [ ] ✅ Renderizado condicional

---

## 🎯 COMPETENCIAS DESARROLLADAS

### ✅ React Core

1. **Componentes** - Funcionales, composición, props
2. **Estado** - useState, estado complejo, inmutabilidad
3. **Efectos** - useEffect, cleanup, dependencies
4. **Hooks** - useState, useEffect, custom hooks
5. **Formularios** - Controlled inputs, validation
6. **Events** - onClick, onChange, onSubmit

### ✅ Patrones WorldSkills

1. **CRUD Operations** - Create, Read, Update, Delete
2. **Search/Filter** - Real-time filtering
3. **Data Persistence** - localStorage integration
4. **Form Validation** - User input validation
5. **Responsive Design** - Mobile-first approach
6. **Component Architecture** - Modular, reusable

### ✅ Preparación Competencia

1. **Velocidad** - App completa en 20 minutos
2. **Calidad** - Sin errores, funcional al 100%
3. **UX** - Interfaz intuitiva y responsive
4. **Code Quality** - Clean, commented, organized

---

## 🏆 RESULTADO FINAL

Al completar este mini-proyecto, habrás desarrollado:

1. ✅ **App React completa** con todas las funcionalidades
2. ✅ **Dominio de hooks básicos** useState y useEffect
3. ✅ **Manejo de formularios** controlados con validación
4. ✅ **Persistencia de datos** con localStorage
5. ✅ **Arquitectura componentes** modular y escalable
6. ✅ **Velocidad de desarrollo** competitiva

---

## 🎯 PRÓXIMOS PASOS

### Después de los 120 minutos:

1. **Practicar** recreando app desde cero
2. **Extender** con nuevas funcionalidades
3. **Integrar** con APIs reales
4. **Preparar** para días avanzados de React

---

**⏰ TIEMPO LÍMITE: 20 MINUTOS**  
**🎯 ¡DEMUESTRA TU DOMINIO REACT COMPLETO!**

---

## 🎉 ¡FELICITACIONES!

**Has completado React Fundamentals en 120 minutos exactos**

✅ **Setup completo** con Vite  
✅ **JSX y componentes** dominados  
✅ **Props y state** implementados  
✅ **Hooks básicos** funcionando  
✅ **App completa** desarrollada

**¡Estás listo para desafíos React más avanzados en WorldSkills 2025!** 🚀🏆

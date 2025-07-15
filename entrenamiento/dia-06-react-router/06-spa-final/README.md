# 🚀 Sección 6: SPA Final - Proyecto Integrador (30 min)

**⏰ TIEMPO**: 5:30 PM - 6:00 PM  
**🎯 OBJETIVO**: Integrar todo el aprendizaje en SPA completa

## ⚡ TIMEBOXING INTENSIVO (30 min)

| Fase            | Tiempo    | Actividad                    |
| --------------- | --------- | ---------------------------- |
| 🔧 **CORE**     | 0-15 min  | Estructura base + navegación |
| ⚡ **ENHANCED** | 15-25 min | Features integradas          |
| ✨ **POLISH**   | 25-30 min | Testing final + demo         |

## 🚀 PROYECTO FINAL: E-COMMERCE SPA

### 🔧 FASE CORE (15 min) - BASE FUNCIONAL

```jsx
// src/App.jsx - Aplicación completa
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas */}
            <Route
              path="/"
              element={<MainLayout />}>
              <Route
                index
                element={<Home />}
              />
              <Route
                path="productos"
                element={<Productos />}
              />
              <Route
                path="producto/:id"
                element={<ProductoDetalle />}
              />
              <Route
                path="carrito"
                element={<Carrito />}
              />
            </Route>

            {/* Auth */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* Rutas protegidas */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }>
              <Route
                index
                element={<Dashboard />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
```

### ⚡ FASE ENHANCED (10 min) - FEATURES INTEGRADAS

```jsx
// src/context/CartContext.jsx
import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        item => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, cantidad: 1 }],
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  const addToCart = product => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeFromCart = productId => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const getTotal = () => {
    return cart.items.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
```

```jsx
// src/pages/Productos.jsx - Lista con carrito
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const mockProducts = [
  { id: 1, nombre: 'Laptop Gaming', precio: 1299.99 },
  { id: 2, nombre: 'Mouse Inalámbrico', precio: 29.99 },
  { id: 3, nombre: 'Teclado Mecánico', precio: 89.99 },
];

export default function Productos() {
  const { addToCart } = useCart();

  return (
    <div className="productos-page">
      <h1>📦 Nuestros Productos</h1>

      <div className="productos-grid">
        {mockProducts.map(producto => (
          <div
            key={producto.id}
            className="producto-card">
            <h3>{producto.nombre}</h3>
            <p>${producto.precio}</p>

            <div className="card-actions">
              <Link
                to={`/producto/${producto.id}`}
                className="btn-secondary">
                Ver Detalles
              </Link>
              <button
                onClick={() => addToCart(producto)}
                className="btn-primary">
                🛒 Agregar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### ✨ FASE POLISH (5 min) - TESTING Y DEMO

```jsx
// src/components/CartBadge.jsx - Badge del carrito
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartBadge() {
  const { cart } = useCart();
  const itemCount = cart.items.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  return (
    <Link
      to="/carrito"
      className="cart-badge">
      🛒 Carrito
      {itemCount > 0 && <span className="badge-count">{itemCount}</span>}
    </Link>
  );
}
```

## 🏆 FUNCIONALIDADES IMPLEMENTADAS

### ✅ **Router Completo**

- ✅ Navegación entre 5+ páginas
- ✅ Rutas dinámicas con parámetros
- ✅ Rutas protegidas con autenticación
- ✅ Layouts anidados (público + dashboard)

### ✅ **Estado Global**

- ✅ AuthContext para autenticación
- ✅ CartContext para carrito de compras
- ✅ Persistencia con localStorage

### ✅ **UX Profesional**

- ✅ Navegación activa con NavLink
- ✅ Loading states y error handling
- ✅ Breadcrumbs automáticos
- ✅ Responsive design

### ✅ **E-commerce Features**

- ✅ Catálogo de productos
- ✅ Detalle de producto individual
- ✅ Carrito de compras funcional
- ✅ Dashboard administrativo

## 🧪 TESTING FINAL (5 min)

### Checklist Demo:

1. **Navegación**: Probar todas las rutas y links
2. **Autenticación**: Login/logout funcionando
3. **Carrito**: Agregar/quitar productos
4. **Responsive**: Verificar en móvil
5. **Performance**: Sin errores en consola

### Demo Script:

1. Mostrar homepage y navegación
2. Agregar productos al carrito
3. Hacer login y acceder a dashboard
4. Demostrar rutas protegidas
5. Verificar responsive design

## 🎯 RESULTADO FINAL

**Al final de 6 horas exactas:**

- ✅ **SPA E-commerce completa** y funcional
- ✅ **React Router v6** implementado profesionalmente
- ✅ **Autenticación** y rutas protegidas
- ✅ **Estado global** con Context API
- ✅ **UX nivel WorldSkills** lista para competencia

## 🏆 COMPETENCIA WORLDSKILLS READY

**Esta SPA demuestra:**

- ⚡ **Velocidad de desarrollo** optimizada
- 🎯 **Calidad profesional** sin errores
- 📱 **Responsive design** mobile-first
- 🚀 **Patrones modernos** React + Router
- 🔒 **Seguridad** con rutas protegidas

---

**🎉 ¡FELICITACIONES! Has completado el Día 6 - React Router Mastery 🏆**

**Próximo**: Día 7 - Express.js Fundamentos

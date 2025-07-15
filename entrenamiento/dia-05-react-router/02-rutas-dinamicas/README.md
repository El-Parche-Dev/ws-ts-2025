# ⚡ Sección 2: Rutas Dinámicas (60 min)

**⏰ TIEMPO**: 1:00 PM - 2:00 PM  
**🎯 OBJETIVO**: useParams, rutas dinámicas y carga de datos

## ⚡ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Actividad                    |
| --------------- | --------- | ---------------------------- |
| 🔧 **CORE**     | 0-25 min  | useParams básico funcionando |
| ⚡ **ENHANCED** | 25-45 min | Data loading y validación    |
| ✨ **POLISH**   | 45-60 min | Error handling y UX          |

## 🚀 IMPLEMENTACIÓN RÁPIDA

### 🔧 FASE CORE (25 min) - USEPARAMS FUNCIONANDO

```jsx
// Agregar rutas dinámicas en App.jsx
<Routes>
  <Route
    path="/"
    element={<Home />}
  />
  <Route
    path="/productos"
    element={<Productos />}
  />
  <Route
    path="/producto/:id"
    element={<ProductoDetalle />}
  />
  <Route
    path="/categoria/:categoria"
    element={<Categoria />}
  />
  <Route
    path="*"
    element={<NotFound />}
  />
</Routes>
```

```jsx
// src/pages/Productos.jsx
import { Link } from 'react-router-dom';

const productos = [
  { id: 1, nombre: 'Laptop Gaming', precio: 1200 },
  { id: 2, nombre: 'Mouse Inalámbrico', precio: 25 },
  { id: 3, nombre: 'Teclado Mecánico', precio: 80 },
];

export default function Productos() {
  return (
    <div>
      <h1>📦 Lista de Productos</h1>

      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {productos.map(producto => (
          <div
            key={producto.id}
            style={{
              border: '1px solid #ddd',
              padding: '1rem',
              borderRadius: '8px',
            }}>
            <h3>{producto.nombre}</h3>
            <p>Precio: ${producto.precio}</p>
            <Link
              to={`/producto/${producto.id}`}
              style={{
                background: '#007bff',
                color: 'white',
                padding: '0.5rem 1rem',
                textDecoration: 'none',
                borderRadius: '4px',
              }}>
              Ver Detalles
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
```

```jsx
// src/pages/ProductoDetalle.jsx
import { useParams, Link } from 'react-router-dom';

export default function ProductoDetalle() {
  const { id } = useParams();

  return (
    <div>
      <Link
        to="/productos"
        style={{ color: '#007bff', marginBottom: '1rem', display: 'block' }}>
        ← Volver a Productos
      </Link>

      <h1>📦 Producto #{id}</h1>
      <p>Mostrando detalles del producto con ID: {id}</p>

      <div
        style={{
          border: '1px solid #ddd',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '2rem',
        }}>
        <h3>Información del Producto</h3>
        <p>
          <strong>ID:</strong> {id}
        </p>
        <p>
          <strong>Nombre:</strong> Producto {id}
        </p>
        <p>
          <strong>Precio:</strong> $299.99
        </p>
        <p>
          <strong>Descripción:</strong> Descripción detallada del producto {id}
        </p>
      </div>
    </div>
  );
}
```

### ⚡ FASE ENHANCED (20 min) - DATA LOADING

```jsx
// src/pages/ProductoDetalle.jsx - Con data loading
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Mock data
const productosData = {
  1: { nombre: 'Laptop Gaming', precio: 1200, categoria: 'Computadoras' },
  2: { nombre: 'Mouse Inalámbrico', precio: 25, categoria: 'Accesorios' },
  3: { nombre: 'Teclado Mecánico', precio: 80, categoria: 'Accesorios' },
};

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));

        const productoEncontrado = productosData[id];

        if (productoEncontrado) {
          setProducto({ id, ...productoEncontrado });
        } else {
          setError('Producto no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>⏳ Cargando producto...</h2>
        <div
          style={{
            width: '50px',
            height: '50px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '2rem auto',
          }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>❌ {error}</h2>
        <button
          onClick={() => navigate('/productos')}
          style={{
            background: '#007bff',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            marginTop: '1rem',
          }}>
          Volver a Productos
        </button>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/productos"
        style={{ color: '#007bff', marginBottom: '1rem', display: 'block' }}>
        ← Volver a Productos
      </Link>

      <div
        style={{
          border: '1px solid #ddd',
          padding: '2rem',
          borderRadius: '8px',
        }}>
        <h1>📦 {producto.nombre}</h1>
        <p style={{ fontSize: '1.5rem', color: '#28a745', fontWeight: 'bold' }}>
          ${producto.precio}
        </p>
        <p>
          <strong>Categoría:</strong> {producto.categoria}
        </p>
        <p>
          <strong>ID:</strong> {producto.id}
        </p>

        <div style={{ marginTop: '2rem' }}>
          <button
            style={{
              background: '#28a745',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '4px',
              marginRight: '1rem',
            }}>
            🛒 Agregar al Carrito
          </button>
          <button
            style={{
              background: '#6c757d',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '4px',
            }}>
            ❤️ Favoritos
          </button>
        </div>
      </div>
    </div>
  );
}
```

### ✨ FASE POLISH (15 min) - ADVANCED FEATURES

```jsx
// src/pages/Categoria.jsx
import { useParams, Link } from 'react-router-dom';

const categorias = {
  computadoras: [
    { id: 1, nombre: 'Laptop Gaming', precio: 1200 },
    { id: 4, nombre: 'PC Desktop', precio: 800 },
  ],
  accesorios: [
    { id: 2, nombre: 'Mouse Inalámbrico', precio: 25 },
    { id: 3, nombre: 'Teclado Mecánico', precio: 80 },
  ],
};

export default function Categoria() {
  const { categoria } = useParams();
  const productos = categorias[categoria.toLowerCase()] || [];

  return (
    <div>
      <Link
        to="/productos"
        style={{ color: '#007bff', marginBottom: '1rem', display: 'block' }}>
        ← Volver a Productos
      </Link>

      <h1>📂 Categoría: {categoria}</h1>

      {productos.length > 0 ? (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
          {productos.map(producto => (
            <div
              key={producto.id}
              style={{
                border: '1px solid #ddd',
                padding: '1rem',
                borderRadius: '8px',
              }}>
              <h3>{producto.nombre}</h3>
              <p>Precio: ${producto.precio}</p>
              <Link
                to={`/producto/${producto.id}`}
                style={{
                  background: '#007bff',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  textDecoration: 'none',
                  borderRadius: '4px',
                }}>
                Ver Detalles
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No hay productos en esta categoría</h3>
          <p>Vuelve pronto para ver nuevos productos.</p>
        </div>
      )}
    </div>
  );
}
```

```jsx
// src/hooks/useProducto.js - Custom hook
import { useState, useEffect } from 'react';

const productosData = {
  1: { nombre: 'Laptop Gaming', precio: 1200, categoria: 'Computadoras' },
  2: { nombre: 'Mouse Inalámbrico', precio: 25, categoria: 'Accesorios' },
  3: { nombre: 'Teclado Mecánico', precio: 80, categoria: 'Accesorios' },
};

export function useProducto(id) {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);

        await new Promise(resolve => setTimeout(resolve, 500));

        const productoEncontrado = productosData[id];

        if (productoEncontrado) {
          setProducto({ id, ...productoEncontrado });
        } else {
          setError('Producto no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  return { producto, loading, error };
}
```

## ✅ VALIDACIÓN (5 min finales)

### Checklist Obligatorio:

- [ ] ✅ useParams funcionando correctamente
- [ ] ✅ Rutas dinámicas navegables (/producto/1, /producto/2)
- [ ] ✅ Data loading con estados (loading, error, success)
- [ ] ✅ Error handling para IDs inexistentes
- [ ] ✅ Navegación de vuelta funcionando
- [ ] ✅ Custom hook implementado (opcional)
- [ ] ✅ UX fluida y profesional

### Test Rápido:

1. **Params**: Navegar a /producto/1, /producto/2, /producto/999
2. **Loading**: Verificar estado de carga
3. **Error**: Probar ID inexistente
4. **Navigation**: Botones de navegación
5. **Categories**: Probar /categoria/computadoras

## 🎯 RESULTADO ESPERADO

**Al final de 60 minutos:**

- ✅ **Rutas dinámicas** completamente funcionales
- ✅ **useParams** implementado correctamente
- ✅ **Data loading** con estados apropiados
- ✅ **Error handling** robusto para casos edge
- ✅ **UX profesional** con loading y feedback
- ✅ **Base sólida** para autenticación y layouts

---

**🎯 LOGRO**: Rutas dinámicas dominadas ✅  
**➡️ SIGUIENTE**: Sección 3 - Auth Context (2:15 PM - Post Break)

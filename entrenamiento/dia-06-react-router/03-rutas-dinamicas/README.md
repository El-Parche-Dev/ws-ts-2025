# 📊 Sección 3: Rutas Dinámicas (60 min)

**⏰ TIEMPO**: 2:15 PM - 3:15 PM (Post Break)  
**🎯 OBJETIVO**: useParams, dynamic routes, data loading

## ⚡ TIMEBOXING ESTRICTO

| Fase            | Tiempo    | Actividad                  |
| --------------- | --------- | -------------------------- |
| 🔧 **CORE**     | 0-25 min  | useParams básico           |
| ⚡ **ENHANCED** | 25-45 min | Data loading, 404 dinámico |
| ✨ **POLISH**   | 45-60 min | Cache, optimización        |

## 🚀 IMPLEMENTACIÓN RÁPIDA

### 🔧 FASE CORE (25 min)

```jsx
// Rutas dinámicas básicas
<Routes>
  <Route
    path="/producto/:id"
    element={<ProductoDetalle />}
  />
  <Route
    path="/categoria/:categoria/producto/:id"
    element={<ProductoEnCategoria />}
  />
</Routes>;

// src/pages/ProductoDetalle.jsx
import { useParams } from 'react-router-dom';

export default function ProductoDetalle() {
  const { id } = useParams();

  return (
    <div>
      <h1>📦 Producto #{id}</h1>
      <p>Mostrando detalles del producto con ID: {id}</p>
    </div>
  );
}
```

### ⚡ FASE ENHANCED (20 min)

```jsx
// src/pages/ProductoDetalle.jsx - Con data loading
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockProduct = {
          id,
          nombre: `Producto ${id}`,
          precio: 299.99,
          descripcion: `Descripción del producto ${id}`,
        };

        setProducto(mockProduct);
      } catch (err) {
        setError('Producto no encontrado');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) return <div>⏳ Cargando producto...</div>;
  if (error) return <div>❌ {error}</div>;
  if (!producto) return <div>❌ Producto no encontrado</div>;

  return (
    <div className="producto-detalle">
      <button onClick={() => navigate(-1)}>← Volver</button>
      <h1>{producto.nombre}</h1>
      <p>💰 ${producto.precio}</p>
      <p>{producto.descripcion}</p>
    </div>
  );
}
```

### ✨ FASE POLISH (15 min)

```jsx
// src/hooks/useProducto.js - Hook personalizado
import { useState, useEffect } from 'react';

export function useProducto(id) {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simular API con cache
        const cached = localStorage.getItem(`producto-${id}`);
        if (cached) {
          setProducto(JSON.parse(cached));
          setLoading(false);
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        if (cancelled) return;

        const mockProduct = {
          id,
          nombre: `Producto ${id}`,
          precio: Math.floor(Math.random() * 1000) + 100,
          descripcion: `Descripción detallada del producto ${id}`,
        };

        localStorage.setItem(`producto-${id}`, JSON.stringify(mockProduct));
        setProducto(mockProduct);
      } catch (err) {
        if (!cancelled) setError('Error al cargar producto');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducto();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { producto, loading, error };
}
```

## ✅ VALIDACIÓN RÁPIDA

- [ ] ✅ useParams funcionando
- [ ] ✅ Rutas dinámicas navegables
- [ ] ✅ Data loading con estados
- [ ] ✅ Error handling 404
- [ ] ✅ Cache implementado
- [ ] ✅ Hook personalizado

**¡Listo para Sección 4! 🔒**

# 🧩 Componentes JSX | 25 minutos

## 🎯 OBJETIVO: Dominar JSX y composición de componentes

**TIMEBOXING**: 25 minutos exactos  
**RESULTADO**: Múltiples componentes comunicándose con props

---

## ⏰ Cronograma Sección 2

| Tarea               | Tiempo | Estado |
| ------------------- | ------ | ------ |
| **JSX Sintaxis**    | 8 min  | ⏳     |
| **Props Avanzados** | 8 min  | ⏳     |
| **Composición**     | 6 min  | ⏳     |
| **Validación**      | 3 min  | ⏳     |

---

## 🚀 FASE CORE (15 min) - JSX Esencial

### 📝 Paso 1: JSX Sintaxis Fundamental (8 min)

**Crear**: `src/components/ProductCard.jsx`

```jsx
// 🎯 FASE CORE: JSX sintaxis esencial para WorldSkills
function ProductCard() {
  // Variables JavaScript dentro del componente
  const productName = 'Laptop Gaming';
  const price = 2500000;
  const isAvailable = true;
  const tags = ['Gaming', 'High Performance', 'RGB'];

  // Formatear precio (lógica JavaScript)
  const formatPrice = price => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(price);
  };

  return (
    <div className="product-card">
      {/* JSX: Interpolación de variables */}
      <h2>{productName}</h2>

      {/* JSX: Expresiones JavaScript */}
      <p className="price">{formatPrice(price)}</p>

      {/* JSX: Renderizado condicional */}
      {isAvailable ? (
        <span className="badge available">✅ Disponible</span>
      ) : (
        <span className="badge unavailable">❌ Agotado</span>
      )}

      {/* JSX: Renderizado de listas */}
      <div className="tags">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="tag">
            {tag}
          </span>
        ))}
      </div>

      {/* JSX: Atributos dinámicos */}
      <button
        className={`btn ${isAvailable ? 'primary' : 'disabled'}`}
        disabled={!isAvailable}>
        {isAvailable ? 'Agregar al Carrito' : 'No Disponible'}
      </button>
    </div>
  );
}

export default ProductCard;
```

### 🔧 Paso 2: Props Avanzados (8 min)

**Mejorar**: `src/components/ProductCard.jsx`

```jsx
// 🎯 FASE ENHANCED: Props con destructuring y defaults
function ProductCard({
  product = {
    name: 'Producto',
    price: 0,
    available: false,
    tags: [],
    image: 'https://via.placeholder.com/300x200',
  },
  onAddToCart = () => {},
}) {
  const formatPrice = price => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(price);
  };

  // Manejar evento de click
  const handleAddToCart = () => {
    if (product.available) {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-card">
      {/* Imagen del producto */}
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{formatPrice(product.price)}</p>

        {/* Estado de disponibilidad */}
        <div className="availability">
          {product.available ? (
            <span className="badge available">✅ Disponible</span>
          ) : (
            <span className="badge unavailable">❌ Agotado</span>
          )}
        </div>

        {/* Tags del producto */}
        {product.tags.length > 0 && (
          <div className="tags">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Botón de acción */}
        <button
          className={`btn ${product.available ? 'primary' : 'disabled'}`}
          onClick={handleAddToCart}
          disabled={!product.available}>
          {product.available ? 'Agregar al Carrito' : 'No Disponible'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
```

---

## ⚡ FASE ENHANCED (8 min) - Composición

### 🏗️ Paso 3: Lista de Productos (6 min)

**Crear**: `src/components/ProductList.jsx`

```jsx
// 🎯 Composición de componentes - Patrón clave WorldSkills
import ProductCard from './ProductCard';

function ProductList() {
  // Datos de ejemplo (en app real vendría de API)
  const products = [
    {
      id: 1,
      name: 'Laptop Gaming ROG',
      price: 4500000,
      available: true,
      tags: ['Gaming', 'RGB', 'High Performance'],
      image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Laptop',
    },
    {
      id: 2,
      name: 'Mouse Gamer',
      price: 150000,
      available: true,
      tags: ['Gaming', 'RGB'],
      image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Mouse',
    },
    {
      id: 3,
      name: 'Teclado Mecánico',
      price: 300000,
      available: false,
      tags: ['Mechanical', 'RGB'],
      image: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Keyboard',
    },
  ];

  // Handler para agregar al carrito
  const handleAddToCart = product => {
    alert(`${product.name} agregado al carrito!`);
    console.log('Producto agregado:', product);
  };

  return (
    <div className="product-list">
      <header className="list-header">
        <h2>🛍️ Catálogo de Productos</h2>
        <p>Productos disponibles: {products.filter(p => p.available).length}</p>
      </header>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
```

### 🎨 Estilos Rápidos

**Agregar a** `src/index.css`:

```css
/* Product components */
.product-list {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.list-header {
  text-align: center;
  margin-bottom: 2rem;
}

.list-header h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 1.5rem;
}

.product-info h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 1rem;
}

.availability {
  margin-bottom: 1rem;
}

.badge {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge.available {
  background: #4caf50;
  color: white;
}

.badge.unavailable {
  background: #f44336;
  color: white;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tag {
  background: #e0e0e0;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.8rem;
  color: #666;
}

.btn {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn.primary {
  background: #4caf50;
  color: white;
}

.btn.primary:hover {
  background: #45a049;
}

.btn.disabled {
  background: #ccc;
  color: #999;
  cursor: not-allowed;
}
```

### 🔄 Actualizar App Principal

**Modificar** `src/App.jsx`:

```jsx
import ProductList from './components/ProductList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🚀 React JSX Demo</h1>
        <p>WorldSkills 2025 - Componentes y Props</p>
      </header>

      <main>
        <ProductList />
      </main>
    </div>
  );
}

export default App;
```

---

## ✨ FASE POLISH (2 min) - Validación

### ✅ Checklist JSX

**Verificar**:

- [ ] ✅ Múltiples componentes renderizando
- [ ] ✅ Props pasando datos correctamente
- [ ] ✅ Map() renderizando listas con keys
- [ ] ✅ Eventos onClick funcionando
- [ ] ✅ Renderizado condicional operativo
- [ ] ✅ Estilos aplicados correctamente

### 🔧 Debug Rápido

**Errores comunes**:

- **Keys missing**: Agregar `key={index}` en map()
- **Props undefined**: Verificar destructuring
- **Event handlers**: Verificar arrow functions
- **JSX syntax**: Verificar llaves {} vs paréntesis ()

---

## 🎯 Competencias Desarrolladas

Al completar esta sección:

1. ✅ **JSX Sintaxis** - Interpolación, expresiones, atributos
2. ✅ **Props** - Passing data, destructuring, defaults
3. ✅ **Renderizado Condicional** - if/else en JSX
4. ✅ **Listas** - map() con keys apropiadas
5. ✅ **Event Handling** - onClick básico
6. ✅ **Composición** - Componentes anidados

---

## ⏭️ Próximo Paso

**Sección 3**: Props & State (25 min)

- useState hook
- Estado local vs props
- Lifting state up

---

**⏰ TIEMPO LÍMITE: 25 MINUTOS**  
**🎯 ¡ENFOQUE EN COMPOSICIÓN Y PROPS!**

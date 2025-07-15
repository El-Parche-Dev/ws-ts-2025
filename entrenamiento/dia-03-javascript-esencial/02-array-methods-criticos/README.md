# 🔥 Array Methods Críticos - Implementación MVP

**⏰ Duración:** 60 minutos  
**🎯 Objetivo:** Dominar array methods esenciales para manipulación de datos

## 📚 Metodología MVP

### **FASE CORE ✅ (20 minutos) - Métodos Fundamentales**

**Funcionalidad esencial:** map(), filter(), find() funcionando perfectamente

#### **🔧 Array Methods Básicos - Los Críticos**

```javascript
// ========== FASE CORE ✅ ==========
// Funcionalidad: Array methods básicos pero esenciales

const productos = [
  {
    id: 1,
    nombre: 'Laptop',
    precio: 2500000,
    categoria: 'tecnología',
    stock: 5,
  },
  { id: 2, nombre: 'Mouse', precio: 50000, categoria: 'accesorios', stock: 15 },
  {
    id: 3,
    nombre: 'Teclado',
    precio: 150000,
    categoria: 'accesorios',
    stock: 8,
  },
  {
    id: 4,
    nombre: 'Monitor',
    precio: 800000,
    categoria: 'tecnología',
    stock: 3,
  },
  {
    id: 5,
    nombre: 'Webcam',
    precio: 200000,
    categoria: 'accesorios',
    stock: 0,
  },
];

// 1. MAP - Transformar cada elemento
const nombres = productos.map(producto => producto.nombre);
console.log('Nombres:', nombres);
// ['Laptop', 'Mouse', 'Teclado', 'Monitor', 'Webcam']

const preciosFormateados = productos.map(producto => ({
  nombre: producto.nombre,
  precio: `$${producto.precio.toLocaleString('es-CO')}`,
}));
console.log('Precios formateados:', preciosFormateados);

// 2. FILTER - Filtrar elementos que cumplan condición
const productosDisponibles = productos.filter(producto => producto.stock > 0);
console.log('Productos disponibles:', productosDisponibles.length);

const productosCaros = productos.filter(producto => producto.precio > 100000);
console.log(
  'Productos caros:',
  productosCaros.map(p => p.nombre)
);

const accesorios = productos.filter(
  producto => producto.categoria === 'accesorios'
);
console.log(
  'Accesorios:',
  accesorios.map(p => p.nombre)
);

// 3. FIND - Encontrar un elemento específico
const laptop = productos.find(producto => producto.nombre === 'Laptop');
console.log('Laptop encontrada:', laptop);

const productoAgotado = productos.find(producto => producto.stock === 0);
console.log('Primer producto agotado:', productoAgotado?.nombre);

const productoCaro = productos.find(producto => producto.precio > 1000000);
console.log('Primer producto caro:', productoCaro?.nombre);
```

### **FASE ENHANCED ⚡ (25 minutos) - Métodos Avanzados**

**Mejoras:** reduce(), some(), every() y combinaciones

#### **⚡ Array Methods Avanzados**

```javascript
// ========== FASE ENHANCED ⚡ ==========
// Mejoras: Métodos avanzados y combinaciones

// 4. REDUCE - Acumular valores
const valorTotalInventario = productos.reduce((total, producto) => {
  return total + producto.precio * producto.stock;
}, 0);
console.log(
  `Valor total inventario: $${valorTotalInventario.toLocaleString('es-CO')}`
);

// Agrupar por categoría usando reduce
const productosPorCategoria = productos.reduce((grupos, producto) => {
  const categoria = producto.categoria;
  if (!grupos[categoria]) {
    grupos[categoria] = [];
  }
  grupos[categoria].push(producto);
  return grupos;
}, {});
console.log('Productos por categoría:', productosPorCategoria);

// Estadísticas con reduce
const estadisticas = productos.reduce(
  (stats, producto) => {
    return {
      total: stats.total + 1,
      precioPromedio: (stats.precioPromedio + producto.precio) / 2,
      stockTotal: stats.stockTotal + producto.stock,
      categorias: [...new Set([...stats.categorias, producto.categoria])],
    };
  },
  { total: 0, precioPromedio: 0, stockTotal: 0, categorias: [] }
);

// 5. SOME - Verificar si al menos uno cumple condición
const hayProductosCaros = productos.some(producto => producto.precio > 1000000);
console.log('¿Hay productos caros?', hayProductosCaros);

const hayProductosAgotados = productos.some(producto => producto.stock === 0);
console.log('¿Hay productos agotados?', hayProductosAgotados);

// 6. EVERY - Verificar si todos cumplen condición
const todosTienenPrecio = productos.every(producto => producto.precio > 0);
console.log('¿Todos tienen precio?', todosTienenPrecio);

const todosTienenStock = productos.every(producto => producto.stock > 0);
console.log('¿Todos tienen stock?', todosTienenStock);

// 7. COMBINACIONES PODEROSAS
const resumenVentas = productos
  .filter(producto => producto.stock > 0) // Solo disponibles
  .map(producto => ({
    nombre: producto.nombre,
    categoria: producto.categoria,
    valorInventario: producto.precio * producto.stock,
    disponibilidad: producto.stock > 5 ? 'Alto' : 'Bajo',
  }))
  .sort((a, b) => b.valorInventario - a.valorInventario); // Ordenar por valor

console.log('Resumen de ventas:', resumenVentas);
```

### **FASE POLISH ✨ (15 minutos) - Optimización y Performance**

**Optimizaciones:** Chaining eficiente, performance patterns

#### **✨ Chaining y Performance**

```javascript
// ========== FASE POLISH ✨ ==========
// Optimizaciones: Chaining eficiente y performance

// Patrón eficiente para búsquedas complejas
class ProductoManager {
  constructor(productos) {
    this.productos = productos;
  }

  // Método fluent interface
  buscar() {
    return {
      productos: this.productos,
      porCategoria: categoria => {
        this.productos = this.productos.filter(p => p.categoria === categoria);
        return this;
      },
      conStock: () => {
        this.productos = this.productos.filter(p => p.stock > 0);
        return this;
      },
      precioEntre: (min, max) => {
        this.productos = this.productos.filter(
          p => p.precio >= min && p.precio <= max
        );
        return this;
      },
      ordenarPor: (campo, direccion = 'asc') => {
        this.productos = this.productos.sort((a, b) => {
          return direccion === 'asc'
            ? a[campo] - b[campo]
            : b[campo] - a[campo];
        });
        return this;
      },
      obtener: () => this.productos,
    };
  }

  // Método para estadísticas rápidas
  estadisticasRapidas() {
    return this.productos.reduce(
      (stats, producto) => ({
        totalProductos: stats.totalProductos + 1,
        valorTotal: stats.valorTotal + producto.precio * producto.stock,
        stockTotal: stats.stockTotal + producto.stock,
        precioPromedio:
          (stats.valorTotal + producto.precio) / (stats.totalProductos + 1),
        categorias: [...new Set([...stats.categorias, producto.categoria])],
        disponibles: stats.disponibles + (producto.stock > 0 ? 1 : 0),
      }),
      {
        totalProductos: 0,
        valorTotal: 0,
        stockTotal: 0,
        precioPromedio: 0,
        categorias: [],
        disponibles: 0,
      }
    );
  }
}

// Uso optimizado
const manager = new ProductoManager(productos);

const accesoriosDisponibles = manager
  .buscar()
  .porCategoria('accesorios')
  .conStock()
  .ordenarPor('precio', 'desc')
  .obtener();

console.log('Accesorios disponibles:', accesoriosDisponibles);

// Performance patterns
const busquedaOptimizada = (productos, filtros) => {
  // Usar Map para búsquedas O(1) si hay muchos elementos
  const productosMap = new Map(productos.map(p => [p.id, p]));

  // Aplicar filtros en el orden más eficiente
  return productos
    .filter(p => !filtros.categoria || p.categoria === filtros.categoria)
    .filter(p => !filtros.minPrecio || p.precio >= filtros.minPrecio)
    .filter(p => !filtros.maxPrecio || p.precio <= filtros.maxPrecio)
    .filter(p => !filtros.conStock || p.stock > 0);
};

// Memoización para búsquedas repetidas
const memoizedFilter = (() => {
  const cache = new Map();

  return (productos, filtros) => {
    const key = JSON.stringify(filtros);

    if (cache.has(key)) {
      console.log('🚀 Resultado desde cache');
      return cache.get(key);
    }

    const resultado = busquedaOptimizada(productos, filtros);
    cache.set(key, resultado);
    return resultado;
  };
})();
```

## 🎯 Ejercicios Prácticos

### **Ejercicio 1: E-commerce Filter System (20 min)**

```javascript
// Datos del ejercicio
const tienda = [
  {
    id: 1,
    nombre: 'iPhone 15',
    precio: 4500000,
    categoria: 'smartphones',
    marca: 'Apple',
    rating: 4.8,
    stock: 10,
  },
  {
    id: 2,
    nombre: 'Samsung Galaxy S24',
    precio: 3800000,
    categoria: 'smartphones',
    marca: 'Samsung',
    rating: 4.7,
    stock: 8,
  },
  {
    id: 3,
    nombre: 'MacBook Pro',
    precio: 8500000,
    categoria: 'laptops',
    marca: 'Apple',
    rating: 4.9,
    stock: 5,
  },
  {
    id: 4,
    nombre: 'Dell XPS 13',
    precio: 6200000,
    categoria: 'laptops',
    marca: 'Dell',
    rating: 4.6,
    stock: 3,
  },
  {
    id: 5,
    nombre: 'AirPods Pro',
    precio: 800000,
    categoria: 'accesorios',
    marca: 'Apple',
    rating: 4.5,
    stock: 20,
  },
  {
    id: 6,
    nombre: 'Sony WH-1000XM5',
    precio: 1200000,
    categoria: 'accesorios',
    marca: 'Sony',
    rating: 4.8,
    stock: 0,
  },
];

// TODO: Implementar usando array methods
// 1. Obtener todos los productos de Apple disponibles (stock > 0)
// 2. Calcular el precio promedio por categoría
// 3. Encontrar el producto con mejor rating en cada categoría
// 4. Crear un resumen de inventario con valor total por marca
// 5. Implementar sistema de búsqueda por nombre (case insensitive)

// Tu código aquí:
```

### **Ejercicio 2: Data Analytics Dashboard (15 min)**

```javascript
// Datos de ventas
const ventas = [
  {
    fecha: '2024-01-15',
    producto: 'Laptop',
    vendedor: 'Ana',
    cantidad: 2,
    valor: 5000000,
  },
  {
    fecha: '2024-01-16',
    producto: 'Mouse',
    vendedor: 'Luis',
    cantidad: 5,
    valor: 250000,
  },
  {
    fecha: '2024-01-16',
    producto: 'Teclado',
    vendedor: 'Ana',
    cantidad: 3,
    valor: 450000,
  },
  {
    fecha: '2024-01-17',
    producto: 'Monitor',
    vendedor: 'Carlos',
    cantidad: 1,
    valor: 800000,
  },
  {
    fecha: '2024-01-17',
    producto: 'Laptop',
    vendedor: 'Luis',
    cantidad: 1,
    valor: 2500000,
  },
];

// TODO: Crear dashboard con:
// 1. Total de ventas por vendedor
// 2. Producto más vendido (por cantidad)
// 3. Día con mayores ventas
// 4. Ranking de vendedores por valor total
// 5. Productos que se vendieron más de una vez

// Tu código aquí:
```

## 📝 Checklist de Validación

### **CORE (✅ Obligatorio)**

- [ ] map() transforma arrays correctamente
- [ ] filter() filtra elementos apropiadamente
- [ ] find() encuentra elementos específicos
- [ ] Resultados son los esperados

### **ENHANCED (⚡ Importante)**

- [ ] reduce() acumula valores correctamente
- [ ] some() y every() funcionan apropiadamente
- [ ] Combinaciones de métodos (chaining)
- [ ] Agrupación y estadísticas implementadas

### **POLISH (✨ Opcional)**

- [ ] Chaining fluent interface implementado
- [ ] Performance optimizada para datasets grandes
- [ ] Memoización o caché implementado
- [ ] Código reutilizable y mantenible

## ⏱️ Timeboxing Estricto

- **00:00-20:00**: CORE - map, filter, find
- **20:00-45:00**: ENHANCED - reduce, some, every + chaining
- **45:00-60:00**: POLISH - optimización y patterns

**¡Si no terminas en tiempo, documenta problemas y avanza al siguiente ejercicio!**

## 🎖️ Criterios de Evaluación

| Criterio          | CORE (8pts)                | ENHANCED (6pts)             | POLISH (6pts)          |
| ----------------- | -------------------------- | --------------------------- | ---------------------- |
| **Funcionalidad** | Métodos básicos funcionan  | Métodos avanzados correctos | Optimización evidente  |
| **Sintaxis**      | Sin errores, código limpio | Chaining apropiado          | Patterns avanzados     |
| **Casos de uso**  | Aplicación práctica        | Combinaciones complejas     | Performance optimizada |

**Mínimo requerido:** 8/20 puntos (CORE completo)

**Meta WorldSkills:** 16/20 puntos (CORE + ENHANCED)

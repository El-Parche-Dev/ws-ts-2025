// 🔥 Array Methods Críticos - WorldSkills 2025
// Metodología MVP: Core (20min) → Enhanced (25min) → Polish (15min)

// ========== TIMER SETUP ==========
let tiempoRestante = 60 * 60; // 60 minutos en segundos

function actualizarTimer() {
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  document.getElementById('timer').textContent = `⏱️ ${minutos
    .toString()
    .padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

  if (tiempoRestante > 0) {
    tiempoRestante--;
    setTimeout(actualizarTimer, 1000);
  } else {
    document.getElementById('timer').textContent = '⏰ ¡TIEMPO AGOTADO!';
    document.getElementById('timer').style.background =
      'rgba(231, 76, 60, 0.9)';
  }
}

// Iniciar timer
actualizarTimer();

// ========== DATOS DE PRUEBA ==========
const productos = [
  {
    id: 1,
    nombre: 'iPhone 15 Pro',
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
    nombre: 'MacBook Pro 16"',
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
  {
    id: 7,
    nombre: 'iPad Air',
    precio: 2800000,
    categoria: 'tablets',
    marca: 'Apple',
    rating: 4.7,
    stock: 12,
  },
  {
    id: 8,
    nombre: 'Surface Pro 9',
    precio: 4200000,
    categoria: 'tablets',
    marca: 'Microsoft',
    rating: 4.4,
    stock: 6,
  },
  {
    id: 9,
    nombre: 'Magic Mouse',
    precio: 350000,
    categoria: 'accesorios',
    marca: 'Apple',
    rating: 4.2,
    stock: 25,
  },
  {
    id: 10,
    nombre: 'Logitech MX Master 3',
    precio: 450000,
    categoria: 'accesorios',
    marca: 'Logitech',
    rating: 4.6,
    stock: 15,
  },
];

// ========== FASE CORE ✅ (20 minutos) - map(), filter(), find() ==========
console.log('🔧 FASE CORE - Array Methods Fundamentales');

// Mostrar datos iniciales
function mostrarDatos() {
  const output = `Total de productos: ${productos.length}

Productos disponibles:
${productos
  .map(
    p =>
      `• ${p.nombre} - $${p.precio.toLocaleString('es-CO')} (Stock: ${p.stock})`
  )
  .join('\n')}`;

  document.getElementById('datos-output').textContent = output;
  document.getElementById('total-productos').textContent = productos.length;
}

// 1. MAP - Transformar arrays
function demostracionMap() {
  let output = '';

  // MAP básico: extraer nombres
  const nombres = productos.map(producto => producto.nombre);
  output += `Nombres de productos:\n${nombres.join(', ')}\n\n`;

  // MAP para formatear precios
  const preciosFormateados = productos.map(producto => ({
    nombre: producto.nombre,
    precio: `$${producto.precio.toLocaleString('es-CO')}`,
    disponible: producto.stock > 0,
  }));
  output += `Precios formateados:\n${JSON.stringify(
    preciosFormateados.slice(0, 3),
    null,
    2
  )}\n\n`;

  // MAP para crear HTML (crítico para competencias)
  const productosHTML = productos
    .slice(0, 3)
    .map(
      producto =>
        `<div class="producto">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio.toLocaleString('es-CO')}</p>
            <span class="categoria">${producto.categoria}</span>
        </div>`
    )
    .join('\n');
  output += `HTML generado (3 productos):\n${productosHTML}`;

  return output;
}

// 2. FILTER - Filtrar elementos
function demostracionFilter() {
  let output = '';

  // FILTER básico: productos disponibles
  const disponibles = productos.filter(producto => producto.stock > 0);
  output += `Productos disponibles: ${disponibles.length}/${productos.length}\n`;
  output += `Lista: ${disponibles.map(p => p.nombre).join(', ')}\n\n`;

  // FILTER por precio
  const productosCaros = productos.filter(
    producto => producto.precio > 2000000
  );
  output += `Productos caros (>$2M): ${productosCaros.length}\n`;
  output += `${productosCaros
    .map(p => `${p.nombre} - $${p.precio.toLocaleString('es-CO')}`)
    .join('\n')}\n\n`;

  // FILTER por marca
  const productosApple = productos.filter(
    producto => producto.marca === 'Apple'
  );
  output += `Productos Apple: ${productosApple.length}\n`;
  output += `${productosApple.map(p => p.nombre).join(', ')}\n\n`;

  // FILTER múltiple (AND)
  const appleDisponibles = productos.filter(
    producto => producto.marca === 'Apple' && producto.stock > 0
  );
  output += `Apple disponibles: ${appleDisponibles
    .map(p => p.nombre)
    .join(', ')}`;

  return output;
}

// 3. FIND - Encontrar elementos específicos
function demostracionFind() {
  let output = '';

  // FIND básico: por ID
  const producto1 = productos.find(producto => producto.id === 1);
  output += `Producto ID 1: ${
    producto1 ? producto1.nombre : 'No encontrado'
  }\n\n`;

  // FIND por nombre
  const macbook = productos.find(producto =>
    producto.nombre.toLowerCase().includes('macbook')
  );
  output += `MacBook encontrado: ${
    macbook ? macbook.nombre : 'No encontrado'
  }\n\n`;

  // FIND por condición compleja
  const mejorRating = productos.find(producto => producto.rating >= 4.8);
  output += `Mejor rating (>=4.8): ${
    mejorRating
      ? `${mejorRating.nombre} (${mejorRating.rating})`
      : 'No encontrado'
  }\n\n`;

  // FIND producto agotado
  const agotado = productos.find(producto => producto.stock === 0);
  output += `Primer producto agotado: ${
    agotado ? agotado.nombre : 'Todos disponibles'
  }\n\n`;

  // FIND con precio específico
  const precioExacto = productos.find(producto => producto.precio === 800000);
  output += `Producto de $800,000: ${
    precioExacto ? precioExacto.nombre : 'No encontrado'
  }`;

  return output;
}

// Ejecutar demos CORE
mostrarDatos();
document.getElementById('map-output').textContent = demostracionMap();
document.getElementById('filter-output').textContent = demostracionFilter();
document.getElementById('find-output').textContent = demostracionFind();

// ========== FASE ENHANCED ⚡ (25 minutos) - reduce(), some(), every() ==========
console.log('⚡ FASE ENHANCED - Array Methods Avanzados');

// 4. REDUCE - Acumular valores
function demostracionReduce() {
  let output = '';

  // REDUCE básico: suma total
  const valorTotal = productos.reduce((total, producto) => {
    return total + producto.precio * producto.stock;
  }, 0);
  output += `Valor total inventario: $${valorTotal.toLocaleString(
    'es-CO'
  )}\n\n`;

  // REDUCE para agrupar por categoría
  const porCategoria = productos.reduce((grupos, producto) => {
    const categoria = producto.categoria;
    if (!grupos[categoria]) {
      grupos[categoria] = [];
    }
    grupos[categoria].push(producto);
    return grupos;
  }, {});

  output += `Productos por categoría:\n`;
  Object.keys(porCategoria).forEach(categoria => {
    output += `• ${categoria}: ${porCategoria[categoria].length} productos\n`;
  });
  output += '\n';

  // REDUCE para estadísticas
  const estadisticas = productos.reduce(
    (stats, producto) => {
      return {
        totalProductos: stats.totalProductos + 1,
        stockTotal: stats.stockTotal + producto.stock,
        valorPromedio: (stats.valorPromedio + producto.precio) / 2,
        ratingPromedio: (stats.ratingPromedio + producto.rating) / 2,
        marcas: [...new Set([...stats.marcas, producto.marca])],
      };
    },
    {
      totalProductos: 0,
      stockTotal: 0,
      valorPromedio: 0,
      ratingPromedio: 0,
      marcas: [],
    }
  );

  output += `Estadísticas generales:\n`;
  output += `• Total productos: ${estadisticas.totalProductos}\n`;
  output += `• Stock total: ${estadisticas.stockTotal} unidades\n`;
  output += `• Precio promedio: $${Math.round(
    estadisticas.valorPromedio
  ).toLocaleString('es-CO')}\n`;
  output += `• Rating promedio: ${estadisticas.ratingPromedio.toFixed(
    1
  )}/5.0\n`;
  output += `• Marcas: ${estadisticas.marcas.join(', ')}`;

  return output;
}

// 5. SOME y EVERY - Validaciones
function demostracionSomeEvery() {
  let output = '';

  // SOME - ¿Existe al menos uno?
  const hayCaros = productos.some(producto => producto.precio > 5000000);
  const hayAgotados = productos.some(producto => producto.stock === 0);
  const hayApple = productos.some(producto => producto.marca === 'Apple');
  const hayRatingAlto = productos.some(producto => producto.rating >= 4.8);

  output += `Validaciones SOME (al menos uno):\n`;
  output += `• ¿Hay productos >$5M? ${hayCaros ? 'Sí' : 'No'}\n`;
  output += `• ¿Hay productos agotados? ${hayAgotados ? 'Sí' : 'No'}\n`;
  output += `• ¿Hay productos Apple? ${hayApple ? 'Sí' : 'No'}\n`;
  output += `• ¿Hay rating >=4.8? ${hayRatingAlto ? 'Sí' : 'No'}\n\n`;

  // EVERY - ¿Todos cumplen?
  const todosTienenPrecio = productos.every(producto => producto.precio > 0);
  const todosTienenStock = productos.every(producto => producto.stock > 0);
  const todosRatingAlto = productos.every(producto => producto.rating >= 4.0);
  const todosTienenMarca = productos.every(
    producto => producto.marca && producto.marca.length > 0
  );

  output += `Validaciones EVERY (todos):\n`;
  output += `• ¿Todos tienen precio? ${todosTienenPrecio ? 'Sí' : 'No'}\n`;
  output += `• ¿Todos tienen stock? ${todosTienenStock ? 'Sí' : 'No'}\n`;
  output += `• ¿Todos rating >=4.0? ${todosRatingAlto ? 'Sí' : 'No'}\n`;
  output += `• ¿Todos tienen marca? ${todosTienenMarca ? 'Sí' : 'No'}\n\n`;

  // Validaciones complejas
  const categoriasConStock = Object.keys(
    productos
      .filter(p => p.stock > 0)
      .reduce((cats, p) => ({ ...cats, [p.categoria]: true }), {})
  );

  output += `Categorías con stock disponible: ${categoriasConStock.join(', ')}`;

  return output;
}

// Ejecutar demos ENHANCED
document.getElementById('reduce-output').textContent = demostracionReduce();
document.getElementById('some-every-output').textContent =
  demostracionSomeEvery();

// Función para generar dashboard interactivo
function generarDashboard() {
  const container = document.getElementById('dashboard-container');

  // Generar tabla de productos
  const tabla = `
        <h4>📊 Dashboard de Productos</h4>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Rating</th>
                    <th>Stock</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                ${productos
                  .map(
                    p => `
                    <tr>
                        <td>${p.nombre}</td>
                        <td>$${p.precio.toLocaleString('es-CO')}</td>
                        <td>${p.categoria}</td>
                        <td>${p.rating}/5</td>
                        <td>${p.stock}</td>
                        <td>${p.stock > 0 ? '✅ Disponible' : '❌ Agotado'}</td>
                    </tr>
                `
                  )
                  .join('')}
            </tbody>
        </table>
    `;

  container.innerHTML = tabla;
}

// Función para filtrar por categoría
function filtrarPorCategoria() {
  const categoria = prompt(
    'Ingresa la categoría (smartphones, laptops, tablets, accesorios):'
  );
  if (!categoria) return;

  const filtrados = productos.filter(
    p => p.categoria.toLowerCase() === categoria.toLowerCase()
  );

  const container = document.getElementById('dashboard-container');
  container.innerHTML = `
        <h4>🔍 Productos en categoría: ${categoria}</h4>
        <p>Encontrados: ${filtrados.length} productos</p>
        <div class="demo-container">
            ${filtrados
              .map(
                p => `
                <div class="demo-card">
                    <h4>${p.nombre}</h4>
                    <p>Precio: $${p.precio.toLocaleString('es-CO')}</p>
                    <p>Rating: ${p.rating}/5 ⭐</p>
                    <p>Stock: ${p.stock} unidades</p>
                    <p>Marca: ${p.marca}</p>
                </div>
            `
              )
              .join('')}
        </div>
    `;
}

// ========== FASE POLISH ✨ (15 minutos) - Chaining y Performance ==========
console.log('✨ FASE POLISH - Optimización y Chaining');

// Demonstración de chaining avanzado
function demostracionChaining() {
  let output = '';

  // Chaining básico: filter + map + sort
  const topProductos = productos
    .filter(p => p.stock > 0) // Solo disponibles
    .filter(p => p.rating >= 4.5) // Solo bien calificados
    .map(p => ({
      // Transformar datos
      nombre: p.nombre,
      precio: p.precio,
      rating: p.rating,
      valoracion: `${p.rating}/5 ⭐`,
      disponibilidad: p.stock > 10 ? 'Alto stock' : 'Stock limitado',
    }))
    .sort((a, b) => b.rating - a.rating); // Ordenar por rating

  output += `TOP Productos (disponibles, rating >=4.5):\n`;
  output += `${topProductos
    .map(p => `${p.nombre} - ${p.valoracion} - ${p.disponibilidad}`)
    .join('\n')}\n\n`;

  // Chaining complejo: análisis por marca
  const analisisMarcas = productos
    .filter(p => p.stock > 0)
    .reduce((marcas, p) => {
      if (!marcas[p.marca]) {
        marcas[p.marca] = {
          productos: [],
          totalStock: 0,
          valorInventario: 0,
          ratingPromedio: 0,
        };
      }
      marcas[p.marca].productos.push(p);
      marcas[p.marca].totalStock += p.stock;
      marcas[p.marca].valorInventario += p.precio * p.stock;
      return marcas;
    }, {});

  // Calcular promedios y ordenar
  const marcasOrdenadas = Object.entries(analisisMarcas)
    .map(([marca, datos]) => ({
      marca,
      cantidadProductos: datos.productos.length,
      totalStock: datos.totalStock,
      valorInventario: datos.valorInventario,
      ratingPromedio:
        datos.productos.reduce((sum, p) => sum + p.rating, 0) /
        datos.productos.length,
    }))
    .sort((a, b) => b.valorInventario - a.valorInventario);

  output += `Análisis por marca (ordenado por valor de inventario):\n`;
  marcasOrdenadas.forEach(m => {
    output += `• ${m.marca}: ${m.cantidadProductos} productos, Stock: ${
      m.totalStock
    }, Valor: $${m.valorInventario.toLocaleString(
      'es-CO'
    )}, Rating: ${m.ratingPromedio.toFixed(1)}\n`;
  });

  return output;
}

document.getElementById('chaining-output').textContent = demostracionChaining();

// Test de performance
function testPerformance() {
  const container = document.getElementById('performance-output');
  const progressBar = document.getElementById('progress');
  let progress = 0;

  container.textContent = 'Ejecutando tests de performance...\n';

  // Simular diferentes enfoques y medir tiempo
  const tests = [
    {
      nombre: 'Filter + Map tradicional',
      funcion: () => {
        return productos
          .filter(p => p.stock > 0)
          .map(p => ({ ...p, formatted: `${p.nombre} - $${p.precio}` }));
      },
    },
    {
      nombre: 'Reduce optimizado',
      funcion: () => {
        return productos.reduce((acc, p) => {
          if (p.stock > 0) {
            acc.push({ ...p, formatted: `${p.nombre} - $${p.precio}` });
          }
          return acc;
        }, []);
      },
    },
    {
      nombre: 'For loop clásico',
      funcion: () => {
        const resultado = [];
        for (let i = 0; i < productos.length; i++) {
          if (productos[i].stock > 0) {
            resultado.push({
              ...productos[i],
              formatted: `${productos[i].nombre} - $${productos[i].precio}`,
            });
          }
        }
        return resultado;
      },
    },
  ];

  const resultados = [];

  tests.forEach((test, index) => {
    setTimeout(() => {
      const inicio = performance.now();

      // Ejecutar múltiples veces para mejor medición
      for (let i = 0; i < 1000; i++) {
        test.funcion();
      }

      const fin = performance.now();
      const tiempo = fin - inicio;

      resultados.push({ nombre: test.nombre, tiempo });

      progress = ((index + 1) / tests.length) * 100;
      progressBar.style.width = `${progress}%`;

      container.textContent += `${test.nombre}: ${tiempo.toFixed(
        2
      )}ms (1000 iteraciones)\n`;

      if (index === tests.length - 1) {
        const masRapido = resultados.reduce((min, r) =>
          r.tiempo < min.tiempo ? r : min
        );
        container.textContent += `\n🏆 Más rápido: ${
          masRapido.nombre
        } (${masRapido.tiempo.toFixed(2)}ms)`;
      }
    }, index * 1000);
  });
}

// Reto final
function iniciarReto() {
  const container = document.getElementById('reto-container');

  container.innerHTML = `
        <h4>🏆 Reto: E-commerce Analytics System</h4>
        <p>Implementa las siguientes funcionalidades usando array methods:</p>
        <ol>
            <li>Buscar productos por nombre (incluye filtro parcial)</li>
            <li>Calcular descuentos automáticos por categoría</li>
            <li>Generar reporte de productos con bajo stock (&lt;5)</li>
            <li>Crear sistema de recomendaciones por rating</li>
            <li>Calcular ROI por marca</li>
        </ol>
        <button class="btn" onclick="mostrarSolucionReto()">Ver Solución</button>
        <div id="solucion-reto" style="display: none;"></div>
    `;
}

function mostrarSolucionReto() {
  const solucionDiv = document.getElementById('solucion-reto');
  solucionDiv.style.display = 'block';

  solucionDiv.innerHTML = `
        <h4>💡 Solución del Reto</h4>
        <div class="output" style="max-height: 400px;">
// 1. Búsqueda de productos
const buscarProductos = (termino) => {
    return productos.filter(p => 
        p.nombre.toLowerCase().includes(termino.toLowerCase())
    );
};

// 2. Descuentos por categoría
const aplicarDescuentos = () => {
    const descuentos = { smartphones: 0.1, laptops: 0.15, accesorios: 0.05 };
    return productos.map(p => ({
        ...p,
        descuento: descuentos[p.categoria] || 0,
        precioFinal: p.precio * (1 - (descuentos[p.categoria] || 0))
    }));
};

// 3. Productos con bajo stock
const bajoStock = productos.filter(p => p.stock < 5 && p.stock > 0);

// 4. Recomendaciones por rating
const recomendados = productos
    .filter(p => p.rating >= 4.7 && p.stock > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

// 5. ROI por marca
const roiPorMarca = productos
    .reduce((marcas, p) => {
        if (!marcas[p.marca]) marcas[p.marca] = { inversion: 0, valorStock: 0 };
        marcas[p.marca].inversion += p.precio;
        marcas[p.marca].valorStock += p.precio * p.stock;
        return marcas;
    }, {});

console.log('Búsqueda "Pro":', buscarProductos('Pro'));
console.log('Productos con descuento:', aplicarDescuentos().slice(0, 3));
console.log('Bajo stock:', bajoStock.map(p => p.nombre));
console.log('Recomendados:', recomendados.map(p => p.nombre));
console.log('ROI por marca:', roiPorMarca);
        </div>
    `;
}

console.log('🔥 Array Methods Críticos cargado correctamente');
console.log('⏱️ Timer iniciado: 60 minutos para dominar manipulación de datos');
console.log('🎯 Meta: Completar todas las fases y el reto final');

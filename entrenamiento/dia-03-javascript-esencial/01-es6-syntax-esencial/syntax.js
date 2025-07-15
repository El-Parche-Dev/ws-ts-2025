// 🚀 ES6 Syntax Esencial - WorldSkills 2025
// Metodología MVP: Core → Enhanced → Polish

// ========== TIMER SETUP ==========
let tiempoRestante = 30 * 60; // 30 minutos en segundos

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

// ========== FASE CORE ✅ (10 minutos) - Destructuring y Spread ==========
console.log('🔧 FASE CORE - Destructuring y Spread Operator');

// Datos de ejemplo para ejercicios
const usuario = {
  nombre: 'Ana García',
  edad: 25,
  email: 'ana@email.com',
  ciudad: 'Bogotá',
  hobbies: ['programación', 'música', 'viajes'],
};

const productos = [
  { id: 1, nombre: 'Laptop Gaming', precio: 2500000, categoria: 'tecnología' },
  {
    id: 2,
    nombre: 'Mouse Inalámbrico',
    precio: 50000,
    categoria: 'accesorios',
  },
  {
    id: 3,
    nombre: 'Teclado Mecánico',
    precio: 150000,
    categoria: 'accesorios',
  },
  { id: 4, nombre: 'Monitor 4K', precio: 800000, categoria: 'tecnología' },
];

// 1. DESTRUCTURING DE OBJETOS
function demostracionDestructuring() {
  let output = '';

  // Destructuring básico
  const { nombre, edad } = usuario;
  output += `Básico: ${nombre}, ${edad} años\n`;

  // Destructuring con renombrado
  const { email: correo, ciudad: location } = usuario;
  output += `Renombrado: ${correo} desde ${location}\n`;

  // Destructuring con defaults
  const { telefono = 'No disponible', profesion = 'Sin especificar' } = usuario;
  output += `Defaults: Tel: ${telefono}, Prof: ${profesion}\n`;

  // Destructuring anidado
  const configuracion = {
    usuario: { nombre: 'Juan', preferencias: { tema: 'oscuro', idioma: 'es' } },
  };
  const {
    usuario: {
      preferencias: { tema, idioma },
    },
  } = configuracion;
  output += `Anidado: Tema ${tema}, Idioma ${idioma}\n`;

  return output;
}

// 2. DESTRUCTURING DE ARRAYS
function destructuringArrays() {
  let output = '';

  const colores = ['rojo', 'verde', 'azul', 'amarillo', 'violeta'];

  // Destructuring básico
  const [primero, segundo] = colores;
  output += `Primeros dos: ${primero}, ${segundo}\n`;

  // Saltar elementos
  const [, , tercero] = colores;
  output += `Tercer elemento: ${tercero}\n`;

  // Rest operator
  const [principal, ...resto] = colores;
  output += `Principal: ${principal}, Resto: [${resto.join(', ')}]\n`;

  // Intercambio de variables
  let a = 10,
    b = 20;
  [a, b] = [b, a];
  output += `Intercambio: a=${a}, b=${b}\n`;

  return output;
}

// 3. SPREAD OPERATOR CON ARRAYS
function spreadArrays() {
  let output = '';

  const numeros1 = [1, 2, 3];
  const numeros2 = [4, 5, 6];

  // Combinar arrays
  const combinados = [...numeros1, ...numeros2];
  output += `Combinados: [${combinados.join(', ')}]\n`;

  // Copiar arrays
  const copia = [...numeros1];
  copia.push(4);
  output += `Original: [${numeros1.join(', ')}]\n`;
  output += `Copia modificada: [${copia.join(', ')}]\n`;

  // Spread en funciones
  const max = Math.max(...numeros1);
  output += `Máximo de ${numeros1.join(', ')}: ${max}\n`;

  // Convertir string a array
  const letras = [...'HOLA'];
  output += `String a array: [${letras.join(', ')}]\n`;

  return output;
}

// 4. SPREAD OPERATOR CON OBJETOS
function spreadObjetos() {
  let output = '';

  const datosPersonales = { nombre: 'María', edad: 28 };
  const datosContacto = { email: 'maria@email.com', telefono: '123456789' };

  // Combinar objetos
  const perfilCompleto = { ...datosPersonales, ...datosContacto };
  output += `Perfil: ${JSON.stringify(perfilCompleto, null, 2)}\n\n`;

  // Actualizar propiedades
  const usuarioActualizado = { ...usuario, edad: 26, ciudad: 'Medellín' };
  output += `Usuario actualizado: ${JSON.stringify(
    usuarioActualizado,
    null,
    2
  )}\n\n`;

  // Combinar con nuevas propiedades
  const productoConDescuento = {
    ...productos[0],
    descuento: 15,
    precioFinal: productos[0].precio * 0.85,
  };
  output += `Producto con descuento: ${JSON.stringify(
    productoConDescuento,
    null,
    2
  )}\n`;

  return output;
}

// Ejecutar demos CORE
document.getElementById('destructuring-output').textContent =
  demostracionDestructuring() + '\n' + destructuringArrays();

document.getElementById('spread-output').textContent =
  spreadArrays() + '\n' + spreadObjetos();

// ========== FASE ENHANCED ⚡ (15 minutos) - Template Literals y Arrow Functions ==========
console.log('⚡ FASE ENHANCED - Template Literals y Arrow Functions');

// 1. TEMPLATE LITERALS BÁSICOS
function templateLiterals() {
  let output = '';

  const producto = productos[0];

  // Template literals básicos
  const descripcion = `
Producto: ${producto.nombre}
Precio: $${producto.precio.toLocaleString('es-CO')}
Categoría: ${producto.categoria.toUpperCase()}
`;
  output += descripcion + '\n';

  // Template literals con expresiones
  const descuento = 0.2;
  const conDescuento = `
OFERTA ESPECIAL:
${producto.nombre}
Precio original: $${producto.precio.toLocaleString('es-CO')}
Descuento: ${descuento * 100}%
¡Ahorra: $${(producto.precio * descuento).toLocaleString('es-CO')}!
Precio final: $${(producto.precio * (1 - descuento)).toLocaleString('es-CO')}
`;
  output += conDescuento + '\n';

  // Template literals para HTML
  const htmlCard = `
<div class="producto-oferta">
    <h3>${producto.nombre}</h3>
    <p class="precio-original">Antes: $${producto.precio.toLocaleString(
      'es-CO'
    )}</p>
    <p class="precio-descuento">Ahora: $${(
      producto.precio * 0.8
    ).toLocaleString('es-CO')}</p>
    <span class="ahorro">¡Ahorras ${(producto.precio * 0.2).toLocaleString(
      'es-CO'
    )}!</span>
</div>
`;
  output += 'HTML generado:\n' + htmlCard;

  return output;
}

// 2. ARROW FUNCTIONS BÁSICAS
function arrowFunctions() {
  let output = '';

  // Arrow functions básicas
  const sumar = (a, b) => a + b;
  const elevarAlCuadrado = x => x * x;
  const saludar = () => '¡Hola WorldSkills 2025!';

  output += `Suma 5 + 3 = ${sumar(5, 3)}\n`;
  output += `4 al cuadrado = ${elevarAlCuadrado(4)}\n`;
  output += `Saludo: ${saludar()}\n\n`;

  // Arrow functions con arrays (métodos críticos)
  const nombres = productos.map(p => p.nombre);
  const preciosFormatted = productos.map(
    p => `$${p.precio.toLocaleString('es-CO')}`
  );
  const productosCaros = productos.filter(p => p.precio > 100000);
  const totalValue = productos.reduce((sum, p) => sum + p.precio, 0);

  output += `Nombres: ${nombres.join(', ')}\n`;
  output += `Precios: ${preciosFormatted.join(', ')}\n`;
  output += `Productos caros: ${productosCaros.length} productos\n`;
  output += `Valor total inventario: $${totalValue.toLocaleString(
    'es-CO'
  )}\n\n`;

  // Arrow functions devolviendo objetos
  const crearUsuario = (nombre, edad) => ({
    nombre,
    edad,
    activo: true,
    fecha: new Date().toLocaleDateString(),
  });
  const calcularDescuento = precio => ({
    original: precio,
    descuento10: precio * 0.9,
    descuento20: precio * 0.8,
  });

  const nuevoUsuario = crearUsuario('Carlos', 32);
  const preciosConDescuento = calcularDescuento(100000);

  output += `Nuevo usuario: ${JSON.stringify(nuevoUsuario, null, 2)}\n\n`;
  output += `Precios con descuento: ${JSON.stringify(
    preciosConDescuento,
    null,
    2
  )}\n`;

  return output;
}

// 3. GENERAR HTML DINÁMICO CON TEMPLATE LITERALS
function generarProductosHTML() {
  const productosHTML = productos
    .map(
      producto => `
        <div class="producto-card">
            <h3>${producto.nombre}</h3>
            <p class="marca">ID: ${producto.id} | Categoría: ${
        producto.categoria
      }</p>
            <p class="precio">$${producto.precio.toLocaleString('es-CO')}</p>
            <span class="estado disponible">✅ Disponible</span>
        </div>
    `
    )
    .join('');

  document.getElementById('productos-container').innerHTML = productosHTML;
}

// Ejecutar demos ENHANCED
document.getElementById('template-output').textContent = templateLiterals();
document.getElementById('arrow-output').textContent = arrowFunctions();
generarProductosHTML();

// ========== FASE POLISH ✨ (5 minutos) - Best Practices ==========
console.log('✨ FASE POLISH - Best Practices y Modern Patterns');

function modernPatterns() {
  let output = '';

  // 1. const/let best practices
  const API_URL = 'https://api.ejemplo.com'; // const para constantes
  const configuracion = { theme: 'dark', lang: 'es' }; // const para objetos que no se reasignan
  let contador = 0; // let solo cuando se reasigna

  output += `Configuración inicial: ${JSON.stringify(configuracion)}\n`;

  // 2. Destructuring con defaults en funciones
  const crearConfiguracion = ({
    theme = 'light',
    language = 'es',
    notifications = true,
    darkMode = false,
  } = {}) => {
    return { theme, language, notifications, darkMode };
  };

  const config1 = crearConfiguracion(); // Todos los defaults
  const config2 = crearConfiguracion({ theme: 'dark', darkMode: true });

  output += `Config con defaults: ${JSON.stringify(config1)}\n`;
  output += `Config personalizada: ${JSON.stringify(config2)}\n\n`;

  // 3. Template literals avanzados para URLs y queries
  const crearURL = (base, endpoint, params = {}) => {
    const queryString = Object.entries(params)
      .filter(([key, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    return `${base}/${endpoint}${queryString ? '?' + queryString : ''}`;
  };

  const urlEjemplo = crearURL('https://api.tienda.com', 'productos', {
    categoria: 'tecnología',
    minPrecio: 50000,
    ordenPor: 'precio',
    limite: 10,
  });

  output += `URL generada: ${urlEjemplo}\n\n`;

  // 4. Spread operator para funciones inmutables
  const actualizarProducto = (producto, cambios) => ({
    ...producto,
    ...cambios,
  });
  const agregarDescuento = (productos, porcentaje) =>
    productos.map(p => ({
      ...p,
      precioOriginal: p.precio,
      precio: p.precio * (1 - porcentaje / 100),
      descuento: porcentaje,
    }));

  const productoActualizado = actualizarProducto(productos[0], {
    precio: 2200000,
    promocion: true,
  });

  const productosConDescuento = agregarDescuento(productos.slice(0, 2), 15);

  output += `Producto actualizado: ${JSON.stringify(
    productoActualizado,
    null,
    2
  )}\n\n`;
  output += `Productos con 15% descuento:\n${JSON.stringify(
    productosConDescuento,
    null,
    2
  )}\n`;

  return output;
}

// Ejecutar demo POLISH
document.getElementById('modern-output').textContent = modernPatterns();

// ========== EJERCICIOS PRÁCTICOS ==========

function ejecutarEjercicios() {
  console.log('\n🎯 EJECUTANDO EJERCICIOS PRÁCTICOS');

  // Ejercicio 1: Destructuring Mastery
  console.log('\n--- Ejercicio 1: Destructuring Mastery ---');

  const pedido = {
    id: 'PED-001',
    cliente: {
      nombre: 'Carlos Ruiz',
      email: 'carlos@email.com',
      direccion: {
        calle: 'Calle 123',
        ciudad: 'Bogotá',
        codigo: '110111',
      },
    },
    items: [
      { producto: 'Laptop', cantidad: 1, precio: 2500000 },
      { producto: 'Mouse', cantidad: 2, precio: 50000 },
    ],
    total: 2600000,
  };

  // SOLUCIÓN:
  const { id } = pedido;
  const {
    cliente: { nombre, email },
  } = pedido;
  const {
    cliente: {
      direccion: { ciudad },
    },
  } = pedido;
  const [primerItem] = pedido.items;
  const [, ...restoItems] = pedido.items;

  console.log('ID del pedido:', id);
  console.log('Cliente:', nombre, email);
  console.log('Ciudad:', ciudad);
  console.log('Primer item:', primerItem);
  console.log('Resto de items:', restoItems);

  // Ejercicio 2: Spread y Template Literals
  console.log('\n--- Ejercicio 2: Spread y Template Literals ---');

  const productos1 = ['Laptop', 'Mouse'];
  const productos2 = ['Teclado', 'Monitor'];
  const descuentos = { laptop: 10, mouse: 5 };
  const impuestos = { iva: 19 };

  // SOLUCIÓN:
  const todosProductos = [...productos1, ...productos2];
  const configCompleta = { ...descuentos, ...impuestos };

  const describirProducto = (nombre, precio) => `
        Producto: ${nombre}
        Precio base: $${precio.toLocaleString('es-CO')}
        Con IVA: $${(precio * 1.19).toLocaleString('es-CO')}
        Estado: Disponible en stock
    `;

  const calcularPrecioFinal = (precio, descuento, iva) => ({
    original: precio,
    conDescuento: precio * (1 - descuento / 100),
    conIva: precio * (1 - descuento / 100) * (1 + iva / 100),
    ahorrado: precio - precio * (1 - descuento / 100),
  });

  console.log('Todos los productos:', todosProductos);
  console.log('Configuración completa:', configCompleta);
  console.log(describirProducto('Laptop Gaming', 2500000));
  console.log('Cálculo precio final:', calcularPrecioFinal(100000, 15, 19));

  alert('¡Ejercicios completados! Revisa la consola para ver los resultados.');
}

// ========== UTILIDADES ADICIONALES ==========

// Función para marcar checklist automáticamente
function marcarChecklist() {
  // Marcar elementos CORE como completados
  document.getElementById('check-destructuring-obj').checked = true;
  document.getElementById('check-destructuring-arr').checked = true;
  document.getElementById('check-spread-arr').checked = true;
  document.getElementById('check-spread-obj').checked = true;

  // Marcar elementos ENHANCED
  document.getElementById('check-template').checked = true;
  document.getElementById('check-arrow').checked = true;
  document.getElementById('check-array-methods').checked = true;
  document.getElementById('check-html-gen').checked = true;

  // Marcar elementos POLISH
  document.getElementById('check-const-let').checked = true;
  document.getElementById('check-best-practices').checked = true;
  document.getElementById('check-defaults').checked = true;
  document.getElementById('check-advanced-template').checked = true;
}

// Marcar checklist después de 5 segundos (simulando que el estudiante completó)
setTimeout(marcarChecklist, 5000);

// Función para calcular progreso
function calcularProgreso() {
  const checkboxes = document.querySelectorAll(
    '.checklist input[type="checkbox"]'
  );
  const marcados = document.querySelectorAll(
    '.checklist input[type="checkbox"]:checked'
  );
  const progreso = (marcados.length / checkboxes.length) * 100;

  console.log(
    `📊 Progreso: ${marcados.length}/${checkboxes.length} (${progreso.toFixed(
      1
    )}%)`
  );
  return progreso;
}

// Evaluar progreso cada 30 segundos
setInterval(calcularProgreso, 30000);

console.log('🚀 ES6 Syntax Esencial cargado correctamente');
console.log(
  '⏱️ Timer iniciado: 30 minutos para completar todos los ejercicios'
);
console.log('📝 Revisa los ejemplos y completa el checklist');
console.log('🎯 Meta mínima: Completar toda la fase CORE (verde)');

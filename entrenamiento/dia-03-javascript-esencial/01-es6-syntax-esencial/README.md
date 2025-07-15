# 🚀 ES6 Syntax Esencial - Implementación MVP

**⏰ Duración:** 30 minutos  
**🎯 Objetivo:** Dominar sintaxis ES6+ crítica para WorldSkills

## 📚 Metodología MVP

### **FASE CORE ✅ (10 minutos) - Sintaxis Fundamental**

**Funcionalidad esencial:** Destructuring y spread operator

#### **🔧 Destructuring - Objetos y Arrays**

```javascript
// ========== FASE CORE ✅ ==========
// Funcionalidad: Destructuring básico

// Destructuring de objetos
const usuario = {
  nombre: 'Ana García',
  edad: 25,
  email: 'ana@email.com',
  ciudad: 'Bogotá',
};

// CORE: Destructuring básico
const { nombre, edad } = usuario;
console.log(nombre, edad); // Ana García 25

// Destructuring con renombrado
const { email: correo, ciudad: location } = usuario;
console.log(correo, location); // ana@email.com Bogotá

// Destructuring de arrays
const colores = ['rojo', 'verde', 'azul', 'amarillo'];
const [primero, segundo, ...resto] = colores;
console.log(primero); // rojo
console.log(segundo); // verde
console.log(resto); // ['azul', 'amarillo']

// Destructuring en parámetros de función
function presentarUsuario({ nombre, edad, ciudad = 'Sin especificar' }) {
  return `${nombre}, ${edad} años, de ${ciudad}`;
}

console.log(presentarUsuario(usuario));
```

#### **🔧 Spread Operator - Arrays y Objetos**

```javascript
// ========== FASE CORE ✅ ==========
// Funcionalidad: Spread operator básico

// Spread con arrays
const numeros1 = [1, 2, 3];
const numeros2 = [4, 5, 6];
const todosNumeros = [...numeros1, ...numeros2];
console.log(todosNumeros); // [1, 2, 3, 4, 5, 6]

// Copiar array
const numerosCopia = [...numeros1];
numerosCopia.push(4);
console.log(numeros1); // [1, 2, 3] - original intacto
console.log(numerosCopia); // [1, 2, 3, 4]

// Spread con objetos
const datosPersonales = { nombre: 'Juan', edad: 30 };
const datosContacto = { email: 'juan@email.com', telefono: '123456789' };
const perfilCompleto = { ...datosPersonales, ...datosContacto };
console.log(perfilCompleto);
// { nombre: 'Juan', edad: 30, email: 'juan@email.com', telefono: '123456789' }

// Actualizar propiedades
const usuarioActualizado = { ...usuario, edad: 26, ciudad: 'Medellín' };
console.log(usuarioActualizado);
```

### **FASE ENHANCED ⚡ (15 minutos) - Sintaxis Moderna**

**Mejoras:** Template literals y arrow functions

#### **⚡ Template Literals**

```javascript
// ========== FASE ENHANCED ⚡ ==========
// Mejoras: Template literals y interpolación

const producto = {
  nombre: 'Laptop Gaming',
  precio: 2500000,
  marca: 'TechPro',
  disponible: true,
};

// Template literals básicos
const descripcion = `
  Producto: ${producto.nombre}
  Marca: ${producto.marca}
  Precio: $${producto.precio.toLocaleString('es-CO')}
  Estado: ${producto.disponible ? 'Disponible' : 'Agotado'}
`;

console.log(descripcion);

// Template literals con expresiones
const descuento = 0.15;
const precioConDescuento = `
  Precio original: $${producto.precio.toLocaleString('es-CO')}
  Descuento: ${descuento * 100}%
  Precio final: $${(producto.precio * (1 - descuento)).toLocaleString('es-CO')}
`;

console.log(precioConDescuento);

// Template literals para HTML
function crearCardProducto(producto) {
  return `
    <div class="producto-card">
      <h3>${producto.nombre}</h3>
      <p class="marca">${producto.marca}</p>
      <p class="precio">$${producto.precio.toLocaleString('es-CO')}</p>
      <span class="estado ${producto.disponible ? 'disponible' : 'agotado'}">
        ${producto.disponible ? '✅ Disponible' : '❌ Agotado'}
      </span>
    </div>
  `;
}

document.getElementById('productos-container').innerHTML =
  crearCardProducto(producto);
```

#### **⚡ Arrow Functions Modernas**

```javascript
// ========== FASE ENHANCED ⚡ ==========
// Mejoras: Arrow functions y contexto

// Arrow function básica
const sumar = (a, b) => a + b;
const elevarAlCuadrado = x => x * x;
const saludar = () => 'Hola WorldSkills!';

console.log(sumar(5, 3)); // 8
console.log(elevarAlCuadrado(4)); // 16
console.log(saludar()); // Hola WorldSkills!

// Arrow functions con arrays
const productos = [
  { nombre: 'Laptop', precio: 2500000 },
  { nombre: 'Mouse', precio: 50000 },
  { nombre: 'Teclado', precio: 150000 },
];

// Más conciso con arrow functions
const nombres = productos.map(p => p.nombre);
const preciosFormatted = productos.map(
  p => `$${p.precio.toLocaleString('es-CO')}`
);
const productosCaros = productos.filter(p => p.precio > 100000);

console.log(nombres); // ['Laptop', 'Mouse', 'Teclado']
console.log(preciosFormatted); // ['$2.500.000', '$50.000', '$150.000']
console.log(productosCaros); // [{nombre: 'Laptop', precio: 2500000}, {nombre: 'Teclado', precio: 150000}]

// Arrow functions con objetos (cuidado con el return implícito)
const crearUsuario = (nombre, edad) => ({ nombre, edad, activo: true });
const duplicarNumero = num => ({ original: num, duplicado: num * 2 });

console.log(crearUsuario('María', 28)); // {nombre: 'María', edad: 28, activo: true}
console.log(duplicarNumero(7)); // {original: 7, duplicado: 14}
```

### **FASE POLISH ✨ (5 minutos) - Best Practices**

**Optimizaciones:** const/let y mejores prácticas

#### **✨ const/let Best Practices**

```javascript
// ========== FASE POLISH ✨ ==========
// Optimizaciones: const/let y clean code

// REGLA 1: const por defecto, let solo si reasignas
const PI = 3.14159;
const usuarios = []; // const para el array, pero puedes modificar contenido
let contador = 0; // let porque se reasignará

// CORRECTO: modificar contenido de const
usuarios.push({ nombre: 'Ana', edad: 25 });
usuarios.push({ nombre: 'Luis', edad: 30 });
console.log(usuarios); // Funciona perfectamente

// CORRECTO: reasignar let
contador = contador + 1;
contador += 1;
contador++;

// REGLA 2: Scope de bloque
function demostrarScope() {
  const global = 'Disponible en toda la función';

  if (true) {
    const bloque = 'Solo disponible en este bloque';
    let variable = 'También de bloque';
    console.log(global); // ✅ Accesible
    console.log(bloque); // ✅ Accesible
  }

  console.log(global); // ✅ Accesible
  // console.log(bloque); // ❌ Error: no está definida
}

// REGLA 3: Destructuring con defaults
function configurarApp({
  theme = 'light',
  language = 'es',
  notifications = true,
} = {}) {
  return {
    theme,
    language,
    notifications,
  };
}

console.log(configurarApp()); // Usa todos los defaults
console.log(configurarApp({ theme: 'dark' })); // Solo cambia theme

// REGLA 4: Template literals para strings dinámicos
const crearMensaje = (nombre, accion, tiempo) =>
  `${nombre} realizó la acción "${accion}" hace ${tiempo} minutos`;

const crearURL = (base, endpoint, params = {}) => {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return `${base}/${endpoint}${queryString ? '?' + queryString : ''}`;
};

console.log(
  crearURL('https://api.example.com', 'users', { page: 1, limit: 10 })
);
// https://api.example.com/users?page=1&limit=10
```

## 🎯 Ejercicios Prácticos

### **Ejercicio 1: Destructuring Mastery (5 min)**

```javascript
// Dado este objeto, extrae la información usando destructuring
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

// TODO: Extrae usando destructuring:
// 1. id del pedido
// 2. nombre y email del cliente
// 3. ciudad de la dirección
// 4. primer item del array
// 5. todos los items excepto el primero

// Tu código aquí:
```

### **Ejercicio 2: Spread y Template Literals (5 min)**

```javascript
// Usa spread operator y template literals para:
const productos1 = ['Laptop', 'Mouse'];
const productos2 = ['Teclado', 'Monitor'];
const descuentos = { laptop: 10, mouse: 5 };
const impuestos = { iva: 19 };

// TODO:
// 1. Combinar ambos arrays de productos
// 2. Crear un objeto que combine descuentos e impuestos
// 3. Crear una función que genere descripción de producto con template literals
// 4. Crear función arrow que calcule precio final con descuento e impuesto

// Tu código aquí:
```

## 📝 Checklist de Validación

### **CORE (✅ Obligatorio)**

- [ ] Destructuring de objetos funciona
- [ ] Destructuring de arrays funciona
- [ ] Spread operator con arrays funciona
- [ ] Spread operator con objetos funciona

### **ENHANCED (⚡ Importante)**

- [ ] Template literals con interpolación
- [ ] Arrow functions básicas implementadas
- [ ] Array methods con arrow functions
- [ ] HTML generation con template literals

### **POLISH (✨ Opcional)**

- [ ] const/let usado apropiadamente
- [ ] Best practices aplicadas
- [ ] Destructuring con defaults
- [ ] Template literals avanzados

## ⏱️ Timeboxing

- **00:00-10:00**: CORE - Destructuring y spread
- **10:00-25:00**: ENHANCED - Template literals y arrows
- **25:00-30:00**: POLISH - Best practices

**¡Si no terminas en tiempo, documenta y avanza al siguiente ejercicio!**

## 🎖️ Criterios de Evaluación

| Criterio          | CORE (5pts)             | ENHANCED (3pts)             | POLISH (2pts)            |
| ----------------- | ----------------------- | --------------------------- | ------------------------ |
| **Sintaxis**      | Sin errores de sintaxis | Código limpio y legible     | Best practices aplicadas |
| **Funcionalidad** | Destructuring funciona  | Template literals correctos | Optimización evidente    |
| **Modernidad**    | ES6+ syntax básico      | Arrow functions apropiadas  | const/let correcto       |

**Mínimo requerido:** 5/10 puntos (CORE completo)

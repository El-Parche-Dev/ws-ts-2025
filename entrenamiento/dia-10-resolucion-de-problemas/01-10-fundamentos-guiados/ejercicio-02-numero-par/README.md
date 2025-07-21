# 🧩 Ejercicio 02: Verificador de Números Pares

## 🎯 FASE CORE ✅ (Tiempo estimado: 8 minutos)

### **Problema**

Crear una función que determine si un número es par o impar.

### **Entrada**

- Un número entero `n`

### **Salida**

- `true` si el número es par
- `false` si el número es impar

### **Ejemplo**

```javascript
esPar(4); // → true
esPar(7); // → false
esPar(0); // → true
```

## 📋 ANÁLISIS PASO A PASO

### **Paso 1: Comprensión del Problema**

Un número es par si es divisible entre 2 (resto de la división es 0).

### **Paso 2: Identificar Estrategia**

- Usar el operador módulo `%` para obtener el resto
- Si `n % 2 === 0`, entonces es par

### **Paso 3: Pseudocódigo**

```text
FUNCIÓN esPar(n)
    RETORNAR n % 2 === 0
FIN FUNCIÓN
```

### **Paso 4: Implementación**

```javascript
function esPar(numero) {
  return numero % 2 === 0;
}
```

### **Paso 5: Casos de Prueba**

```javascript
// Casos básicos
console.log(esPar(2)); // true
console.log(esPar(3)); // false
console.log(esPar(0)); // true

// Casos edge
console.log(esPar(-2)); // true
console.log(esPar(-3)); // false
```

## ⚡ FASE ENHANCED (Tiempo estimado: 4 minutos)

### **Versión Mejorada con Validación**

```javascript
function esParMejorado(numero) {
  // Validar entrada
  if (typeof numero !== 'number' || !Number.isInteger(numero)) {
    throw new Error('El parámetro debe ser un número entero');
  }

  return numero % 2 === 0;
}
```

## ✨ FASE POLISH (Tiempo estimado: 3 minutos)

### **Versión Completa con Documentación**

```javascript
/**
 * Determina si un número entero es par
 * @param {number} numero - El número a verificar
 * @returns {boolean} true si es par, false si es impar
 * @throws {Error} Si el parámetro no es un número entero
 */
function esPar(numero) {
  if (typeof numero !== 'number' || !Number.isInteger(numero)) {
    throw new Error('El parámetro debe ser un número entero');
  }

  return numero % 2 === 0;
}

// Versión con arrow function
const esParArrow = numero => numero % 2 === 0;
```

## 🧪 TESTING

```javascript
// test-ejercicio-02.js
const { esPar } = require('./solucion');

describe('Ejercicio 02: Verificador de Números Pares', () => {
  test('debe identificar números pares correctamente', () => {
    expect(esPar(2)).toBe(true);
    expect(esPar(4)).toBe(true);
    expect(esPar(0)).toBe(true);
    expect(esPar(-2)).toBe(true);
  });

  test('debe identificar números impares correctamente', () => {
    expect(esPar(1)).toBe(false);
    expect(esPar(3)).toBe(false);
    expect(esPar(-1)).toBe(false);
    expect(esPar(-3)).toBe(false);
  });

  test('debe manejar casos extremos', () => {
    expect(esPar(1000)).toBe(true);
    expect(esPar(1001)).toBe(false);
  });
});
```

## 📝 ENTREGABLES

1. **solucion.js** - Tu implementación
2. **test-ejercicio-02.js** - Tests automatizados
3. **analisis.md** - Tu proceso de pensamiento

## 🎯 RÚBRICA DE EVALUACIÓN

- ✅ **Funcionalidad (40%)**: Solución correcta y completa
- ✅ **Código limpio (25%)**: Legible, bien estructurado
- ✅ **Testing (20%)**: Casos de prueba comprensivos
- ✅ **Documentación (15%)**: Análisis claro del proceso

## 💡 CONCEPTOS CLAVE APRENDIDOS

- **Operador módulo (`%`)**: Para verificar divisibilidad
- **Valores booleanos**: Retorno directo de expresiones
- **Validación de tipos**: Manejo robusto de entrada
- **Arrow functions**: Sintaxis moderna ES6+

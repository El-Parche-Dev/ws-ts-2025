# 🧩 Ejercicio 01: Suma de Array

## 🎯 FASE CORE ✅ (Tiempo estimado: 8 minutos)

### **Problema**

Crear una función que calcule la suma de todos los números en un array.

### **Entrada**

- Un array de números `numeros`

### **Salida**

- La suma total de todos los elementos

### **Ejemplo**

```javascript
sumaArray([1, 2, 3, 4, 5]); // → 15
sumaArray([10, -5, 3]); // → 8
sumaArray([]); // → 0
```

## 📋 ANÁLISIS PASO A PASO

### **Paso 1: Comprensión del Problema**

Necesitamos recorrer todos los elementos del array y sumarlos. Es el problema más básico de iteración y acumulación.

### **Paso 2: Identificar Estrategia**

- Usar una variable acumuladora inicializada en 0
- Recorrer el array elemento por elemento
- Sumar cada elemento al acumulador
- Retornar el resultado final

### **Paso 3: Pseudocódigo**

```text
FUNCIÓN sumaArray(numeros)
    suma = 0
    PARA cada numero EN numeros
        suma = suma + numero
    FIN PARA
    RETORNAR suma
FIN FUNCIÓN
```

### **Paso 4: Implementación**

```javascript
function sumaArray(numeros) {
  let suma = 0;
  for (let i = 0; i < numeros.length; i++) {
    suma += numeros[i];
  }
  return suma;
}
```

### **Paso 5: Casos de Prueba**

```javascript
// Casos básicos
console.log(sumaArray([1, 2, 3])); // 6
console.log(sumaArray([10, 20])); // 30
console.log(sumaArray([5])); // 5

// Casos edge
console.log(sumaArray([])); // 0
console.log(sumaArray([-1, 1])); // 0
console.log(sumaArray([-5, -3])); // -8
```

## ⚡ FASE ENHANCED (Tiempo estimado: 4 minutos)

### **Versión con Validación**

```javascript
function sumaArray(numeros) {
  // Validar entrada
  if (!Array.isArray(numeros)) {
    throw new Error('El parámetro debe ser un array');
  }

  let suma = 0;
  for (let i = 0; i < numeros.length; i++) {
    if (typeof numeros[i] !== 'number') {
      throw new Error(`Elemento en índice ${i} no es un número`);
    }
    suma += numeros[i];
  }

  return suma;
}
```

### **Versión con Reduce**

```javascript
function sumaArrayReduce(numeros) {
  if (!Array.isArray(numeros)) {
    throw new Error('El parámetro debe ser un array');
  }

  return numeros.reduce((suma, numero) => {
    if (typeof numero !== 'number') {
      throw new Error('Todos los elementos deben ser números');
    }
    return suma + numero;
  }, 0);
}
```

## ✨ FASE POLISH (Tiempo estimado: 3 minutos)

### **Versión Completa con Documentación**

```javascript
/**
 * Calcula la suma de todos los números en un array
 * @param {number[]} numeros - Array de números a sumar
 * @param {boolean} ignorarNoNumeros - Si ignorar elementos que no son números
 * @returns {number} La suma total de todos los números
 * @throws {Error} Si el parámetro no es un array
 */
function sumaArray(numeros, ignorarNoNumeros = false) {
  if (!Array.isArray(numeros)) {
    throw new Error('El parámetro debe ser un array');
  }

  return numeros.reduce((suma, elemento, indice) => {
    if (typeof elemento !== 'number') {
      if (ignorarNoNumeros) {
        return suma; // Ignorar elementos no numéricos
      } else {
        throw new Error(
          `Elemento en índice ${indice} no es un número: ${elemento}`
        );
      }
    }
    return suma + elemento;
  }, 0);
}

// Versiones alternativas
const sumaArrayFor = numeros => {
  let suma = 0;
  for (const numero of numeros) {
    suma += numero;
  }
  return suma;
};

const sumaArrayRecursiva = numeros => {
  if (numeros.length === 0) return 0;
  return numeros[0] + sumaArrayRecursiva(numeros.slice(1));
};
```

## 🧪 TESTING

```javascript
// test-ejercicio-01.js
const { sumaArray } = require('./solucion');

describe('Ejercicio 01: Suma de Array', () => {
  test('debe sumar números positivos correctamente', () => {
    expect(sumaArray([1, 2, 3, 4, 5])).toBe(15);
    expect(sumaArray([10, 20, 30])).toBe(60);
  });

  test('debe manejar números negativos', () => {
    expect(sumaArray([-1, -2, -3])).toBe(-6);
    expect(sumaArray([-5, 5])).toBe(0);
  });

  test('debe manejar array vacío', () => {
    expect(sumaArray([])).toBe(0);
  });

  test('debe manejar array con un elemento', () => {
    expect(sumaArray([42])).toBe(42);
  });

  test('debe validar entrada', () => {
    expect(() => sumaArray('not an array')).toThrow();
    expect(() => sumaArray(null)).toThrow();
  });

  test('debe manejar números decimales', () => {
    expect(sumaArray([1.5, 2.3, 3.2])).toBeCloseTo(7.0, 1);
  });
});
```

## 📝 ENTREGABLES

1. **solucion.js** - Tu implementación
2. **test-ejercicio-01.js** - Tests automatizados
3. **analisis.md** - Tu proceso de pensamiento

## 🎯 RÚBRICA DE EVALUACIÓN

- ✅ **Funcionalidad (40%)**: Solución correcta y completa
- ✅ **Código limpio (25%)**: Legible, bien estructurado
- ✅ **Testing (20%)**: Casos de prueba comprensivos
- ✅ **Documentación (15%)**: Análisis claro del proceso

## 💡 CONCEPTOS CLAVE APRENDIDOS

- **Loops**: for tradicional, for...of
- **Acumuladores**: Patrón suma += valor
- **Array methods**: reduce() para operaciones de agregación
- **Validación de entrada**: Array.isArray(), typeof
- **Recursión**: Caso base y llamada recursiva
- **Testing**: Casos normales, edge cases, validación

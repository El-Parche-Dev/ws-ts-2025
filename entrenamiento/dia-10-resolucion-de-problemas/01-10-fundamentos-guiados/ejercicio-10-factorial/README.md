# 🧩 Ejercicio 10: Calculadora de Factorial

## 🎯 FASE CORE ✅ (Tiempo estimado: 10 minutos)

### **Problema**

Calcular el factorial de un número (n! = n × (n-1) × ... × 1).

### **Ejemplo**

```javascript
factorial(5); // → 120 (5 × 4 × 3 × 2 × 1)
factorial(0); // → 1 (por definición)
factorial(3); // → 6 (3 × 2 × 1)
```

## 📋 IMPLEMENTACIÓN

### **Versión Iterativa**

```javascript
function factorial(n) {
  if (n < 0) {
    throw new Error('El factorial no está definido para números negativos');
  }

  if (n === 0 || n === 1) {
    return 1;
  }

  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }

  return resultado;
}
```

### **Versión Recursiva**

```javascript
function factorialRecursivo(n) {
  if (n < 0) {
    throw new Error('El factorial no está definido para números negativos');
  }

  if (n === 0 || n === 1) {
    return 1;
  }

  return n * factorialRecursivo(n - 1);
}
```

### **Versión con Memoización**

```javascript
const factorialMemo = (() => {
  const cache = { 0: 1, 1: 1 };

  return function (n) {
    if (n < 0) {
      throw new Error('El factorial no está definido para números negativos');
    }

    if (n in cache) {
      return cache[n];
    }

    cache[n] = n * factorialMemo(n - 1);
    return cache[n];
  };
})();
```

### **Versión con BigInt (para números grandes)**

```javascript
function factorialBigInt(n) {
  if (n < 0) {
    throw new Error('El factorial no está definido para números negativos');
  }

  if (n === 0 || n === 1) {
    return 1n;
  }

  let resultado = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    resultado *= i;
  }

  return resultado;
}
```

## 🧪 CASOS DE PRUEBA

```javascript
// Casos básicos
console.log(factorial(0)); // 1
console.log(factorial(1)); // 1
console.log(factorial(5)); // 120

// Casos especiales
console.log(factorial(10)); // 3628800

// Números grandes con BigInt
console.log(factorialBigInt(20)); // 2432902008176640000n
```

## 💡 CONCEPTOS CLAVE

- **Recursión**: Caso base y caso recursivo
- **Iteración**: Loops for tradicionales
- **Memoización**: Optimización con cache
- **BigInt**: Manejo de números enteros grandes
- **Validación**: Manejo de casos edge

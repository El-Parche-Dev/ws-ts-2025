# 🧩 Ejercicio 09: Generador de Números Primos

## 🎯 FASE CORE ✅ (Tiempo estimado: 12 minutos)

### **Problema**

Determinar si un número es primo y generar una lista de números primos.

### **Ejemplo**

```javascript
esPrimo(7); // → true
esPrimo(8); // → false
esPrimo(2); // → true
generarPrimos(10); // → [2, 3, 5, 7]
```

## 📋 ANÁLISIS PASO A PASO

### **Paso 1: Comprensión del Problema**

Un número primo es divisible solo por 1 y por sí mismo. Necesitamos verificar si un número es primo y generar todos los primos hasta un límite.

### **Paso 2: Identificar Estrategia**

- **Para verificar si es primo**: Probar divisibilidad desde 2 hasta √n
- **Para generar lista**: Usar función esPrimo en loop o aplicar Criba de Eratóstenes
- **Optimización**: Solo verificar números impares después del 2

### **Paso 3: Pseudocódigo**

```text
FUNCIÓN esPrimo(numero)
    SI numero < 2 RETORNAR false
    SI numero === 2 RETORNAR true
    SI numero % 2 === 0 RETORNAR false

    PARA i DESDE 3 HASTA √numero (incremento 2)
        SI numero % i === 0
            RETORNAR false
        FIN SI
    FIN PARA
    RETORNAR true
FIN FUNCIÓN

FUNCIÓN generarPrimos(limite)
    primos = []
    PARA i DESDE 2 HASTA limite
        SI esPrimo(i)
            primos.push(i)
        FIN SI
    FIN PARA
    RETORNAR primos
FIN FUNCIÓN
```

## 📋 IMPLEMENTACIÓN

### **Función esPrimo Básica**

```javascript
function esPrimo(numero) {
  if (numero < 2) return false;
  if (numero === 2) return true;
  if (numero % 2 === 0) return false;

  for (let i = 3; i <= Math.sqrt(numero); i += 2) {
    if (numero % i === 0) {
      return false;
    }
  }

  return true;
}
```

### **Generador de Primos**

```javascript
function generarPrimos(limite) {
  const primos = [];

  for (let i = 2; i <= limite; i++) {
    if (esPrimo(i)) {
      primos.push(i);
    }
  }

  return primos;
}
```

### **Versión Optimizada - Criba de Eratóstenes**

```javascript
function generarPrimosCriba(limite) {
  if (limite < 2) return [];

  const esPrimoArray = new Array(limite + 1).fill(true);
  esPrimoArray[0] = esPrimoArray[1] = false;

  for (let i = 2; i * i <= limite; i++) {
    if (esPrimoArray[i]) {
      for (let j = i * i; j <= limite; j += i) {
        esPrimoArray[j] = false;
      }
    }
  }

  const primos = [];
  for (let i = 2; i <= limite; i++) {
    if (esPrimoArray[i]) {
      primos.push(i);
    }
  }

  return primos;
}
```

## 💡 CONCEPTOS CLAVE

- **Algoritmos matemáticos**: Prueba de primalidad
- **Optimización**: Math.sqrt() para límite
- **Criba de Eratóstenes**: Algoritmo clásico
- **Array manipulation**: fill(), push()

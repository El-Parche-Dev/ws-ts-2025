# 🧩 Ejercicio 06: Palíndromo Detector

## 🎯 FASE CORE ✅ (Tiempo estimado: 10 minutos)

### **Problema**

Determinar si una palabra es un palíndromo (se lee igual al derecho y al revés).

### **Ejemplo**

```javascript
esPalindromo('radar'); // → true
esPalindromo('hola'); // → false
esPalindromo('reconocer'); // → true
```

## 📋 ANÁLISIS PASO A PASO

### **Paso 1: Comprensión del Problema**

Un palíndromo se lee igual de izquierda a derecha que de derecha a izquierda. Necesitamos comparar la cadena original con su versión invertida.

### **Paso 2: Identificar Estrategia**

- **Estrategia 1**: Invertir la cadena y compararla con la original
- **Estrategia 2**: Usar dos punteros (inicio y fin) comparando caracteres
- **Consideración**: Normalizar el texto (mayúsculas/minúsculas, espacios)

### **Paso 3: Pseudocódigo**

```text
FUNCIÓN esPalindromo(str)
    // Limpiar y normalizar
    limpio = str.toLowerCase().replace(espacios y puntuación, '')

    // Método 1: Comparación con invertido
    invertido = limpio.split('').reverse().join('')
    RETORNAR limpio === invertido

    // Método 2: Two pointers
    inicio = 0, fin = limpio.length - 1
    MIENTRAS inicio < fin
        SI limpio[inicio] !== limpio[fin]
            RETORNAR false
        inicio++, fin--
    FIN MIENTRAS
    RETORNAR true
FIN FUNCIÓN
```

## 📋 IMPLEMENTACIÓN

### **Versión Básica**

```javascript
function esPalindromo(str) {
  const limpio = str.toLowerCase();
  const invertido = limpio.split('').reverse().join('');
  return limpio === invertido;
}
```

### **Versión Optimizada**

```javascript
function esPalindromo(str) {
  const limpio = str.toLowerCase().replace(/[^a-z]/g, '');
  let inicio = 0;
  let fin = limpio.length - 1;

  while (inicio < fin) {
    if (limpio[inicio] !== limpio[fin]) {
      return false;
    }
    inicio++;
    fin--;
  }
  return true;
}
```

## 💡 CONCEPTOS CLAVE

- **String manipulation**: toLowerCase(), replace()
- **Two pointers**: Técnica de dos punteros
- **Regex**: Limpiar caracteres especiales

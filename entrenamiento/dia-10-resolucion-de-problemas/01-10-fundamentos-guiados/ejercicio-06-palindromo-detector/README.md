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

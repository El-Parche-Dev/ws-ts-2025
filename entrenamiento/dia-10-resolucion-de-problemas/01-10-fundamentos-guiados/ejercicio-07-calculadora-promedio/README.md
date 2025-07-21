# 🧩 Ejercicio 07: Calculadora de Promedio

## 🎯 FASE CORE ✅ (Tiempo estimado: 8 minutos)

### **Problema**

Calcular el promedio de un array de números.

### **Ejemplo**

```javascript
calcularPromedio([1, 2, 3, 4, 5]); // → 3
calcularPromedio([10, 20, 30]); // → 20
calcularPromedio([7]); // → 7
```

## 📋 IMPLEMENTACIÓN

### **Versión Básica**

```javascript
function calcularPromedio(numeros) {
  if (numeros.length === 0) return 0;

  let suma = 0;
  for (let i = 0; i < numeros.length; i++) {
    suma += numeros[i];
  }

  return suma / numeros.length;
}
```

### **Versión con Reduce**

```javascript
function calcularPromedio(numeros) {
  if (numeros.length === 0) return 0;

  const suma = numeros.reduce((acc, num) => acc + num, 0);
  return suma / numeros.length;
}
```

### **Versión Completa**

```javascript
function calcularPromedio(numeros, decimales = 2) {
  if (!Array.isArray(numeros)) {
    throw new Error('Se requiere un array de números');
  }

  if (numeros.length === 0) return 0;

  const suma = numeros.reduce((acc, num) => {
    if (typeof num !== 'number') {
      throw new Error('Todos los elementos deben ser números');
    }
    return acc + num;
  }, 0);

  const promedio = suma / numeros.length;
  return (
    Math.round(promedio * Math.pow(10, decimales)) / Math.pow(10, decimales)
  );
}
```

## 💡 CONCEPTOS CLAVE

- **Array methods**: reduce(), forEach()
- **Validación**: Array.isArray(), typeof
- **Precisión decimal**: Math.round() con potencias

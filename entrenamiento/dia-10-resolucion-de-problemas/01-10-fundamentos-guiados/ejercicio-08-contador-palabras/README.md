# 🧩 Ejercicio 08: Contador de Palabras

## 🎯 FASE CORE ✅ (Tiempo estimado: 10 minutos)

### **Problema**

Contar el número de palabras en una cadena de texto.

### **Ejemplo**

```javascript
contarPalabras('Hola mundo'); // → 2
contarPalabras('  espacios   extra  '); // → 2
contarPalabras('Una sola palabra'); // → 3
```

## 📋 IMPLEMENTACIÓN

### **Versión Básica**

```javascript
function contarPalabras(texto) {
  if (texto.trim() === '') return 0;
  return texto.trim().split(' ').length;
}
```

### **Versión Mejorada**

```javascript
function contarPalabras(texto) {
  if (typeof texto !== 'string') {
    throw new Error('El parámetro debe ser una cadena');
  }

  // Limpiar espacios extra y dividir por espacios
  const palabras = texto.trim().split(/\s+/);

  // Si después de limpiar queda una cadena vacía
  if (palabras.length === 1 && palabras[0] === '') {
    return 0;
  }

  return palabras.length;
}
```

### **Versión Avanzada**

```javascript
function contarPalabras(texto, ignorarPuntuacion = false) {
  if (typeof texto !== 'string') {
    throw new Error('El parámetro debe ser una cadena');
  }

  if (texto.trim() === '') return 0;

  let textoLimpio = texto.trim();

  if (ignorarPuntuacion) {
    // Remover puntuación pero mantener espacios
    textoLimpio = textoLimpio.replace(/[^\w\s]/g, '');
  }

  // Dividir por uno o más espacios en blanco
  const palabras = textoLimpio
    .split(/\s+/)
    .filter(palabra => palabra.length > 0);

  return palabras.length;
}
```

## 💡 CONCEPTOS CLAVE

- **String methods**: trim(), split()
- **Regex**: \s+ para espacios múltiples
- **Array methods**: filter() para limpiar resultados

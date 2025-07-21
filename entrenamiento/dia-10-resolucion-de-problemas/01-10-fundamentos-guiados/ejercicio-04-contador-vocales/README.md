# 🧩 Ejercicio 04: Contador de Vocales

## 🎯 FASE CORE ✅ (Tiempo estimado: 10 minutos)

### **Problema**

Crear una función que cuente el número de vocales en una cadena de texto.

### **Entrada**

- Una cadena de texto `str`

### **Salida**

- El número total de vocales (a, e, i, o, u)

### **Ejemplo**

```javascript
contarVocales('hola'); // → 2
contarVocales('murcielago'); // → 5
contarVocales('xyz'); // → 0
```

## 📋 ANÁLISIS PASO A PASO

### **Paso 1: Comprensión del Problema**

Recorrer cada carácter y verificar si es una vocal (considerando mayúsculas/minúsculas).

### **Paso 2: Estrategia**

- Definir las vocales: "aeiouAEIOU"
- Recorrer la cadena carácter por carácter
- Contar coincidencias

### **Paso 3: Implementación Core**

```javascript
function contarVocales(str) {
  const vocales = 'aeiouAEIOU';
  let contador = 0;

  for (let i = 0; i < str.length; i++) {
    if (vocales.includes(str[i])) {
      contador++;
    }
  }

  return contador;
}
```

## ⚡ FASE ENHANCED (Tiempo estimado: 5 minutos)

### **Versión con Regex**

```javascript
function contarVocales(str) {
  if (typeof str !== 'string') {
    throw new Error('El parámetro debe ser una cadena');
  }

  const vocales = str.match(/[aeiouAEIOU]/g);
  return vocales ? vocales.length : 0;
}
```

## ✨ FASE POLISH (Tiempo estimado: 3 minutos)

### **Contador Avanzado**

```javascript
function contarVocales(str, incluirAcentos = false) {
  if (typeof str !== 'string') {
    throw new Error('El parámetro debe ser una cadena');
  }

  const vocalesBasicas = /[aeiouAEIOU]/g;
  const vocalesConAcentos = /[aeiouAEIOUáéíóúÁÉÍÓÚ]/g;

  const regex = incluirAcentos ? vocalesConAcentos : vocalesBasicas;
  const vocales = str.match(regex);

  return vocales ? vocales.length : 0;
}
```

## 💡 CONCEPTOS CLAVE

- **String methods**: includes(), match()
- **Expresiones regulares**: Patterns básicos
- **Loops**: for tradicional vs métodos de array

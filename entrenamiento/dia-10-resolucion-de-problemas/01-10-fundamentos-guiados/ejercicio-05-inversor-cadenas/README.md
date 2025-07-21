# 🧩 Ejercicio 05: Inversor de Cadenas

## 🎯 FASE CORE ✅ (Tiempo estimado: 8 minutos)

### **Problema**

Crear una función que invierta una cadena de texto.

### **Ejemplo**

```javascript
invertirCadena('hola'); // → "aloh"
invertirCadena('mundo'); // → "odnum"
invertirCadena('a'); // → "a"
```

## 📋 IMPLEMENTACIÓN

### **Método 1: Split + Reverse + Join**

```javascript
function invertirCadena(str) {
  return str.split('').reverse().join('');
}
```

### **Método 2: Loop Manual**

```javascript
function invertirCadena(str) {
  let resultado = '';
  for (let i = str.length - 1; i >= 0; i--) {
    resultado += str[i];
  }
  return resultado;
}
```

### **Método 3: Recursión**

```javascript
function invertirCadena(str) {
  if (str.length <= 1) return str;
  return str[str.length - 1] + invertirCadena(str.slice(0, -1));
}
```

## 💡 CONCEPTOS CLAVE

- **Array methods**: split(), reverse(), join()
- **String indexing**: Acceso por índice
- **Recursión**: Casos base y recursivos

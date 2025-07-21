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

## 📋 ANÁLISIS PASO A PASO

### **Paso 1: Comprensión del Problema**

Necesitamos tomar cada carácter de la cadena y reorganizarlos en orden inverso. El primer carácter se convierte en el último, el segundo en el penúltimo, etc.

### **Paso 2: Identificar Estrategia**

- **Opción 1**: Usar métodos nativos de JavaScript (split, reverse, join)
- **Opción 2**: Usar un loop manual para construir la cadena invertida
- **Opción 3**: Usar recursión para dividir el problema

### **Paso 3: Pseudocódigo**

```text
FUNCIÓN invertirCadena(str)
    // Método 1: Nativo
    RETORNAR str.split('').reverse().join('')

    // Método 2: Manual
    resultado = ''
    PARA i DESDE str.length-1 HASTA 0
        resultado += str[i]
    FIN PARA
    RETORNAR resultado
FIN FUNCIÓN
```

### **Paso 4: Casos de Prueba Inicial**

```javascript
console.log(invertirCadena('hola')); // "aloh"
console.log(invertirCadena('')); // ""
console.log(invertirCadena('a')); // "a"
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

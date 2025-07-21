# 🧠 Estrategias Generales de Resolución de Problemas

## 🎯 METODOLOGÍA DE RESOLUCIÓN DE PROBLEMAS

### **📋 Framework Sistemático WorldSkills**

Esta metodología está diseñada específicamente para la **competencia WorldSkills 2025** donde la eficiencia y precisión bajo presión son críticas.

#### **⏱️ Distribución de Tiempo por Ejercicio**

```
📊 ANÁLISIS DEL PROBLEMA (20% tiempo)
🔧 DISEÑO DE SOLUCIÓN (30% tiempo)
💻 IMPLEMENTACIÓN (40% tiempo)
🧪 TESTING Y VALIDACIÓN (10% tiempo)
```

### **🔍 ANÁLISIS PASO A PASO**

## 🎯 Framework de Análisis Sistemático

### **📋 PASO 1: COMPRENSIÓN DEL PROBLEMA (2-3 minutos)**

#### **🔍 Análisis de Requerimientos**

1. **Leer** el problema 2-3 veces lentamente
2. **Identificar** qué se pide exactamente
3. **Subrayar** palabras clave y restricciones
4. **Reformular** el problema con tus propias palabras

#### **📊 Análisis de Datos**

```javascript
// Ejemplo de análisis estructurado
/*
PROBLEMA: Encontrar el número máximo en un array
INPUT: [3, 7, 2, 9, 1] (array de números)
OUTPUT: 9 (número máximo)
RESTRICCIONES: 
- Array no vacío
- Solo números enteros
- Puede haber negativos
*/
```

### **📋 PASO 2: DISEÑO DE ESTRATEGIA (3-4 minutos)**

#### **🎯 Técnicas de Resolución**

##### **1. Divide y Vencerás**

```javascript
// Divide el problema en subproblemas más pequeños
// Ejemplo: Búsqueda binaria, merge sort
```

##### **2. Fuerza Bruta**

```javascript
// Probar todas las posibilidades
// Útil para problemas pequeños o como primera aproximación
```

##### **3. Programación Dinámica**

```javascript
// Guardar resultados de subproblemas
// Ejemplo: Fibonacci, subsecuencias
```

##### **4. Algoritmos Greedy**

```javascript
// Tomar la mejor decisión local en cada paso
// Ejemplo: Cambio de monedas, scheduling
```

##### **5. Búsqueda y Recorrido**

```javascript
// BFS, DFS para estructuras de datos
// Ejemplo: Árboles, grafos
```

### **📋 PASO 3: PSEUDOCÓDIGO (2-3 minutos)**

#### **📝 Template de Pseudocódigo**

```
FUNCIÓN nombreFunción(parámetros)
    // 1. Validar entrada
    SI entrada no válida ENTONCES
        RETORNAR error o valor por defecto
    FIN SI

    // 2. Inicializar variables
    DECLARAR variable1 = valor inicial
    DECLARAR variable2 = valor inicial

    // 3. Lógica principal
    PARA cada elemento EN estructura HACER
        // procesar elemento
        SI condición ENTONCES
            // acción
        FIN SI
    FIN PARA

    // 4. Retornar resultado
    RETORNAR resultado
FIN FUNCIÓN
```

### **📋 PASO 4: IMPLEMENTACIÓN (5-10 minutos)**

#### **💻 Template JavaScript**

```javascript
/**
 * Descripción del problema
 * @param {tipo} parametro - descripción del parámetro
 * @return {tipo} descripción del resultado
 *
 * Ejemplo:
 * Input: valor ejemplo
 * Output: resultado ejemplo
 *
 * Complejidad:
 * Tiempo: O(n)
 * Espacio: O(1)
 */
function nombreFuncion(parametro) {
  // 1. Validación de entrada
  if (!parametro || parametro.length === 0) {
    return null; // o valor por defecto
  }

  // 2. Inicialización
  let variable1 = valorInicial;
  let variable2 = valorInicial;

  // 3. Lógica principal
  for (let i = 0; i < parametro.length; i++) {
    // procesar elemento
    if (condicion) {
      // acción
    }
  }

  // 4. Retorno
  return resultado;
}
```

### **📋 PASO 5: TESTING Y VALIDACIÓN (2-3 minutos)**

#### **🧪 Estrategia de Testing**

```javascript
// Test cases básicos
console.log(nombreFuncion([])); // caso vacío
console.log(nombreFuncion([1])); // caso mínimo
console.log(nombreFuncion([1, 2, 3])); // caso normal
console.log(nombreFuncion([3, 2, 1])); // caso inverso
console.log(nombreFuncion([-1, -2, -3])); // caso negativo
console.log(nombreFuncion([1, 1, 1])); // caso repetido

// Casos extremos
console.log(nombreFuncion([Number.MAX_VALUE])); // valor máximo
console.log(nombreFuncion([Number.MIN_VALUE])); // valor mínimo
```

### **📋 PASO 6: OPTIMIZACIÓN (2-3 minutos)**

#### **⚡ Análisis de Complejidad**

```javascript
// Complejidad Temporal
// O(1) - Constante: acceso directo
// O(log n) - Logarítmica: búsqueda binaria
// O(n) - Lineal: recorrido simple
// O(n log n) - Linearítmica: merge sort
// O(n²) - Cuadrática: loops anidados
// O(2^n) - Exponencial: fibonacci recursivo

// Complejidad Espacial
// O(1) - Sin espacio extra
// O(n) - Espacio proporcional a entrada
// O(n²) - Matriz bidimensional
```

## 🛠️ HERRAMIENTAS DE DEBUGGING

### **🔍 Console Debugging**

```javascript
function debugFunction(arr) {
  console.log('Input:', arr); // Entrada

  for (let i = 0; i < arr.length; i++) {
    console.log(`Iteración ${i}:`, arr[i]); // Proceso
  }

  const result = procesarArray(arr);
  console.log('Output:', result); // Salida
  return result;
}
```

### **⏱️ Performance Measurement**

```javascript
function measurePerformance(func, input) {
  const start = performance.now();
  const result = func(input);
  const end = performance.now();

  console.log(`Tiempo: ${end - start} ms`);
  console.log(`Resultado:`, result);
  return result;
}
```

## 🎯 PATRONES COMUNES

### **🔄 Patrones de Iteración**

#### **1. Recorrido Simple**

```javascript
for (let i = 0; i < arr.length; i++) {
  // procesar arr[i]
}
```

#### **2. Dos Punteros**

```javascript
let left = 0;
let right = arr.length - 1;
while (left < right) {
  // procesar arr[left] y arr[right]
  left++;
  right--;
}
```

#### **3. Ventana Deslizante**

```javascript
for (let i = 0; i <= arr.length - windowSize; i++) {
  // procesar ventana arr[i] hasta arr[i + windowSize - 1]
}
```

### **🔍 Patrones de Búsqueda**

#### **1. Búsqueda Lineal**

```javascript
for (let i = 0; i < arr.length; i++) {
  if (arr[i] === target) {
    return i;
  }
}
return -1;
```

#### **2. Búsqueda Binaria**

```javascript
let left = 0;
let right = arr.length - 1;
while (left <= right) {
  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) left = mid + 1;
  else right = mid - 1;
}
return -1;
```

### **📊 Patrones de Acumulación**

#### **1. Suma/Contador**

```javascript
let sum = 0;
for (let num of arr) {
  sum += num;
}
```

#### **2. Máximo/Mínimo**

```javascript
let max = arr[0];
for (let i = 1; i < arr.length; i++) {
  if (arr[i] > max) {
    max = arr[i];
  }
}
```

#### **3. Filtrado**

```javascript
const result = [];
for (let item of arr) {
  if (condition(item)) {
    result.push(item);
  }
}
```

## 💡 TIPS PARA WORLDSKILLS

### **⏱️ Gestión del Tiempo**

1. **2-3 min:** Comprensión y análisis
2. **3-4 min:** Diseño de estrategia
3. **2-3 min:** Pseudocódigo
4. **5-10 min:** Implementación
5. **2-3 min:** Testing
6. **1-2 min:** Optimización

### **🎯 Prioridades**

1. **Funcionalidad** antes que optimización
2. **Casos básicos** antes que edge cases
3. **Solución simple** antes que elegante
4. **Testing manual** antes que automatizado

### **🚨 Errores Comunes a Evitar**

- No leer el problema completamente
- Empezar a codificar sin plan
- No considerar casos extremos
- Optimización prematura
- No testear la solución

---

**🎯 Recuerda:** La práctica constante de estos patrones te dará la velocidad y confianza necesarias para WorldSkills 2025.

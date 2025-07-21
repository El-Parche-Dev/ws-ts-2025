# 🧩 Ejercicio 03: Convertidor de Temperatura

## 🎯 FASE CORE ✅ (Tiempo estimado: 8 minutos)

### **Problema**

Crear una función que convierta grados Celsius a Fahrenheit.

### **Entrada**

- Un número `celsius` representando la temperatura en grados Celsius

### **Salida**

- La temperatura en grados Fahrenheit

### **Fórmula**

F = (C × 9/5) + 32

### **Ejemplo**

```javascript
celsiusAFahrenheit(0); // → 32
celsiusAFahrenheit(100); // → 212
celsiusAFahrenheit(37); // → 98.6
```

## 📋 ANÁLISIS PASO A PASO

### **Paso 1: Comprensión del Problema**

Necesitamos aplicar la fórmula matemática de conversión: F = (C × 9/5) + 32

### **Paso 2: Identificar Estrategia**

- Multiplicar celsius por 9/5
- Sumar 32 al resultado
- Retornar el valor

### **Paso 3: Pseudocódigo**

```text
FUNCIÓN celsiusAFahrenheit(celsius)
    fahrenheit = (celsius * 9/5) + 32
    RETORNAR fahrenheit
FIN FUNCIÓN
```

### **Paso 4: Implementación**

```javascript
function celsiusAFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}
```

### **Paso 5: Casos de Prueba**

```javascript
console.log(celsiusAFahrenheit(0)); // 32 (punto de congelación)
console.log(celsiusAFahrenheit(100)); // 212 (punto de ebullición)
console.log(celsiusAFahrenheit(37)); // 98.6 (temperatura corporal)
console.log(celsiusAFahrenheit(-40)); // -40 (igual en ambas escalas)
```

## ⚡ FASE ENHANCED (Tiempo estimado: 5 minutos)

### **Versión Bidireccional**

```javascript
function celsiusAFahrenheit(celsius) {
  if (typeof celsius !== 'number') {
    throw new Error('La temperatura debe ser un número');
  }
  return (celsius * 9) / 5 + 32;
}

function fahrenheitACelsius(fahrenheit) {
  if (typeof fahrenheit !== 'number') {
    throw new Error('La temperatura debe ser un número');
  }
  return ((fahrenheit - 32) * 5) / 9;
}
```

## ✨ FASE POLISH (Tiempo estimado: 4 minutos)

### **Conversor Completo con Precisión**

```javascript
/**
 * Convierte temperatura de Celsius a Fahrenheit
 * @param {number} celsius - Temperatura en grados Celsius
 * @param {number} decimales - Número de decimales (por defecto 1)
 * @returns {number} Temperatura en grados Fahrenheit
 */
function celsiusAFahrenheit(celsius, decimales = 1) {
  if (typeof celsius !== 'number') {
    throw new Error('La temperatura debe ser un número');
  }

  const fahrenheit = (celsius * 9) / 5 + 32;
  return (
    Math.round(fahrenheit * Math.pow(10, decimales)) / Math.pow(10, decimales)
  );
}

// Conversor universal
const convertirTemperatura = (temperatura, desde, hacia, decimales = 1) => {
  const conversiones = {
    'celsius-fahrenheit': temp => (temp * 9) / 5 + 32,
    'fahrenheit-celsius': temp => ((temp - 32) * 5) / 9,
    'celsius-kelvin': temp => temp + 273.15,
    'kelvin-celsius': temp => temp - 273.15,
  };

  const clave = `${desde}-${hacia}`;
  if (!conversiones[clave]) {
    throw new Error(`Conversión ${desde} a ${hacia} no soportada`);
  }

  const resultado = conversiones[clave](temperatura);
  return (
    Math.round(resultado * Math.pow(10, decimales)) / Math.pow(10, decimales)
  );
};
```

## 🧪 TESTING

```javascript
describe('Ejercicio 03: Convertidor de Temperatura', () => {
  test('debe convertir temperaturas conocidas correctamente', () => {
    expect(celsiusAFahrenheit(0)).toBe(32);
    expect(celsiusAFahrenheit(100)).toBe(212);
    expect(celsiusAFahrenheit(37)).toBeCloseTo(98.6, 1);
    expect(celsiusAFahrenheit(-40)).toBe(-40);
  });

  test('debe manejar decimales', () => {
    expect(celsiusAFahrenheit(25, 2)).toBeCloseTo(77.0, 2);
    expect(celsiusAFahrenheit(30.5, 1)).toBeCloseTo(86.9, 1);
  });

  test('debe validar entrada', () => {
    expect(() => celsiusAFahrenheit('25')).toThrow();
    expect(() => celsiusAFahrenheit(null)).toThrow();
  });
});
```

## 📝 ENTREGABLES

1. **solucion.js** - Implementación completa
2. **test-ejercicio-03.js** - Suite de tests
3. **analisis.md** - Documentación del proceso

## 💡 CONCEPTOS CLAVE APRENDIDOS

- **Operaciones matemáticas**: Aplicación de fórmulas
- **Precisión decimal**: Manejo de Math.round()
- **Validación de tipos**: typeof y error handling
- **Funciones puras**: Sin efectos secundarios

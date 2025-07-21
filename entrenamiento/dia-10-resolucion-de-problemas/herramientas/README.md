# 🔧 Herramientas de Desarrollo - Día 10

## 🚀 TEST RUNNER AUTOMÁTICO

### **test-runner.js**

```javascript
#!/usr/bin/env node
/**
 * Test Runner Automático para Ejercicios
 * Ejecuta y evalúa todos los tests de forma automática
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TestRunner {
  constructor() {
    this.ejerciciosPath = path.join(__dirname, '..');
    this.reportes = [];
  }

  async ejecutarTodos() {
    console.log('🚀 Iniciando Test Runner...\n');

    const carpetas = this.obtenerCarpetasEjercicios();

    for (const carpeta of carpetas) {
      await this.ejecutarTestsEjercicio(carpeta);
    }

    this.generarReporteCompleto();
  }

  obtenerCarpetasEjercicios() {
    const carpetas = [];

    // Ejercicios 1-10
    for (let i = 1; i <= 10; i++) {
      const ejercicioPath = path.join(
        this.ejerciciosPath,
        '01-10-fundamentos-guiados',
        `ejercicio-${i.toString().padStart(2, '0')}-*`
      );
      if (fs.existsSync(ejercicioPath)) {
        carpetas.push(ejercicioPath);
      }
    }

    return carpetas;
  }

  async ejecutarTestsEjercicio(ejercicioPath) {
    const nombreEjercicio = path.basename(ejercicioPath);
    console.log(`🧪 Ejecutando tests: ${nombreEjercicio}`);

    try {
      const testFile = path.join(ejercicioPath, 'test-*.js');

      if (!fs.existsSync(testFile)) {
        console.log(`   ⚠️  No se encontraron tests`);
        return;
      }

      const output = execSync(`cd "${ejercicioPath}" && npm test`, {
        encoding: 'utf8',
        timeout: 30000,
      });

      console.log(`   ✅ Tests pasados`);
      this.reportes.push({
        ejercicio: nombreEjercicio,
        estado: 'success',
        output: output,
      });
    } catch (error) {
      console.log(`   ❌ Tests fallaron`);
      this.reportes.push({
        ejercicio: nombreEjercicio,
        estado: 'failed',
        error: error.message,
      });
    }
  }

  generarReporteCompleto() {
    console.log('\n📊 REPORTE COMPLETO DE TESTS\n');

    const exitosos = this.reportes.filter(r => r.estado === 'success').length;
    const fallidos = this.reportes.filter(r => r.estado === 'failed').length;

    console.log(`✅ Tests exitosos: ${exitosos}`);
    console.log(`❌ Tests fallidos: ${fallidos}`);
    console.log(`📊 Total: ${this.reportes.length}`);

    if (fallidos > 0) {
      console.log('\n🔍 EJERCICIOS CON FALLOS:');
      this.reportes
        .filter(r => r.estado === 'failed')
        .forEach(r => {
          console.log(`   - ${r.ejercicio}`);
        });
    }

    // Guardar reporte en archivo
    const reporteCompleto = {
      fecha: new Date().toISOString(),
      resumen: { exitosos, fallidos, total: this.reportes.length },
      detalles: this.reportes,
    };

    fs.writeFileSync(
      path.join(__dirname, 'reporte-tests.json'),
      JSON.stringify(reporteCompleto, null, 2)
    );

    console.log('\n💾 Reporte guardado en: reporte-tests.json');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const runner = new TestRunner();
  runner.ejecutarTodos().catch(console.error);
}

module.exports = TestRunner;
```

## ⚡ ANALIZADOR DE RENDIMIENTO

### **performance-analyzer.js**

```javascript
/**
 * Analizador de Rendimiento de Algoritmos
 * Mide tiempo de ejecución y uso de memoria
 */

class PerformanceAnalyzer {
  constructor() {
    this.resultados = [];
  }

  async analizarFuncion(func, inputs, nombre = 'función') {
    console.log(`🔬 Analizando: ${nombre}`);

    const resultados = {
      nombre,
      inputs: inputs.length,
      tiempos: [],
      memoria: [],
      promedios: {},
    };

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];

      // Medir tiempo
      const inicioTiempo = performance.now();
      const resultado = await func(input);
      const finTiempo = performance.now();

      const tiempoEjecucion = finTiempo - inicioTiempo;
      resultados.tiempos.push(tiempoEjecucion);

      console.log(`   Input ${i + 1}: ${tiempoEjecucion.toFixed(3)}ms`);
    }

    // Calcular estadísticas
    resultados.promedios = {
      tiempo: this.calcularPromedio(resultados.tiempos),
      tiempoMin: Math.min(...resultados.tiempos),
      tiempoMax: Math.max(...resultados.tiempos),
    };

    this.resultados.push(resultados);
    return resultados;
  }

  calcularPromedio(array) {
    return array.reduce((a, b) => a + b, 0) / array.length;
  }

  compararAlgoritmos(resultados) {
    console.log('\n📊 COMPARACIÓN DE ALGORITMOS\n');

    resultados.sort((a, b) => a.promedios.tiempo - b.promedios.tiempo);

    resultados.forEach((resultado, index) => {
      const posicion =
        index === 0
          ? '🥇'
          : index === 1
          ? '🥈'
          : index === 2
          ? '🥉'
          : `${index + 1}°`;
      console.log(
        `${posicion} ${resultado.nombre}: ${resultado.promedios.tiempo.toFixed(
          3
        )}ms promedio`
      );
    });
  }

  generarReporte() {
    const reporte = {
      fecha: new Date().toISOString(),
      resultados: this.resultados,
      resumen: {
        algoritmos: this.resultados.length,
        masRapido: this.resultados.reduce((min, r) =>
          r.promedios.tiempo < min.promedios.tiempo ? r : min
        ),
      },
    };

    return reporte;
  }
}

// Ejemplo de uso
if (require.main === module) {
  const analyzer = new PerformanceAnalyzer();

  // Ejemplo: comparar algoritmos de ordenamiento
  const datos = [
    [64, 34, 25, 12, 22, 11, 90],
    Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000)),
    Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000)),
  ];

  async function ejemplo() {
    // Bubble Sort
    await analyzer.analizarFuncion(bubbleSort, datos, 'Bubble Sort');

    // Quick Sort
    await analyzer.analizarFuncion(quickSort, datos, 'Quick Sort');

    // Native Sort
    await analyzer.analizarFuncion(
      arr => [...arr].sort((a, b) => a - b),
      datos,
      'Native Sort'
    );

    analyzer.compararAlgoritmos(analyzer.resultados);
  }

  ejemplo();
}

module.exports = PerformanceAnalyzer;
```

## 📈 GENERADOR DE DATOS DE PRUEBA

### **data-generator.js**

```javascript
/**
 * Generador de Datos de Prueba
 * Crea datasets para testing de algoritmos
 */

class DataGenerator {
  // Arrays de números
  static arrayAleatorio(tamaño, min = 0, max = 100) {
    return Array.from(
      { length: tamaño },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    );
  }

  static arrayOrdenado(tamaño, inicio = 1) {
    return Array.from({ length: tamaño }, (_, i) => inicio + i);
  }

  static arrayInverso(tamaño, inicio = 100) {
    return Array.from({ length: tamaño }, (_, i) => inicio - i);
  }

  // Strings
  static stringAleatorio(longitud) {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length: longitud },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  static palabrasAleatorias(cantidad, longitudMin = 3, longitudMax = 10) {
    return Array.from({ length: cantidad }, () =>
      this.stringAleatorio(
        Math.floor(Math.random() * (longitudMax - longitudMin + 1)) +
          longitudMin
      )
    );
  }

  // Casos especiales
  static casosEdge() {
    return {
      arrayVacio: [],
      arrayUnElemento: [42],
      arrayDuplicados: [1, 1, 1, 1, 1],
      arrayNegativos: [-5, -3, -8, -1, -10],
      arrayMixto: [-2, 0, 5, -1, 3],
      stringVacio: '',
      stringUnCaracter: 'a',
      stringEspacios: '   ',
      stringEspeciales: '!@#$%^&*()',
    };
  }

  // Dataset completo para un ejercicio
  static generarDatasetCompleto(tipo = 'arrays') {
    const casos = this.casosEdge();

    if (tipo === 'arrays') {
      return {
        ...casos,
        pequeño: this.arrayAleatorio(10),
        mediano: this.arrayAleatorio(100),
        grande: this.arrayAleatorio(1000),
        ordenado: this.arrayOrdenado(50),
        inverso: this.arrayInverso(50),
      };
    }

    if (tipo === 'strings') {
      return {
        ...casos,
        corto: this.stringAleatorio(10),
        mediano: this.stringAleatorio(100),
        largo: this.stringAleatorio(1000),
        palabras: this.palabrasAleatorias(20).join(' '),
      };
    }
  }
}

module.exports = DataGenerator;
```

## 🎯 VALIDADOR DE SOLUCIONES

### **solution-validator.js**

```javascript
/**
 * Validador de Soluciones
 * Verifica que las implementaciones cumplan los criterios
 */

class SolutionValidator {
  constructor() {
    this.criterios = [];
    this.puntuacion = 0;
    this.maxPuntuacion = 0;
  }

  agregarCriterio(nombre, evaluador, puntos) {
    this.criterios.push({ nombre, evaluador, puntos });
    this.maxPuntuacion += puntos;
  }

  async validarSolucion(solucion, datos) {
    console.log('🔍 Validando solución...\n');

    const resultados = [];

    for (const criterio of this.criterios) {
      try {
        const resultado = await criterio.evaluador(solucion, datos);
        const puntos = resultado ? criterio.puntos : 0;

        this.puntuacion += puntos;

        resultados.push({
          criterio: criterio.nombre,
          cumple: resultado,
          puntos: puntos,
          maxPuntos: criterio.puntos,
        });

        const icono = resultado ? '✅' : '❌';
        console.log(
          `${icono} ${criterio.nombre}: ${puntos}/${criterio.puntos} pts`
        );
      } catch (error) {
        console.log(`❌ ${criterio.nombre}: Error - ${error.message}`);
        resultados.push({
          criterio: criterio.nombre,
          cumple: false,
          puntos: 0,
          maxPuntos: criterio.puntos,
          error: error.message,
        });
      }
    }

    return this.generarReporte(resultados);
  }

  generarReporte(resultados) {
    const porcentaje = (this.puntuacion / this.maxPuntuacion) * 100;

    console.log(
      `\n📊 PUNTUACIÓN FINAL: ${this.puntuacion}/${
        this.maxPuntuacion
      } (${porcentaje.toFixed(1)}%)`
    );

    let nivel;
    if (porcentaje >= 90) nivel = '🥇 Oro';
    else if (porcentaje >= 80) nivel = '🥈 Plata';
    else if (porcentaje >= 70) nivel = '🥉 Bronce';
    else if (porcentaje >= 60) nivel = '✅ Aprobado';
    else nivel = '❌ No Aprobado';

    console.log(`🏆 Nivel: ${nivel}\n`);

    return {
      puntuacion: this.puntuacion,
      maxPuntuacion: this.maxPuntuacion,
      porcentaje: porcentaje,
      nivel: nivel,
      criterios: resultados,
    };
  }
}

// Ejemplo de uso
if (require.main === module) {
  const validator = new SolutionValidator();

  // Configurar criterios para un ejercicio de ordenamiento
  validator.agregarCriterio(
    'Funcionalidad básica',
    (func, datos) => {
      const resultado = func([3, 1, 4, 1, 5]);
      return JSON.stringify(resultado) === JSON.stringify([1, 1, 3, 4, 5]);
    },
    40
  );

  validator.agregarCriterio(
    'Maneja array vacío',
    (func, datos) => {
      const resultado = func([]);
      return Array.isArray(resultado) && resultado.length === 0;
    },
    10
  );

  validator.agregarCriterio(
    'Performance aceptable',
    (func, datos) => {
      const inicio = performance.now();
      func(Array.from({ length: 1000 }, () => Math.random()));
      const tiempo = performance.now() - inicio;
      return tiempo < 100; // menos de 100ms
    },
    25
  );

  // Validar una función de ejemplo
  const ejemploOrdenamiento = arr => [...arr].sort((a, b) => a - b);

  validator.validarSolucion(ejemploOrdenamiento, {}).then(reporte => {
    console.log('Reporte generado:', reporte);
  });
}

module.exports = SolutionValidator;
```

## 📦 PACKAGE.JSON PARA HERRAMIENTAS

### **package.json**

```json
{
  "name": "worldskills-dia10-herramientas",
  "version": "1.0.0",
  "description": "Herramientas de evaluación y análisis para ejercicios de algoritmia",
  "main": "index.js",
  "scripts": {
    "test:all": "node test-runner.js",
    "analyze": "node performance-analyzer.js",
    "validate": "node solution-validator.js",
    "generate-data": "node data-generator.js"
  },
  "keywords": ["worldskills", "algorithms", "testing", "performance"],
  "author": "WorldSkills Training Team",
  "license": "MIT",
  "dependencies": {
    "chalk": "^4.1.2",
    "commander": "^9.4.1"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

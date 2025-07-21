/**
 * Ejercicio 02: Verificador de Números Pares
 * Determina si un número entero es par o impar
 */

// 🎯 FASE CORE ✅
function esPar(numero) {
  return numero % 2 === 0;
}

// ⚡ FASE ENHANCED
function esParConValidacion(numero) {
  if (typeof numero !== 'number' || !Number.isInteger(numero)) {
    throw new Error('El parámetro debe ser un número entero');
  }

  return numero % 2 === 0;
}

// ✨ FASE POLISH
/**
 * Determina si un número entero es par
 * @param {number} numero - El número a verificar
 * @returns {boolean} true si es par, false si es impar
 * @throws {Error} Si el parámetro no es un número entero
 */
function esParCompleto(numero) {
  if (typeof numero !== 'number' || !Number.isInteger(numero)) {
    throw new Error('El parámetro debe ser un número entero');
  }

  return numero % 2 === 0;
}

// Versión con arrow function
const esParArrow = numero => numero % 2 === 0;

// Exportar para testing
module.exports = {
  esPar,
  esParConValidacion,
  esParCompleto,
  esParArrow,
};

// 🧪 EJEMPLOS DE USO
if (require.main === module) {
  console.log('=== Ejercicio 02: Verificador de Números Pares ===');

  // Casos básicos
  console.log('Casos básicos:');
  console.log(`esPar(2) = ${esPar(2)}`); // true
  console.log(`esPar(3) = ${esPar(3)}`); // false
  console.log(`esPar(0) = ${esPar(0)}`); // true

  // Casos negativos
  console.log('\nCasos negativos:');
  console.log(`esPar(-2) = ${esPar(-2)}`); // true
  console.log(`esPar(-3) = ${esPar(-3)}`); // false

  // Casos extremos
  console.log('\nCasos extremos:');
  console.log(`esPar(1000) = ${esPar(1000)}`); // true
  console.log(`esPar(1001) = ${esPar(1001)}`); // false
}

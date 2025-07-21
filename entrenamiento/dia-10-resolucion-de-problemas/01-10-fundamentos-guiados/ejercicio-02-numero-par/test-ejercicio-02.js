const {
  esPar,
  esParConValidacion,
  esParCompleto,
  esParArrow,
} = require('./solucion');

describe('Ejercicio 02: Verificador de Números Pares', () => {
  describe('Función esPar básica', () => {
    test('debe identificar números pares correctamente', () => {
      expect(esPar(2)).toBe(true);
      expect(esPar(4)).toBe(true);
      expect(esPar(0)).toBe(true);
      expect(esPar(-2)).toBe(true);
      expect(esPar(100)).toBe(true);
    });

    test('debe identificar números impares correctamente', () => {
      expect(esPar(1)).toBe(false);
      expect(esPar(3)).toBe(false);
      expect(esPar(-1)).toBe(false);
      expect(esPar(-3)).toBe(false);
      expect(esPar(99)).toBe(false);
    });

    test('debe manejar casos extremos', () => {
      expect(esPar(1000)).toBe(true);
      expect(esPar(1001)).toBe(false);
      expect(esPar(-1000)).toBe(true);
      expect(esPar(-1001)).toBe(false);
    });
  });

  describe('Función esParConValidacion', () => {
    test('debe funcionar correctamente con números válidos', () => {
      expect(esParConValidacion(2)).toBe(true);
      expect(esParConValidacion(3)).toBe(false);
    });

    test('debe lanzar error con entrada inválida', () => {
      expect(() => esParConValidacion('2')).toThrow(
        'El parámetro debe ser un número entero'
      );
      expect(() => esParConValidacion(2.5)).toThrow(
        'El parámetro debe ser un número entero'
      );
      expect(() => esParConValidacion(null)).toThrow(
        'El parámetro debe ser un número entero'
      );
      expect(() => esParConValidacion(undefined)).toThrow(
        'El parámetro debe ser un número entero'
      );
    });
  });

  describe('Función esParCompleto', () => {
    test('debe funcionar igual que esParConValidacion', () => {
      expect(esParCompleto(2)).toBe(true);
      expect(esParCompleto(3)).toBe(false);
      expect(() => esParCompleto('2')).toThrow();
    });
  });

  describe('Arrow function esParArrow', () => {
    test('debe funcionar igual que la versión básica', () => {
      expect(esParArrow(2)).toBe(true);
      expect(esParArrow(3)).toBe(false);
      expect(esParArrow(0)).toBe(true);
    });
  });

  describe('Casos de rendimiento', () => {
    test('debe ser eficiente con números grandes', () => {
      const start = Date.now();
      for (let i = 0; i < 10000; i++) {
        esPar(i);
      }
      const time = Date.now() - start;
      expect(time).toBeLessThan(100); // Debe ejecutarse en menos de 100ms
    });
  });
});

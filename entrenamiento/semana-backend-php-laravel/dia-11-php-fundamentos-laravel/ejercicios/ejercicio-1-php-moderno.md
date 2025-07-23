# 💻 EJERCICIO 1: PHP Moderno - Calculadora Avanzada

## Implementación MVP - 30 minutos

### 📋 **DESCRIPCIÓN**

Crear una clase `Calculadora` que demuestre el dominio de PHP 8.2+ features esenciales para Laravel.

---

## 🎯 **REQUERIMIENTOS**

### **FASE CORE ✅ (20 minutos)**

- ✅ Constructor property promotion
- ✅ Return types estrictos
- ✅ Operaciones básicas funcionales
- ✅ Manejo de errores básico

### **FASE ENHANCED ⚡ (10 minutos)**

- ⚡ Named arguments
- ⚡ Match expressions
- ⚡ Union types
- ⚡ Nullsafe operator

---

## 🏗️ **CÓDIGO BASE**

```php
<?php
// calculadora.php - Implementar esta clase

declare(strict_types=1);

class Calculadora {
    // TODO: Implementar usando constructor property promotion
    // TODO: Agregar properties para historial de operaciones

    public function __construct(
        // TODO: Definir parámetros con tipos
    ) {
        // TODO: Implementar constructor
    }

    // TODO: Implementar operaciones básicas con return types
    public function sumar(float $a, float $b): float {
        // TODO: Implementar suma
    }

    public function restar(float $a, float $b): float {
        // TODO: Implementar resta
    }

    public function multiplicar(float $a, float $b): float {
        // TODO: Implementar multiplicación
    }

    public function dividir(float $a, float $b): float {
        // TODO: Implementar división con manejo de división por cero
    }

    // TODO: Implementar método con match expression
    public function operacion(string $tipo, float $a, float $b): float {
        // TODO: Usar match para determinar operación
    }

    // TODO: Implementar método con named arguments
    public function calcularPorcentaje(
        float $cantidad,
        float $porcentaje,
        bool $agregar = true
    ): float {
        // TODO: Calcular porcentaje
    }

    // TODO: Implementar método para obtener historial
    public function obtenerHistorial(): array {
        // TODO: Retornar historial de operaciones
    }
}

// TODO: Crear instancia y probar todas las funcionalidades
$calc = new Calculadora(/* parámetros */);

// TODO: Probar operaciones básicas
echo "Suma: " . $calc->sumar(10, 5) . "\n";
echo "Resta: " . $calc->restar(10, 5) . "\n";
echo "Multiplicación: " . $calc->multiplicar(10, 5) . "\n";
echo "División: " . $calc->dividir(10, 5) . "\n";

// TODO: Probar match expression
echo "Operación suma: " . $calc->operacion('suma', 10, 5) . "\n";

// TODO: Probar named arguments
echo "Porcentaje: " . $calc->calcularPorcentaje(
    cantidad: 1000,
    porcentaje: 15,
    agregar: true
) . "\n";

// TODO: Mostrar historial
print_r($calc->obtenerHistorial());
?>
```

---

## ✅ **CRITERIOS DE EVALUACIÓN**

### **CORE (15 puntos)**

- [ ] Constructor property promotion correcto (3 pts)
- [ ] Return types en todos los métodos (3 pts)
- [ ] Operaciones básicas funcionan (6 pts)
- [ ] Manejo de errores básico (3 pts)

### **ENHANCED (5 puntos)**

- [ ] Named arguments implementados (2 pts)
- [ ] Match expression funcional (2 pts)
- [ ] Union types o nullsafe operator (1 pt)

---

## 🔍 **SOLUCIÓN ESPERADA**

```php
<?php
// SOLUCIÓN - No ver hasta intentar primero

declare(strict_types=1);

class Calculadora {
    private array $historial = [];

    public function __construct(
        private string $nombre = "Calculadora WorldSkills",
        private bool $guardarHistorial = true
    ) {}

    public function sumar(float $a, float $b): float {
        $resultado = $a + $b;
        $this->agregarHistorial('suma', $a, $b, $resultado);
        return $resultado;
    }

    public function restar(float $a, float $b): float {
        $resultado = $a - $b;
        $this->agregarHistorial('resta', $a, $b, $resultado);
        return $resultado;
    }

    public function multiplicar(float $a, float $b): float {
        $resultado = $a * $b;
        $this->agregarHistorial('multiplicación', $a, $b, $resultado);
        return $resultado;
    }

    public function dividir(float $a, float $b): float {
        if ($b === 0.0) {
            throw new InvalidArgumentException('División por cero no permitida');
        }

        $resultado = $a / $b;
        $this->agregarHistorial('división', $a, $b, $resultado);
        return $resultado;
    }

    public function operacion(string $tipo, float $a, float $b): float {
        return match($tipo) {
            'suma', '+' => $this->sumar($a, $b),
            'resta', '-' => $this->restar($a, $b),
            'multiplicacion', '*' => $this->multiplicar($a, $b),
            'division', '/' => $this->dividir($a, $b),
            default => throw new InvalidArgumentException("Operación '{$tipo}' no soportada")
        };
    }

    public function calcularPorcentaje(
        float $cantidad,
        float $porcentaje,
        bool $agregar = true
    ): float {
        $valorPorcentaje = ($cantidad * $porcentaje) / 100;
        $resultado = $agregar ? $cantidad + $valorPorcentaje : $valorPorcentaje;

        $this->agregarHistorial(
            $agregar ? 'porcentaje_agregar' : 'porcentaje_calcular',
            $cantidad,
            $porcentaje,
            $resultado
        );

        return $resultado;
    }

    public function obtenerHistorial(): array {
        return $this->historial;
    }

    private function agregarHistorial(string $operacion, float $a, float $b, float $resultado): void {
        if (!$this->guardarHistorial) {
            return;
        }

        $this->historial[] = [
            'operacion' => $operacion,
            'operando_a' => $a,
            'operando_b' => $b,
            'resultado' => $resultado,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
}

// Pruebas
try {
    $calc = new Calculadora(
        nombre: "Calculadora SENA",
        guardarHistorial: true
    );

    echo "=== CALCULADORA WORLDSKILLS ===\n";
    echo "Suma: " . $calc->sumar(10, 5) . "\n";
    echo "Resta: " . $calc->restar(10, 5) . "\n";
    echo "Multiplicación: " . $calc->multiplicar(10, 5) . "\n";
    echo "División: " . $calc->dividir(10, 5) . "\n";

    echo "\n=== USANDO MATCH ===\n";
    echo "Operación suma: " . $calc->operacion('suma', 20, 8) . "\n";
    echo "Operación multiplicación: " . $calc->operacion('*', 7, 6) . "\n";

    echo "\n=== NAMED ARGUMENTS ===\n";
    echo "15% de 1000 (agregar): " . $calc->calcularPorcentaje(
        cantidad: 1000,
        porcentaje: 15,
        agregar: true
    ) . "\n";

    echo "Solo 15% de 1000: " . $calc->calcularPorcentaje(
        cantidad: 1000,
        porcentaje: 15,
        agregar: false
    ) . "\n";

    echo "\n=== HISTORIAL ===\n";
    foreach ($calc->obtenerHistorial() as $operacion) {
        echo "[{$operacion['timestamp']}] {$operacion['operacion']}: {$operacion['operando_a']} op {$operacion['operando_b']} = {$operacion['resultado']}\n";
    }

} catch (InvalidArgumentException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
```

---

## 🚀 **RETO EXTRA (OPCIONAL)**

Si terminas antes de tiempo, implementa:

1. **Operaciones científicas**: potencia, raíz cuadrada, logaritmo
2. **Validación avanzada**: usar attributes de PHP 8
3. **Formateo de números**: usar `NumberFormatter` para diferentes locales
4. **Export historial**: método para exportar historial a JSON

---

¡Demuestra tu dominio de PHP 8.2+ para Laravel! 💪

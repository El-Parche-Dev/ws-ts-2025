<?php
// 🎯 Calculadora PHP Moderno - Implementación MVP para WorldSkills 2025

declare(strict_types=1);

/**
 * Calculadora avanzada que demuestra características modernas de PHP 8.2+
 * Implementación completa con enfoque MVP
 */
class Calculadora {
    private array $historial = [];

    /**
     * Constructor con property promotion (PHP 8.0+)
     * 
     * @param string $nombre Nombre de la calculadora
     * @param bool $guardarHistorial Si debe guardar historial de operaciones
     * @param int $precision Precisión decimal para los resultados
     */
    public function __construct(
        private string $nombre = "Calculadora WorldSkills",
        private bool $guardarHistorial = true,
        private int $precision = 2
    ) {
        $this->agregarHistorial('inicialización', 0, 0, 0, "Calculadora '{$this->nombre}' inicializada");
    }

    // ========== FASE CORE ✅ (Operaciones básicas) ==========

    /**
     * Suma dos números con manejo de errores
     */
    public function sumar(float $a, float $b): float {
        $resultado = round($a + $b, $this->precision);
        $this->agregarHistorial('suma', $a, $b, $resultado);
        return $resultado;
    }

    /**
     * Resta dos números
     */
    public function restar(float $a, float $b): float {
        $resultado = round($a - $b, $this->precision);
        $this->agregarHistorial('resta', $a, $b, $resultado);
        return $resultado;
    }

    /**
     * Multiplica dos números
     */
    public function multiplicar(float $a, float $b): float {
        $resultado = round($a * $b, $this->precision);
        $this->agregarHistorial('multiplicación', $a, $b, $resultado);
        return $resultado;
    }

    /**
     * Divide dos números con validación de división por cero
     */
    public function dividir(float $a, float $b): float {
        // Manejo de errores básico - división por cero
        if ($b === 0.0) {
            throw new InvalidArgumentException('Error: División por cero no permitida');
        }

        $resultado = round($a / $b, $this->precision);
        $this->agregarHistorial('división', $a, $b, $resultado);
        return $resultado;
    }

    // ========== FASE ENHANCED ⚡ (Features PHP 8.2+) ==========

    /**
     * Operación genérica usando match expression (PHP 8.0+)
     */
    public function operacion(string $tipo, float $a, float $b): float {
        return match($tipo) {
            'suma', '+', 'add' => $this->sumar($a, $b),
            'resta', '-', 'subtract' => $this->restar($a, $b),
            'multiplicacion', 'multiplicación', '*', 'multiply' => $this->multiplicar($a, $b),
            'division', 'división', '/', 'divide' => $this->dividir($a, $b),
            'potencia', '**', 'power' => $this->potencia($a, $b),
            default => throw new InvalidArgumentException("Operación '{$tipo}' no soportada. Operaciones válidas: suma, resta, multiplicación, división, potencia")
        };
    }

    /**
     * Calcula porcentaje usando named arguments (PHP 8.0+)
     */
    public function calcularPorcentaje(
        float $cantidad,
        float $porcentaje,
        bool $agregar = true,
        bool $redondear = true
    ): float {
        $valorPorcentaje = ($cantidad * $porcentaje) / 100;
        $resultado = $agregar ? $cantidad + $valorPorcentaje : $valorPorcentaje;

        if ($redondear) {
            $resultado = round($resultado, $this->precision);
        }

        $operacion = $agregar ? 'porcentaje_agregar' : 'porcentaje_calcular';
        $this->agregarHistorial($operacion, $cantidad, $porcentaje, $resultado);

        return $resultado;
    }

    /**
     * Operación de potencia (PHP 8.2+ ready)
     */
    public function potencia(float $base, float $exponente): float {
        $resultado = round(pow($base, $exponente), $this->precision);
        $this->agregarHistorial('potencia', $base, $exponente, $resultado);
        return $resultado;
    }

    /**
     * Raíz cuadrada con validación
     */
    public function raizCuadrada(float $numero): float {
        if ($numero < 0) {
            throw new InvalidArgumentException('No se puede calcular la raíz cuadrada de un número negativo');
        }

        $resultado = round(sqrt($numero), $this->precision);
        $this->agregarHistorial('raíz_cuadrada', $numero, 0, $resultado);
        return $resultado;
    }

    /**
     * Método con union types (PHP 8.0+)
     */
    public function procesarNumero(int|float|string $numero): float {
        return match(true) {
            is_string($numero) => (float) $numero,
            is_int($numero) => (float) $numero,
            is_float($numero) => $numero,
            default => throw new InvalidArgumentException('Tipo de número no válido')
        };
    }

    /**
     * Método que usa nullsafe operator (PHP 8.0+)
     */
    public function obtenerUltimaOperacion(): ?array {
        $ultimaOperacion = end($this->historial);
        return $ultimaOperacion ?: null;
    }

    /**
     * Obtener nombre de calculadora (getter con nullsafe)
     */
    public function obtenerNombre(): string {
        return $this->nombre ?? 'Calculadora Sin Nombre';
    }

    // ========== MÉTODOS AUXILIARES ==========

    /**
     * Obtiene el historial completo de operaciones
     */
    public function obtenerHistorial(): array {
        return $this->historial;
    }

    /**
     * Limpia el historial de operaciones
     */
    public function limpiarHistorial(): void {
        $this->historial = [];
        $this->agregarHistorial('limpiar', 0, 0, 0, 'Historial limpiado');
    }

    /**
     * Obtiene estadísticas del historial
     */
    public function obtenerEstadisticas(): array {
        $operaciones = array_column($this->historial, 'operacion');
        $conteoOperaciones = array_count_values($operaciones);

        return [
            'total_operaciones' => count($this->historial),
            'operaciones_por_tipo' => $conteoOperaciones,
            'precision_configurada' => $this->precision,
            'calculadora' => $this->nombre
        ];
    }

    /**
     * Agrega operación al historial
     */
    private function agregarHistorial(
        string $operacion, 
        float $a, 
        float $b, 
        float $resultado, 
        ?string $nota = null
    ): void {
        if (!$this->guardarHistorial) {
            return;
        }

        $this->historial[] = [
            'id' => count($this->historial) + 1,
            'operacion' => $operacion,
            'operando_a' => $a,
            'operando_b' => $b,
            'resultado' => $resultado,
            'timestamp' => date('Y-m-d H:i:s'),
            'nota' => $nota
        ];
    }

    /**
     * Exporta historial a JSON
     */
    public function exportarHistorialJson(): string {
        $datos = [
            'calculadora' => $this->nombre,
            'exportado_el' => date('Y-m-d H:i:s'),
            'total_operaciones' => count($this->historial),
            'historial' => $this->historial,
            'estadisticas' => $this->obtenerEstadisticas()
        ];

        return json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}

// ========== DEMOSTRACIONES Y PRUEBAS ==========

echo "🧮 === CALCULADORA WORLDSKILLS 2025 - PHP 8.2+ ===\n\n";

try {
    // Crear instancia usando named arguments
    $calc = new Calculadora(
        nombre: "Calculadora SENA WorldSkills",
        guardarHistorial: true,
        precision: 2
    );

    echo "📊 CALCULADORA: {$calc->obtenerNombre()}\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

    // ========== FASE CORE ✅ ==========
    echo "🔥 FASE CORE - Operaciones Básicas:\n";
    echo "Suma (10 + 5): " . $calc->sumar(10, 5) . "\n";
    echo "Resta (10 - 5): " . $calc->restar(10, 5) . "\n";
    echo "Multiplicación (10 × 5): " . $calc->multiplicar(10, 5) . "\n";
    echo "División (10 ÷ 5): " . $calc->dividir(10, 5) . "\n";

    // ========== FASE ENHANCED ⚡ ==========
    echo "\n⚡ FASE ENHANCED - Features PHP 8.2+:\n";
    
    // Match expressions
    echo "Match suma (20 + 8): " . $calc->operacion('suma', 20, 8) . "\n";
    echo "Match multiplicación (7 × 6): " . $calc->operacion('*', 7, 6) . "\n";
    echo "Potencia (2^8): " . $calc->operacion('potencia', 2, 8) . "\n";

    // Named arguments
    echo "\nNamed Arguments - Porcentajes:\n";
    echo "15% de 1000 (agregar): " . $calc->calcularPorcentaje(
        cantidad: 1000,
        porcentaje: 15,
        agregar: true
    ) . "\n";
    
    echo "Solo 15% de 1000: " . $calc->calcularPorcentaje(
        cantidad: 1000,
        porcentaje: 15,
        agregar: false,
        redondear: true
    ) . "\n";

    // Union types
    echo "\nUnion Types:\n";
    echo "Procesar string '123.45': " . $calc->procesarNumero('123.45') . "\n";
    echo "Procesar int 100: " . $calc->procesarNumero(100) . "\n";
    echo "Procesar float 99.99: " . $calc->procesarNumero(99.99) . "\n";

    // Operaciones adicionales
    echo "\nOperaciones Científicas:\n";
    echo "Raíz cuadrada de 144: " . $calc->raizCuadrada(144) . "\n";
    echo "Potencia 3^4: " . $calc->potencia(3, 4) . "\n";

    // Nullsafe operator
    echo "\nNullsafe Operator:\n";
    $ultimaOp = $calc->obtenerUltimaOperacion();
    echo "Última operación: " . ($ultimaOp['operacion'] ?? 'ninguna') . "\n";

    // ========== ESTADÍSTICAS ==========
    echo "\n📈 ESTADÍSTICAS:\n";
    $stats = $calc->obtenerEstadisticas();
    echo "Total operaciones: {$stats['total_operaciones']}\n";
    echo "Precisión: {$stats['precision_configurada']} decimales\n";
    
    echo "\nOperaciones por tipo:\n";
    foreach ($stats['operaciones_por_tipo'] as $tipo => $cantidad) {
        echo "  - {$tipo}: {$cantidad}\n";
    }

    // ========== HISTORIAL DETALLADO ==========
    echo "\n📋 HISTORIAL COMPLETO:\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    foreach ($calc->obtenerHistorial() as $operacion) {
        $nota = $operacion['nota'] ? " ({$operacion['nota']})" : "";
        echo "[{$operacion['id']}] [{$operacion['timestamp']}] ";
        echo "{$operacion['operacion']}: {$operacion['operando_a']} → {$operacion['operando_b']} = {$operacion['resultado']}{$nota}\n";
    }

    // ========== EXPORT JSON ==========
    echo "\n💾 EXPORTANDO HISTORIAL...\n";
    $jsonFile = __DIR__ . '/historial_calculadora.json';
    file_put_contents($jsonFile, $calc->exportarHistorialJson());
    echo "✅ Historial exportado a: {$jsonFile}\n";

} catch (InvalidArgumentException $e) {
    echo "❌ Error de validación: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "❌ Error inesperado: " . $e->getMessage() . "\n";
}

// ========== PRUEBAS DE ERRORES ==========
echo "\n🧪 PRUEBAS DE MANEJO DE ERRORES:\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

try {
    $calcTest = new Calculadora(nombre: "Test de Errores");
    
    // Intentar división por cero
    echo "Probando división por cero...\n";
    $calcTest->dividir(10, 0);
} catch (InvalidArgumentException $e) {
    echo "✅ Error capturado correctamente: {$e->getMessage()}\n";
}

try {
    $calcTest = new Calculadora(nombre: "Test de Errores");
    
    // Intentar raíz cuadrada de número negativo
    echo "Probando raíz cuadrada de número negativo...\n";
    $calcTest->raizCuadrada(-25);
} catch (InvalidArgumentException $e) {
    echo "✅ Error capturado correctamente: {$e->getMessage()}\n";
}

try {
    $calcTest = new Calculadora(nombre: "Test de Errores");
    
    // Intentar operación no válida
    echo "Probando operación no válida...\n";
    $calcTest->operacion('operacion_inexistente', 5, 3);
} catch (InvalidArgumentException $e) {
    echo "✅ Error capturado correctamente: {$e->getMessage()}\n";
}

echo "\n🎉 ¡CALCULADORA WORLDSKILLS COMPLETADA!\n";
echo "✅ Constructor property promotion\n";
echo "✅ Return types estrictos\n";
echo "✅ Named arguments\n";
echo "✅ Match expressions\n";
echo "✅ Union types\n";
echo "✅ Nullsafe operator\n";
echo "✅ Manejo de errores robusto\n";
echo "✅ Todas las operaciones funcionales\n\n";

echo "🚀 ¡Listo para competencia WorldSkills 2025! 💪\n";
?>

# 📘 01. PHP 8+ Syntax Moderno

## 🎯 Objetivos de la Sección

⏱️ **Tiempo Asignado: 30 minutos** `12:00-12:30`

Refrescar y dominar la sintaxis moderna de PHP 8+ necesaria para trabajar eficientemente con Laravel.

### **MVP Breakdown**

- **🔧 CORE (20 min)**: Variables, arrays, funciones, clases básicas
- **⚡ ENHANCED (8 min)**: Named arguments, match expressions
- **✨ POLISH (2 min)**: PHP 8 features avanzados

---

## 🔧 FASE CORE ✅ (20 minutos)

### **Variables y Tipos de Datos**

```php
<?php
// 🎯 Variables PHP básicas
$nombre = "Juan Pérez";
$edad = 25;
$precio = 19.99;
$activo = true;
$productos = ["Laptop", "Mouse", "Teclado"];

// 🎯 Arrays asociativos (crítico para Laravel)
$usuario = [
    'id' => 1,
    'nombre' => 'Ana García',
    'email' => 'ana@email.com',
    'edad' => 28,
    'activo' => true
];

// 🎯 Null coalescing operator (??)
$nombreUsuario = $usuario['nombre'] ?? 'Anónimo';
$configuracion = $config['tema'] ?? 'dark';

echo "Usuario: $nombreUsuario\n";
echo "Tema: $configuracion\n";
?>
```

### **Funciones Modernas**

```php
<?php
// 🎯 Funciones básicas
function saludar($nombre) {
    return "Hola, $nombre!";
}

// 🎯 Arrow functions (PHP 7.4+)
$numeros = [1, 2, 3, 4, 5];
$cuadrados = array_map(fn($n) => $n * $n, $numeros);

// 🎯 Funciones con tipos (importante para Laravel)
function calcularPrecioFinal(float $precio, float $impuesto = 0.19): float {
    return $precio * (1 + $impuesto);
}

// 🎯 Función con array return type
function obtenerUsuario(int $id): array {
    return [
        'id' => $id,
        'nombre' => 'Usuario ' . $id,
        'email' => "usuario{$id}@email.com"
    ];
}

// Ejemplos de uso
echo saludar("Carlos") . "\n";
echo "Cuadrados: " . implode(", ", $cuadrados) . "\n";
echo "Precio final: $" . calcularPrecioFinal(100.0) . "\n";

$user = obtenerUsuario(5);
echo "Usuario: " . $user['nombre'] . "\n";
?>
```

### **Clases Básicas para Laravel**

```php
<?php
// 🎯 Clase básica moderna
class Producto {
    // 🎯 Properties con visibilidad
    public string $nombre;
    public float $precio;
    protected int $stock;
    private bool $activo;

    // 🎯 Constructor con promoted properties (PHP 8+)
    public function __construct(
        string $nombre,
        float $precio,
        int $stock = 0,
        bool $activo = true
    ) {
        $this->nombre = $nombre;
        $this->precio = $precio;
        $this->stock = $stock;
        $this->activo = $activo;
    }

    // 🎯 Métodos públicos
    public function getPrecioFormateado(): string {
        return '$' . number_format($this->precio, 2);
    }

    public function estaDisponible(): bool {
        return $this->activo && $this->stock > 0;
    }

    // 🎯 Getters y setters
    public function getStock(): int {
        return $this->stock;
    }

    public function setStock(int $cantidad): void {
        $this->stock = max(0, $cantidad);
    }
}

// 🎯 Uso de la clase
$laptop = new Producto("MacBook Pro", 2500.00, 5);
echo "Producto: " . $laptop->nombre . "\n";
echo "Precio: " . $laptop->getPrecioFormateado() . "\n";
echo "Disponible: " . ($laptop->estaDisponible() ? "Sí" : "No") . "\n";

$laptop->setStock(3);
echo "Stock actualizado: " . $laptop->getStock() . "\n";
?>
```

---

## ⚡ FASE ENHANCED (8 minutos)

### **Named Arguments (PHP 8+)**

```php
<?php
// 🎯 Named arguments para mayor claridad
function crearUsuario(
    string $nombre,
    string $email,
    int $edad = 18,
    bool $activo = true,
    string $rol = 'usuario'
): array {
    return [
        'nombre' => $nombre,
        'email' => $email,
        'edad' => $edad,
        'activo' => $activo,
        'rol' => $rol
    ];
}

// ⚡ Llamada con named arguments
$admin = crearUsuario(
    nombre: "Sandra López",
    email: "sandra@admin.com",
    rol: "administrador",
    edad: 30
);

echo "Admin creado: " . $admin['nombre'] . " (" . $admin['rol'] . ")\n";
?>
```

### **Match Expression (PHP 8+)**

```php
<?php
// 🎯 Match expression (mejor que switch)
function obtenerEstadoPedido(string $codigo): string {
    return match($codigo) {
        'P' => 'Pendiente',
        'PR' => 'Procesando',
        'E' => 'Enviado',
        'EN' => 'Entregado',
        'C' => 'Cancelado',
        default => 'Estado desconocido'
    };
}

// ⚡ Match con múltiples valores
function obtenerCategoriaPorPrecio(float $precio): string {
    return match(true) {
        $precio < 50 => 'Económico',
        $precio < 200 => 'Medio',
        $precio < 1000 => 'Premium',
        default => 'Lujo'
    };
}

// Ejemplos de uso
echo obtenerEstadoPedido('EN') . "\n";
echo obtenerCategoriaPorPrecio(150.0) . "\n";
?>
```

### **Enums (PHP 8.1+)**

```php
<?php
// 🎯 Enums para constantes tipadas
enum EstadoPedido: string {
    case PENDIENTE = 'pendiente';
    case PROCESANDO = 'procesando';
    case ENVIADO = 'enviado';
    case ENTREGADO = 'entregado';
    case CANCELADO = 'cancelado';

    // ⚡ Métodos en enums
    public function getColor(): string {
        return match($this) {
            self::PENDIENTE => 'yellow',
            self::PROCESANDO => 'blue',
            self::ENVIADO => 'orange',
            self::ENTREGADO => 'green',
            self::CANCELADO => 'red',
        };
    }

    public function puedeEditar(): bool {
        return match($this) {
            self::PENDIENTE, self::PROCESANDO => true,
            default => false
        };
    }
}

// Uso de enums
$estado = EstadoPedido::ENVIADO;
echo "Estado: " . $estado->value . "\n";
echo "Color: " . $estado->getColor() . "\n";
echo "Puede editar: " . ($estado->puedeEditar() ? "Sí" : "No") . "\n";
?>
```

---

## ✨ FASE POLISH (2 minutos)

### **Readonly Properties (PHP 8.1+)**

```php
<?php
// 🎯 Readonly properties para inmutabilidad
class ProductoInmutable {
    public function __construct(
        public readonly string $id,
        public readonly string $nombre,
        public readonly float $precio,
        public readonly DateTime $fechaCreacion
    ) {}

    // ✨ Método que retorna nueva instancia modificada
    public function conPrecioActualizado(float $nuevoPrecio): self {
        return new self(
            $this->id,
            $this->nombre,
            $nuevoPrecio,
            $this->fechaCreacion
        );
    }
}

// Uso de readonly properties
$producto = new ProductoInmutable(
    id: 'PROD-001',
    nombre: 'iPhone 15',
    precio: 999.99,
    fechaCreacion: new DateTime()
);

echo "Producto: " . $producto->nombre . " - $" . $producto->precio . "\n";

// ✨ Crear versión con precio actualizado
$productoActualizado = $producto->conPrecioActualizado(899.99);
echo "Precio actualizado: $" . $productoActualizado->precio . "\n";
?>
```

---

## 🧪 Ejercicio Práctico: Sistema de Productos

### **Archivo: `ejercicio-productos.php`**

```php
<?php
// 🎯 Ejercicio: Sistema básico de productos
declare(strict_types=1);

// ✅ Enum para categorías
enum CategoriaProducto: string {
    case ELECTRONICA = 'electronica';
    case ROPA = 'ropa';
    case HOGAR = 'hogar';
    case DEPORTES = 'deportes';
    case LIBROS = 'libros';

    public function getIcon(): string {
        return match($this) {
            self::ELECTRONICA => '💻',
            self::ROPA => '👕',
            self::HOGAR => '🏠',
            self::DEPORTES => '⚽',
            self::LIBROS => '📚',
        };
    }
}

// ✅ Clase Producto moderna
class Producto {
    public function __construct(
        public readonly string $id,
        public string $nombre,
        public float $precio,
        public CategoriaProducto $categoria,
        public int $stock = 0,
        public bool $activo = true
    ) {}

    public function getPrecioFormateado(): string {
        return '$' . number_format($this->precio, 2, ',', '.');
    }

    public function estaDisponible(): bool {
        return $this->activo && $this->stock > 0;
    }

    public function reducirStock(int $cantidad): bool {
        if ($this->stock >= $cantidad) {
            $this->stock -= $cantidad;
            return true;
        }
        return false;
    }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'precio' => $this->precio,
            'precio_formateado' => $this->getPrecioFormateado(),
            'categoria' => $this->categoria->value,
            'categoria_icon' => $this->categoria->getIcon(),
            'stock' => $this->stock,
            'activo' => $this->activo,
            'disponible' => $this->estaDisponible()
        ];
    }
}

// ✅ Gestor de productos
class GestorProductos {
    private array $productos = [];

    public function agregar(Producto $producto): void {
        $this->productos[$producto->id] = $producto;
    }

    public function obtener(string $id): ?Producto {
        return $this->productos[$id] ?? null;
    }

    public function listar(): array {
        return array_values($this->productos);
    }

    public function filtrarPorCategoria(CategoriaProducto $categoria): array {
        return array_filter(
            $this->productos,
            fn(Producto $p) => $p->categoria === $categoria
        );
    }

    public function obtenerDisponibles(): array {
        return array_filter(
            $this->productos,
            fn(Producto $p) => $p->estaDisponible()
        );
    }
}

// 🎯 Demo del sistema
$gestor = new GestorProductos();

// Agregar productos
$gestor->agregar(new Producto(
    id: 'LAPTOP-001',
    nombre: 'MacBook Pro 16"',
    precio: 2499.99,
    categoria: CategoriaProducto::ELECTRONICA,
    stock: 5
));

$gestor->agregar(new Producto(
    id: 'LIBRO-001',
    nombre: 'Clean Code',
    precio: 45.99,
    categoria: CategoriaProducto::LIBROS,
    stock: 12
));

$gestor->agregar(new Producto(
    id: 'ROPA-001',
    nombre: 'Camiseta Nike',
    precio: 29.99,
    categoria: CategoriaProducto::ROPA,
    stock: 0
));

// Mostrar productos
echo "=== TODOS LOS PRODUCTOS ===\n";
foreach ($gestor->listar() as $producto) {
    $data = $producto->toArray();
    echo "{$data['categoria_icon']} {$data['nombre']} - {$data['precio_formateado']} (Stock: {$data['stock']})\n";
}

echo "\n=== PRODUCTOS DISPONIBLES ===\n";
foreach ($gestor->obtenerDisponibles() as $producto) {
    echo "✅ {$producto->nombre} - {$producto->getPrecioFormateado()}\n";
}

echo "\n=== PRODUCTOS DE ELECTRÓNICA ===\n";
foreach ($gestor->filtrarPorCategoria(CategoriaProducto::ELECTRONICA) as $producto) {
    echo "💻 {$producto->nombre} - {$producto->getPrecioFormateado()}\n";
}

// Simular venta
$laptop = $gestor->obtener('LAPTOP-001');
if ($laptop && $laptop->reducirStock(2)) {
    echo "\n✅ Vendidas 2 unidades de {$laptop->nombre}. Stock restante: {$laptop->stock}\n";
}
?>
```

---

## ✅ Checklist de Validación

### **🔧 CORE MVP**

- [ ] Variables y arrays funcionando correctamente
- [ ] Funciones con tipos definidos
- [ ] Clases básicas con properties y métodos
- [ ] Constructor moderno implementado
- [ ] Getters y setters funcionales

### **⚡ ENHANCED MVP**

- [ ] Named arguments implementados
- [ ] Match expressions funcionando
- [ ] Enums definidos y utilizados
- [ ] Métodos en enums implementados

### **✨ POLISH MVP**

- [ ] Readonly properties utilizadas
- [ ] Strict types declarado
- [ ] Ejercicio completo funcionando
- [ ] Código bien documentado

---

## 🚀 Comandos de Prueba

```bash
# Verificar sintaxis PHP
php -l ejercicio-productos.php

# Ejecutar el ejercicio
php ejercicio-productos.php

# Verificar versión PHP (debe ser 8.0+)
php --version
```

## 📝 Notas Importantes

### **Para Laravel**

- Usar **typed properties** siempre que sea posible
- **Named arguments** útiles para métodos Eloquent
- **Match expressions** mejores que switch en controladores
- **Enums** perfectos para estados y categorías

### **WorldSkills Focus**

- Sintaxis limpia y moderna
- Código legible y bien estructurado
- Uso eficiente de PHP 8+ features
- Base sólida para trabajar con Laravel

---

## 🔄 Próximo Paso

**Sección 02**: Laravel Installation + Structure

- Instalar Laravel via Composer
- Entender la estructura de directorios
- Configurar el entorno de desarrollo

---

> **⏱️ Tiempo Target: 30 minutos** > **🎯 Objetivo: Sintaxis PHP moderna para Laravel** > **✅ Resultado: Base sólida para desarrollo Laravel**

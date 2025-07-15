<?php
// 🎯 Ejercicio: Sistema básico de productos
// Comentarios en español para WorldSkills 2025
// Sistema de validar productos moderno con PHP 8+
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

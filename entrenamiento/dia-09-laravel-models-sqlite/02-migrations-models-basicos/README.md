# 📊 Migrations + Models Básicos

**⏱️ Tiempo:** 60 minutos (12:30-13:30)  
**🎯 Objetivo:** Crear estructura de database con migrations y models funcionales

## 🎯 Metodología MVP

### 🔧 FASE CORE (12:30-12:50) - 20 minutos

**Objetivo:** Primera migration + model funcional

**Entregables:**

- Migration de productos creada
- Model Producto básico funcional
- Schema de database operativo

### ⚡ FASE ENHANCED (12:50-13:10) - 20 minutos

**Objetivo:** Schema completo con constrainsts

**Entregables:**

- Campos avanzados agregados
- Constraints y validaciones
- Relationships preparadas

### ✨ FASE POLISH (13:10-13:30) - 20 minutos

**Objetivo:** Data de prueba lista

**Entregables:**

- Seeders implementados
- Factories creados
- Data de prueba cargada

## 📋 CORE: Primera Migration y Model

### 1. Crear Migration de Productos

```bash
# Crear migration para tabla productos
php artisan make:migration create_productos_table

# Esto creará: database/migrations/YYYY_MM_DD_HHMMSS_create_productos_table.php
```

### 2. Definir Schema Básico

Editar la migration creada:

```php
<?php
// database/migrations/2024_01_01_000001_create_productos_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecutar las migraciones.
     */
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 10, 2);
            $table->integer('stock')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reversar las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
```

### 3. Ejecutar la Migration

```bash
# Ejecutar la migration
php artisan migrate

# Verificar que se creó correctamente
php artisan migrate:status
```

### 4. Crear Model Básico

```bash
# Crear model Producto
php artisan make:model Producto
```

Editar el model:

```php
<?php
// app/Models/Producto.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    /**
     * Los atributos que se pueden asignar masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'stock',
        'activo',
    ];

    /**
     * Los atributos que deben ser casteados.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'precio' => 'decimal:2',
        'activo' => 'boolean',
        'stock' => 'integer',
    ];
}
```

### 5. Verificar Funcionalidad Básica

```bash
# Probar el model en tinker
php artisan tinker
```

En Tinker:

```php
// Crear un producto de prueba
$producto = new App\Models\Producto();
$producto->nombre = 'Producto Test';
$producto->descripcion = 'Descripción de prueba';
$producto->precio = 19.99;
$producto->stock = 100;
$producto->save();

// Verificar que se guardó
App\Models\Producto::all();

// Salir
exit
```

## ⚡ ENHANCED: Schema Avanzado

### 1. Agregar Campos Adicionales

Crear nueva migration para campos adicionales:

```bash
# Crear migration para agregar campos
php artisan make:migration add_advanced_fields_to_productos_table
```

```php
<?php
// database/migrations/2024_01_01_000002_add_advanced_fields_to_productos_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->string('codigo_sku')->unique()->after('id');
            $table->string('imagen')->nullable()->after('descripcion');
            $table->decimal('peso', 8, 3)->nullable()->after('precio');
            $table->string('categoria')->default('general')->after('stock');
            $table->json('especificaciones')->nullable()->after('categoria');
            $table->timestamp('fecha_vencimiento')->nullable()->after('activo');

            // Índices para performance
            $table->index('codigo_sku');
            $table->index('categoria');
            $table->index('activo');
            $table->index(['activo', 'stock']); // Índice compuesto
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropIndex(['productos_codigo_sku_index']);
            $table->dropIndex(['productos_categoria_index']);
            $table->dropIndex(['productos_activo_index']);
            $table->dropIndex(['productos_activo_stock_index']);

            $table->dropColumn([
                'codigo_sku',
                'imagen',
                'peso',
                'categoria',
                'especificaciones',
                'fecha_vencimiento'
            ]);
        });
    }
};
```

### 2. Actualizar Model con Campos Nuevos

```php
<?php
// app/Models/Producto.php - Versión Enhanced

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    /**
     * Atributos asignables masivamente
     */
    protected $fillable = [
        'codigo_sku',
        'nombre',
        'descripcion',
        'imagen',
        'precio',
        'peso',
        'stock',
        'categoria',
        'especificaciones',
        'activo',
        'fecha_vencimiento',
    ];

    /**
     * Casting de atributos
     */
    protected $casts = [
        'precio' => 'decimal:2',
        'peso' => 'decimal:3',
        'activo' => 'boolean',
        'stock' => 'integer',
        'especificaciones' => 'array', // JSON -> Array
        'fecha_vencimiento' => 'datetime',
    ];

    /**
     * Campos que se ocultan en serialización
     */
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    /**
     * Accessors - Formateo de datos al obtener
     */
    public function getPrecioFormateadoAttribute(): string
    {
        return '$' . number_format($this->precio, 2, ',', '.');
    }

    public function getEstadoStockAttribute(): string
    {
        if ($this->stock <= 0) {
            return 'Sin stock';
        } elseif ($this->stock <= 10) {
            return 'Stock bajo';
        } else {
            return 'En stock';
        }
    }

    /**
     * Mutators - Formateo de datos al guardar
     */
    public function setNombreAttribute($value): void
    {
        $this->attributes['nombre'] = ucwords(strtolower(trim($value)));
    }

    public function setCodigoSkuAttribute($value): void
    {
        $this->attributes['codigo_sku'] = strtoupper(trim($value));
    }

    /**
     * Scopes - Query helpers
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    public function scopeEnStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopePorCategoria($query, $categoria)
    {
        return $query->where('categoria', $categoria);
    }

    public function scopeBuscarPorNombre($query, $termino)
    {
        return $query->where('nombre', 'like', '%' . $termino . '%');
    }
}
```

### 3. Ejecutar Nueva Migration

```bash
# Ejecutar la nueva migration
php artisan migrate

# Verificar estructura actualizada
php artisan tinker --execute="
    \$producto = new App\Models\Producto();
    echo 'Campos fillable: ' . json_encode(\$producto->getFillable());
    echo '\nCasts: ' . json_encode(\$producto->getCasts());
"
```

## ✨ POLISH: Seeders y Factories

### 1. Crear Factory para Productos

```bash
# Crear factory
php artisan make:factory ProductoFactory
```

```php
<?php
// database/factories/ProductoFactory.php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductoFactory extends Factory
{
    /**
     * Definir el estado por defecto del model
     */
    public function definition(): array
    {
        $categorias = ['electronica', 'ropa', 'hogar', 'deportes', 'libros', 'belleza'];

        return [
            'codigo_sku' => strtoupper($this->faker->bothify('SKU-####-???')),
            'nombre' => $this->faker->words(3, true),
            'descripcion' => $this->faker->paragraph(2),
            'imagen' => 'productos/' . $this->faker->image('public/storage/productos', 400, 400, null, false),
            'precio' => $this->faker->randomFloat(2, 10, 1000),
            'peso' => $this->faker->randomFloat(3, 0.1, 50),
            'stock' => $this->faker->numberBetween(0, 200),
            'categoria' => $this->faker->randomElement($categorias),
            'especificaciones' => [
                'marca' => $this->faker->company,
                'modelo' => $this->faker->bothify('MOD-####'),
                'garantia' => $this->faker->randomElement(['6 meses', '1 año', '2 años']),
                'origen' => $this->faker->country,
            ],
            'activo' => $this->faker->boolean(90), // 90% activos
            'fecha_vencimiento' => $this->faker->optional(0.3)->dateTimeBetween('now', '+2 years'),
        ];
    }

    /**
     * Estado para productos sin stock
     */
    public function sinStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
            'activo' => false,
        ]);
    }

    /**
     * Estado para productos premium
     */
    public function premium(): static
    {
        return $this->state(fn (array $attributes) => [
            'precio' => $this->faker->randomFloat(2, 500, 2000),
            'categoria' => 'premium',
            'especificaciones' => array_merge($attributes['especificaciones'] ?? [], [
                'premium' => true,
                'envio_gratis' => true,
            ]),
        ]);
    }

    /**
     * Estado para productos de ofertas
     */
    public function oferta(): static
    {
        return $this->state(fn (array $attributes) => [
            'precio' => $this->faker->randomFloat(2, 5, 50),
            'stock' => $this->faker->numberBetween(50, 200),
            'especificaciones' => array_merge($attributes['especificaciones'] ?? [], [
                'oferta' => true,
                'descuento' => $this->faker->numberBetween(10, 50) . '%',
            ]),
        ]);
    }
}
```

### 2. Crear Seeder para Productos

```bash
# Crear seeder
php artisan make:seeder ProductoSeeder
```

```php
<?php
// database/seeders/ProductoSeeder.php

namespace Database\Seeders;

use App\Models\Producto;
use Illuminate\Database\Seeder;

class ProductoSeeder extends Seeder
{
    /**
     * Ejecutar los seeders de la base de datos
     */
    public function run(): void
    {
        // Limpiar tabla primero
        Producto::truncate();

        // Productos específicos para demo
        $productosDemo = [
            [
                'codigo_sku' => 'DEMO-001',
                'nombre' => 'iPhone 15 Pro',
                'descripcion' => 'El último iPhone con chip A17 Pro y cámara profesional de 48MP',
                'precio' => 4999000,
                'peso' => 0.187,
                'stock' => 25,
                'categoria' => 'electronica',
                'especificaciones' => [
                    'marca' => 'Apple',
                    'modelo' => 'iPhone 15 Pro',
                    'pantalla' => '6.1 pulgadas',
                    'almacenamiento' => '128GB',
                    'color' => 'Natural Titanium',
                ],
                'activo' => true,
            ],
            [
                'codigo_sku' => 'DEMO-002',
                'nombre' => 'MacBook Air M3',
                'descripcion' => 'Laptop ultradelgada con chip M3 y pantalla Retina de 13 pulgadas',
                'precio' => 5499000,
                'peso' => 1.24,
                'stock' => 15,
                'categoria' => 'electronica',
                'especificaciones' => [
                    'marca' => 'Apple',
                    'modelo' => 'MacBook Air',
                    'procesador' => 'Apple M3',
                    'memoria' => '8GB',
                    'almacenamiento' => '256GB SSD',
                ],
                'activo' => true,
            ],
            [
                'codigo_sku' => 'DEMO-003',
                'nombre' => 'Auriculares Sony WH-1000XM5',
                'descripcion' => 'Auriculares inalámbricos con cancelación de ruido premium',
                'precio' => 899000,
                'peso' => 0.250,
                'stock' => 50,
                'categoria' => 'electronica',
                'especificaciones' => [
                    'marca' => 'Sony',
                    'modelo' => 'WH-1000XM5',
                    'tipo' => 'Over-ear',
                    'conectividad' => 'Bluetooth 5.2',
                    'bateria' => '30 horas',
                ],
                'activo' => true,
            ],
        ];

        // Crear productos demo
        foreach ($productosDemo as $producto) {
            Producto::create($producto);
        }

        // Crear productos aleatorios usando factory

        // 20 productos normales
        Producto::factory(20)->create();

        // 5 productos premium
        Producto::factory(5)->premium()->create();

        // 10 productos en oferta
        Producto::factory(10)->oferta()->create();

        // 3 productos sin stock
        Producto::factory(3)->sinStock()->create();

        $this->command->info('✅ ProductoSeeder completado:');
        $this->command->info('• 3 productos demo');
        $this->command->info('• 20 productos normales');
        $this->command->info('• 5 productos premium');
        $this->command->info('• 10 productos en oferta');
        $this->command->info('• 3 productos sin stock');
        $this->command->info('📊 Total: ' . Producto::count() . ' productos creados');
    }
}
```

### 3. Actualizar DatabaseSeeder

```php
<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Ejecutar los seeders de la aplicación
     */
    public function run(): void
    {
        $this->call([
            ProductoSeeder::class,
        ]);
    }
}
```

### 4. Ejecutar Seeders

```bash
# Ejecutar todos los seeders
php artisan db:seed

# O ejecutar solo ProductoSeeder
php artisan db:seed --class=ProductoSeeder

# Para reset completo con seeders
php artisan migrate:fresh --seed
```

### 5. Comandos de Verificación

```bash
# Verificar datos creados
php artisan tinker --execute="
    echo 'Total productos: ' . App\Models\Producto::count() . PHP_EOL;
    echo 'Productos activos: ' . App\Models\Producto::activos()->count() . PHP_EOL;
    echo 'Productos en stock: ' . App\Models\Producto::enStock()->count() . PHP_EOL;
    echo 'Categorías: ' . App\Models\Producto::distinct('categoria')->count('categoria') . PHP_EOL;
"

# Ver algunos productos de ejemplo
php artisan tinker --execute="
    App\Models\Producto::take(3)->get(['codigo_sku', 'nombre', 'precio', 'stock'])->each(function(\$p) {
        echo \$p->codigo_sku . ' - ' . \$p->nombre . ' - ' . \$p->precio_formateado . ' - ' . \$p->estado_stock . PHP_EOL;
    });
"
```

## 🧪 Verificación Final

### Checklist de Validación

```bash
# 1. Verificar migraciones
php artisan migrate:status

# 2. Verificar estructura de tabla
php artisan tinker --execute="
    \$columns = DB::select('PRAGMA table_info(productos)');
    foreach(\$columns as \$col) {
        echo \$col->name . ' (' . \$col->type . ')' . PHP_EOL;
    }
"

# 3. Verificar model y datos
php artisan tinker --execute="
    \$producto = App\Models\Producto::first();
    echo 'Primer producto: ' . \$producto->nombre . PHP_EOL;
    echo 'Precio formateado: ' . \$producto->precio_formateado . PHP_EOL;
    echo 'Estado stock: ' . \$producto->estado_stock . PHP_EOL;
"

# 4. Probar scopes
php artisan tinker --execute="
    echo 'Productos activos: ' . App\Models\Producto::activos()->count() . PHP_EOL;
    echo 'Productos electrónicos: ' . App\Models\Producto::porCategoria('electronica')->count() . PHP_EOL;
"
```

## ✅ Entregables de esta Sección

- [ ] Migration `create_productos_table` creada y ejecutada
- [ ] Migration `add_advanced_fields_to_productos_table` ejecutada
- [ ] Model `Producto` con campos completos y casts
- [ ] Accessors y mutators implementados
- [ ] Scopes de query funcionales
- [ ] Factory `ProductoFactory` con estados
- [ ] Seeder `ProductoSeeder` con datos demo y aleatorios
- [ ] Datos de prueba cargados (41 productos total)
- [ ] Verificación completa exitosa

## 🚨 Troubleshooting Común

### Error: "SQLSTATE[HY000]: General error: 1 table productos has no column named..."

```bash
# Verificar migraciones pendientes
php artisan migrate:status

# Ejecutar migraciones faltantes
php artisan migrate

# Si hay conflictos, reset completo
php artisan migrate:fresh --seed
```

### Error: "Class 'Database\Factories\ProductoFactory' not found"

```bash
# Regenerar autoload
composer dump-autoload

# Verificar que el factory existe
ls -la database/factories/ProductoFactory.php
```

## ➡️ Preparación para Sección 03

Una vez completada esta sección, tendrás:

✅ Schema de productos completo con SQLite  
✅ Model Producto con funcionalidades avanzadas  
✅ 41 productos de prueba cargados  
✅ Accessors, mutators y scopes funcionales

**Próximo paso:** Implementar operaciones CRUD completas con Eloquent en la Sección 03.

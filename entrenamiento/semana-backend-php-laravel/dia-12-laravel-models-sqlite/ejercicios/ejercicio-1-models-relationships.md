# 💻 EJERCICIO 1: Sistema Productos con Categorías

## Implementación MVP - 45 minutos

### 📋 **DESCRIPCIÓN**

Crear un sistema completo de productos con categorías usando Laravel Models, SQLite, relationships y factories.

---

## 🎯 **REQUERIMIENTOS**

### **FASE CORE ✅ (30 minutos)**

- ✅ Models con relationships configurados
- ✅ Migrations con foreign keys
- ✅ Scopes básicos funcionando
- ✅ Factories generando datos válidos

### **FASE ENHANCED ⚡ (15 minutos)**

- ⚡ Accessors y mutators avanzados
- ⚡ Query optimization (eager loading)
- ⚡ Collection methods personalizados
- ⚡ Search functionality

---

## 🏗️ **PASO A PASO**

### **1. Configurar SQLite**

```bash
# Crear proyecto Laravel
composer create-project laravel/laravel tienda-products
cd tienda-products

# Configurar SQLite
touch database/database.sqlite
```

```env
# .env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/your/project/database/database.sqlite
```

### **2. Crear Migrations**

```bash
php artisan make:migration create_categories_table
php artisan make:migration create_products_table
```

**categories migration:**

```php
<?php
// TODO: Implementar migration de categorías

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            // TODO: Implementar campos
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('slug', 120)->unique();
            $table->text('description')->nullable();
            $table->string('color', 7)->default('#3B82F6');
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();

            // TODO: Agregar índices
            $table->index(['is_active', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

### **3. Crear Models**

```bash
php artisan make:model Category -f
php artisan make:model Product -f
```

**Category Model Template:**

```php
<?php
// app/Models/Category.php - IMPLEMENTAR

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        // TODO: Definir fillable fields
    ];

    protected $casts = [
        // TODO: Configurar casts
    ];

    // TODO: Implementar relationship con products
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    // TODO: Implementar scope para categorías activas
    public function scopeActive(Builder $query): void
    {
        // Implementar filtro activas
    }

    // TODO: Implementar accessor para conteo de productos
    public function getProductCountAttribute(): int
    {
        // Retornar cantidad de productos
    }

    // TODO: Implementar mutator para name y slug
    public function setNameAttribute(string $value): void
    {
        // Auto-generar slug
    }
}
```

### **4. Implementar Factories**

**CategoryFactory Template:**

```php
<?php
// database/factories/CategoryFactory.php - COMPLETAR

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->unique()->words(2, true);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            // TODO: Completar con más campos
            'description' => $this->faker->paragraph(2),
            'color' => $this->faker->hexColor(),
            'is_active' => $this->faker->boolean(85),
            'metadata' => [
                'featured' => $this->faker->boolean(20),
                'sort_order' => $this->faker->numberBetween(1, 100)
            ]
        ];
    }

    // TODO: Implementar state methods
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
```

### **5. Crear Seeder**

```bash
php artisan make:seeder ProductSeeder
```

```php
<?php
// database/seeders/ProductSeeder.php - IMPLEMENTAR

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // TODO: Crear categorías predefinidas
        $electronics = Category::factory()->create([
            'name' => 'Electrónicos',
            'slug' => 'electronicos',
        ]);

        // TODO: Crear productos para cada categoría
        Product::factory(10)->create(['category_id' => $electronics->id]);

        // TODO: Crear más categorías y productos
    }
}
```

---

## 🎯 **DESAFÍOS A RESOLVER**

### **Desafío 1: Query Optimization**

```php
// ❌ Problema N+1 - CORREGIR
$products = Product::all();
foreach ($products as $product) {
    echo $product->category->name; // N+1 queries!
}

// ✅ TODO: Implementar solución con eager loading
$products = Product::with(['category'])->get();
```

### **Desafío 2: Advanced Search**

```php
// TODO: Implementar método de búsqueda en Product model
public function scopeSearch(Builder $query, string $term): void
{
    $query->where(function (Builder $q) use ($term) {
        // Buscar en name, description, sku
        // Incluir búsqueda en categoria relacionada
    });
}
```

### **Desafío 3: Price Accessors**

```php
// TODO: Implementar en Product model
protected function finalPrice(): Attribute
{
    return Attribute::make(
        get: fn () => $this->sale_price ?? $this->price,
    );
}

protected function discountPercentage(): Attribute
{
    return Attribute::make(
        get: function () {
            // Calcular porcentaje de descuento
        }
    );
}
```

---

## ✅ **CRITERIOS DE EVALUACIÓN**

### **CORE (15 puntos)**

- [ ] Migrations ejecutan sin errores (3 pts)
- [ ] Models con relationships funcionando (4 pts)
- [ ] Factories generan datos válidos (3 pts)
- [ ] Seeder crea datos correctamente (3 pts)
- [ ] Scopes básicos implementados (2 pts)

### **ENHANCED (5 puntos)**

- [ ] Eager loading implementado (2 pts)
- [ ] Accessors/mutators funcionando (2 pts)
- [ ] Search scope avanzado (1 pt)

---

## 🧪 **COMANDOS DE TESTING**

```bash
# Ejecutar migrations
php artisan migrate:fresh

# Ejecutar seeders
php artisan db:seed --class=ProductSeeder

# Probar en tinker
php artisan tinker

# En tinker - Probar relationships
>>> $category = Category::first()
>>> $category->products
>>> $category->product_count

# Probar eager loading
>>> Product::with('category')->get()

# Probar scopes
>>> Category::active()->get()
>>> Product::search('laptop')->get()
```

---

## 🔍 **SOLUCIÓN PARCIAL** (No mirar hasta intentar)

<details>
<summary>Ver implementación Category Model</summary>

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'color', 'is_active', 'metadata'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'metadata' => 'array',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function activeProducts(): HasMany
    {
        return $this->hasMany(Product::class)->where('status', 'published');
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function getProductCountAttribute(): int
    {
        return $this->products()->count();
    }

    public function setNameAttribute(string $value): void
    {
        $this->attributes['name'] = ucfirst(trim($value));
        $this->attributes['slug'] = \Str::slug($value);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
```

</details>

---

## 🚀 **RETO EXTRA** (Si terminas antes)

1. **Implementar categorías jerárquicas** (parent_id)
2. **Sistema de tags** (many-to-many relationship)
3. **Soft deletes** en productos
4. **Observers** para logs automáticos
5. **Custom Collection** methods para análisis

---

**¡Demuestra tu dominio de Laravel Models!** 💪

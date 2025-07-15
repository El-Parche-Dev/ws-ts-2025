<?php
/**
 * Migration: Crear tabla productos
 * WorldSkills 2025 - Laravel Models + SQLite
 * Tiempo: CORE - 20 minutos
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecutar las migraciones - FASE CORE
     */
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            // Clave primaria
            $table->id();
            
            // Campos básicos CORE (FASE 1 - 20 min)
            $table->string('nombre', 255);
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 10, 2); // Hasta 99,999,999.99
            $table->integer('stock')->default(0);
            $table->boolean('activo')->default(true);
            
            // Timestamps automáticos
            $table->timestamps();
            
            // Índices básicos para performance
            $table->index('activo'); // Para filtrar productos activos
            $table->index(['activo', 'stock']); // Para productos activos con stock
        });
    }

    /**
     * Reversar las migraciones
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};

/*
INSTRUCCIONES DE USO:

1. Copiar este archivo a: database/migrations/YYYY_MM_DD_HHMMSS_create_productos_table.php
   
2. Ejecutar la migration:
   php artisan migrate

3. Verificar que se creó correctamente:
   php artisan migrate:status

4. Probar en tinker:
   php artisan tinker
   App\Models\Producto::create([
       'nombre' => 'Producto Test',
       'descripcion' => 'Descripción de prueba',
       'precio' => 19.99,
       'stock' => 100
   ]);

CAMPOS EXPLICADOS:

- id: Clave primaria auto-incremental
- nombre: Nombre del producto (máximo 255 caracteres)
- descripcion: Descripción larga (opcional, texto)
- precio: Precio con 2 decimales (formato: 99999999.99)
- stock: Cantidad disponible (entero, default 0)
- activo: Estado del producto (boolean, default true)
- created_at/updated_at: Timestamps automáticos

ÍNDICES:

- Index en 'activo': Para filtrar rápidamente productos activos
- Index compuesto 'activo + stock': Para productos activos CON stock disponible

PRÓXIMO PASO:

Después de ejecutar esta migration, continuar con:
- app/Models/Producto.php (Model básico)
- Migration avanzada con campos adicionales (ENHANCED)
*/

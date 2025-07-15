<?php
/**
 * Migration: Crear tabla categorias
 * WorldSkills 2025 - Laravel Relationships
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecutar las migraciones
     */
    public function up(): void
    {
        Schema::create('categorias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->string('slug')->unique();
            $table->text('descripcion')->nullable();
            $table->string('icono', 50)->nullable();
            $table->boolean('activa')->default(true);
            $table->timestamps();
            
            // Índices para performance
            $table->index('activa');
            $table->index('slug');
        });
    }

    /**
     * Reversar las migraciones
     */
    public function down(): void
    {
        Schema::dropIfExists('categorias');
    }
};

/*
COMANDO PARA CREAR:
php artisan make:migration create_categorias_table

CAMPOS INCLUIDOS:
- id: Clave primaria
- nombre: Nombre único de la categoría
- slug: URL amigable única
- descripcion: Descripción opcional
- icono: Emoji o código de icono
- activa: Estado de la categoría
- timestamps: created_at, updated_at

PRÓXIMO PASO:
1. Ejecutar: php artisan migrate
2. Crear migration para foreign key en productos
*/

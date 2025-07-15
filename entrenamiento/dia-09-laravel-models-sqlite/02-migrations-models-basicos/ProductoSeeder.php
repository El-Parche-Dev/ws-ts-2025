<?php
/**
 * Seeder: ProductoSeeder
 * WorldSkills 2025 - Laravel Models + SQLite
 * Tiempo: POLISH - 15 minutos
 */

namespace Database\Seeders;

use App\Models\Producto;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductoSeeder extends Seeder
{
    /**
     * Ejecutar los seeders de la base de datos
     */
    public function run(): void
    {
        // Limpiar tabla de productos
        Producto::truncate();

        // ========================================
        // PRODUCTOS DEMO ESPECÍFICOS
        // ========================================

        $productosDemo = [
            [
                'codigo_sku' => 'DEMO-001',
                'nombre' => 'iPhone 15 Pro',
                'descripcion' => 'El último iPhone con chip A17 Pro y cámara profesional de 48MP. Incluye pantalla Super Retina XDR de 6.1 pulgadas y diseño en titanio.',
                'precio' => 4999000.00,
                'peso' => 0.187,
                'stock' => 25,
                'categoria' => 'electronica',
                'especificaciones' => [
                    'marca' => 'Apple',
                    'modelo' => 'iPhone 15 Pro',
                    'pantalla' => '6.1 pulgadas Super Retina XDR',
                    'almacenamiento' => '128GB',
                    'procesador' => 'A17 Pro',
                    'camara' => '48MP Principal + 12MP Ultra Gran Angular + 12MP Teleobjetivo',
                    'color' => 'Natural Titanium',
                    'resistencia' => 'IP68',
                ],
                'activo' => true,
                'fecha_vencimiento' => null,
            ],
            [
                'codigo_sku' => 'DEMO-002',
                'nombre' => 'MacBook Air M3',
                'descripcion' => 'Laptop ultradelgada con chip M3 de Apple y pantalla Retina de 13 pulgadas. Perfecta para estudiantes y profesionales.',
                'precio' => 5499000.00,
                'peso' => 1.240,
                'stock' => 15,
                'categoria' => 'electronica',
                'especificaciones' => [
                    'marca' => 'Apple',
                    'modelo' => 'MacBook Air 13"',
                    'procesador' => 'Apple M3 de 8 núcleos',
                    'memoria' => '8GB RAM unificada',
                    'almacenamiento' => '256GB SSD',
                    'pantalla' => '13.6" Liquid Retina (2560 x 1664)',
                    'bateria' => 'Hasta 18 horas',
                    'conectividad' => '2x Thunderbolt/USB 4, MagSafe 3',
                ],
                'activo' => true,
                'fecha_vencimiento' => null,
            ],
            [
                'codigo_sku' => 'DEMO-003',
                'nombre' => 'Auriculares Sony WH-1000XM5',
                'descripcion' => 'Auriculares inalámbricos premium con cancelación de ruido líder en la industria y calidad de sonido excepcional.',
                'precio' => 899000.00,
                'peso' => 0.250,
                'stock' => 50,
                'categoria' => 'electronica',
                'especificaciones' => [
                    'marca' => 'Sony',
                    'modelo' => 'WH-1000XM5',
                    'tipo' => 'Over-ear cerrados',
                    'conectividad' => 'Bluetooth 5.2, NFC',
                    'bateria' => 'Hasta 30 horas con ANC',
                    'drivers' => '30mm tipo cúpula',
                    'peso' => '250g',
                    'features' => 'Cancelación de ruido adaptativa, Quick Attention, Speak-to-Chat',
                ],
                'activo' => true,
                'fecha_vencimiento' => null,
            ],
            [
                'codigo_sku' => 'DEMO-004',
                'nombre' => 'Samsung Galaxy Tab S9',
                'descripcion' => 'Tablet premium con pantalla Dynamic AMOLED 2X y S Pen incluido. Ideal para creativos y productividad.',
                'precio' => 2799000.00,
                'peso' => 0.498,
                'stock' => 30,
                'categoria' => 'electronica',
                'especificaciones' => [
                    'marca' => 'Samsung',
                    'modelo' => 'Galaxy Tab S9',
                    'pantalla' => '11" Dynamic AMOLED 2X (2560 x 1600)',
                    'procesador' => 'Snapdragon 8 Gen 2',
                    'memoria' => '8GB RAM',
                    'almacenamiento' => '128GB + microSD',
                    'bateria' => '8,400mAh',
                    'accesorios' => 'S Pen incluido',
                ],
                'activo' => true,
                'fecha_vencimiento' => null,
            ],
            [
                'codigo_sku' => 'DEMO-005',
                'nombre' => 'Camiseta WorldSkills 2025',
                'descripcion' => 'Camiseta oficial de la competencia WorldSkills 2025. Material premium 100% algodón.',
                'precio' => 45000.00,
                'peso' => 0.200,
                'stock' => 200,
                'categoria' => 'ropa',
                'especificaciones' => [
                    'marca' => 'WorldSkills',
                    'material' => '100% algodón premium',
                    'tallas' => 'XS, S, M, L, XL, XXL',
                    'colores' => 'Blanco, Negro, Azul WS',
                    'diseño' => 'Logo WorldSkills 2025 bordado',
                    'origen' => 'Colombia',
                ],
                'activo' => true,
                'fecha_vencimiento' => null,
            ],
        ];

        // Crear productos demo
        foreach ($productosDemo as $producto) {
            Producto::create($producto);
        }

        // ========================================
        // PRODUCTOS USANDO FACTORY (Solo si existe)
        // ========================================

        // Verificar si Factory existe antes de usar
        if (class_exists('Database\Factories\ProductoFactory')) {
            // 15 productos normales aleatorios
            Producto::factory(15)->create();
            
            // 5 productos premium (precios altos)
            Producto::factory(5)->premium()->create();
            
            // 8 productos en oferta (precios bajos)
            Producto::factory(8)->oferta()->create();
            
            // 3 productos sin stock
            Producto::factory(3)->sinStock()->create();
        } else {
            // Si no hay factory, crear productos manualmente
            $this->crearProductosManuales();
        }

        // Mostrar estadísticas finales
        $total = Producto::count();
        $activos = Producto::where('activo', true)->count();
        $enStock = Producto::where('stock', '>', 0)->count();

        $this->command->info('✅ ProductoSeeder completado exitosamente:');
        $this->command->info("📦 Total productos: {$total}");
        $this->command->info("✅ Productos activos: {$activos}");
        $this->command->info("📈 Productos en stock: {$enStock}");
        $this->command->info('🎯 Data lista para WorldSkills 2025!');
    }

    /**
     * Crear productos adicionales manualmente si no hay Factory
     */
    private function crearProductosManuales(): void
    {
        $productosAdicionales = [
            [
                'codigo_sku' => 'MAN-001',
                'nombre' => 'Mouse Gaming RGB',
                'descripcion' => 'Mouse gaming con iluminación RGB y 6400 DPI.',
                'precio' => 149000.00,
                'peso' => 0.120,
                'stock' => 75,
                'categoria' => 'electronica',
                'especificaciones' => [
                    'marca' => 'TechGamer',
                    'dpi' => '6400 DPI ajustable',
                    'botones' => '7 botones programables',
                    'iluminacion' => 'RGB 16.7 millones de colores',
                    'conectividad' => 'USB 3.0',
                ],
                'activo' => true,
            ],
            [
                'codigo_sku' => 'MAN-002',
                'nombre' => 'Teclado Mecánico',
                'descripcion' => 'Teclado mecánico RGB con switches azules.',
                'precio' => 289000.00,
                'peso' => 1.100,
                'stock' => 45,
                'categoria' => 'electronica',
                'especificaciones' => [
                    'marca' => 'MechKeys',
                    'switches' => 'Cherry MX Blue',
                    'iluminacion' => 'RGB por tecla',
                    'layout' => 'Español QWERTY',
                    'material' => 'Aluminio anodizado',
                ],
                'activo' => true,
            ],
            [
                'codigo_sku' => 'MAN-003',
                'nombre' => 'Monitor 24" Full HD',
                'descripcion' => 'Monitor LED 24 pulgadas Full HD para gaming y trabajo.',
                'precio' => 599000.00,
                'peso' => 3.500,
                'stock' => 20,
                'categoria' => 'electronica',
                'especificaciones' => [
                    'marca' => 'ViewTech',
                    'tamaño' => '24 pulgadas',
                    'resolucion' => '1920x1080 Full HD',
                    'frecuencia' => '144Hz',
                    'panel' => 'IPS',
                    'conectividad' => 'HDMI, DisplayPort, USB-C',
                ],
                'activo' => true,
            ],
            [
                'codigo_sku' => 'MAN-004',
                'nombre' => 'Libro PHP Laravel',
                'descripcion' => 'Guía completa para desarrollo web con PHP y Laravel.',
                'precio' => 89000.00,
                'peso' => 0.650,
                'stock' => 100,
                'categoria' => 'libros',
                'especificaciones' => [
                    'autor' => 'Desarrollo Web Pro',
                    'paginas' => '450 páginas',
                    'nivel' => 'Intermedio a Avanzado',
                    'incluye' => 'Códigos de ejemplo y proyectos',
                    'idioma' => 'Español',
                ],
                'activo' => true,
            ],
            [
                'codigo_sku' => 'MAN-005',
                'nombre' => 'Producto Sin Stock',
                'descripcion' => 'Producto para testing - sin stock disponible.',
                'precio' => 50000.00,
                'peso' => 0.100,
                'stock' => 0,
                'categoria' => 'testing',
                'especificaciones' => [
                    'tipo' => 'Producto de prueba',
                    'proposito' => 'Testing de funcionalidades',
                ],
                'activo' => false,
            ],
        ];

        foreach ($productosAdicionales as $producto) {
            Producto::create($producto);
        }

        $this->command->info('📝 Productos manuales agregados (sin Factory)');
    }
}

/*
INSTRUCCIONES DE USO:

1. Copiar este archivo a: database/seeders/ProductoSeeder.php

2. Registrar en DatabaseSeeder:
   
   // database/seeders/DatabaseSeeder.php
   public function run(): void
   {
       $this->call([
           ProductoSeeder::class,
       ]);
   }

3. Ejecutar el seeder:
   php artisan db:seed --class=ProductoSeeder
   
   // O con reset completo:
   php artisan migrate:fresh --seed

4. Verificar datos creados:
   php artisan tinker
   echo Producto::count();
   Producto::take(3)->get(['nombre', 'precio', 'stock']);

PRODUCTOS INCLUIDOS:

DEMO (5 productos específicos):
- iPhone 15 Pro (electronica) - $4,999,000
- MacBook Air M3 (electronica) - $5,499,000  
- Sony WH-1000XM5 (electronica) - $899,000
- Samsung Galaxy Tab S9 (electronica) - $2,799,000
- Camiseta WorldSkills (ropa) - $45,000

MANUALES (5 productos adicionales):
- Mouse Gaming RGB - $149,000
- Teclado Mecánico - $289,000
- Monitor 24" - $599,000
- Libro PHP Laravel - $89,000
- Producto Sin Stock - $50,000 (testing)

FACTORY (si existe):
- 15 productos normales aleatorios
- 5 productos premium
- 8 productos en oferta
- 3 productos sin stock

TOTAL ESPERADO: 36-41 productos

PRÓXIMO PASO:
Continuar con Sección 03: Eloquent CRUD Operations
*/

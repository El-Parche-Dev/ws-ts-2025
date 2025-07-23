# 🛠️ EJERCICIO 2: Laravel CRUD - Productos Avanzado

## Implementación MVP - 60 minutos

### 📋 **DESCRIPCIÓN**

Extender el controlador `ProductoController` con funcionalidades avanzadas usando Laravel patterns.

---

## 🎯 **REQUERIMIENTOS**

### **FASE CORE ✅ (40 minutos)**

- ✅ Agregar campo "descripción" al CRUD
- ✅ Implementar búsqueda por nombre
- ✅ Agregar validaciones robustas
- ✅ Mejorar manejo de errores

### **FASE ENHANCED ⚡ (20 minutos)**

- ⚡ Paginación básica
- ⚡ Filtrado por estado (activo/inactivo)
- ⚡ Ordenamiento por diferentes campos
- ⚡ Soft deletes simulation

---

## 🏗️ **CÓDIGO BASE A EXTENDER**

### **1. Controller Mejorado**

```php
<?php
// app/Http/Controllers/ProductoController.php - EXTENDER ESTE CÓDIGO

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class ProductoController extends Controller
{
    // Datos simulados mejorados - TODO: Agregar más campos
    private static array $productos = [
        1 => [
            'id' => 1,
            'nombre' => 'Laptop Gaming',
            'descripcion' => 'Laptop de alto rendimiento para gaming',
            'precio' => 1500.00,
            'categoria' => 'Electrónicos',
            'activo' => true,
            'created_at' => '2025-01-11 10:00:00',
            'updated_at' => '2025-01-11 10:00:00'
        ],
        2 => [
            'id' => 2,
            'nombre' => 'Mouse Inalámbrico',
            'descripcion' => 'Mouse ergonómico con sensor óptico',
            'precio' => 25.50,
            'categoria' => 'Accesorios',
            'activo' => true,
            'created_at' => '2025-01-11 10:30:00',
            'updated_at' => '2025-01-11 10:30:00'
        ],
        3 => [
            'id' => 3,
            'nombre' => 'Teclado Mecánico',
            'descripcion' => 'Teclado mecánico RGB para programadores',
            'precio' => 85.00,
            'categoria' => 'Accesorios',
            'activo' => false,
            'created_at' => '2025-01-11 11:00:00',
            'updated_at' => '2025-01-11 11:00:00'
        ],
    ];

    /**
     * TODO: Mejorar index con búsqueda, filtros y paginación
     */
    public function index(Request $request): View
    {
        // TODO: Implementar búsqueda por nombre
        $buscar = $request->get('buscar', '');

        // TODO: Implementar filtro por estado
        $estado = $request->get('estado', 'todos'); // todos, activos, inactivos

        // TODO: Implementar ordenamiento
        $orden = $request->get('orden', 'nombre'); // nombre, precio, fecha
        $direccion = $request->get('direccion', 'asc'); // asc, desc

        // TODO: Filtrar productos según los parámetros
        $productos = collect(self::$productos);

        // Aplicar filtros aquí...

        return view('productos.index', compact('productos', 'buscar', 'estado', 'orden', 'direccion'));
    }

    /**
     * TODO: Mejorar validaciones en store
     */
    public function store(Request $request): RedirectResponse
    {
        // TODO: Implementar validaciones más robustas
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'min:3',
                'max:255',
                // TODO: Agregar validación de unicidad simulada
            ],
            'descripcion' => [
                'required',
                'string',
                'min:10',
                'max:1000'
            ],
            'precio' => [
                'required',
                'numeric',
                'min:0.01',
                'max:999999.99'
            ],
            'categoria' => [
                'required',
                'string',
                'in:Electrónicos,Accesorios,Software,Hardware'
            ]
        ], [
            'nombre.required' => 'El nombre del producto es obligatorio',
            'nombre.min' => 'El nombre debe tener al menos 3 caracteres',
            'descripcion.required' => 'La descripción es obligatoria',
            'descripcion.min' => 'La descripción debe tener al menos 10 caracteres',
            'precio.required' => 'El precio es obligatorio',
            'precio.min' => 'El precio debe ser mayor a 0',
            'categoria.required' => 'La categoría es obligatoria',
            'categoria.in' => 'La categoría seleccionada no es válida'
        ]);

        // TODO: Verificar que el nombre no existe (simulación)

        // TODO: Crear nuevo producto con timestamp
        $nuevoId = max(array_keys(self::$productos)) + 1;
        self::$productos[$nuevoId] = [
            'id' => $nuevoId,
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'],
            'precio' => (float) $validated['precio'],
            'categoria' => $validated['categoria'],
            'activo' => true,
            'created_at' => now()->format('Y-m-d H:i:s'),
            'updated_at' => now()->format('Y-m-d H:i:s')
        ];

        return redirect()->route('productos.index')
            ->with('success', 'Producto creado exitosamente');
    }

    /**
     * TODO: Implementar método de búsqueda específico
     */
    public function buscar(Request $request): View
    {
        // TODO: Implementar búsqueda avanzada
        $termino = $request->get('q', '');
        $categoria = $request->get('categoria', '');
        $precioMin = $request->get('precio_min', 0);
        $precioMax = $request->get('precio_max', 999999);

        // TODO: Filtrar productos según criterios

        return view('productos.buscar', compact('productos', 'termino', 'categoria', 'precioMin', 'precioMax'));
    }

    /**
     * TODO: Implementar soft delete
     */
    public function softDelete(string $id): RedirectResponse
    {
        // TODO: Implementar soft delete (cambiar activo a false)

        return redirect()->route('productos.index')
            ->with('success', 'Producto eliminado exitosamente');
    }

    /**
     * TODO: Implementar restaurar producto
     */
    public function restore(string $id): RedirectResponse
    {
        // TODO: Restaurar producto (cambiar activo a true)

        return redirect()->route('productos.index')
            ->with('success', 'Producto restaurado exitosamente');
    }
}
?>
```

### **2. Vistas a Crear/Mejorar**

```html
{{-- resources/views/productos/create.blade.php - MEJORAR --}}
@extends('layouts.app')

@section('title', 'Crear Producto - WorldSkills')

@section('content')
<div class="row justify-content-center">
    <div class="col-md-10">
        <div class="card">
            <div class="card-header">
                <h4>Crear Nuevo Producto</h4>
            </div>
            <div class="card-body">
                <form method="POST" action="{{ route('productos.store') }}">
                    @csrf

                    <div class="row">
                        {{-- Nombre --}}
                        <div class="col-md-6 mb-3">
                            <label for="nombre" class="form-label">Nombre del Producto *</label>
                            <input type="text"
                                   id="nombre"
                                   name="nombre"
                                   class="form-control @error('nombre') is-invalid @enderror"
                                   value="{{ old('nombre') }}"
                                   placeholder="Ej: Laptop Gaming MSI"
                                   required>
                            @error('nombre')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        {{-- Categoría --}}
                        <div class="col-md-6 mb-3">
                            <label for="categoria" class="form-label">Categoría *</label>
                            <select id="categoria"
                                    name="categoria"
                                    class="form-select @error('categoria') is-invalid @enderror"
                                    required>
                                <option value="">Seleccionar categoría</option>
                                <option value="Electrónicos" {{ old('categoria') == 'Electrónicos' ? 'selected' : '' }}>
                                    Electrónicos
                                </option>
                                <option value="Accesorios" {{ old('categoria') == 'Accesorios' ? 'selected' : '' }}>
                                    Accesorios
                                </option>
                                <option value="Software" {{ old('categoria') == 'Software' ? 'selected' : '' }}>
                                    Software
                                </option>
                                <option value="Hardware" {{ old('categoria') == 'Hardware' ? 'selected' : '' }}>
                                    Hardware
                                </option>
                            </select>
                            @error('categoria')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    {{-- Descripción --}}
                    <div class="mb-3">
                        <label for="descripcion" class="form-label">Descripción *</label>
                        <textarea id="descripcion"
                                  name="descripcion"
                                  class="form-control @error('descripcion') is-invalid @enderror"
                                  rows="4"
                                  placeholder="Describe las características principales del producto..."
                                  required>{{ old('descripcion') }}</textarea>
                        @error('descripcion')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                        <div class="form-text">Mínimo 10 caracteres, máximo 1000.</div>
                    </div>

                    {{-- Precio --}}
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="precio" class="form-label">Precio *</label>
                            <div class="input-group">
                                <span class="input-group-text">$</span>
                                <input type="number"
                                       id="precio"
                                       name="precio"
                                       class="form-control @error('precio') is-invalid @enderror"
                                       value="{{ old('precio') }}"
                                       step="0.01"
                                       min="0.01"
                                       max="999999.99"
                                       placeholder="0.00"
                                       required>
                                @error('precio')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    {{-- Actions --}}
                    <div class="d-flex justify-content-between">
                        <a href="{{ route('productos.index') }}" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i> Cancelar
                        </a>
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-save"></i> Crear Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
```

### **3. Vista Index con Búsqueda**

```html
{{-- resources/views/productos/index.blade.php - MEJORAR --}}
@extends('layouts.app')

@section('title', 'Productos - WorldSkills')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1>Lista de Productos</h1>
    <a href="{{ route('productos.create') }}" class="btn btn-success">
        <i class="fas fa-plus"></i> Crear Producto
    </a>
</div>

{{-- Filtros y Búsqueda --}}
<div class="card mb-4">
    <div class="card-body">
        <form method="GET" action="{{ route('productos.index') }}">
            <div class="row g-3">
                {{-- Búsqueda por nombre --}}
                <div class="col-md-4">
                    <label for="buscar" class="form-label">Buscar por nombre</label>
                    <input type="text"
                           id="buscar"
                           name="buscar"
                           class="form-control"
                           value="{{ $buscar }}"
                           placeholder="Nombre del producto...">
                </div>

                {{-- Filtro por estado --}}
                <div class="col-md-3">
                    <label for="estado" class="form-label">Estado</label>
                    <select id="estado" name="estado" class="form-select">
                        <option value="todos" {{ $estado == 'todos' ? 'selected' : '' }}>Todos</option>
                        <option value="activos" {{ $estado == 'activos' ? 'selected' : '' }}>Activos</option>
                        <option value="inactivos" {{ $estado == 'inactivos' ? 'selected' : '' }}>Inactivos</option>
                    </select>
                </div>

                {{-- Ordenamiento --}}
                <div class="col-md-3">
                    <label for="orden" class="form-label">Ordenar por</label>
                    <select id="orden" name="orden" class="form-select">
                        <option value="nombre" {{ $orden == 'nombre' ? 'selected' : '' }}>Nombre</option>
                        <option value="precio" {{ $orden == 'precio' ? 'selected' : '' }}>Precio</option>
                        <option value="fecha" {{ $orden == 'fecha' ? 'selected' : '' }}>Fecha</option>
                    </select>
                </div>

                {{-- Acciones --}}
                <div class="col-md-2 d-flex align-items-end">
                    <button type="submit" class="btn btn-primary me-2">
                        <i class="fas fa-search"></i> Buscar
                    </button>
                    <a href="{{ route('productos.index') }}" class="btn btn-outline-secondary">
                        <i class="fas fa-times"></i>
                    </a>
                </div>
            </div>
        </form>
    </div>
</div>

{{-- Lista de Productos --}}
<!-- TODO: Implementar la tabla de productos con los nuevos campos -->

@endsection
```

---

## ✅ **TAREAS ESPECÍFICAS**

### **CORE (40 minutos)**

1. **Agregar campo descripción** (10 min)

   - [ ] Modificar array de productos simulados
   - [ ] Agregar campo en formulario create/edit
   - [ ] Agregar validación para descripción

2. **Implementar búsqueda** (15 min)

   - [ ] Filtrar productos por nombre en método index()
   - [ ] Crear formulario de búsqueda en vista
   - [ ] Mantener parámetros de búsqueda en enlaces

3. **Mejorar validaciones** (10 min)

   - [ ] Agregar validación de unicidad simulada
   - [ ] Mensajes de error en español
   - [ ] Validación de categorías

4. **Manejo de errores** (5 min)
   - [ ] Try-catch en operaciones críticas
   - [ ] Mensajes de éxito/error consistentes

### **ENHANCED (20 minutos)**

5. **Paginación simulada** (10 min)

   - [ ] Implementar paginación básica (10 productos por página)
   - [ ] Links de navegación en vista

6. **Filtros adicionales** (10 min)
   - [ ] Filtro por estado (activo/inactivo)
   - [ ] Ordenamiento por nombre, precio, fecha
   - [ ] Filtro por categoría

---

## 🔍 **CRITERIOS DE EVALUACIÓN**

### **CORE (40 puntos)**

- [ ] Campo descripción agregado correctamente (10 pts)
- [ ] Búsqueda por nombre funcional (15 pts)
- [ ] Validaciones robustas implementadas (10 pts)
- [ ] Manejo de errores apropiado (5 pts)

### **ENHANCED (20 puntos)**

- [ ] Paginación básica funcional (10 pts)
- [ ] Filtros adicionales operativos (10 pts)

---

## 🚀 **PISTAS DE IMPLEMENTACIÓN**

### **Para la búsqueda:**

```php
$productos = collect(self::$productos);

if (!empty($buscar)) {
    $productos = $productos->filter(function ($producto) use ($buscar) {
        return stripos($producto['nombre'], $buscar) !== false;
    });
}
```

### **Para el ordenamiento:**

```php
$productos = $productos->sortBy($orden);
if ($direccion === 'desc') {
    $productos = $productos->reverse();
}
```

---

¡Demuestra tu dominio de Laravel CRUD avanzado! 🚀

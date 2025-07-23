# 🎨 EJERCICIO 3: Blade Templates - Componentes Reutilizables

## Implementación MVP - 30 minutos

### 📋 **DESCRIPCIÓN**

Crear vistas Blade optimizadas y componentes reutilizables para el sistema de productos.

---

## 🎯 **REQUERIMIENTOS**

### **FASE CORE ✅ (20 minutos)**

- ✅ Vista de edición de productos
- ✅ Vista detalle de producto
- ✅ Componente tarjeta de producto
- ✅ Navegación mejorada

### **FASE ENHANCED ⚡ (10 minutos)**

- ⚡ Componente de alertas reutilizable
- ⚡ Modal de confirmación
- ⚡ Breadcrumbs dinámicos
- ⚡ Loading states

---

## 🏗️ **VISTAS A CREAR**

### **1. Vista de Edición (CORE)**

```html
{{-- resources/views/productos/edit.blade.php - CREAR --}}
@extends('layouts.app')

@section('title', 'Editar Producto - WorldSkills')

@section('content')
<div class="row justify-content-center">
    <div class="col-md-10">
        {{-- Breadcrumb --}}
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <a href="{{ route('home') }}">Inicio</a>
                </li>
                <li class="breadcrumb-item">
                    <a href="{{ route('productos.index') }}">Productos</a>
                </li>
                <li class="breadcrumb-item">
                    <a href="{{ route('productos.show', $producto['id']) }}">{{ $producto['nombre'] }}</a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Editar</li>
            </ol>
        </nav>

        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h4>Editar Producto: {{ $producto['nombre'] }}</h4>
                <a href="{{ route('productos.show', $producto['id']) }}" class="btn btn-outline-secondary btn-sm">
                    <i class="fas fa-eye"></i> Ver Producto
                </a>
            </div>
            <div class="card-body">
                <form method="POST" action="{{ route('productos.update', $producto['id']) }}">
                    @csrf
                    @method('PUT')

                    <div class="row">
                        {{-- Nombre --}}
                        <div class="col-md-6 mb-3">
                            <label for="nombre" class="form-label">Nombre del Producto *</label>
                            <input type="text"
                                   id="nombre"
                                   name="nombre"
                                   class="form-control @error('nombre') is-invalid @enderror"
                                   value="{{ old('nombre', $producto['nombre']) }}"
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
                                @foreach(['Electrónicos', 'Accesorios', 'Software', 'Hardware'] as $cat)
                                    <option value="{{ $cat }}"
                                            {{ old('categoria', $producto['categoria']) == $cat ? 'selected' : '' }}>
                                        {{ $cat }}
                                    </option>
                                @endforeach
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
                                  required>{{ old('descripcion', $producto['descripcion']) }}</textarea>
                        @error('descripcion')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    {{-- Precio y Estado --}}
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="precio" class="form-label">Precio *</label>
                            <div class="input-group">
                                <span class="input-group-text">$</span>
                                <input type="number"
                                       id="precio"
                                       name="precio"
                                       class="form-control @error('precio') is-invalid @enderror"
                                       value="{{ old('precio', $producto['precio']) }}"
                                       step="0.01"
                                       min="0.01"
                                       required>
                                @error('precio')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label">Estado</label>
                            <div class="form-check form-switch">
                                <input class="form-check-input"
                                       type="checkbox"
                                       id="activo"
                                       name="activo"
                                       value="1"
                                       {{ old('activo', $producto['activo']) ? 'checked' : '' }}>
                                <label class="form-check-label" for="activo">
                                    Producto activo
                                </label>
                            </div>
                        </div>
                    </div>

                    {{-- Información adicional --}}
                    <div class="row">
                        <div class="col-md-6">
                            <small class="text-muted">
                                <strong>Creado:</strong> {{ $producto['created_at'] }}
                            </small>
                        </div>
                        <div class="col-md-6">
                            <small class="text-muted">
                                <strong>Actualizado:</strong> {{ $producto['updated_at'] }}
                            </small>
                        </div>
                    </div>

                    {{-- Actions --}}
                    <div class="d-flex justify-content-between mt-4">
                        <a href="{{ route('productos.show', $producto['id']) }}" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i> Cancelar
                        </a>
                        <button type="submit" class="btn btn-warning">
                            <i class="fas fa-save"></i> Actualizar Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
// Confirmación antes de salir sin guardar
let formChanged = false;

document.querySelectorAll('input, textarea, select').forEach(element => {
    element.addEventListener('change', function() {
        formChanged = true;
    });
});

window.addEventListener('beforeunload', function(e) {
    if (formChanged) {
        e.preventDefault();
        e.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
    }
});

document.querySelector('form').addEventListener('submit', function() {
    formChanged = false;
});
</script>
@endpush
```

### **2. Vista Detalle (CORE)**

```html
{{-- resources/views/productos/show.blade.php - CREAR --}}
@extends('layouts.app') @section('title', $producto['nombre'] . ' -
WorldSkills') @section('content') {{-- Breadcrumb --}}
<nav
  aria-label="breadcrumb"
  class="mb-4">
  <ol class="breadcrumb">
    <li class="breadcrumb-item">
      <a href="{{ route('home') }}">Inicio</a>
    </li>
    <li class="breadcrumb-item">
      <a href="{{ route('productos.index') }}">Productos</a>
    </li>
    <li
      class="breadcrumb-item active"
      aria-current="page">
      {{ $producto['nombre'] }}
    </li>
  </ol>
</nav>

<div class="row">
  <div class="col-md-8">
    {{-- Información Principal --}}
    <div class="card mb-4">
      <div
        class="card-header d-flex justify-content-between align-items-center">
        <h4 class="mb-0">{{ $producto['nombre'] }}</h4>
        <span
          class="badge {{ $producto['activo'] ? 'bg-success' : 'bg-danger' }} fs-6">
          {{ $producto['activo'] ? 'Activo' : 'Inactivo' }}
        </span>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h5 class="text-primary">Información Básica</h5>
            <table class="table table-borderless">
              <tr>
                <td><strong>ID:</strong></td>
                <td>{{ $producto['id'] }}</td>
              </tr>
              <tr>
                <td><strong>Categoría:</strong></td>
                <td>
                  <span class="badge bg-secondary"
                    >{{ $producto['categoria'] }}</span
                  >
                </td>
              </tr>
              <tr>
                <td><strong>Precio:</strong></td>
                <td class="fs-5 text-success">
                  <strong>${{ number_format($producto['precio'], 2) }}</strong>
                </td>
              </tr>
            </table>
          </div>
          <div class="col-md-6">
            <h5 class="text-primary">Fechas</h5>
            <table class="table table-borderless">
              <tr>
                <td><strong>Creado:</strong></td>
                <td>{{ $producto['created_at'] }}</td>
              </tr>
              <tr>
                <td><strong>Actualizado:</strong></td>
                <td>{{ $producto['updated_at'] }}</td>
              </tr>
            </table>
          </div>
        </div>

        <hr />

        <h5 class="text-primary">Descripción</h5>
        <p class="lead">{{ $producto['descripcion'] }}</p>
      </div>
    </div>
  </div>

  <div class="col-md-4">
    {{-- Panel de Acciones --}}
    <div class="card">
      <div class="card-header">
        <h5>Acciones</h5>
      </div>
      <div class="card-body d-grid gap-2">
        <a
          href="{{ route('productos.edit', $producto['id']) }}"
          class="btn btn-warning">
          <i class="fas fa-edit"></i> Editar Producto
        </a>

        @if($producto['activo'])
        <form
          action="{{ route('productos.destroy', $producto['id']) }}"
          method="POST"
          id="deleteForm">
          @csrf @method('DELETE')
          <button
            type="button"
            class="btn btn-danger w-100"
            id="deleteBtn">
            <i class="fas fa-trash"></i> Eliminar Producto
          </button>
        </form>
        @else
        <button
          class="btn btn-success"
          onclick="restaurarProducto({{ $producto['id'] }})">
          <i class="fas fa-undo"></i> Restaurar Producto
        </button>
        @endif

        <a
          href="{{ route('productos.index') }}"
          class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left"></i> Volver a Lista
        </a>
      </div>
    </div>

    {{-- Información Adicional --}}
    <div class="card mt-3">
      <div class="card-header">
        <h6>Estadísticas</h6>
      </div>
      <div class="card-body">
        <small class="text-muted">
          {{-- TODO: Agregar estadísticas reales --}}
          <div class="d-flex justify-content-between">
            <span>Vistas:</span>
            <span class="badge bg-info">{{ rand(10, 100) }}</span>
          </div>
          <div class="d-flex justify-content-between mt-2">
            <span>Ventas:</span>
            <span class="badge bg-success">{{ rand(1, 20) }}</span>
          </div>
        </small>
      </div>
    </div>
  </div>
</div>
@endsection @push('scripts')
<script>
  document.getElementById('deleteBtn')?.addEventListener('click', function () {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar este producto?\\n\\nEsta acción no se puede deshacer.'
      )
    ) {
      document.getElementById('deleteForm').submit();
    }
  });

  function restaurarProducto(id) {
    if (confirm('¿Quieres restaurar este producto?')) {
      // TODO: Implementar restauración via AJAX
      window.location.href = `/productos/${id}/restore`;
    }
  }
</script>
@endpush
```

### **3. Componente Tarjeta de Producto (CORE)**

```html
{{-- resources/views/components/producto-card.blade.php - CREAR COMPONENTE --}}
@props(['producto'])

<div class="col-md-4 mb-3">
  <div class="card h-100 shadow-sm">
    {{-- Header con estado --}}
    <div
      class="card-header d-flex justify-content-between align-items-center py-2">
      <small class="text-muted">ID: {{ $producto['id'] }}</small>
      <span
        class="badge {{ $producto['activo'] ? 'bg-success' : 'bg-danger' }}">
        {{ $producto['activo'] ? 'Activo' : 'Inactivo' }}
      </span>
    </div>

    <div class="card-body d-flex flex-column">
      {{-- Título --}}
      <h5 class="card-title">{{ $producto['nombre'] }}</h5>

      {{-- Categoría --}}
      <div class="mb-2">
        <span class="badge bg-secondary">{{ $producto['categoria'] }}</span>
      </div>

      {{-- Descripción (truncada) --}}
      <p class="card-text flex-grow-1">
        {{ Str::limit($producto['descripcion'], 100) }}
      </p>

      {{-- Precio destacado --}}
      <div class="mb-3">
        <h4 class="text-success mb-0">
          ${{ number_format($producto['precio'], 2) }}
        </h4>
      </div>

      {{-- Metadatos --}}
      <div class="text-muted small mb-3">
        <div class="d-flex justify-content-between">
          <span
            ><i class="fas fa-calendar"></i> {{ date('d/m/Y',
            strtotime($producto['created_at'])) }}</span
          >
          <span
            ><i class="fas fa-clock"></i> {{ date('H:i',
            strtotime($producto['updated_at'])) }}</span
          >
        </div>
      </div>
    </div>

    {{-- Footer con acciones --}}
    <div class="card-footer bg-transparent">
      <div
        class="btn-group w-100"
        role="group">
        <a
          href="{{ route('productos.show', $producto['id']) }}"
          class="btn btn-outline-primary btn-sm">
          <i class="fas fa-eye"></i> Ver
        </a>
        <a
          href="{{ route('productos.edit', $producto['id']) }}"
          class="btn btn-outline-warning btn-sm">
          <i class="fas fa-edit"></i> Editar
        </a>
        <button
          type="button"
          class="btn btn-outline-danger btn-sm"
          onclick="confirmarEliminacion({{ $producto['id'] }}, '{{ $producto['nombre'] }}')">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    </div>
  </div>
</div>

<script>
  function confirmarEliminacion(id, nombre) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${nombre}"?`)) {
      // Crear formulario dinámicamente
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `/productos/${id}`;
      form.style.display = 'none';

      // Token CSRF
      const csrfToken = document.createElement('input');
      csrfToken.type = 'hidden';
      csrfToken.name = '_token';
      csrfToken.value = '{{ csrf_token() }}';

      // Method spoofing
      const methodField = document.createElement('input');
      methodField.type = 'hidden';
      methodField.name = '_method';
      methodField.value = 'DELETE';

      form.appendChild(csrfToken);
      form.appendChild(methodField);
      document.body.appendChild(form);
      form.submit();
    }
  }
</script>
```

---

## ✅ **TAREAS ESPECÍFICAS**

### **CORE (20 minutos)**

1. **Vista de edición** (8 min)

   - [ ] Crear `resources/views/productos/edit.blade.php`
   - [ ] Formulario con campos pre-llenos
   - [ ] Validación visual de errores
   - [ ] Breadcrumbs de navegación

2. **Vista detalle** (8 min)

   - [ ] Crear `resources/views/productos/show.blade.php`
   - [ ] Layout informativo y profesional
   - [ ] Panel de acciones lateral
   - [ ] Información de metadatos

3. **Componente tarjeta** (4 min)
   - [ ] Crear `resources/views/components/producto-card.blade.php`
   - [ ] Design responsivo y atractivo
   - [ ] Acciones integradas

### **ENHANCED (10 minutos)**

4. **Componente de alertas** (3 min)

   - [ ] Crear componente reutilizable para mensajes
   - [ ] Diferentes tipos (success, error, warning, info)

5. **Modal de confirmación** (4 min)

   - [ ] JavaScript para confirmaciones elegantes
   - [ ] Reemplazar alert() básico

6. **Mejoras de UX** (3 min)
   - [ ] Loading states
   - [ ] Transiciones CSS
   - [ ] Tooltips informativos

---

## 🔍 **EJEMPLO DE USO DEL COMPONENTE**

```html
{{-- En productos/index.blade.php --}} @if($productos->count() > 0)
<div class="row">
  @foreach($productos as $producto)
  <x-producto-card :producto="$producto" />
  @endforeach
</div>
@endif
```

---

## ✅ **CRITERIOS DE EVALUACIÓN**

### **CORE (20 puntos)**

- [ ] Vista de edición funcional y bien diseñada (8 pts)
- [ ] Vista detalle informativa y profesional (8 pts)
- [ ] Componente tarjeta reutilizable (4 pts)

### **ENHANCED (10 puntos)**

- [ ] Componentes adicionales implementados (5 pts)
- [ ] JavaScript para UX mejorada (3 pts)
- [ ] CSS y diseño profesional (2 pts)

---

¡Crea interfaces Blade profesionales y reutilizables! 🎨

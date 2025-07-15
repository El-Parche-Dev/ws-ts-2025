@props([
    'type' => 'info', // success, danger, warning, info, primary, secondary
    'dismissible' => true,
    'icon' => null
])

@php
$icons = [
    'success' => 'check-circle',
    'danger' => 'exclamation-triangle',
    'warning' => 'exclamation-triangle',
    'info' => 'info-circle',
    'primary' => 'info-circle',
    'secondary' => 'info-circle'
];

$defaultIcon = $icon ?? $icons[$type] ?? 'info-circle';

$classes = [
    'alert',
    'alert-' . $type,
    $dismissible ? 'alert-dismissible fade show' : ''
];
@endphp

<div {{ $attributes->merge(['class' => implode(' ', $classes)]) }} role="alert">
    <i class="bi bi-{{ $defaultIcon }} me-2"></i>
    {{ $slot }}
    
    @if($dismissible)
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    @endif
</div>

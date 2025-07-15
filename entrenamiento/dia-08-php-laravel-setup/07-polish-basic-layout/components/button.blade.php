@props([
    'type' => 'button',
    'variant' => 'primary', // primary, secondary, success, danger, warning, info, light, dark
    'size' => 'md', // sm, md, lg
    'icon' => null,
    'loading' => false,
    'disabled' => false
])

@php
$classes = [
    'btn',
    'btn-' . $variant,
    $size === 'sm' ? 'btn-sm' : '',
    $size === 'lg' ? 'btn-lg' : '',
    $loading ? 'disabled' : '',
    $disabled ? 'disabled' : ''
];
@endphp

<button 
    type="{{ $type }}" 
    {{ $attributes->merge(['class' => implode(' ', array_filter($classes))]) }}
    @if($loading || $disabled) disabled @endif
>
    @if($loading)
        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
    @elseif($icon)
        <i class="bi bi-{{ $icon }} me-2"></i>
    @endif
    
    {{ $slot }}
</button>

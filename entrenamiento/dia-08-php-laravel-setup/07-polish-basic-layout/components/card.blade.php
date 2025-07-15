@props([
    'title' => null,
    'icon' => null,
    'type' => 'default', // default, primary, success, warning, danger, info
    'shadow' => true,
    'hover' => true
])

@php
$classes = [
    'card',
    'h-100',
    $shadow ? 'shadow-custom' : '',
    $hover ? 'card-hover' : '',
    $type !== 'default' ? 'border-' . $type : ''
];
@endphp

<div {{ $attributes->merge(['class' => implode(' ', array_filter($classes))]) }}>
    @if($title)
    <div class="card-header {{ $type !== 'default' ? 'bg-' . $type . ' text-white' : '' }}">
        @if($icon)
            <i class="bi bi-{{ $icon }} me-2"></i>
        @endif
        {{ $title }}
    </div>
    @endif
    
    <div class="card-body">
        {{ $slot }}
    </div>
</div>

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * 🎯 ProductValidationRequest - Validaciones Avanzadas WorldSkills 2025
 * 
 * Form Request con validaciones complejas y reglas de negocio específicas
 * Implementado siguiendo metodología MVP: Core → Enhanced → Polish
 */
class ProductValidationRequest extends FormRequest
{
    /**
     * Determinar si el usuario está autorizado
     */
    public function authorize()
    {
        return true;
    }

    // ========== FASE CORE ✅ (10 minutos) ==========
    // Validaciones básicas esenciales con reglas complejas

    /**
     * Reglas de validación avanzadas
     */
    public function rules()
    {
        $productId = $this->route('product')?->id;

        return [
            // Validaciones básicas mejoradas
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-0-9]+$/', // Solo letras, números, espacios y guiones
                Rule::unique('products', 'name')->ignore($productId)
            ],
            
            'description' => [
                'required',
                'string',
                'min:20',
                'max:1000',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.\,\-0-9\(\)]+$/' // Caracteres seguros
            ],
            
            // Validación de precio con reglas de negocio
            'price' => [
                'required',
                'numeric',
                'min:0.01',
                'max:999999.99',
                'decimal:0,2', // Máximo 2 decimales
                function ($attribute, $value, $fail) {
                    // Validar precio mínimo según categoría
                    $categoryId = $this->input('category_id');
                    $minimumPrices = [
                        1 => 10,    // Electrónicos: mínimo $10
                        2 => 5,     // Ropa: mínimo $5
                        3 => 1,     // Libros: mínimo $1
                        4 => 15,    // Hogar: mínimo $15
                    ];
                    
                    if (isset($minimumPrices[$categoryId]) && $value < $minimumPrices[$categoryId]) {
                        $fail("El precio mínimo para esta categoría es $" . $minimumPrices[$categoryId]);
                    }
                }
            ],
            
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id,active,1' // Solo categorías activas
            ],
            
            // Validación avanzada de imagen
            'image' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif,webp',
                'max:2048', // 2MB
                'dimensions:min_width=200,min_height=200,max_width=2000,max_height=2000'
            ],
            
            // Validación de stock con reglas de negocio
            'stock' => [
                'required',
                'integer',
                'min:0',
                'max:9999',
                function ($attribute, $value, $fail) {
                    // Si está activo, debe tener stock
                    if ($this->boolean('active') && $value == 0) {
                        $fail('Un producto activo debe tener stock disponible.');
                    }
                }
            ],
            
            'active' => 'boolean'
        ];
    }

    // ========== FASE ENHANCED ⚡ (12 minutos) ==========
    // Validaciones condicionales y reglas personalizadas

    /**
     * Mensajes de error personalizados en español
     */
    public function messages()
    {
        return [
            // Mensajes para nombre
            'name.required' => 'El nombre del producto es obligatorio.',
            'name.unique' => 'Ya existe un producto con este nombre.',
            'name.min' => 'El nombre debe tener al menos 3 caracteres.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
            'name.regex' => 'El nombre solo puede contener letras, números, espacios y guiones.',
            
            // Mensajes para descripción
            'description.required' => 'La descripción es obligatoria.',
            'description.min' => 'La descripción debe tener al menos 20 caracteres.',
            'description.max' => 'La descripción no puede exceder 1000 caracteres.',
            'description.regex' => 'La descripción contiene caracteres no permitidos.',
            
            // Mensajes para precio
            'price.required' => 'El precio es obligatorio.',
            'price.numeric' => 'El precio debe ser un número válido.',
            'price.min' => 'El precio debe ser mayor a $0.00.',
            'price.max' => 'El precio no puede exceder $999,999.99.',
            'price.decimal' => 'El precio puede tener máximo 2 decimales.',
            
            // Mensajes para categoría
            'category_id.required' => 'Debes seleccionar una categoría.',
            'category_id.exists' => 'La categoría seleccionada no existe o está inactiva.',
            
            // Mensajes para imagen
            'image.image' => 'El archivo debe ser una imagen.',
            'image.mimes' => 'La imagen debe ser de tipo: jpeg, png, jpg, gif o webp.',
            'image.max' => 'La imagen no puede ser mayor a 2MB.',
            'image.dimensions' => 'La imagen debe tener entre 200x200 y 2000x2000 píxeles.',
            
            // Mensajes para stock
            'stock.required' => 'El stock es obligatorio.',
            'stock.integer' => 'El stock debe ser un número entero.',
            'stock.min' => 'El stock no puede ser negativo.',
            'stock.max' => 'El stock no puede exceder 9,999 unidades.'
        ];
    }

    /**
     * Validaciones adicionales después de validación básica
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validar coherencia entre campos
            $this->validateFieldCoherence($validator);
            
            // Validar reglas de negocio específicas
            $this->validateBusinessRules($validator);
            
            // Validar límites por categoría
            $this->validateCategoryLimits($validator);
        });
    }

    // ========== FASE POLISH ✨ (8 minutos) ==========
    // Validaciones avanzadas y preparación optimizada

    /**
     * Preparar datos antes de validación
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'active' => $this->boolean('active', true),
            
            // Limpiar y formatear precio
            'price' => $this->input('price') ? 
                (float) str_replace(['$', ',', ' '], '', $this->input('price')) : null,
                
            // Limpiar nombre
            'name' => $this->input('name') ? 
                trim(ucwords(strtolower($this->input('name')))) : null,
                
            // Limpiar descripción
            'description' => $this->input('description') ? 
                trim($this->input('description')) : null
        ]);
    }

    /**
     * Validar coherencia entre campos
     */
    private function validateFieldCoherence($validator)
    {
        // Validar que descripción no sea igual al nombre
        if ($this->filled(['name', 'description'])) {
            if (strtolower($this->name) === strtolower($this->description)) {
                $validator->errors()->add('description', 
                    'La descripción debe ser diferente al nombre del producto.');
            }
        }
        
        // Validar precio coherente con descripción
        if ($this->filled(['price', 'description'])) {
            $luxuryKeywords = ['premium', 'luxury', 'deluxe', 'profesional'];
            $hasLuxuryKeywords = false;
            
            foreach ($luxuryKeywords as $keyword) {
                if (stripos($this->description, $keyword) !== false) {
                    $hasLuxuryKeywords = true;
                    break;
                }
            }
            
            if ($hasLuxuryKeywords && $this->price < 100) {
                $validator->errors()->add('price', 
                    'Los productos premium deben tener un precio de al menos $100.');
            }
        }
    }

    /**
     * Validar reglas de negocio específicas
     */
    private function validateBusinessRules($validator)
    {
        // Validar duplicación por nombre similar
        if ($this->filled('name')) {
            $similarProducts = \App\Models\Product::where('name', 'like', '%' . $this->name . '%')
                ->where('id', '!=', $this->route('product')?->id ?? 0)
                ->count();
                
            if ($similarProducts > 0) {
                $validator->errors()->add('name', 
                    'Existe un producto con nombre similar. Verifica que no sea duplicado.');
            }
        }
        
        // Validar límite de productos por categoría (ejemplo: máximo 100 por categoría)
        if ($this->filled('category_id')) {
            $productsInCategory = \App\Models\Product::where('category_id', $this->category_id)
                ->where('id', '!=', $this->route('product')?->id ?? 0)
                ->count();
                
            if ($productsInCategory >= 100) {
                $validator->errors()->add('category_id', 
                    'Esta categoría ya tiene el máximo de productos permitidos (100).');
            }
        }
    }

    /**
     * Validar límites específicos por categoría
     */
    private function validateCategoryLimits($validator)
    {
        if (!$this->filled(['category_id', 'stock', 'price'])) {
            return;
        }
        
        $category = \App\Models\Category::find($this->category_id);
        if (!$category) {
            return;
        }
        
        // Reglas específicas por categoría
        switch ($category->name) {
            case 'Electrónicos':
                if ($this->stock > 500) {
                    $validator->errors()->add('stock', 
                        'Los productos electrónicos no pueden tener más de 500 unidades en stock.');
                }
                break;
                
            case 'Perecederos':
                if ($this->stock > 50) {
                    $validator->errors()->add('stock', 
                        'Los productos perecederos no pueden tener más de 50 unidades en stock.');
                }
                if (!$this->active) {
                    $validator->errors()->add('active', 
                        'Los productos perecederos deben estar activos.');
                }
                break;
                
            case 'Libros':
                if ($this->price > 500) {
                    $validator->errors()->add('price', 
                        'Los libros no pueden costar más de $500.');
                }
                break;
        }
    }

    /**
     * Obtener datos validados con formateo adicional
     */
    public function validated($key = null, $default = null)
    {
        $data = parent::validated();
        
        // Formatear datos después de validación
        if (isset($data['name'])) {
            $data['name'] = trim($data['name']);
        }
        
        if (isset($data['description'])) {
            $data['description'] = trim($data['description']);
        }
        
        if (isset($data['price'])) {
            $data['price'] = round($data['price'], 2);
        }
        
        return $data;
    }
}

// 📝 Notas de Implementación MVP:
// - Prioridad 1: Validaciones robustas funcionando (CORE)
// - Prioridad 2: Reglas de negocio y coherencia (ENHANCED)
// - Prioridad 3: Optimizaciones y validaciones avanzadas (POLISH)

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * 🎯 ProductRequest - Form Request para validación de productos
 * 
 * Centraliza todas las validaciones de productos siguiendo MVP:
 * Core → Enhanced → Polish
 */
class ProductRequest extends FormRequest
{
    /**
     * Determinar si el usuario está autorizado para esta request
     * 
     * @return bool
     */
    public function authorize()
    {
        return true; // Ajustar según lógica de autorización necesaria
    }

    // ========== FASE CORE ✅ (10 minutos) ==========
    // Validaciones básicas esenciales

    /**
     * Reglas de validación básicas
     * 
     * @return array
     */
    public function rules()
    {
        $productId = $this->route('product')?->id;

        return [
            // Campos básicos requeridos
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
                Rule::unique('products', 'name')->ignore($productId)
            ],
            'description' => 'required|string|min:10|max:1000',
            'price' => 'required|numeric|min:0|max:999999.99',
            'category_id' => 'required|exists:categories,id',
            
            // Campos opcionales básicos
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'stock' => 'required|integer|min:0|max:9999',
            'active' => 'boolean'
        ];
    }

    // ========== FASE ENHANCED ⚡ (8 minutos) ==========
    // Mensajes personalizados y validaciones adicionales

    /**
     * Mensajes de validación personalizados en español
     * 
     * @return array
     */
    public function messages()
    {
        return [
            // Mensajes para nombre
            'name.required' => 'El nombre del producto es obligatorio.',
            'name.unique' => 'Ya existe un producto con este nombre.',
            'name.min' => 'El nombre debe tener al menos 3 caracteres.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
            
            // Mensajes para descripción
            'description.required' => 'La descripción es obligatoria.',
            'description.min' => 'La descripción debe tener al menos 10 caracteres.',
            'description.max' => 'La descripción no puede exceder 1000 caracteres.',
            
            // Mensajes para precio
            'price.required' => 'El precio es obligatorio.',
            'price.numeric' => 'El precio debe ser un número válido.',
            'price.min' => 'El precio no puede ser negativo.',
            'price.max' => 'El precio no puede exceder $999,999.99.',
            
            // Mensajes para categoría
            'category_id.required' => 'Debes seleccionar una categoría.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
            
            // Mensajes para imagen
            'image.image' => 'El archivo debe ser una imagen.',
            'image.mimes' => 'La imagen debe ser de tipo: jpeg, png, jpg o gif.',
            'image.max' => 'La imagen no puede ser mayor a 2MB.',
            
            // Mensajes para stock
            'stock.required' => 'El stock es obligatorio.',
            'stock.integer' => 'El stock debe ser un número entero.',
            'stock.min' => 'El stock no puede ser negativo.',
            'stock.max' => 'El stock no puede exceder 9,999 unidades.'
        ];
    }

    /**
     * Atributos personalizados para mensajes de error
     * 
     * @return array
     */
    public function attributes()
    {
        return [
            'name' => 'nombre',
            'description' => 'descripción',
            'price' => 'precio',
            'category_id' => 'categoría',
            'image' => 'imagen',
            'stock' => 'stock',
            'active' => 'estado'
        ];
    }

    // ========== FASE POLISH ✨ (7 minutos) ==========
    // Validaciones avanzadas y preparación de datos

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
                trim(ucwords(strtolower($this->input('name')))) : null
        ]);
    }

    /**
     * Validaciones adicionales después de validación básica
     * 
     * @param \Illuminate\Validation\Validator $validator
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validar que el precio sea coherente con la categoría
            if ($this->filled(['price', 'category_id'])) {
                $category = \App\Models\Category::find($this->category_id);
                
                if ($category && $category->name === 'Electrónicos' && $this->price < 50) {
                    $validator->errors()->add('price', 
                        'Los productos electrónicos deben tener un precio mínimo de $50.');
                }
            }
            
            // Validar coherencia stock vs estado
            if ($this->filled(['stock', 'active'])) {
                if ($this->active && $this->stock == 0) {
                    $validator->errors()->add('stock', 
                        'Un producto activo debe tener stock disponible.');
                }
            }
        });
    }

    /**
     * Manejar validación fallida
     * 
     * @param \Illuminate\Contracts\Validation\Validator $validator
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        // Registrar intentos de validación fallidos para debugging
        \Log::info('Validación de producto fallida', [
            'errors' => $validator->errors()->toArray(),
            'input' => $this->except(['image']) // No loggear archivos
        ]);

        parent::failedValidation($validator);
    }

    /**
     * Obtener datos validados con formateo adicional
     * 
     * @return array
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
        
        return $data;
    }
}

// 📝 Notas de Implementación MVP:
// - Prioridad 1: Validaciones básicas funcionales (CORE)
// - Prioridad 2: Mensajes personalizados y atributos (ENHANCED)
// - Prioridad 3: Validaciones avanzadas y formateo (POLISH)

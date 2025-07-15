<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

/**
 * 🎯 Custom Exception Handler - WorldSkills 2025
 * 
 * Manejo profesional de errores con logging, recovery y UX optimizada
 * Implementado siguiendo metodología MVP: Core → Enhanced → Polish
 */
class Handler extends ExceptionHandler
{
    // ========== FASE CORE ✅ (10 minutos) ==========
    // Exception handling básico con logging estructurado

    /**
     * Lista de inputs que no se incluyen en logs de sesión
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Registrar callbacks de exception handling
     */
    public function register()
    {
        // Handler para errores de base de datos
        $this->renderable(function (QueryException $e, Request $request) {
            return $this->handleDatabaseException($e, $request);
        });
        
        // Handler para errores 404
        $this->renderable(function (NotFoundHttpException $e, Request $request) {
            return $this->handleNotFoundHttpException($e, $request);
        });
        
        // Handler para errores de validación
        $this->renderable(function (ValidationException $e, Request $request) {
            return $this->handleValidationException($e, $request);
        });
    }

    /**
     * Reportar o loggear una excepción
     */
    public function report(Throwable $exception)
    {
        // Logging estructurado con contexto
        $this->logExceptionWithContext($exception);
        
        parent::report($exception);
    }

    // ========== FASE ENHANCED ⚡ (15 minutos) ==========
    // Recovery automático y manejo específico por tipo de error

    /**
     * Manejar errores de base de datos
     */
    private function handleDatabaseException(QueryException $e, Request $request)
    {
        \Log::channel('products')->error('Database Error', [
            'error' => $e->getMessage(),
            'sql' => $e->getSql(),
            'bindings' => $e->getBindings(),
            'user_id' => auth()->id(),
            'ip' => $request->ip(),
            'url' => $request->fullUrl(),
            'timestamp' => now()
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la base de datos. Por favor intenta nuevamente.',
                'error_code' => 'DB_ERROR',
                'timestamp' => now(),
                'can_retry' => true
            ], 500);
        }

        return response()->view('errors.database', [
            'message' => 'Problema temporal con la base de datos',
            'canRetry' => true,
            'previousUrl' => url()->previous()
        ], 500);
    }

    /**
     * Manejar errores 404
     */
    private function handleNotFoundHttpException(NotFoundHttpException $e, Request $request)
    {
        \Log::channel('products')->warning('404 Not Found', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'user_agent' => $request->userAgent(),
            'referer' => $request->header('referer'),
            'user_id' => auth()->id(),
            'ip' => $request->ip()
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Recurso no encontrado',
                'error_code' => 'NOT_FOUND',
                'suggestions' => $this->getSuggestions($request)
            ], 404);
        }

        return response()->view('errors.404', [
            'suggestions' => $this->getSuggestions($request),
            'searchTerm' => $this->extractSearchTermFromUrl($request->path())
        ], 404);
    }

    /**
     * Manejar errores de validación con contexto mejorado
     */
    private function handleValidationException(ValidationException $e, Request $request)
    {
        \Log::channel('products')->info('Validation Failed', [
            'errors' => $e->errors(),
            'input' => $request->except(['password', 'image']),
            'user_id' => auth()->id(),
            'form_step' => $request->get('step', 'unknown'),
            'timestamp' => now()
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $e->errors(),
                'error_code' => 'VALIDATION_ERROR',
                'suggestions' => $this->getValidationSuggestions($e->errors())
            ], 422);
        }

        return back()
            ->withErrors($e->errors())
            ->withInput()
            ->with('validation_failed', true)
            ->with('error_suggestions', $this->getValidationSuggestions($e->errors()));
    }

    // ========== FASE POLISH ✨ (10 minutos) ==========
    // Funcionalidades avanzadas: recovery automático, sugerencias inteligentes

    /**
     * Logging de excepciones con contexto completo
     */
    private function logExceptionWithContext(Throwable $exception)
    {
        $context = [
            'exception_class' => get_class($exception),
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString(),
            'url' => request()->fullUrl(),
            'method' => request()->method(),
            'user_id' => auth()->id(),
            'session_id' => session()->getId(),
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'memory_usage' => memory_get_usage(true),
            'timestamp' => now(),
            'environment' => app()->environment()
        ];

        // Agregar contexto específico por tipo de excepción
        if ($exception instanceof QueryException) {
            $context['sql'] = $exception->getSql();
            $context['bindings'] = $exception->getBindings();
        }

        \Log::error('Exception Occurred', $context);
    }

    /**
     * Generar sugerencias inteligentes para errores 404
     */
    private function getSuggestions(Request $request)
    {
        $path = $request->path();
        $suggestions = [];

        // Sugerencias basadas en rutas similares
        if (str_contains($path, 'producto')) {
            $suggestions[] = [
                'text' => 'Ver todos los productos',
                'url' => route('products.index'),
                'icon' => 'fas fa-list'
            ];
            $suggestions[] = [
                'text' => 'Agregar nuevo producto',
                'url' => route('products.create'),
                'icon' => 'fas fa-plus'
            ];
        }

        // Buscar productos similares si hay ID en la URL
        $productId = $this->extractIdFromPath($path);
        if ($productId) {
            $similarProducts = \App\Models\Product::where('id', '!=', $productId)
                ->limit(3)
                ->get(['id', 'name']);
                
            foreach ($similarProducts as $product) {
                $suggestions[] = [
                    'text' => $product->name,
                    'url' => route('products.show', $product),
                    'icon' => 'fas fa-box'
                ];
            }
        }

        return $suggestions;
    }

    /**
     * Generar sugerencias para errores de validación
     */
    private function getValidationSuggestions(array $errors)
    {
        $suggestions = [];

        foreach ($errors as $field => $messages) {
            switch ($field) {
                case 'name':
                    $suggestions[$field] = [
                        'tip' => 'Usa un nombre descriptivo y único',
                        'example' => 'Ejemplo: "iPhone 15 Pro Max 256GB"'
                    ];
                    break;
                    
                case 'price':
                    $suggestions[$field] = [
                        'tip' => 'El precio debe ser un número positivo',
                        'example' => 'Ejemplo: 299.99'
                    ];
                    break;
                    
                case 'image':
                    $suggestions[$field] = [
                        'tip' => 'Usa imágenes JPG, PNG o GIF menores a 2MB',
                        'example' => 'Tamaño recomendado: 800x600 píxeles'
                    ];
                    break;
                    
                default:
                    $suggestions[$field] = [
                        'tip' => 'Verifica que el campo cumpla los requisitos',
                        'example' => ''
                    ];
            }
        }

        return $suggestions;
    }

    /**
     * Extraer término de búsqueda de la URL
     */
    private function extractSearchTermFromUrl(string $path)
    {
        if (preg_match('/productos\/search\/(.+)/', $path, $matches)) {
            return urldecode($matches[1]);
        }
        
        return null;
    }

    /**
     * Extraer ID numérico de la ruta
     */
    private function extractIdFromPath(string $path)
    {
        if (preg_match('/\/(\d+)/', $path, $matches)) {
            return (int) $matches[1];
        }
        
        return null;
    }

    /**
     * Render custom error response
     */
    public function render($request, Throwable $exception)
    {
        // Para APIs, siempre retornar JSON
        if ($request->is('api/*') || $request->expectsJson()) {
            return $this->renderApiError($request, $exception);
        }

        // Para requests web, usar vistas personalizadas
        return parent::render($request, $exception);
    }

    /**
     * Renderizar errores para API
     */
    private function renderApiError($request, Throwable $exception)
    {
        $statusCode = method_exists($exception, 'getStatusCode') 
            ? $exception->getStatusCode() 
            : 500;

        $response = [
            'success' => false,
            'message' => $exception->getMessage(),
            'error_code' => class_basename($exception),
            'timestamp' => now(),
            'request_id' => $request->header('X-Request-ID', uniqid())
        ];

        // Incluir stack trace solo en desarrollo
        if (app()->environment('local', 'testing')) {
            $response['debug'] = [
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTrace()
            ];
        }

        return response()->json($response, $statusCode);
    }
}

// 📝 Notas de Implementación MVP:
// - Prioridad 1: Exception handling básico funcionando (CORE)
// - Prioridad 2: Recovery automático y logging contextual (ENHANCED)
// - Prioridad 3: Sugerencias inteligentes y UX avanzada (POLISH)

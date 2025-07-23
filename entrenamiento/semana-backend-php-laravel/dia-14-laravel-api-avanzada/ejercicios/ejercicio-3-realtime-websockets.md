# 🌐 EJERCICIO 3: Real-time Features & WebSockets

## Implementación MVP - 2 horas

### 📋 **DESCRIPCIÓN**

Implementar funcionalidades en tiempo real usando Laravel Broadcasting, WebSockets y eventos para crear una experiencia de usuario dinámica e interactiva en tu API.

---

## 🎯 **REQUERIMIENTOS TÉCNICOS**

### **FASE CORE ✅ (80 minutos)**

- ✅ Configuración básica de Laravel Broadcasting
- ✅ WebSocket server funcionando
- ✅ Eventos de tiempo real básicos
- ✅ Notificaciones push simples
- ✅ Frontend básico para testing

### **FASE ENHANCED ⚡ (30 minutos)**

- ⚡ Presence channels con usuarios online
- ⚡ Private channels con autenticación
- ⚡ Event broadcasting con payload complejo
- ⚡ Real-time file upload progress

### **FASE POLISH ✨ (10 minutos)**

- ✨ WebSocket clustering
- ✨ Broadcasting performance optimization
- ✨ Real-time analytics dashboard
- ✨ Custom WebSocket events

---

## 🏗️ **ESTRUCTURA DEL PROYECTO**

```php
<?php
// Estructura de archivos a crear

app/
├── Events/
│   ├── FileUploaded.php
│   ├── UserOnline.php
│   ├── NotificationSent.php
│   └── FileProcessingProgress.php
├── Http/
│   ├── Controllers/
│   │   ├── BroadcastController.php
│   │   └── RealTimeController.php
│   └── Middleware/
│       └── BroadcastAuth.php
├── Broadcasting/
│   └── CustomPresenceChannel.php
├── Listeners/
│   ├── SendRealTimeNotification.php
│   └── LogUserActivity.php
└── Models/
    ├── OnlineUser.php
    └── RealTimeActivity.php

resources/
├── views/
│   └── websocket-test.blade.php
└── js/
    ├── websocket.js
    └── real-time-client.js

routes/
├── channels.php
└── web.php

config/
├── broadcasting.php
└── websockets.php
```

---

## 🔧 **PASO 1: Configuración de Broadcasting**

### **1.1 Instalación de Dependencias**

```bash
# Instalar paquetes necesarios
composer require pusher/pusher-php-server
composer require beyondcode/laravel-websockets

# Publicar configuraciones
php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="migrations"
php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="config"

# Ejecutar migraciones
php artisan migrate

# Instalar dependencias de frontend (opcional)
npm install --save laravel-echo pusher-js
```

### **1.2 Configuración de Broadcasting**

```php
<?php
// config/broadcasting.php - Actualizar configuración

return [
    'default' => env('BROADCAST_DRIVER', 'null'),

    'connections' => [
        'pusher' => [
            'driver' => 'pusher',
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'app_id' => env('PUSHER_APP_ID'),
            'options' => [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'host' => env('PUSHER_HOST') ?: 'api-'.env('PUSHER_APP_CLUSTER', 'mt1').'.pusherapp.com',
                'port' => env('PUSHER_PORT', 443),
                'scheme' => env('PUSHER_SCHEME', 'https'),
                'encrypted' => true,
                'useTLS' => env('PUSHER_SCHEME', 'https') === 'https',
            ],
            'client_options' => [
                // Configuraciones adicionales del cliente
            ],
        ],

        'ably' => [
            'driver' => 'ably',
            'key' => env('ABLY_KEY'),
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],
    ],
];
```

### **1.3 Configuración de WebSockets**

```php
<?php
// config/websockets.php - Configuración personalizada

return [
    'dashboard' => [
        'port' => env('LARAVEL_WEBSOCKETS_PORT', 6001),
    ],

    'apps' => [
        [
            'id' => env('PUSHER_APP_ID'),
            'name' => env('APP_NAME'),
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'path' => env('PUSHER_APP_PATH'),
            'capacity' => null,
            'enable_client_messages' => false,
            'enable_statistics' => true,
            'allowed_origins' => [
                'http://localhost:3000',
                'http://127.0.0.1:8000',
                env('APP_URL'),
            ],
        ],
    ],

    'app_provider' => BeyondCode\LaravelWebSockets\Apps\ConfigAppProvider::class,

    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:8000',
        env('APP_URL'),
    ],

    'max_request_size_in_kb' => 250,

    'path' => 'laravel-websockets',

    'middleware' => [
        'web',
    ],

    'statistics' => [
        'model' => \BeyondCode\LaravelWebSockets\Statistics\Models\WebSocketsStatisticsEntry::class,
        'logger' => BeyondCode\LaravelWebSockets\Statistics\Logger\HttpStatisticsLogger::class,
        'interval_in_seconds' => 60,
        'delete_statistics_older_than_days' => 60,
        'perform_dns_lookup' => false,
    ],

    'ssl' => [
        'local_cert' => env('LARAVEL_WEBSOCKETS_SSL_LOCAL_CERT', null),
        'local_pk' => env('LARAVEL_WEBSOCKETS_SSL_LOCAL_PK', null),
        'passphrase' => env('LARAVEL_WEBSOCKETS_SSL_PASSPHRASE', null),
    ],

    'channel_manager' => \BeyondCode\LaravelWebSockets\WebSockets\Channels\ChannelManagers\ArrayChannelManager::class,
];
```

### **1.4 Variables de Entorno**

```env
# Agregar al archivo .env
BROADCAST_DRIVER=pusher

# WebSocket Configuration
PUSHER_APP_ID=local
PUSHER_APP_KEY=local
PUSHER_APP_SECRET=local
PUSHER_APP_CLUSTER=mt1
PUSHER_HOST=127.0.0.1
PUSHER_PORT=6001
PUSHER_SCHEME=http

# Laravel WebSockets
LARAVEL_WEBSOCKETS_PORT=6001
MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
MIX_PUSHER_HOST=127.0.0.1
MIX_PUSHER_PORT=6001
```

---

## 📡 **PASO 2: Eventos Broadcasting**

### **2.1 FileUploaded Event**

```php
<?php
// app/Events/FileUploaded.php

namespace App\Events;

use App\Models\File;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FileUploaded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public File $file,
        public User $user
    ) {}

    /**
     * Canales donde se transmitirá el evento
     */
    public function broadcastOn(): array
    {
        return [
            // Canal privado del usuario
            new PrivateChannel('user.' . $this->user->id),
            // Canal público de uploads (si el archivo es público)
            new Channel('files.uploads'),
            // Canal de administradores
            new PrivateChannel('admin.activity')
        ];
    }

    /**
     * Nombre del evento en el cliente
     */
    public function broadcastAs(): string
    {
        return 'file.uploaded';
    }

    /**
     * Datos que se enviarán al cliente
     */
    public function broadcastWith(): array
    {
        return [
            'file' => [
                'id' => $this->file->id,
                'name' => $this->file->original_name,
                'size' => $this->file->size,
                'size_human' => $this->file->size_human,
                'mime_type' => $this->file->mime_type,
                'url' => $this->file->url,
                'is_image' => $this->file->is_image,
                'uploaded_at' => $this->file->created_at->toISOString()
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar' => $this->user->avatar ?? null
            ],
            'timestamp' => now()->toISOString(),
            'type' => 'file_upload'
        ];
    }

    /**
     * Condición para transmitir (opcional)
     */
    public function broadcastWhen(): bool
    {
        // Solo transmitir si el archivo se subió exitosamente
        return $this->file->exists && $this->file->size > 0;
    }
}
```

### **2.2 FileProcessingProgress Event**

```php
<?php
// app/Events/FileProcessingProgress.php

namespace App\Events;

use App\Models\File;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FileProcessingProgress implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public File $file,
        public int $progress,
        public string $currentStep,
        public array $processingData = []
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->file->user_id),
            new PrivateChannel('file.processing.' . $this->file->id)
        ];
    }

    public function broadcastAs(): string
    {
        return 'file.processing.progress';
    }

    public function broadcastWith(): array
    {
        return [
            'file_id' => $this->file->id,
            'progress' => $this->progress,
            'current_step' => $this->currentStep,
            'estimated_completion' => $this->calculateEstimatedCompletion(),
            'processing_data' => $this->processingData,
            'timestamp' => now()->toISOString()
        ];
    }

    private function calculateEstimatedCompletion(): string
    {
        // Lógica para calcular tiempo estimado basado en progreso
        $remainingProgress = 100 - $this->progress;
        $estimatedMinutes = ($remainingProgress / 10); // Aproximación

        return now()->addMinutes($estimatedMinutes)->toISOString();
    }

    public function broadcastWhen(): bool
    {
        return $this->progress >= 0 && $this->progress <= 100;
    }
}
```

### **2.3 UserOnline Event**

```php
<?php
// app/Events/UserOnline.php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserOnline implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public User $user,
        public string $status = 'online',
        public array $metadata = []
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('online-users'),
            new PresenceChannel('user-activity')
        ];
    }

    public function broadcastAs(): string
    {
        return 'user.status.changed';
    }

    public function broadcastWith(): array
    {
        return [
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'avatar' => $this->user->avatar ?? null
            ],
            'status' => $this->status,
            'last_seen' => now()->toISOString(),
            'metadata' => array_merge([
                'browser' => request()->header('User-Agent'),
                'ip' => request()->ip(),
                'location' => 'Unknown' // Implementar geolocalización si se necesita
            ], $this->metadata),
            'timestamp' => now()->toISOString()
        ];
    }
}
```

### **2.4 NotificationSent Event**

```php
<?php
// app/Events/NotificationSent.php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public User $user,
        public string $title,
        public string $message,
        public string $type = 'info',
        public array $actionData = []
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->user->id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'notification.sent';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => uniqid('notif_'),
            'title' => $this->title,
            'message' => $this->message,
            'type' => $this->type, // success, info, warning, error
            'action_data' => $this->actionData,
            'created_at' => now()->toISOString(),
            'read' => false,
            'user_id' => $this->user->id
        ];
    }
}
```

---

## 🎛️ **PASO 3: Canales de Broadcasting**

### **3.1 Configurar Canales**

```php
<?php
// routes/channels.php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
*/

// Canal privado del usuario
Broadcast::private('user.{id}', function (User $user, int $id) {
    return (int) $user->id === (int) $id;
});

// Canal de administradores
Broadcast::private('admin.activity', function (User $user) {
    return $user->hasRole('admin'); // Asumiendo que tienes roles implementados
});

// Canal de presencia para usuarios online
Broadcast::presence('online-users', function (User $user) {
    return [
        'id' => $user->id,
        'name' => $user->name,
        'avatar' => $user->avatar ?? null,
        'status' => 'online',
        'joined_at' => now()->toISOString()
    ];
});

// Canal para actividad de usuarios
Broadcast::presence('user-activity', function (User $user) {
    return [
        'id' => $user->id,
        'name' => $user->name,
        'last_activity' => now()->toISOString()
    ];
});

// Canal privado para procesamiento de archivos específicos
Broadcast::private('file.processing.{fileId}', function (User $user, int $fileId) {
    // Verificar que el usuario es propietario del archivo
    return $user->files()->where('id', $fileId)->exists();
});

// Canal público para uploads (solo archivos públicos)
Broadcast::channel('files.uploads', function () {
    return true; // Canal público, cualquiera puede escuchar
});

// Canal para notificaciones del sistema
Broadcast::private('system.notifications.{userId}', function (User $user, int $userId) {
    return (int) $user->id === (int) $userId;
});
```

---

## 🎮 **PASO 4: Controladores**

### **4.1 RealTimeController**

```php
<?php
// app/Http/Controllers/RealTimeController.php

namespace App\Http\Controllers;

use App\Events\FileProcessingProgress;
use App\Events\NotificationSent;
use App\Events\UserOnline;
use App\Models\File;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RealTimeController extends Controller
{
    /**
     * Enviar notificación en tiempo real
     */
    public function sendNotification(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
            'type' => 'nullable|in:success,info,warning,error',
            'action_data' => 'nullable|array'
        ]);

        try {
            $user = auth()->user();

            event(new NotificationSent(
                $user,
                $request->input('title'),
                $request->input('message'),
                $request->input('type', 'info'),
                $request->input('action_data', [])
            ));

            return response()->json([
                'success' => true,
                'message' => 'Notificación enviada exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error enviando notificación en tiempo real', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error enviando notificación'
            ], 500);
        }
    }

    /**
     * Simular progreso de procesamiento
     */
    public function simulateFileProcessing(File $file): JsonResponse
    {
        if ($file->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado'
            ], 403);
        }

        try {
            // Simular progreso gradual
            $steps = [
                'Iniciando procesamiento...',
                'Analizando archivo...',
                'Redimensionando imagen...',
                'Optimizando calidad...',
                'Generando thumbnails...',
                'Finalizando...'
            ];

            foreach ($steps as $index => $step) {
                $progress = (($index + 1) / count($steps)) * 100;

                event(new FileProcessingProgress(
                    $file,
                    (int) $progress,
                    $step,
                    [
                        'step_number' => $index + 1,
                        'total_steps' => count($steps),
                        'file_size' => $file->size,
                        'estimated_time_remaining' => max(0, (count($steps) - $index - 1) * 2)
                    ]
                ));

                // Simular tiempo de procesamiento
                if (app()->environment('local')) {
                    sleep(1); // Solo en desarrollo
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Simulación de procesamiento iniciada'
            ]);

        } catch (\Exception $e) {
            Log::error('Error simulando procesamiento', [
                'file_id' => $file->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error en simulación'
            ], 500);
        }
    }

    /**
     * Actualizar estado online del usuario
     */
    public function updateOnlineStatus(Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:online,away,busy,offline',
            'metadata' => 'nullable|array'
        ]);

        try {
            $user = auth()->user();

            event(new UserOnline(
                $user,
                $request->input('status'),
                $request->input('metadata', [])
            ));

            return response()->json([
                'success' => true,
                'message' => 'Estado actualizado exitosamente',
                'data' => [
                    'user_id' => $user->id,
                    'status' => $request->input('status'),
                    'updated_at' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error actualizando estado online', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error actualizando estado'
            ], 500);
        }
    }

    /**
     * Obtener estadísticas en tiempo real
     */
    public function getRealTimeStats(): JsonResponse
    {
        try {
            $stats = [
                'online_users' => \DB::table('sessions')
                    ->where('last_activity', '>', now()->subMinutes(5)->timestamp)
                    ->count(),
                'active_files_processing' => File::where('processed', false)
                    ->where('created_at', '>', now()->subHours(1))
                    ->count(),
                'recent_uploads' => File::where('created_at', '>', now()->subHour())
                    ->count(),
                'system_status' => [
                    'queue_size' => \DB::table('jobs')->count(),
                    'failed_jobs' => \DB::table('failed_jobs')->count(),
                    'server_time' => now()->toISOString()
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'generated_at' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            Log::error('Error obteniendo estadísticas en tiempo real', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo estadísticas'
            ], 500);
        }
    }

    /**
     * Test de conectividad WebSocket
     */
    public function testWebSocketConnection(): JsonResponse
    {
        try {
            $user = auth()->user();
            $testMessage = 'Test de conectividad WebSocket - ' . now()->format('H:i:s');

            event(new NotificationSent(
                $user,
                'Test de Conexión',
                $testMessage,
                'info',
                ['test' => true, 'timestamp' => now()->toISOString()]
            ));

            return response()->json([
                'success' => true,
                'message' => 'Mensaje de test enviado',
                'data' => [
                    'test_message' => $testMessage,
                    'channel' => "user.{$user->id}",
                    'event' => 'notification.sent'
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en test de conexión: ' . $e->getMessage()
            ], 500);
        }
    }
}
```

---

## 🛣️ **PASO 5: Rutas API**

### **5.1 Rutas Real-time**

```php
<?php
// routes/api.php - Agregar estas rutas

use App\Http\Controllers\RealTimeController;

Route::middleware(['auth:sanctum'])->group(function () {
    // Real-time notifications
    Route::post('realtime/send-notification', [RealTimeController::class, 'sendNotification'])
         ->name('realtime.send-notification');

    // File processing simulation
    Route::post('realtime/simulate-processing/{file}', [RealTimeController::class, 'simulateFileProcessing'])
         ->name('realtime.simulate-processing');

    // User online status
    Route::post('realtime/update-status', [RealTimeController::class, 'updateOnlineStatus'])
         ->name('realtime.update-status');

    // Real-time stats
    Route::get('realtime/stats', [RealTimeController::class, 'getRealTimeStats'])
         ->name('realtime.stats');

    // WebSocket test
    Route::post('realtime/test-connection', [RealTimeController::class, 'testWebSocketConnection'])
         ->name('realtime.test-connection');
});
```

---

## 🌐 **PASO 6: Frontend Testing**

### **6.1 Vista de Test WebSocket**

```blade
{{-- resources/views/websocket-test.blade.php --}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>WebSocket Test - Laravel API</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .status {
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .connected { background: #d4edda; color: #155724; }
        .disconnected { background: #f8d7da; color: #721c24; }
        .loading { background: #fff3cd; color: #856404; }
        .event-log {
            height: 300px;
            overflow-y: auto;
            border: 1px solid #ddd;
            padding: 15px;
            background: #f8f9fa;
            font-family: monospace;
            font-size: 12px;
        }
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover { background: #0056b3; }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .notification {
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
            border-left: 4px solid;
        }
        .notification.success { background: #d4edda; border-color: #28a745; }
        .notification.error { background: #f8d7da; border-color: #dc3545; }
        .notification.info { background: #d1ecf1; border-color: #17a2b8; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 WebSocket Real-time Test</h1>

        <div id="connection-status" class="status disconnected">
            ❌ Desconectado - Esperando conexión...
        </div>

        <div class="grid">
            <div>
                <h3>🎛️ Controles de Test</h3>
                <button onclick="testConnection()">Test Conexión</button>
                <button onclick="sendNotification()">Enviar Notificación</button>
                <button onclick="updateStatus()">Cambiar Estado</button>
                <button onclick="simulateProcessing()">Simular Procesamiento</button>
                <button onclick="clearLog()">Limpiar Log</button>

                <h3>📊 Estadísticas</h3>
                <div id="stats-container">
                    <button onclick="loadStats()">Cargar Estadísticas</button>
                    <div id="stats-display"></div>
                </div>
            </div>

            <div>
                <h3>📨 Notificaciones</h3>
                <div id="notifications-container"></div>
            </div>
        </div>

        <h3>📋 Event Log</h3>
        <div id="event-log" class="event-log"></div>
    </div>

    <!-- Laravel Echo y Pusher -->
    <script src="https://js.pusher.com/7.2/pusher.min.js"></script>
    <script>
        // Configuración
        const API_BASE = '{{ url('/api') }}';
        const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const USER_ID = {{ auth()->id() ?? 'null' }};

        // Initialize Pusher
        const pusher = new Pusher('{{ env('PUSHER_APP_KEY') }}', {
            cluster: '{{ env('PUSHER_APP_CLUSTER') }}',
            wsHost: '{{ env('PUSHER_HOST', '127.0.0.1') }}',
            wsPort: {{ env('PUSHER_PORT', 6001) }},
            wssPort: {{ env('PUSHER_PORT', 6001) }},
            forceTLS: false,
            encrypted: false,
            disableStats: true,
            enabledTransports: ['ws', 'wss'],
            authEndpoint: '/broadcasting/auth',
            auth: {
                headers: {
                    'X-CSRF-TOKEN': CSRF_TOKEN,
                    'Authorization': 'Bearer {{ auth()->user()?->createToken("websocket-test")?->plainTextToken ?? "" }}'
                }
            }
        });

        // Connection status
        pusher.connection.bind('connected', () => {
            updateConnectionStatus('connected', '✅ Conectado exitosamente');
        });

        pusher.connection.bind('disconnected', () => {
            updateConnectionStatus('disconnected', '❌ Conexión perdida');
        });

        pusher.connection.bind('error', (error) => {
            updateConnectionStatus('disconnected', '❌ Error de conexión: ' + error.message);
            logEvent('ERROR', 'Connection error: ' + JSON.stringify(error));
        });

        // Subscribe to channels if user is authenticated
        if (USER_ID) {
            // Private user channel
            const userChannel = pusher.subscribe(`private-user.${USER_ID}`);

            userChannel.bind('notification.sent', (data) => {
                logEvent('NOTIFICATION', JSON.stringify(data, null, 2));
                showNotification(data.title, data.message, data.type);
            });

            userChannel.bind('file.processing.progress', (data) => {
                logEvent('PROCESSING', `File ${data.file_id}: ${data.progress}% - ${data.current_step}`);
                showProcessingProgress(data);
            });

            // Public files channel
            const filesChannel = pusher.subscribe('files.uploads');
            filesChannel.bind('file.uploaded', (data) => {
                logEvent('FILE_UPLOAD', `File uploaded: ${data.file.name} by ${data.user.name}`);
            });

            // Presence channel for online users
            const presenceChannel = pusher.subscribe('presence-online-users');

            presenceChannel.bind('pusher:subscription_succeeded', (members) => {
                logEvent('PRESENCE', `Conectado a canal de presencia. Usuarios online: ${members.count}`);
            });

            presenceChannel.bind('pusher:member_added', (member) => {
                logEvent('PRESENCE', `Usuario conectado: ${member.info.name}`);
            });

            presenceChannel.bind('pusher:member_removed', (member) => {
                logEvent('PRESENCE', `Usuario desconectado: ${member.info.name}`);
            });
        }

        // Utility functions
        function updateConnectionStatus(status, message) {
            const statusEl = document.getElementById('connection-status');
            statusEl.className = `status ${status}`;
            statusEl.textContent = message;
        }

        function logEvent(type, message) {
            const logEl = document.getElementById('event-log');
            const timestamp = new Date().toLocaleTimeString();
            logEl.innerHTML += `[${timestamp}] <strong>${type}:</strong> ${message}\n`;
            logEl.scrollTop = logEl.scrollHeight;
        }

        function showNotification(title, message, type = 'info') {
            const container = document.getElementById('notifications-container');
            const notifEl = document.createElement('div');
            notifEl.className = `notification ${type}`;
            notifEl.innerHTML = `<strong>${title}</strong><br>${message}`;
            container.appendChild(notifEl);

            // Auto remove after 5 seconds
            setTimeout(() => {
                if (notifEl.parentNode) {
                    notifEl.parentNode.removeChild(notifEl);
                }
            }, 5000);
        }

        function showProcessingProgress(data) {
            // Show processing progress in notifications
            showNotification(
                `Procesando Archivo ${data.file_id}`,
                `${data.current_step} (${data.progress}%)`,
                'info'
            );
        }

        // API functions
        async function apiCall(endpoint, method = 'GET', data = null) {
            const config = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': CSRF_TOKEN,
                    'Authorization': 'Bearer {{ auth()->user()?->createToken("websocket-test")?->plainTextToken ?? "" }}'
                }
            };

            if (data) {
                config.body = JSON.stringify(data);
            }

            try {
                const response = await fetch(`${API_BASE}${endpoint}`, config);
                return await response.json();
            } catch (error) {
                logEvent('API_ERROR', error.message);
                return { success: false, message: error.message };
            }
        }

        // Test functions
        async function testConnection() {
            logEvent('TEST', 'Iniciando test de conexión...');
            const result = await apiCall('/realtime/test-connection', 'POST');
            logEvent('TEST', JSON.stringify(result, null, 2));
        }

        async function sendNotification() {
            const result = await apiCall('/realtime/send-notification', 'POST', {
                title: 'Test Notification',
                message: 'Esta es una notificación de prueba enviada desde el cliente',
                type: 'success'
            });
            logEvent('API', JSON.stringify(result, null, 2));
        }

        async function updateStatus() {
            const statuses = ['online', 'away', 'busy'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

            const result = await apiCall('/realtime/update-status', 'POST', {
                status: randomStatus,
                metadata: { test: true, random: Math.random() }
            });
            logEvent('STATUS', JSON.stringify(result, null, 2));
        }

        async function simulateProcessing() {
            // This would need a real file ID - for demo purposes only
            logEvent('SIMULATE', 'Función de simulación - necesita un ID de archivo real');
        }

        async function loadStats() {
            const result = await apiCall('/realtime/stats');
            if (result.success) {
                document.getElementById('stats-display').innerHTML = `
                    <pre>${JSON.stringify(result.data, null, 2)}</pre>
                `;
            }
            logEvent('STATS', JSON.stringify(result, null, 2));
        }

        function clearLog() {
            document.getElementById('event-log').innerHTML = '';
        }

        // Initialize
        logEvent('INIT', 'WebSocket test initialized');
        if (USER_ID) {
            logEvent('AUTH', `Authenticated as user ID: ${USER_ID}`);
        } else {
            logEvent('AUTH', 'No authenticated user - some features may not work');
        }
    </script>
</body>
</html>
```

### **6.2 Ruta para la Vista de Test**

```php
<?php
// routes/web.php - Agregar esta ruta

Route::middleware('auth')->get('/websocket-test', function () {
    return view('websocket-test');
})->name('websocket.test');
```

---

## ✅ **PASO 7: Testing**

### **7.1 Feature Test para Real-time**

```php
<?php
// tests/Feature/RealTimeTest.php

namespace Tests\Feature;

use App\Events\FileUploaded;
use App\Events\NotificationSent;
use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class RealTimeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Event::fake();
    }

    public function test_file_uploaded_event_dispatched(): void
    {
        $user = User::factory()->create();
        $file = File::factory()->create(['user_id' => $user->id]);

        event(new FileUploaded($file, $user));

        Event::assertDispatched(FileUploaded::class, function ($event) use ($file, $user) {
            return $event->file->id === $file->id && $event->user->id === $user->id;
        });
    }

    public function test_send_realtime_notification(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/realtime/send-notification', [
                'title' => 'Test Notification',
                'message' => 'This is a test message',
                'type' => 'success'
            ]);

        $response->assertStatus(200)
                ->assertJson(['success' => true]);

        Event::assertDispatched(NotificationSent::class);
    }

    public function test_update_online_status(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/realtime/update-status', [
                'status' => 'online',
                'metadata' => ['test' => true]
            ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => ['user_id', 'status', 'updated_at']
                ]);
    }

    public function test_get_realtime_stats(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/realtime/stats');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'online_users',
                        'active_files_processing',
                        'recent_uploads',
                        'system_status'
                    ]
                ]);
    }

    public function test_websocket_connection_test(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/realtime/test-connection');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => ['test_message', 'channel', 'event']
                ]);

        Event::assertDispatched(NotificationSent::class);
    }
}
```

---

## 📋 **CRITERIOS DE EVALUACIÓN**

### **CORE (15 puntos)**

- [ ] Configuración básica de Broadcasting (3 pts)
- [ ] WebSocket server funcionando (4 pts)
- [ ] Eventos básicos transmitiendo (4 pts)
- [ ] Canales privados con autenticación (2 pts)
- [ ] Frontend de testing funcional (2 pts)

### **ENHANCED (10 puntos)**

- [ ] Presence channels implementados (3 pts)
- [ ] Broadcasting con payload complejo (3 pts)
- [ ] Real-time progress tracking (2 pts)
- [ ] Error handling robusto (2 pts)

### **POLISH (5 puntos)**

- [ ] Performance optimization (2 pts)
- [ ] Real-time analytics (2 pts)
- [ ] Custom WebSocket events (1 pt)

---

## 🚀 **COMANDOS DE TESTING**

```bash
# Iniciar WebSocket server
php artisan websockets:serve

# Verificar configuración de broadcasting
php artisan config:show broadcasting

# Ejecutar tests
php artisan test --filter RealTimeTest

# Ver estadísticas de WebSocket (si está habilitado)
# Visitar: http://localhost:8000/laravel-websockets

# Test manual
# Visitar: http://localhost:8000/websocket-test
```

---

## 🎯 **ENTREGABLES**

Al completar este ejercicio debes tener:

1. ✅ **WebSocket server funcionando** con Laravel WebSockets
2. ✅ **Eventos broadcasting** en tiempo real
3. ✅ **Canales privados y presencia** configurados
4. ✅ **Frontend de testing** para verificar funcionalidad
5. ✅ **API endpoints** para real-time features
6. ✅ **Tests feature** completos

---

**¡Domina las funcionalidades en tiempo real con Laravel Broadcasting! 🌐⚡**

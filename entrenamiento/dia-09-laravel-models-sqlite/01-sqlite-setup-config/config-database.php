<?php
/**
 * Configuración avanzada para SQLite
 * WorldSkills 2025 - Laravel Database Setup
 */

// Configuración para config/database.php
return [
    'sqlite' => [
        'driver' => 'sqlite',
        'url' => env('DATABASE_URL'),
        'database' => env('DB_DATABASE', database_path('database.sqlite')),
        'prefix' => '',
        'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
        
        // Optimizaciones de performance
        'journal_mode' => 'WAL', // Write-Ahead Logging
        'synchronous' => 'NORMAL', // Balance performance/durabilidad
        'cache_size' => -64000, // 64MB cache
        'temp_store' => 'MEMORY', // Usar memoria para temporales
        
        // Configuración de timeout
        'timeout' => 60000, // 60 segundos
        
        // Habilitar análisis de queries
        'options' => [
            PDO::ATTR_STRINGIFY_FETCHES => false,
            PDO::ATTR_EMULATE_PREPARES => false,
        ],
    ],
];

/**
 * Funciones helper para configuración de SQLite
 */
class SQLiteHelper
{
    /**
     * Verificar que SQLite está disponible
     */
    public static function isAvailable(): bool
    {
        return extension_loaded('sqlite3') && extension_loaded('pdo_sqlite');
    }
    
    /**
     * Verificar permisos del archivo de database
     */
    public static function checkPermissions(string $dbPath): array
    {
        $result = [
            'exists' => file_exists($dbPath),
            'readable' => is_readable($dbPath),
            'writable' => is_writable($dbPath),
            'size' => file_exists($dbPath) ? filesize($dbPath) : 0,
        ];
        
        // Verificar directorio padre
        $dir = dirname($dbPath);
        $result['dir_writable'] = is_writable($dir);
        
        return $result;
    }
    
    /**
     * Crear base de datos si no existe
     */
    public static function createIfNotExists(string $dbPath): bool
    {
        if (!file_exists($dbPath)) {
            $dir = dirname($dbPath);
            
            // Crear directorio si no existe
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            
            // Crear archivo
            touch($dbPath);
            chmod($dbPath, 0664);
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Obtener información de la base de datos
     */
    public static function getDatabaseInfo(string $dbPath): array
    {
        if (!file_exists($dbPath)) {
            return ['error' => 'Database file not found'];
        }
        
        try {
            $pdo = new PDO("sqlite:$dbPath");
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Información básica
            $info = [
                'file_size' => filesize($dbPath),
                'file_modified' => date('Y-m-d H:i:s', filemtime($dbPath)),
                'sqlite_version' => $pdo->query('SELECT sqlite_version()')->fetchColumn(),
            ];
            
            // Obtener tablas
            $tables = $pdo->query(
                "SELECT name FROM sqlite_master WHERE type='table'"
            )->fetchAll(PDO::FETCH_COLUMN);
            
            $info['tables'] = $tables;
            $info['table_count'] = count($tables);
            
            // Información de cada tabla
            foreach ($tables as $table) {
                $count = $pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();
                $info['table_info'][$table] = ['records' => $count];
            }
            
            return $info;
            
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
    
    /**
     * Optimizar base de datos SQLite
     */
    public static function optimize(string $dbPath): bool
    {
        try {
            $pdo = new PDO("sqlite:$dbPath");
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Ejecutar comandos de optimización
            $pdo->exec('PRAGMA optimize');
            $pdo->exec('VACUUM');
            $pdo->exec('PRAGMA integrity_check');
            
            return true;
            
        } catch (Exception $e) {
            error_log("SQLite optimization failed: " . $e->getMessage());
            return false;
        }
    }
}

/**
 * Comando de ejemplo para verificar configuración
 */
if (php_sapi_name() === 'cli') {
    echo "🔧 Verificando configuración SQLite...\n";
    
    // Verificar extensiones
    if (SQLiteHelper::isAvailable()) {
        echo "✅ Extensiones SQLite disponibles\n";
    } else {
        echo "❌ Extensiones SQLite NO disponibles\n";
        exit(1);
    }
    
    // Verificar archivo de database
    $dbPath = 'database/database.sqlite';
    if (file_exists($dbPath)) {
        $info = SQLiteHelper::getDatabaseInfo($dbPath);
        echo "✅ Database encontrada: " . $info['file_size'] . " bytes\n";
        echo "📊 Tablas: " . $info['table_count'] . "\n";
    } else {
        echo "⚠️  Database no existe, se creará automáticamente\n";
    }
    
    echo "🎯 Configuración SQLite lista para usar\n";
}

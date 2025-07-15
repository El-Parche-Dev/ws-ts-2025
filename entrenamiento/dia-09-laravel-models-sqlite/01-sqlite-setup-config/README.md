# 🗄️ SQLite Setup + Configuration

**⏱️ Tiempo:** 30 minutos (12:00-12:30)  
**🎯 Objetivo:** Configurar SQLite como base de datos principal para Laravel

## 🎯 Metodología MVP

### 🔧 FASE CORE (12:00-12:10) - 10 minutos

**Objetivo:** SQLite funcionando básico

**Entregables:**

- SQLite instalado y verificado
- Laravel conectado a SQLite
- Database creada exitosamente

### ⚡ FASE ENHANCED (12:10-12:20) - 10 minutos

**Objetivo:** Configuración optimizada

**Entregables:**

- Variables de entorno configuradas
- Rutas de database optimizadas
- Permisos verificados

### ✨ FASE POLISH (12:20-12:30) - 10 minutos

**Objetivo:** Setup profesional

**Entregables:**

- Estrategia de backup implementada
- Tools de debug configurados
- Documentación completa

## 📋 CORE: Instalación y Configuración Básica

### 1. Verificar SQLite en el Sistema

```bash
# Verificar que SQLite esté instalado
sqlite3 --version

# Si no está instalado en Ubuntu/Debian:
sudo apt update
sudo apt install sqlite3

# Si no está instalado en macOS:
brew install sqlite
```

### 2. Configurar Laravel para SQLite

Editar el archivo `.env`:

```env
# Cambiar la configuración de database
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/your/project/database/database.sqlite

# Comentar estas líneas de MySQL/PostgreSQL
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
```

### 3. Crear el Archivo de Base de Datos

```bash
# Desde la raíz del proyecto Laravel
touch database/database.sqlite

# Verificar que el archivo fue creado
ls -la database/
```

### 4. Ejecutar Migraciones por Defecto

```bash
# Ejecutar las migraciones básicas de Laravel
php artisan migrate

# Deberías ver algo como:
# Migration table created successfully.
# Migrating: 2014_10_12_000000_create_users_table
# Migrated:  2014_10_12_000000_create_users_table
```

### 5. Verificar Conexión

```bash
# Verificar que Laravel puede conectar a SQLite
php artisan tinker
```

En Tinker:

```php
// Verificar conexión
DB::connection()->getPdo();

// Listar tablas creadas
DB::select("SELECT name FROM sqlite_master WHERE type='table'");

// Salir de tinker
exit
```

## ⚡ ENHANCED: Optimización de Configuración

### 1. Configuración Avanzada del Database

Crear archivo de configuración personalizada:

```php
<?php
// config/database.php - Sección SQLite optimizada

'sqlite' => [
    'driver' => 'sqlite',
    'url' => env('DATABASE_URL'),
    'database' => env('DB_DATABASE', database_path('database.sqlite')),
    'prefix' => '',
    'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
    'journal_mode' => 'WAL', // Write-Ahead Logging para mejor performance
    'synchronous' => 'NORMAL', // Balance entre performance y durabilidad
    'cache_size' => -64000, // 64MB cache
    'temp_store' => 'MEMORY', // Usar memoria para tablas temporales
],
```

### 2. Variables de Entorno Optimizadas

Crear `.env.sqlite` como ejemplo:

```env
# Configuración SQLite optimizada para desarrollo
APP_NAME="WorldSkills Laravel"
APP_ENV=local
APP_KEY=base64:your-app-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
DB_FOREIGN_KEYS=true

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

### 3. Verificar Permisos

```bash
# Verificar permisos del directorio database
ls -la database/

# Ajustar permisos si es necesario
chmod 664 database/database.sqlite
chmod 775 database/

# Verificar que el servidor web puede escribir
sudo chown -R www-data:www-data database/ # Para Apache
# O
sudo chown -R nginx:nginx database/ # Para Nginx
```

## ✨ POLISH: Herramientas Avanzadas

### 1. Script de Backup Automático

Crear `scripts/backup-database.sh`:

```bash
#!/bin/bash
# Script de backup para SQLite

# Configuración
DB_PATH="database/database.sqlite"
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/database_backup_${TIMESTAMP}.sqlite"

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

# Realizar backup
if [ -f "$DB_PATH" ]; then
    cp "$DB_PATH" "$BACKUP_FILE"
    echo "✅ Backup creado: $BACKUP_FILE"

    # Comprimir backup
    gzip "$BACKUP_FILE"
    echo "✅ Backup comprimido: ${BACKUP_FILE}.gz"

    # Limpiar backups antiguos (mantener solo 10)
    ls -t ${BACKUP_DIR}/database_backup_*.gz | tail -n +11 | xargs -r rm
    echo "✅ Backups antiguos limpiados"
else
    echo "❌ Error: No se encontró la base de datos en $DB_PATH"
    exit 1
fi
```

Hacer ejecutable:

```bash
chmod +x scripts/backup-database.sh
```

### 2. Herramientas de Debug

Crear `app/Console/Commands/DatabaseInfo.php`:

```bash
# Crear comando artisan personalizado
php artisan make:command DatabaseInfo
```

```php
<?php
// app/Console/Commands/DatabaseInfo.php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DatabaseInfo extends Command
{
    protected $signature = 'db:info';
    protected $description = 'Mostrar información detallada de la base de datos SQLite';

    public function handle()
    {
        $this->info('📊 Información de Base de Datos SQLite');
        $this->line('');

        // Información de conexión
        $config = config('database.connections.sqlite');
        $this->table(['Configuración', 'Valor'], [
            ['Driver', $config['driver']],
            ['Database', $config['database']],
            ['Foreign Keys', $config['foreign_key_constraints'] ? 'Enabled' : 'Disabled'],
        ]);

        // Estadísticas del archivo
        $dbPath = database_path('database.sqlite');
        if (file_exists($dbPath)) {
            $size = filesize($dbPath);
            $this->table(['Archivo', 'Información'], [
                ['Ruta', $dbPath],
                ['Tamaño', number_format($size) . ' bytes'],
                ['Última modificación', date('Y-m-d H:i:s', filemtime($dbPath))],
            ]);
        }

        // Listar tablas
        $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table'");
        if (!empty($tables)) {
            $this->info('📋 Tablas en la base de datos:');
            foreach ($tables as $table) {
                $count = DB::table($table->name)->count();
                $this->line("• {$table->name} ({$count} registros)");
            }
        }

        return 0;
    }
}
```

### 3. Alias Útiles para Desarrollo

Crear `scripts/dev-aliases.sh`:

```bash
#!/bin/bash
# Aliases útiles para desarrollo con SQLite

# Alias para comandos frecuentes
alias db-migrate="php artisan migrate"
alias db-fresh="php artisan migrate:fresh --seed"
alias db-seed="php artisan db:seed"
alias db-info="php artisan db:info"
alias db-backup="./scripts/backup-database.sh"

# Función para acceder a SQLite CLI
sqlite-cli() {
    sqlite3 database/database.sqlite
}

# Función para ver esquema de tabla
show-table() {
    if [ -z "$1" ]; then
        echo "Uso: show-table <nombre_tabla>"
        return 1
    fi
    sqlite3 database/database.sqlite ".schema $1"
}

# Función para contar registros
count-records() {
    if [ -z "$1" ]; then
        echo "Uso: count-records <nombre_tabla>"
        return 1
    fi
    sqlite3 database/database.sqlite "SELECT COUNT(*) FROM $1;"
}

echo "✅ Aliases de desarrollo cargados:"
echo "• db-migrate: Ejecutar migraciones"
echo "• db-fresh: Reset completo con seeders"
echo "• db-info: Información de la DB"
echo "• sqlite-cli: Acceder a SQLite CLI"
echo "• show-table <tabla>: Ver esquema de tabla"
echo "• count-records <tabla>: Contar registros"
```

Cargar aliases:

```bash
source scripts/dev-aliases.sh
```

## 🧪 Verificación Final

### Checklist de Validación

```bash
# 1. Verificar conexión
php artisan tinker --execute="echo 'DB Connected: ' . (DB::connection()->getPdo() ? 'YES' : 'NO');"

# 2. Verificar migraciones
php artisan migrate:status

# 3. Verificar información de DB
php artisan db:info

# 4. Test de escritura
php artisan tinker --execute="DB::table('users')->insert(['name' => 'Test', 'email' => 'test@test.com', 'password' => 'test']); echo 'Write test: OK';"

# 5. Test de lectura
php artisan tinker --execute="echo 'Users count: ' . DB::table('users')->count();"
```

## ✅ Entregables de esta Sección

- [ ] SQLite instalado y funcionando
- [ ] Laravel conectado exitosamente a SQLite
- [ ] Archivo `.env` configurado correctamente
- [ ] Migraciones por defecto ejecutadas
- [ ] Comando `db:info` creado y funcional
- [ ] Script de backup implementado
- [ ] Aliases de desarrollo configurados
- [ ] Verificación completa realizada

## 🚨 Troubleshooting Común

### Error: "database is locked"

```bash
# Verificar procesos que usan la DB
lsof database/database.sqlite

# Verificar permisos
ls -la database/database.sqlite

# Recrear archivo si es necesario
rm database/database.sqlite
touch database/database.sqlite
php artisan migrate
```

### Error: "SQLSTATE[HY000] [14] unable to open database file"

```bash
# Verificar que el directorio existe
mkdir -p database

# Verificar permisos del directorio
chmod 775 database/

# Verificar ruta absoluta en .env
echo "DB_DATABASE=$(pwd)/database/database.sqlite" >> .env
```

## ➡️ Preparación para Sección 02

Una vez completada esta sección, tendrás:

✅ SQLite completamente configurado  
✅ Laravel conectado sin errores  
✅ Herramientas de debug instaladas  
✅ Scripts de backup funcionales

**Próximo paso:** Crear nuestras primeras migrations y models personalizados en la Sección 02.

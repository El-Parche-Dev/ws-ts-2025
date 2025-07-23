# 🐳 MÓDULO 2: Deployment y DevOps

## Duración: 90 minutos (1:30 PM - 3:00 PM)

### 📋 **OBJETIVO DEL MÓDULO**

Implementar una estrategia completa de deployment utilizando Docker, configurar CI/CD con GitHub Actions, y establecer un pipeline automatizado para environments de desarrollo, staging y producción.

---

## 🎯 **ENTREGABLES DEL MÓDULO**

Al finalizar este módulo tendrás:

1. ✅ **Containerización completa** con Docker multi-stage
2. ✅ **Docker Compose** para desarrollo local
3. ✅ **CI/CD Pipeline** con GitHub Actions
4. ✅ **Environment management** (dev, staging, prod)
5. ✅ **SSL/HTTPS** configurado
6. ✅ **Database migrations** automatizadas
7. ✅ **Rollback strategy** implementada

---

## 🐳 **FASE 1: Containerización con Docker (30 minutos)**

### **1.1 Dockerfile Multi-Stage para Producción**

```dockerfile
# Dockerfile
# Stage 1: Build dependencies
FROM php:8.2-fpm-alpine AS php-build

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite-dev \
    redis \
    nodejs \
    npm

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files first (better layer caching)
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy package.json and install node dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Build frontend assets
RUN npm run build

# Set correct permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Stage 2: Production runtime
FROM php:8.2-fpm-alpine AS production

# Install production dependencies only
RUN apk add --no-cache \
    libpng \
    oniguruma \
    libxml2 \
    sqlite \
    redis \
    nginx \
    supervisor

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd

# Copy application from build stage
COPY --from=php-build --chown=www-data:www-data /var/www /var/www

# Copy configuration files
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/php/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf
COPY docker/php/php.ini /usr/local/etc/php/php.ini
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set working directory
WORKDIR /var/www

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Expose port
EXPOSE 80

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# Stage 3: Development version
FROM php-build AS development

# Install development tools
RUN apk add --no-cache \
    bash \
    vim \
    htop

# Install development composer dependencies
RUN composer install --optimize-autoloader

# Install Xdebug for development
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Copy development PHP configuration
COPY docker/php/php-dev.ini /usr/local/etc/php/php.ini

# Expose PHP-FPM port
EXPOSE 9000

CMD ["php-fpm"]
```

### **1.2 Configuraciones Docker**

```nginx
# docker/nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    include /etc/nginx/conf.d/*.conf;
}
```

```nginx
# docker/nginx/default.conf
server {
    listen 80;
    server_name localhost;
    root /var/www/public;
    index index.php index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle Laravel routes
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
        fastcgi_read_timeout 300;
        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt|tar|gz)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Deny access to sensitive files
    location ~ /(?:composer\.json|composer\.lock|\.env) {
        deny all;
    }
}
```

```ini
# docker/php/php.ini
[PHP]
engine = On
short_open_tag = Off
precision = 14
output_buffering = 4096
zlib.output_compression = Off
implicit_flush = Off
unserialize_callback_func =
serialize_precision = -1
disable_functions =
disable_classes =
zend.enable_gc = On
zend.exception_ignore_args = On

[Date]
date.timezone = America/Bogota

[Pdo_mysql]
pdo_mysql.default_socket=

[mail function]
SMTP = localhost
smtp_port = 25
mail.add_x_header = Off

[ODBC]
odbc.allow_persistent = On
odbc.check_persistent = On
odbc.max_persistent = -1
odbc.max_links = -1
odbc.defaultlrl = 4096
odbc.defaultbinmode = 1

[MySQLi]
mysqli.max_persistent = -1
mysqli.allow_persistent = On
mysqli.max_links = -1
mysqli.default_port = 3306
mysqli.default_socket =
mysqli.default_host =
mysqli.default_user =
mysqli.default_pw =
mysqli.reconnect = Off

# Performance Settings
memory_limit = 512M
max_execution_time = 300
max_input_time = 300
max_input_vars = 10000
post_max_size = 100M
upload_max_filesize = 100M
max_file_uploads = 20

# OpCache Settings
opcache.enable = 1
opcache.enable_cli = 1
opcache.memory_consumption = 256
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 20000
opcache.revalidate_freq = 2
opcache.validate_timestamps = 0
opcache.fast_shutdown = 1
```

```conf
# docker/supervisor/supervisord.conf
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:nginx]
command=nginx -g "daemon off;"
autostart=true
autorestart=true
stderr_logfile=/var/log/nginx/error.log
stdout_logfile=/var/log/nginx/access.log

[program:php-fpm]
command=php-fpm
autostart=true
autorestart=true
stderr_logfile=/var/log/php-fpm.log
stdout_logfile=/var/log/php-fpm.log

[program:horizon]
process_name=%(program_name)s
command=php /var/www/artisan horizon
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/storage/logs/horizon.log
stopwaitsecs=3600

[program:websockets]
process_name=%(program_name)s
command=php /var/www/artisan websockets:serve --host=0.0.0.0 --port=6001
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/storage/logs/websockets.log
```

### **1.3 Docker Compose para Desarrollo**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Laravel Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    container_name: worldskills_app
    restart: unless-stopped
    working_dir: /var/www
    volumes:
      - ./:/var/www
      - ./docker/php/php-dev.ini:/usr/local/etc/php/php.ini
    networks:
      - worldskills
    depends_on:
      - mysql
      - redis

  # Nginx Web Server
  nginx:
    image: nginx:alpine
    container_name: worldskills_nginx
    restart: unless-stopped
    ports:
      - '8000:80'
      - '443:443'
    volumes:
      - ./:/var/www
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./docker/ssl:/etc/nginx/ssl
    networks:
      - worldskills
    depends_on:
      - app

  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: worldskills_mysql
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: worldskills_api
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD:-secret}
      MYSQL_PASSWORD: ${DB_PASSWORD:-secret}
      MYSQL_USER: ${DB_USERNAME:-laravel}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./docker/mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - '3306:3306'
    networks:
      - worldskills

  # Redis for Caching and Queues
  redis:
    image: redis:7-alpine
    container_name: worldskills_redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - worldskills

  # Mailhog for Email Testing
  mailhog:
    image: mailhog/mailhog
    container_name: worldskills_mailhog
    ports:
      - '1025:1025'
      - '8025:8025'
    networks:
      - worldskills

  # Adminer for Database Management
  adminer:
    image: adminer
    container_name: worldskills_adminer
    restart: unless-stopped
    ports:
      - '8080:8080'
    networks:
      - worldskills
    depends_on:
      - mysql

volumes:
  mysql_data:
  redis_data:

networks:
  worldskills:
    driver: bridge
```

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: worldskills_app_prod
    restart: unless-stopped
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
    volumes:
      - storage_data:/var/www/storage
      - log_data:/var/log
    networks:
      - worldskills_prod
    depends_on:
      - mysql
      - redis

  nginx:
    image: nginx:alpine
    container_name: worldskills_nginx_prod
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./docker/nginx/prod.conf:/etc/nginx/conf.d/default.conf
      - ./docker/ssl:/etc/nginx/ssl
      - storage_data:/var/www/storage:ro
      - log_data:/var/log/nginx
    networks:
      - worldskills_prod
    depends_on:
      - app

  mysql:
    image: mysql:8.0
    container_name: worldskills_mysql_prod
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: ${DB_DATABASE}
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_USER: ${DB_USERNAME}
    volumes:
      - mysql_prod_data:/var/lib/mysql
    networks:
      - worldskills_prod

  redis:
    image: redis:7-alpine
    container_name: worldskills_redis_prod
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_prod_data:/data
    networks:
      - worldskills_prod

volumes:
  mysql_prod_data:
  redis_prod_data:
  storage_data:
  log_data:

networks:
  worldskills_prod:
    driver: bridge
```

---

## 🚀 **FASE 2: CI/CD con GitHub Actions (30 minutos)**

### **2.1 Workflow Principal**

```yaml
# .github/workflows/deploy.yml
name: Deploy WorldSkills API Platform

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Job 1: Tests y Quality Checks
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: secret
          MYSQL_DATABASE: testing
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd="redis-cli ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.2
          extensions: dom, curl, libxml, mbstring, zip, pcntl, pdo, sqlite, pdo_sqlite, bcmath, soap, intl, gd, exif, iconv
          coverage: xdebug

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Cache Composer dependencies
        uses: actions/cache@v3
        with:
          path: vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: ${{ runner.os }}-composer-

      - name: Install Composer dependencies
        run: composer install --no-progress --prefer-dist --optimize-autoloader

      - name: Install NPM dependencies
        run: npm ci

      - name: Build frontend assets
        run: npm run build

      - name: Prepare Laravel Application
        run: |
          cp .env.ci .env
          php artisan key:generate
          php artisan migrate --force
          php artisan db:seed --force

      - name: Run PHP CS Fixer
        run: vendor/bin/php-cs-fixer fix --dry-run --diff --verbose

      - name: Run PHPStan
        run: vendor/bin/phpstan analyse

      - name: Run PHPUnit Tests
        run: vendor/bin/phpunit --coverage-text --coverage-clover=coverage.xml

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
          fail_ci_if_error: true

  # Job 2: Security Scan
  security:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run security audit
        run: composer audit

      - name: Run NPM security audit
        run: npm audit --audit-level moderate

  # Job 3: Build Docker Image
  build:
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'

    outputs:
      image: ${{ steps.image.outputs.image }}
      digest: ${{ steps.build.outputs.digest }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          target: production
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Output image
        id: image
        run: |
          echo "image=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}" >> $GITHUB_OUTPUT

  # Job 4: Deploy to Staging
  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - name: Deploy to staging
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USERNAME }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          port: ${{ secrets.STAGING_PORT }}
          script: |
            cd /var/www/worldskills-api-staging
            docker-compose pull
            docker-compose down
            docker-compose up -d
            docker-compose exec -T app php artisan migrate --force
            docker-compose exec -T app php artisan config:cache
            docker-compose exec -T app php artisan route:cache
            docker-compose exec -T app php artisan view:cache
            echo "Staging deployment completed"

  # Job 5: Deploy to Production
  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USERNAME }}
          key: ${{ secrets.PROD_SSH_KEY }}
          port: ${{ secrets.PROD_PORT }}
          script: |
            cd /var/www/worldskills-api-production

            # Backup current deployment
            docker-compose exec -T app php artisan backup:run

            # Update containers
            docker-compose pull
            docker-compose down
            docker-compose up -d

            # Run migrations
            docker-compose exec -T app php artisan migrate --force

            # Optimize application
            docker-compose exec -T app php artisan config:cache
            docker-compose exec -T app php artisan route:cache
            docker-compose exec -T app php artisan view:cache
            docker-compose exec -T app php artisan storage:link

            # Clear caches
            docker-compose exec -T app php artisan cache:clear
            docker-compose exec -T app php artisan queue:restart

            # Health check
            sleep 30
            curl -f http://localhost/health || exit 1

            echo "Production deployment completed successfully"

  # Job 6: Notify deployment
  notify:
    runs-on: ubuntu-latest
    needs: [deploy-staging, deploy-production]
    if: always()

    steps:
      - name: Notify Slack on success
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: "🚀 Deployment successful to ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

      - name: Notify Slack on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          text: "❌ Deployment failed to ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### **2.2 Configuración de Environments**

```bash
# .env.ci (para testing)
APP_NAME="WorldSkills API Platform"
APP_ENV=testing
APP_KEY=base64:InsertYourKeyHere
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=testing
DB_USERNAME=root
DB_PASSWORD=secret

BROADCAST_DRIVER=redis
CACHE_DRIVER=redis
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=array
```

```bash
# .env.production (template)
APP_NAME="WorldSkills API Platform"
APP_ENV=production
APP_KEY=${APP_KEY}
APP_DEBUG=false
APP_URL=${APP_URL}

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=${DB_HOST}
DB_PORT=3306
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}

BROADCAST_DRIVER=redis
CACHE_DRIVER=redis
FILESYSTEM_DISK=s3
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=${REDIS_HOST}
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=${MAIL_HOST}
MAIL_PORT=587
MAIL_USERNAME=${MAIL_USERNAME}
MAIL_PASSWORD=${MAIL_PASSWORD}
MAIL_ENCRYPTION=tls

AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}
AWS_BUCKET=${AWS_BUCKET}

PUSHER_APP_ID=${PUSHER_APP_ID}
PUSHER_APP_KEY=${PUSHER_APP_KEY}
PUSHER_APP_SECRET=${PUSHER_APP_SECRET}
PUSHER_HOST=${PUSHER_HOST}
PUSHER_PORT=443
PUSHER_SCHEME=https
```

---

## 🔒 **FASE 3: SSL/HTTPS y Security (15 minutos)**

### **3.1 SSL Certificate con Let's Encrypt**

```bash
#!/bin/bash
# scripts/setup-ssl.sh

# Install certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

```nginx
# docker/nginx/prod.conf (con SSL)
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/public;
    index index.php index.html;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout 5m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_protocols TLSv1.2 TLSv1.3;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass app:9000;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Resto de la configuración...
}
```

### **3.2 Backup Strategy**

```php
<?php
// config/backup.php (configuración de backup)

return [
    'backup' => [
        'name' => env('APP_NAME', 'worldskills-api'),

        'source' => [
            'files' => [
                'include' => [
                    base_path(),
                ],
                'exclude' => [
                    base_path('vendor'),
                    base_path('node_modules'),
                    base_path('storage/logs'),
                ],
                'follow_links' => false,
                'ignore_unreadable_directories' => false,
                'relative_path' => null,
            ],

            'databases' => [
                'mysql',
            ],
        ],

        'destination' => [
            'filename_prefix' => '',
            'disks' => [
                's3',
            ],
        ],

        'temporary_directory' => storage_path('app/backup-temp'),

        'password' => env('BACKUP_PASSWORD'),

        'encryption' => 'default',
    ],

    'notifications' => [
        'notifications' => [
            \Spatie\Backup\Notifications\Notifications\BackupHasFailed::class => ['slack'],
            \Spatie\Backup\Notifications\Notifications\UnhealthyBackupWasFound::class => ['slack'],
            \Spatie\Backup\Notifications\Notifications\CleanupHasFailed::class => ['slack'],
            \Spatie\Backup\Notifications\Notifications\BackupWasSuccessful::class => ['slack'],
            \Spatie\Backup\Notifications\Notifications\HealthyBackupWasFound::class => ['slack'],
            \Spatie\Backup\Notifications\Notifications\CleanupWasSuccessful::class => ['slack'],
        ],

        'notifiable' => \Spatie\Backup\Notifications\Notifiable::class,

        'mail' => [
            'to' => env('BACKUP_MAIL_TO', 'admin@yourdomain.com'),
            'from' => [
                'address' => env('BACKUP_MAIL_FROM', 'backup@yourdomain.com'),
                'name' => env('APP_NAME'),
            ],
        ],

        'slack' => [
            'webhook_url' => env('BACKUP_SLACK_WEBHOOK_URL'),
            'channel' => env('BACKUP_SLACK_CHANNEL'),
            'username' => env('BACKUP_SLACK_USERNAME'),
            'icon' => env('BACKUP_SLACK_ICON'),
        ],
    ],

    'monitor_backups' => [
        [
            'name' => env('APP_NAME', 'worldskills-api'),
            'disks' => ['s3'],
            'health_checks' => [
                \Spatie\Backup\Tasks\Monitor\HealthChecks\MaximumAgeInDays::class => 1,
                \Spatie\Backup\Tasks\Monitor\HealthChecks\MaximumStorageInMegabytes::class => 5000,
            ],
        ],
    ],

    'cleanup' => [
        'strategy' => \Spatie\Backup\Tasks\Cleanup\Strategies\DefaultStrategy::class,

        'default_strategy' => [
            'keep_all_backups_for_days' => 7,
            'keep_daily_backups_for_days' => 16,
            'keep_weekly_backups_for_weeks' => 8,
            'keep_monthly_backups_for_months' => 4,
            'keep_yearly_backups_for_years' => 2,
            'delete_oldest_backups_when_using_more_megabytes_than' => 5000,
        ],
    ],
];
```

---

## 📦 **FASE 4: Deployment Scripts (15 minutos)**

### **4.1 Script de Deployment**

```bash
#!/bin/bash
# scripts/deploy.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
PROJECT_DIR="/var/www/worldskills-api-${ENVIRONMENT}"
DOCKER_COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yml"
BACKUP_DIR="/var/backups/worldskills-api"

echo -e "${GREEN}🚀 Starting deployment to ${ENVIRONMENT}...${NC}"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Function to log with timestamp
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Function to handle errors
error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Function to backup database
backup_database() {
    log "Creating database backup..."

    BACKUP_FILE="${BACKUP_DIR}/db_backup_$(date +%Y%m%d_%H%M%S).sql"

    docker-compose -f ${DOCKER_COMPOSE_FILE} exec -T mysql mysqldump \
        -u${DB_USERNAME} -p${DB_PASSWORD} ${DB_DATABASE} > ${BACKUP_FILE}

    if [ $? -eq 0 ]; then
        log "Database backup created: ${BACKUP_FILE}"
        # Keep only last 7 backups
        find ${BACKUP_DIR} -name "db_backup_*.sql" -type f -mtime +7 -delete
    else
        error "Database backup failed"
    fi
}

# Function to backup application files
backup_storage() {
    log "Creating storage backup..."

    STORAGE_BACKUP="${BACKUP_DIR}/storage_backup_$(date +%Y%m%d_%H%M%S).tar.gz"

    tar -czf ${STORAGE_BACKUP} -C ${PROJECT_DIR} storage/app/public/ 2>/dev/null || true

    if [ -f ${STORAGE_BACKUP} ]; then
        log "Storage backup created: ${STORAGE_BACKUP}"
        # Keep only last 7 backups
        find ${BACKUP_DIR} -name "storage_backup_*.tar.gz" -type f -mtime +7 -delete
    fi
}

# Function to check application health
health_check() {
    log "Performing health check..."

    local max_attempts=30
    local attempt=0

    while [ $attempt -lt $max_attempts ]; do
        if curl -f -s http://localhost/health > /dev/null; then
            log "Health check passed ✅"
            return 0
        fi

        attempt=$((attempt + 1))
        log "Health check attempt ${attempt}/${max_attempts}..."
        sleep 2
    done

    error "Health check failed after ${max_attempts} attempts"
}

# Function to rollback
rollback() {
    log "🔄 Rolling back deployment..."

    # Restore from backup
    if [ -f "${BACKUP_DIR}/docker-compose.${ENVIRONMENT}.yml.backup" ]; then
        cp "${BACKUP_DIR}/docker-compose.${ENVIRONMENT}.yml.backup" ${DOCKER_COMPOSE_FILE}
        docker-compose -f ${DOCKER_COMPOSE_FILE} up -d

        # Restore database if needed
        LATEST_DB_BACKUP=$(find ${BACKUP_DIR} -name "db_backup_*.sql" -type f -printf '%T@ %p\n' | sort -k 1nr | head -1 | cut -d' ' -f2-)
        if [ -f "${LATEST_DB_BACKUP}" ]; then
            docker-compose -f ${DOCKER_COMPOSE_FILE} exec -T mysql mysql \
                -u${DB_USERNAME} -p${DB_PASSWORD} ${DB_DATABASE} < ${LATEST_DB_BACKUP}
        fi

        log "Rollback completed"
    else
        error "No backup found for rollback"
    fi
}

# Main deployment process
main() {
    # Check if project directory exists
    if [ ! -d "${PROJECT_DIR}" ]; then
        error "Project directory ${PROJECT_DIR} does not exist"
    fi

    cd ${PROJECT_DIR}

    # Load environment variables
    if [ -f ".env.${ENVIRONMENT}" ]; then
        source .env.${ENVIRONMENT}
    else
        error "Environment file .env.${ENVIRONMENT} not found"
    fi

    # Create backups
    backup_database
    backup_storage

    # Backup current docker-compose file
    cp ${DOCKER_COMPOSE_FILE} "${BACKUP_DIR}/docker-compose.${ENVIRONMENT}.yml.backup"

    # Pull latest images
    log "Pulling latest Docker images..."
    docker-compose -f ${DOCKER_COMPOSE_FILE} pull

    # Stop containers gracefully
    log "Stopping containers..."
    docker-compose -f ${DOCKER_COMPOSE_FILE} down --timeout 30

    # Start containers
    log "Starting containers..."
    docker-compose -f ${DOCKER_COMPOSE_FILE} up -d

    # Wait for containers to be ready
    sleep 10

    # Run migrations
    log "Running database migrations..."
    docker-compose -f ${DOCKER_COMPOSE_FILE} exec -T app php artisan migrate --force

    # Clear and cache
    log "Optimizing application..."
    docker-compose -f ${DOCKER_COMPOSE_FILE} exec -T app php artisan config:cache
    docker-compose -f ${DOCKER_COMPOSE_FILE} exec -T app php artisan route:cache
    docker-compose -f ${DOCKER_COMPOSE_FILE} exec -T app php artisan view:cache
    docker-compose -f ${DOCKER_COMPOSE_FILE} exec -T app php artisan storage:link

    # Clear application caches
    docker-compose -f ${DOCKER_COMPOSE_FILE} exec -T app php artisan cache:clear
    docker-compose -f ${DOCKER_COMPOSE_FILE} exec -T app php artisan queue:restart

    # Health check
    if ! health_check; then
        log "Health check failed, attempting rollback..."
        rollback
        exit 1
    fi

    # Cleanup old images
    log "Cleaning up old Docker images..."
    docker image prune -f

    log "🎉 Deployment to ${ENVIRONMENT} completed successfully!"

    # Send notification
    if [ ! -z "${SLACK_WEBHOOK_URL}" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 Deployment to ${ENVIRONMENT} completed successfully\"}" \
            ${SLACK_WEBHOOK_URL}
    fi
}

# Trap to handle rollback on failure
trap 'rollback' ERR

# Execute main function
main "$@"
```

### **4.2 Script de Zero-Downtime Deployment**

```bash
#!/bin/bash
# scripts/zero-downtime-deploy.sh

# Blue-Green deployment strategy
ENVIRONMENT=${1:-production}
CURRENT_COLOR=$(docker-compose -f docker-compose.${ENVIRONMENT}.yml ps --services | grep -o "blue\|green" | head -1)
NEW_COLOR=$([ "$CURRENT_COLOR" = "blue" ] && echo "green" || echo "blue")

log "Current deployment: $CURRENT_COLOR, New deployment: $NEW_COLOR"

# Deploy to new color
docker-compose -f docker-compose.${ENVIRONMENT}.yml up -d ${NEW_COLOR}

# Health check on new deployment
if health_check_color ${NEW_COLOR}; then
    # Switch traffic to new deployment
    switch_traffic ${NEW_COLOR}

    # Stop old deployment
    docker-compose -f docker-compose.${ENVIRONMENT}.yml stop ${CURRENT_COLOR}

    log "Zero-downtime deployment completed: $CURRENT_COLOR -> $NEW_COLOR"
else
    # Cleanup failed deployment
    docker-compose -f docker-compose.${ENVIRONMENT}.yml stop ${NEW_COLOR}
    error "Zero-downtime deployment failed"
fi
```

---

## ✅ **VERIFICACIÓN DEL MÓDULO 2**

### **Checklist de Completitud:**

- [ ] Dockerfile multi-stage funcionando correctamente
- [ ] Docker Compose para desarrollo configurado
- [ ] CI/CD pipeline con GitHub Actions operativo
- [ ] SSL/HTTPS configurado y funcionando
- [ ] Scripts de deployment y rollback probados
- [ ] Strategy de backup implementada
- [ ] Environment management (dev/staging/prod) configurado
- [ ] Health checks y monitoring básico funcionando

### **Comandos de Verificación:**

```bash
# Verificar containers
docker-compose ps
docker-compose logs app

# Verificar SSL
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Verificar health endpoint
curl -f https://yourdomain.com/health

# Probar deployment
./scripts/deploy.sh staging
```

---

## 🎯 **RESULTADO ESPERADO**

Al finalizar el Módulo 2, tendrás un **sistema de deployment profesional** con:

- ✅ **Containerización completa** con Docker optimizado
- ✅ **CI/CD automatizado** con testing y deployment
- ✅ **SSL/HTTPS** configurado con renovación automática
- ✅ **Backup strategy** automática con retención
- ✅ **Zero-downtime deployment** con rollback automático
- ✅ **Multi-environment** support (dev/staging/prod)
- ✅ **Security hardening** aplicado
- ✅ **Health monitoring** básico implementado

**¡Perfecto! Tu aplicación ahora está lista para producción con deployment profesional! 🚀**

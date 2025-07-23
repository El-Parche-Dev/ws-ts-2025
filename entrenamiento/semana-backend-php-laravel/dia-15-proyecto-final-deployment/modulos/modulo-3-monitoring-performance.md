# 📊 MÓDULO 3: Monitoring y Performance

## Duración: 90 minutos (3:00 PM - 4:30 PM)

### 📋 **OBJETIVO DEL MÓDULO**

Implementar un sistema completo de monitoring, logging y optimización de performance que permita detectar, diagnosticar y resolver problemas en tiempo real, asegurando la máxima disponibilidad y rendimiento de la aplicación.

---

## 🎯 **ENTREGABLES DEL MÓDULO**

Al finalizar este módulo tendrás:

1. ✅ **Prometheus + Grafana** para métricas y dashboards
2. ✅ **ELK Stack** (Elasticsearch, Logstash, Kibana) para logs
3. ✅ **Laravel Telescope** para debugging detallado
4. ✅ **Performance optimization** aplicada
5. ✅ **Alerting system** configurado
6. ✅ **Custom metrics** y health checks
7. ✅ **APM (Application Performance Monitoring)** implementado

---

## 📈 **FASE 1: Prometheus + Grafana Setup (25 minutos)**

### **1.1 Docker Compose para Monitoring Stack**

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  # Prometheus - Metrics Collection
  prometheus:
    image: prom/prometheus:latest
    container_name: worldskills_prometheus
    restart: unless-stopped
    ports:
      - '9090:9090'
    volumes:
      - ./monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./monitoring/prometheus/rules:/etc/prometheus/rules
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
      - '--web.enable-admin-api'
    networks:
      - monitoring

  # Grafana - Visualization Dashboard
  grafana:
    image: grafana/grafana:latest
    container_name: worldskills_grafana
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_ADMIN_PASSWORD:-admin}
      GF_INSTALL_PLUGINS: grafana-clock-panel,grafana-simple-json-datasource,grafana-worldmap-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
      - ./monitoring/grafana/dashboards:/var/lib/grafana/dashboards
    networks:
      - monitoring
    depends_on:
      - prometheus

  # Node Exporter - System Metrics
  node-exporter:
    image: prom/node-exporter:latest
    container_name: worldskills_node_exporter
    restart: unless-stopped
    ports:
      - '9100:9100'
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - monitoring

  # Redis Exporter - Redis Metrics
  redis-exporter:
    image: oliver006/redis_exporter:latest
    container_name: worldskills_redis_exporter
    restart: unless-stopped
    ports:
      - '9121:9121'
    environment:
      REDIS_ADDR: redis:6379
      REDIS_PASSWORD: ${REDIS_PASSWORD:-}
    networks:
      - monitoring
      - worldskills
    depends_on:
      - redis

  # MySQL Exporter - Database Metrics
  mysql-exporter:
    image: prom/mysqld-exporter:latest
    container_name: worldskills_mysql_exporter
    restart: unless-stopped
    ports:
      - '9104:9104'
    environment:
      DATA_SOURCE_NAME: '${DB_USERNAME}:${DB_PASSWORD}@(mysql:3306)/${DB_DATABASE}'
    networks:
      - monitoring
      - worldskills
    depends_on:
      - mysql

  # Nginx Exporter - Web Server Metrics
  nginx-exporter:
    image: nginx/nginx-prometheus-exporter:latest
    container_name: worldskills_nginx_exporter
    restart: unless-stopped
    ports:
      - '9113:9113'
    command:
      - -nginx.scrape-uri=http://nginx:8080/nginx_status
    networks:
      - monitoring
      - worldskills
    depends_on:
      - nginx

  # AlertManager - Alert Handling
  alertmanager:
    image: prom/alertmanager:latest
    container_name: worldskills_alertmanager
    restart: unless-stopped
    ports:
      - '9093:9093'
    volumes:
      - ./monitoring/alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager_data:/alertmanager
    networks:
      - monitoring

volumes:
  prometheus_data:
  grafana_data:
  alertmanager_data:

networks:
  monitoring:
    driver: bridge
```

### **1.2 Configuración de Prometheus**

```yaml
# monitoring/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - '/etc/prometheus/rules/*.yml'

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

scrape_configs:
  # Prometheus self-monitoring
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Node system metrics
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  # Laravel application metrics
  - job_name: 'laravel-app'
    static_configs:
      - targets: ['app:8080']
    metrics_path: '/metrics'
    scrape_interval: 30s

  # Redis metrics
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']

  # MySQL metrics
  - job_name: 'mysql'
    static_configs:
      - targets: ['mysql-exporter:9104']

  # Nginx metrics
  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-exporter:9113']

  # Custom application endpoints
  - job_name: 'app-health'
    static_configs:
      - targets: ['nginx:80']
    metrics_path: '/health'
    scrape_interval: 10s
```

### **1.3 Alerting Rules**

```yaml
# monitoring/prometheus/rules/laravel-alerts.yml
groups:
  - name: laravel-app-alerts
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: rate(laravel_http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: 'High error rate detected'
          description: 'Error rate is {{ $value }} errors per second'

      # High response time
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(laravel_http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: 'High response time detected'
          description: '95th percentile response time is {{ $value }} seconds'

      # Database connection issues
      - alert: DatabaseConnectionFailed
        expr: mysql_up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: 'Database connection failed'
          description: 'MySQL instance is down'

      # High memory usage
      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: 'High memory usage'
          description: 'Memory usage is above 90%'

      # Queue size too large
      - alert: QueueSizeHigh
        expr: laravel_queue_size > 1000
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: 'Queue size is high'
          description: 'Queue size is {{ $value }} jobs'

  - name: infrastructure-alerts
    rules:
      # Disk space low
      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: 'Disk space low'
          description: 'Disk space is below 10%'

      # High CPU usage
      - alert: HighCPUUsage
        expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: 'High CPU usage'
          description: 'CPU usage is above 80%'

      # Container down
      - alert: ContainerDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: 'Container is down'
          description: 'Container {{ $labels.instance }} is down'
```

### **1.4 Laravel Metrics Collection**

```php
<?php
// app/Http/Middleware/CollectMetrics.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class CollectMetrics
{
    public function handle(Request $request, Closure $next)
    {
        $startTime = microtime(true);

        $response = $next($request);

        $duration = microtime(true) - $startTime;

        // Collect metrics asynchronously
        $this->collectMetrics($request, $response, $duration);

        return $response;
    }

    private function collectMetrics(Request $request, $response, float $duration): void
    {
        try {
            $route = $request->route() ? $request->route()->getName() : 'unknown';
            $method = $request->method();
            $status = $response->getStatusCode();

            // Store metrics in Redis for Prometheus to scrape
            $metricsKey = 'metrics:' . date('Y-m-d-H-i');

            Redis::hincrby($metricsKey, "http_requests_total:{$method}:{$route}:{$status}", 1);
            Redis::hincrbyfloat($metricsKey, "http_request_duration:{$method}:{$route}", $duration);
            Redis::expire($metricsKey, 3600); // Keep for 1 hour

            // Additional custom metrics
            $this->collectCustomMetrics();

        } catch (\Exception $e) {
            // Don't let metrics collection break the application
            \Log::error('Metrics collection failed', ['error' => $e->getMessage()]);
        }
    }

    private function collectCustomMetrics(): void
    {
        // Database connections
        Redis::set('metrics:db_connections', DB::select('SHOW STATUS LIKE "Threads_connected"')[0]->Value ?? 0);

        // Queue size
        Redis::set('metrics:queue_size', \Queue::size());

        // Cache hit ratio
        $cacheStats = Cache::getRedis()->info('stats');
        if (isset($cacheStats['keyspace_hits'], $cacheStats['keyspace_misses'])) {
            $hitRatio = $cacheStats['keyspace_hits'] / ($cacheStats['keyspace_hits'] + $cacheStats['keyspace_misses']);
            Redis::set('metrics:cache_hit_ratio', $hitRatio);
        }

        // Memory usage
        Redis::set('metrics:memory_usage', memory_get_peak_usage(true));
    }
}
```

```php
<?php
// routes/web.php - Metrics endpoint

Route::get('/metrics', function () {
    $metrics = [];

    // Get current metrics from Redis
    $keys = Redis::keys('metrics:*');

    foreach ($keys as $key) {
        if (str_contains($key, 'metrics:')) {
            $data = Redis::hgetall($key);
            foreach ($data as $metric => $value) {
                $metrics[] = "{$metric} {$value}";
            }
        }
    }

    // Add instant metrics
    $metrics[] = 'laravel_memory_usage ' . memory_get_peak_usage(true);
    $metrics[] = 'laravel_db_connections ' . (Redis::get('metrics:db_connections') ?? 0);
    $metrics[] = 'laravel_queue_size ' . (Redis::get('metrics:queue_size') ?? 0);
    $metrics[] = 'laravel_cache_hit_ratio ' . (Redis::get('metrics:cache_hit_ratio') ?? 0);

    return response(implode("\n", $metrics))->header('Content-Type', 'text/plain');
});
```

---

## 📊 **FASE 2: ELK Stack para Logging (25 minutos)**

### **2.1 Docker Compose ELK Stack**

```yaml
# docker-compose.elk.yml
version: '3.8'

services:
  # Elasticsearch - Search and Analytics Engine
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    container_name: worldskills_elasticsearch
    restart: unless-stopped
    environment:
      - discovery.type=single-node
      - 'ES_JAVA_OPTS=-Xms1g -Xmx1g'
      - xpack.security.enabled=false
      - xpack.security.enrollment.enabled=false
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - '9200:9200'
      - '9300:9300'
    networks:
      - elk

  # Logstash - Data Processing Pipeline
  logstash:
    image: docker.elastic.co/logstash/logstash:8.8.0
    container_name: worldskills_logstash
    restart: unless-stopped
    volumes:
      - ./monitoring/logstash/pipeline:/usr/share/logstash/pipeline
      - ./monitoring/logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml
      - ./storage/logs:/usr/share/logstash/logs:ro
    ports:
      - '5044:5044'
      - '5000:5000/tcp'
      - '5000:5000/udp'
      - '9600:9600'
    environment:
      LS_JAVA_OPTS: '-Xmx512m -Xms512m'
    networks:
      - elk
    depends_on:
      - elasticsearch

  # Kibana - Data Visualization
  kibana:
    image: docker.elastic.co/kibana/kibana:8.8.0
    container_name: worldskills_kibana
    restart: unless-stopped
    ports:
      - '5601:5601'
    environment:
      ELASTICSEARCH_URL: http://elasticsearch:9200
      ELASTICSEARCH_HOSTS: '["http://elasticsearch:9200"]'
    networks:
      - elk
    depends_on:
      - elasticsearch

  # Filebeat - Log Shipper
  filebeat:
    image: docker.elastic.co/beats/filebeat:8.8.0
    container_name: worldskills_filebeat
    restart: unless-stopped
    user: root
    volumes:
      - ./monitoring/filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - ./storage/logs:/var/log/laravel:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - elk
    depends_on:
      - elasticsearch
      - logstash

volumes:
  elasticsearch_data:

networks:
  elk:
    driver: bridge
```

### **2.2 Configuración de Logstash**

```yaml
# monitoring/logstash/config/logstash.yml
http.host: '0.0.0.0'
xpack.monitoring.elasticsearch.hosts: ['http://elasticsearch:9200']
```

```ruby
# monitoring/logstash/pipeline/laravel.conf
input {
  beats {
    port => 5044
  }

  file {
    path => "/usr/share/logstash/logs/*.log"
    start_position => "beginning"
    codec => "json"
    type => "laravel"
  }
}

filter {
  if [type] == "laravel" {
    # Parse Laravel log format
    grok {
      match => { "message" => "\[%{TIMESTAMP_ISO8601:timestamp}\] %{DATA:environment}\.%{DATA:level}: %{GREEDYDATA:message}" }
      overwrite => ["message"]
    }

    # Parse timestamp
    date {
      match => ["timestamp", "yyyy-MM-dd HH:mm:ss"]
      target => "@timestamp"
    }

    # Add severity based on level
    if [level] == "emergency" or [level] == "alert" or [level] == "critical" or [level] == "error" {
      mutate {
        add_field => { "severity" => "high" }
      }
    } else if [level] == "warning" {
      mutate {
        add_field => { "severity" => "medium" }
      }
    } else {
      mutate {
        add_field => { "severity" => "low" }
      }
    }

    # Parse JSON context if present
    if [context] {
      json {
        source => "context"
        target => "context_parsed"
      }
    }
  }

  # Parse Docker container logs
  if [container] {
    mutate {
      add_field => { "service" => "%{[container][name]}" }
    }
  }

  # GeoIP lookup for IP addresses
  if [remote_ip] {
    geoip {
      source => "remote_ip"
      target => "geoip"
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "laravel-logs-%{+YYYY.MM.dd}"
  }

  # Output errors to separate index
  if [level] == "error" or [level] == "critical" or [level] == "emergency" {
    elasticsearch {
      hosts => ["elasticsearch:9200"]
      index => "laravel-errors-%{+YYYY.MM.dd}"
    }
  }

  # Debug output (remove in production)
  stdout {
    codec => rubydebug
  }
}
```

### **2.3 Configuración de Filebeat**

```yaml
# monitoring/filebeat/filebeat.yml
filebeat.inputs:
  # Laravel application logs
  - type: log
    enabled: true
    paths:
      - /var/log/laravel/*.log
    fields:
      app: laravel
      environment: production
    fields_under_root: true
    multiline.pattern: '^\[\d{4}-\d{2}-\d{2}'
    multiline.negate: true
    multiline.match: after

  # Docker container logs
  - type: container
    enabled: true
    paths:
      - /var/lib/docker/containers/*/*.log
    processors:
      - add_docker_metadata:
          host: 'unix:///var/run/docker.sock'

  # Nginx access logs
  - type: log
    enabled: true
    paths:
      - /var/log/nginx/access.log
    fields:
      service: nginx
      log_type: access
    fields_under_root: true

  # Nginx error logs
  - type: log
    enabled: true
    paths:
      - /var/log/nginx/error.log
    fields:
      service: nginx
      log_type: error
    fields_under_root: true

# Processors
processors:
  - add_host_metadata:
      when.not.contains.tags: forwarded
  - add_cloud_metadata: ~
  - add_docker_metadata: ~
  - timestamp:
      field: json.time
      layouts:
        - '2006-01-02T15:04:05.000Z'
        - '2006-01-02T15:04:05Z'
      test:
        - '2019-06-22T16:33:51Z'

# Output
output.logstash:
  hosts: ['logstash:5044']

# Logging
logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
  permissions: 0644
```

### **2.4 Enhanced Laravel Logging**

```php
<?php
// config/logging.php - Enhanced logging configuration

return [
    'default' => env('LOG_CHANNEL', 'stack'),

    'deprecations' => env('LOG_DEPRECATIONS_CHANNEL', 'null'),

    'channels' => [
        'stack' => [
            'driver' => 'stack',
            'channels' => ['single', 'stderr', 'performance', 'security'],
            'ignore_exceptions' => false,
        ],

        'single' => [
            'driver' => 'single',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'replace_placeholders' => true,
        ],

        'performance' => [
            'driver' => 'single',
            'path' => storage_path('logs/performance.log'),
            'level' => 'info',
        ],

        'security' => [
            'driver' => 'single',
            'path' => storage_path('logs/security.log'),
            'level' => 'warning',
        ],

        'api_requests' => [
            'driver' => 'single',
            'path' => storage_path('logs/api_requests.log'),
            'level' => 'info',
        ],

        'database' => [
            'driver' => 'single',
            'path' => storage_path('logs/database.log'),
            'level' => 'debug',
        ],

        'jobs' => [
            'driver' => 'single',
            'path' => storage_path('logs/jobs.log'),
            'level' => 'info',
        ],

        'elk' => [
            'driver' => 'custom',
            'via' => App\Logging\ElkLoggerFactory::class,
            'level' => 'debug',
            'host' => env('ELK_HOST', 'logstash'),
            'port' => env('ELK_PORT', 5000),
        ],

        'stderr' => [
            'driver' => 'monolog',
            'level' => env('LOG_LEVEL', 'debug'),
            'handler' => Monolog\Handler\StreamHandler::class,
            'formatter' => env('LOG_STDERR_FORMATTER'),
            'with' => [
                'stream' => 'php://stderr',
            ],
        ],

        'syslog' => [
            'driver' => 'syslog',
            'level' => env('LOG_LEVEL', 'debug'),
            'facility' => LOG_USER,
            'replace_placeholders' => true,
        ],

        'errorlog' => [
            'driver' => 'errorlog',
            'level' => env('LOG_LEVEL', 'debug'),
            'replace_placeholders' => true,
        ],

        'null' => [
            'driver' => 'monolog',
            'handler' => Monolog\Handler\NullHandler::class,
        ],

        'emergency' => [
            'path' => storage_path('logs/laravel.log'),
        ],
    ],
];
```

```php
<?php
// app/Logging/ElkLoggerFactory.php

namespace App\Logging;

use Monolog\Logger;
use Monolog\Handler\SocketHandler;
use Monolog\Formatter\JsonFormatter;

class ElkLoggerFactory
{
    public function __invoke(array $config): Logger
    {
        $logger = new Logger('elk');

        $handler = new SocketHandler(
            "udp://{$config['host']}:{$config['port']}"
        );

        $handler->setFormatter(new JsonFormatter());

        $logger->pushHandler($handler);

        return $logger;
    }
}
```

```php
<?php
// app/Http/Middleware/LogApiRequests.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogApiRequests
{
    public function handle(Request $request, Closure $next)
    {
        $startTime = microtime(true);

        $response = $next($request);

        $duration = microtime(true) - $startTime;

        // Log API request details
        Log::channel('api_requests')->info('API Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'route' => $request->route() ? $request->route()->getName() : null,
            'status_code' => $response->getStatusCode(),
            'duration' => round($duration * 1000, 2), // milliseconds
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => auth()->id(),
            'request_id' => $request->header('X-Request-ID') ?? uniqid(),
            'memory_usage' => memory_get_peak_usage(true),
            'request_size' => $request->header('Content-Length', 0),
            'response_size' => strlen($response->getContent()),
            'timestamp' => now()->toISOString(),
        ]);

        // Log slow requests
        if ($duration > 2.0) { // 2 seconds threshold
            Log::channel('performance')->warning('Slow API Request', [
                'url' => $request->fullUrl(),
                'duration' => $duration,
                'method' => $request->method(),
                'user_id' => auth()->id(),
                'timestamp' => now()->toISOString(),
            ]);
        }

        return $response;
    }
}
```

---

## 🔬 **FASE 3: Laravel Telescope + APM (20 minutos)**

### **3.1 Configuración Avanzada de Telescope**

```php
<?php
// config/telescope.php - Enhanced configuration

return [
    'enabled' => env('TELESCOPE_ENABLED', true),

    'domain' => env('TELESCOPE_DOMAIN'),

    'path' => env('TELESCOPE_PATH', 'telescope'),

    'driver' => env('TELESCOPE_DRIVER', 'database'),

    'storage' => [
        'database' => [
            'connection' => env('DB_CONNECTION', 'mysql'),
            'chunk' => 1000,
        ],
    ],

    'queue' => [
        'connection' => env('TELESCOPE_QUEUE_CONNECTION', 'redis'),
        'queue' => env('TELESCOPE_QUEUE', 'telescope'),
    ],

    'ignore_paths' => [
        'nova-api*',
        'health*',
        'metrics*',
    ],

    'ignore_commands' => [
        'telescope:prune',
        'telescope:clear',
        'schedule:run',
        'queue:work',
        'horizon:work',
    ],

    'watchers' => [
        Watchers\BatchWatcher::class => env('TELESCOPE_BATCH_WATCHER', true),

        Watchers\CacheWatcher::class => [
            'enabled' => env('TELESCOPE_CACHE_WATCHER', true),
            'hidden' => [],
        ],

        Watchers\CommandWatcher::class => [
            'enabled' => env('TELESCOPE_COMMAND_WATCHER', true),
            'ignore' => [
                'telescope:prune',
                'schedule:run',
            ],
        ],

        Watchers\DumpWatcher::class => env('TELESCOPE_DUMP_WATCHER', true),

        Watchers\EventWatcher::class => [
            'enabled' => env('TELESCOPE_EVENT_WATCHER', true),
            'ignore' => [
                'Illuminate\Auth\Events\*',
                'Illuminate\Cache\Events\*',
                'Illuminate\Foundation\Events\LocaleUpdated',
                'Illuminate\Session\Events\*',
            ],
        ],

        Watchers\ExceptionWatcher::class => env('TELESCOPE_EXCEPTION_WATCHER', true),

        Watchers\JobWatcher::class => env('TELESCOPE_JOB_WATCHER', true),

        Watchers\LogWatcher::class => [
            'enabled' => env('TELESCOPE_LOG_WATCHER', true),
            'level' => 'error',
        ],

        Watchers\MailWatcher::class => env('TELESCOPE_MAIL_WATCHER', true),

        Watchers\ModelWatcher::class => [
            'enabled' => env('TELESCOPE_MODEL_WATCHER', true),
            'events' => ['eloquent.*'],
            'hydrations' => true,
        ],

        Watchers\NotificationWatcher::class => env('TELESCOPE_NOTIFICATION_WATCHER', true),

        Watchers\QueryWatcher::class => [
            'enabled' => env('TELESCOPE_QUERY_WATCHER', true),
            'ignore_packages' => true,
            'ignore_paths' => [],
            'slow' => 100, // milliseconds
        ],

        Watchers\RedisWatcher::class => env('TELESCOPE_REDIS_WATCHER', true),

        Watchers\RequestWatcher::class => [
            'enabled' => env('TELESCOPE_REQUEST_WATCHER', true),
            'size_limit' => env('TELESCOPE_RESPONSE_SIZE_LIMIT', 64),
            'ignore_status_codes' => [404],
        ],

        Watchers\ScheduleWatcher::class => env('TELESCOPE_SCHEDULE_WATCHER', true),

        Watchers\ViewWatcher::class => env('TELESCOPE_VIEW_WATCHER', true),
    ],
];
```

### **3.2 Custom Telescope Tags**

```php
<?php
// app/Providers/TelescopeServiceProvider.php

namespace App\Providers;

use Laravel\Telescope\IncomingEntry;
use Laravel\Telescope\Telescope;
use Laravel\Telescope\TelescopeApplicationServiceProvider;

class TelescopeServiceProvider extends TelescopeApplicationServiceProvider
{
    public function register(): void
    {
        Telescope::night();

        $this->hideSensitiveRequestDetails();

        Telescope::filter(function (IncomingEntry $entry) {
            if ($this->app->environment('local')) {
                return true;
            }

            return $entry->isReportableException() ||
                   $entry->isFailedRequest() ||
                   $entry->isFailedJob() ||
                   $entry->isScheduledTask() ||
                   $entry->hasMonitoredTag();
        });

        // Custom tags for better filtering
        Telescope::tag(function (IncomingEntry $entry) {
            $tags = [];

            if ($entry->type === 'request') {
                $tags[] = 'status:' . $entry->content['response_status'];

                if (isset($entry->content['route_name'])) {
                    $tags[] = 'route:' . $entry->content['route_name'];
                }

                if ($entry->content['duration'] > 1000) {
                    $tags[] = 'slow-request';
                }
            }

            if ($entry->type === 'query') {
                if ($entry->content['time'] > 100) {
                    $tags[] = 'slow-query';
                }

                $tags[] = 'connection:' . $entry->content['connection_name'];
            }

            if ($entry->type === 'job') {
                $tags[] = 'queue:' . ($entry->content['queue'] ?? 'default');

                if ($entry->content['failed']) {
                    $tags[] = 'failed-job';
                }
            }

            if ($entry->type === 'exception') {
                $tags[] = 'exception:' . class_basename($entry->content['class']);
                $tags[] = 'critical';
            }

            // Add user context
            if (auth()->check()) {
                $tags[] = 'user:' . auth()->id();
                $tags[] = 'role:' . auth()->user()->roles->pluck('name')->implode(',');
            }

            return $tags;
        });
    }

    protected function hideSensitiveRequestDetails(): void
    {
        if ($this->app->environment('local')) {
            return;
        }

        Telescope::hideRequestParameters(['_token']);

        Telescope::hideRequestHeaders([
            'cookie',
            'x-csrf-token',
            'x-xsrf-token',
        ]);
    }

    protected function authorization(): void
    {
        Telescope::auth(function ($request) {
            return app()->environment('local') ||
                   auth()->check() && auth()->user()->hasRole('admin');
        });
    }
}
```

### **3.3 Performance Monitoring Service**

```php
<?php
// app/Services/PerformanceMonitoringService.php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class PerformanceMonitoringService
{
    private const CACHE_PREFIX = 'perf_metrics:';
    private const TTL = 300; // 5 minutes

    public function recordApiMetrics(string $endpoint, float $duration, int $statusCode, int $memoryUsage): void
    {
        $key = self::CACHE_PREFIX . 'api:' . md5($endpoint);

        $metrics = Cache::get($key, [
            'endpoint' => $endpoint,
            'total_requests' => 0,
            'total_duration' => 0.0,
            'max_duration' => 0.0,
            'min_duration' => null,
            'status_codes' => [],
            'avg_memory' => 0,
            'last_updated' => now(),
        ]);

        $metrics['total_requests']++;
        $metrics['total_duration'] += $duration;
        $metrics['max_duration'] = max($metrics['max_duration'], $duration);
        $metrics['min_duration'] = $metrics['min_duration'] ? min($metrics['min_duration'], $duration) : $duration;
        $metrics['status_codes'][$statusCode] = ($metrics['status_codes'][$statusCode] ?? 0) + 1;
        $metrics['avg_memory'] = ($metrics['avg_memory'] + $memoryUsage) / 2;
        $metrics['last_updated'] = now();

        Cache::put($key, $metrics, self::TTL);

        // Alert on performance issues
        $avgDuration = $metrics['total_duration'] / $metrics['total_requests'];
        if ($avgDuration > 2000) { // 2 seconds
            $this->alertSlowEndpoint($endpoint, $avgDuration);
        }
    }

    public function recordDatabaseMetrics(string $query, float $duration, string $connection = 'default'): void
    {
        $queryHash = md5($query);
        $key = self::CACHE_PREFIX . 'db:' . $queryHash;

        $metrics = Cache::get($key, [
            'query_pattern' => $this->normalizeQuery($query),
            'connection' => $connection,
            'execution_count' => 0,
            'total_duration' => 0.0,
            'max_duration' => 0.0,
            'avg_duration' => 0.0,
            'last_executed' => now(),
        ]);

        $metrics['execution_count']++;
        $metrics['total_duration'] += $duration;
        $metrics['max_duration'] = max($metrics['max_duration'], $duration);
        $metrics['avg_duration'] = $metrics['total_duration'] / $metrics['execution_count'];
        $metrics['last_executed'] = now();

        Cache::put($key, $metrics, self::TTL);

        // Alert on slow queries
        if ($duration > 1000) { // 1 second
            $this->alertSlowQuery($query, $duration);
        }
    }

    public function getPerformanceReport(): array
    {
        $keys = Cache::getRedis()->keys(self::CACHE_PREFIX . '*');
        $report = [
            'api_metrics' => [],
            'database_metrics' => [],
            'system_metrics' => $this->getSystemMetrics(),
            'generated_at' => now(),
        ];

        foreach ($keys as $key) {
            $metrics = Cache::get($key);
            if (!$metrics) continue;

            if (str_contains($key, ':api:')) {
                $report['api_metrics'][] = $metrics;
            } elseif (str_contains($key, ':db:')) {
                $report['database_metrics'][] = $metrics;
            }
        }

        // Sort by performance impact
        usort($report['api_metrics'], fn($a, $b) => $b['max_duration'] <=> $a['max_duration']);
        usort($report['database_metrics'], fn($a, $b) => $b['max_duration'] <=> $a['max_duration']);

        return $report;
    }

    public function getSystemMetrics(): array
    {
        return [
            'memory_usage' => [
                'current' => memory_get_usage(true),
                'peak' => memory_get_peak_usage(true),
                'limit' => ini_get('memory_limit'),
            ],
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'database' => [
                'connections' => DB::select('SHOW STATUS LIKE "Threads_connected"')[0]->Value ?? 0,
                'slow_queries' => DB::select('SHOW STATUS LIKE "Slow_queries"')[0]->Value ?? 0,
            ],
            'redis' => [
                'connected_clients' => Redis::info('clients')['connected_clients'] ?? 0,
                'used_memory' => Redis::info('memory')['used_memory_human'] ?? '0B',
            ],
            'disk_usage' => disk_free_space('/') / disk_total_space('/'),
            'load_average' => sys_getloadavg(),
            'timestamp' => now(),
        ];
    }

    private function normalizeQuery(string $query): string
    {
        // Replace values with placeholders for pattern recognition
        $normalized = preg_replace('/\b\d+\b/', '?', $query);
        $normalized = preg_replace("/'\w+'/", '?', $normalized);
        return trim($normalized);
    }

    private function alertSlowEndpoint(string $endpoint, float $avgDuration): void
    {
        Log::channel('performance')->warning('Slow API endpoint detected', [
            'endpoint' => $endpoint,
            'avg_duration_ms' => $avgDuration,
            'threshold_ms' => 2000,
            'timestamp' => now(),
        ]);
    }

    private function alertSlowQuery(string $query, float $duration): void
    {
        Log::channel('database')->warning('Slow database query detected', [
            'query_pattern' => $this->normalizeQuery($query),
            'duration_ms' => $duration,
            'threshold_ms' => 1000,
            'timestamp' => now(),
        ]);
    }
}
```

---

## 🚨 **FASE 4: Alerting System (20 minutos)**

### **4.1 AlertManager Configuration**

```yaml
# monitoring/alertmanager/alertmanager.yml
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alerts@yourdomain.com'
  slack_api_url: 'YOUR_SLACK_WEBHOOK_URL'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'
  routes:
    - match:
        severity: critical
      receiver: 'critical-alerts'
      group_wait: 0s
      repeat_interval: 5m

    - match:
        severity: warning
      receiver: 'warning-alerts'
      repeat_interval: 30m

receivers:
  - name: 'web.hook'
    webhook_configs:
      - url: 'http://nginx/webhook/alerts'
        send_resolved: true

  - name: 'critical-alerts'
    email_configs:
      - to: 'admin@yourdomain.com'
        subject: '🚨 CRITICAL: {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          Alert: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          Severity: {{ .Labels.severity }}
          Instance: {{ .Labels.instance }}
          Time: {{ .StartsAt }}
          {{ end }}

    slack_configs:
      - channel: '#alerts-critical'
        title: '🚨 Critical Alert'
        text: |
          {{ range .Alerts }}
          *Alert:* {{ .Annotations.summary }}
          *Description:* {{ .Annotations.description }}
          *Severity:* {{ .Labels.severity }}
          *Instance:* {{ .Labels.instance }}
          {{ end }}
        send_resolved: true

  - name: 'warning-alerts'
    slack_configs:
      - channel: '#alerts-warning'
        title: '⚠️ Warning Alert'
        text: |
          {{ range .Alerts }}
          *Alert:* {{ .Annotations.summary }}
          *Description:* {{ .Annotations.description }}
          *Instance:* {{ .Labels.instance }}
          {{ end }}
        send_resolved: true

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']
```

### **4.2 Custom Laravel Alert Handler**

```php
<?php
// app/Http/Controllers/WebhookController.php

namespace App\Http\Controllers;

use App\Services\AlertService;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function __construct(
        private AlertService $alertService
    ) {}

    public function handleAlerts(Request $request)
    {
        $alerts = $request->json('alerts', []);

        foreach ($alerts as $alert) {
            $this->alertService->processAlert($alert);
        }

        return response()->json(['status' => 'processed']);
    }
}
```

```php
<?php
// app/Services/AlertService.php

namespace App\Services;

use App\Models\Alert;
use App\Models\User;
use App\Notifications\CriticalAlert;
use App\Notifications\WarningAlert;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class AlertService
{
    public function processAlert(array $alertData): void
    {
        $alert = $this->createAlert($alertData);

        Log::info('Processing alert', [
            'alert_name' => $alert->name,
            'severity' => $alert->severity,
            'status' => $alert->status,
        ]);

        // Send notifications based on severity
        if ($alert->severity === 'critical') {
            $this->handleCriticalAlert($alert);
        } elseif ($alert->severity === 'warning') {
            $this->handleWarningAlert($alert);
        }

        // Auto-resolve if status is resolved
        if ($alert->status === 'resolved') {
            $this->resolveAlert($alert);
        }
    }

    private function createAlert(array $data): Alert
    {
        return Alert::updateOrCreate(
            [
                'fingerprint' => $data['fingerprint'] ?? md5(json_encode($data['labels'])),
            ],
            [
                'name' => $data['labels']['alertname'] ?? 'Unknown Alert',
                'severity' => $data['labels']['severity'] ?? 'info',
                'status' => $data['status'] ?? 'firing',
                'summary' => $data['annotations']['summary'] ?? '',
                'description' => $data['annotations']['description'] ?? '',
                'labels' => $data['labels'] ?? [],
                'annotations' => $data['annotations'] ?? [],
                'starts_at' => $data['startsAt'] ?? now(),
                'ends_at' => $data['endsAt'] ?? null,
                'generator_url' => $data['generatorURL'] ?? null,
            ]
        );
    }

    private function handleCriticalAlert(Alert $alert): void
    {
        // Notify all admins immediately
        $admins = User::role('admin')->get();

        Notification::send($admins, new CriticalAlert($alert));

        // Create incident if not exists
        $this->createIncident($alert);

        Log::critical('Critical alert processed', [
            'alert_id' => $alert->id,
            'alert_name' => $alert->name,
            'notified_admins' => $admins->count(),
        ]);
    }

    private function handleWarningAlert(Alert $alert): void
    {
        // Notify on-call engineer
        $onCallUser = $this->getOnCallUser();

        if ($onCallUser) {
            $onCallUser->notify(new WarningAlert($alert));
        }

        Log::warning('Warning alert processed', [
            'alert_id' => $alert->id,
            'alert_name' => $alert->name,
            'on_call_user' => $onCallUser?->id,
        ]);
    }

    private function resolveAlert(Alert $alert): void
    {
        $alert->update([
            'status' => 'resolved',
            'resolved_at' => now(),
        ]);

        // Close related incident if exists
        if ($alert->incident) {
            $alert->incident->update(['status' => 'resolved']);
        }

        Log::info('Alert resolved', [
            'alert_id' => $alert->id,
            'alert_name' => $alert->name,
        ]);
    }

    private function createIncident(Alert $alert): void
    {
        if (!$alert->incident) {
            $alert->incident()->create([
                'title' => $alert->summary,
                'description' => $alert->description,
                'severity' => $alert->severity,
                'status' => 'open',
                'assigned_to' => $this->getOnCallUser()?->id,
            ]);
        }
    }

    private function getOnCallUser(): ?User
    {
        // Implement your on-call rotation logic
        return User::role('admin')->inRandomOrder()->first();
    }
}
```

---

## ✅ **VERIFICACIÓN DEL MÓDULO 3**

### **Checklist de Completitud:**

- [ ] Prometheus + Grafana dashboards funcionando
- [ ] ELK Stack procesando logs correctamente
- [ ] Laravel Telescope configurado con filtros avanzados
- [ ] Custom metrics siendo recolectadas
- [ ] AlertManager enviando notificaciones
- [ ] Performance monitoring activo
- [ ] Health checks respondiendo correctamente
- [ ] Dashboards mostrando métricas en tiempo real

### **Comandos de Verificación:**

```bash
# Verificar servicios de monitoring
docker-compose -f docker-compose.monitoring.yml ps
docker-compose -f docker-compose.elk.yml ps

# Verificar métricas
curl http://localhost:9090/api/v1/query?query=up
curl http://localhost:8000/metrics

# Verificar logs
curl http://localhost:5601/api/status

# Test alert
curl -X POST http://localhost:9093/api/v1/alerts \
  -H "Content-Type: application/json" \
  -d '[{"labels":{"alertname":"test","severity":"warning"}}]'
```

### **URLs de Acceso:**

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)
- **Kibana**: http://localhost:5601
- **AlertManager**: http://localhost:9093
- **Laravel Telescope**: http://localhost:8000/telescope

---

## 🎯 **RESULTADO ESPERADO**

Al finalizar el Módulo 3, tendrás un **sistema de monitoring completo** con:

- ✅ **Métricas en tiempo real** con Prometheus + Grafana
- ✅ **Logging centralizado** con ELK Stack
- ✅ **Debugging avanzado** con Laravel Telescope
- ✅ **Performance monitoring** automático
- ✅ **Alerting inteligente** con escalación
- ✅ **Dashboards profesionales** para diferentes audiencias
- ✅ **Incident management** básico integrado
- ✅ **Historical data** para análisis de tendencias

**¡Increíble! Tu aplicación ahora tiene observabilidad completa y profesional! 📊🚀**

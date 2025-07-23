# 🎯 WorldSkills Laravel API - Multi-stage Dockerfile

# ========== STAGE 1: Base PHP Environment ==========
FROM php:8.2-fpm-alpine AS base

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    build-base \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    sqlite \
    sqlite-dev \
    nodejs \
    npm \
    supervisor

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd \
        pdo \
        pdo_sqlite \
        zip \
        exif \
        pcntl \
        bcmath \
        opcache

# Install Redis extension
RUN apk add --no-cache pcre-dev $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del pcre-dev $PHPIZE_DEPS

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN addgroup -g 1000 www && \
    adduser -u 1000 -G www -s /bin/sh -D www

# ========== STAGE 2: Development Environment ==========
FROM base AS development

# Install development dependencies
RUN apk add --no-cache \
    php8-xdebug

# Copy custom PHP configuration
COPY docker/php/local.ini /usr/local/etc/php/conf.d/local.ini
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Copy application files
COPY --chown=www:www . /var/www/html

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Install Node.js dependencies and build assets
RUN npm install && npm run build

# Set proper permissions
RUN chown -R www:www /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Create SQLite database directory
RUN mkdir -p /var/www/html/database \
    && touch /var/www/html/database/database.sqlite \
    && chown -R www:www /var/www/html/database

# Switch to www user
USER www

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]

# ========== STAGE 3: Production Environment ==========
FROM base AS production

# Install production PHP configuration
COPY docker/php/production.ini /usr/local/etc/php/conf.d/production.ini
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Copy application files
COPY --chown=www:www . /var/www/html

# Install PHP dependencies (production)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Install Node.js dependencies and build assets
RUN npm ci --only=production && npm run build && npm cache clean --force

# Remove development files
RUN rm -rf node_modules \
    && rm -rf .git \
    && rm -rf tests \
    && rm -rf docker \
    && rm package*.json

# Set proper permissions
RUN chown -R www:www /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Create SQLite database directory
RUN mkdir -p /var/www/html/database \
    && touch /var/www/html/database/database.sqlite \
    && chown -R www:www /var/www/html/database

# Optimize Laravel
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Switch to www user
USER www

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]

# ========== STAGE 4: Testing Environment ==========
FROM development AS testing

# Switch back to root for installations
USER root

# Install additional testing tools
RUN apk add --no-cache \
    php8-phpunit \
    php8-pcov

# Install XDebug for code coverage
RUN apk add --no-cache \
    php8-xdebug

# Copy testing configuration
COPY docker/php/testing.ini /usr/local/etc/php/conf.d/testing.ini

# Install all dependencies including dev
RUN composer install --optimize-autoloader --no-interaction

# Switch back to www user
USER www

# Default command runs tests
CMD ["php", "artisan", "test", "--coverage"]

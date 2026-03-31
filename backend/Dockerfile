FROM php:8.2-cli

# Installer les extensions PHP nécessaires
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev \
    libxml2-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip gd

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Dossier de travail
WORKDIR /app

# Copier les fichiers
COPY . .

# Installer les dépendances
RUN composer install --no-dev --optimize-autoloader

# Permissions storage
RUN chmod -R 777 storage bootstrap/cache

# Exposer le port
EXPOSE 10000

# Lancer Laravel
CMD php artisan migrate --force && \
    php artisan db:seed --class=RoleSeeder --force && \
    php artisan db:seed --class=PermissionSeeder --force && \
    php artisan db:seed --class=AdminSeeder --force && \
    php artisan storage:link && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan serve --host=0.0.0.0 --port=10000
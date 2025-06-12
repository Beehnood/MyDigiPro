# Base PHP 8.3 avec Apache
FROM php:8.4-apache

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libicu-dev \
    libzip-dev \
    libonig-dev \
    && docker-php-ext-install intl zip opcache pdo pdo_mysql

# Installer Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Installer Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copier tout le projet
WORKDIR /var/www/html
COPY . .

# Installer les dépendances PHP (back-api)
WORKDIR /var/www/html/back-api
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Installer et builder le frontend (front-cine/)
WORKDIR /var/www/html/front-cine
RUN npm install && npm run build

# Copier les assets compilés vers le dossier public de Symfony
RUN cp -a /var/www/html/front-cine/dist/. /var/www/html/back-api/public/

# Configurer Apache pour Symfony
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/back-api/public|g' /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite
RUN chown -R www-data:www-data /var/www/html/back-api/var /var/www/html/back-api/public

EXPOSE 80
CMD ["apache2-foreground"]

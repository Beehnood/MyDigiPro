# Étape 1 : Image de base avec PHP 8.4 et Apache
FROM php:8.4-apache

# Étape 2 : Installation de Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Étape 3 : Installation des extensions PHP
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions
# Étape 4 : Dépendances système
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    && install-php-extensions \
        ctype \
        iconv \
        pdo \
        pdo_mysql \
        json \
        tokenizer \
        xml \
        dom \
        mbstring \
        zip \
        intl \
        opcache

# Étape 5 : Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Étape 6 : Copie du code source
WORKDIR /var/www/html
COPY . .

# Étape 7 : Installation des dépendances backend
WORKDIR /var/www/html/back-api
RUN composer install --optimize-autoloader

# Étape 8 : Build du frontend React
WORKDIR /var/www/html/front-cine
RUN npm install
RUN npm run build

# Étape 9 : Configuration Apache pour servir React + API
# Copier le build React vers le document root Apache
RUN cp -r build/* /var/www/html/
# Créer un alias pour l'API
RUN echo "Alias /api /var/www/html/back-api/public" >> /etc/apache2/apache2.conf

# Étape 10 : Configuration Apache finale
ENV APACHE_DOCUMENT_ROOT /var/www/html
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN a2enmod rewrite

# Étape 11 : Configuration pour React Router (SPA)
RUN echo '<Directory "/var/www/html">\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    RewriteEngine On\n\
    RewriteCond %{REQUEST_FILENAME} !-f\n\
    RewriteCond %{REQUEST_FILENAME} !-d\n\
    RewriteCond %{REQUEST_URI} !^/api\n\
    RewriteRule . /index.html [L]\n\
</Directory>' >> /etc/apache2/apache2.conf

CMD ["apache2-foreground"]
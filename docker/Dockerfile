# Étape 1 : Image de base avec PHP 8.4 et Apache
FROM php:8.4-apache

# Étape 2 : Installation de Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Étape 3 : Installation des extensions PHP
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions

# Étape 4 : Installation des dépendances et extensions
RUN apt-get update && apt-get install -y \
    git unzip \
    && install-php-extensions \
        pdo_mysql \
        zip \
        intl \
        opcache \
    && rm -rf /var/lib/apt/lists/*

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

# Étape 9 : Vérification du build
RUN ls -la /var/www/html/front-cine/build  # Debug step

# Étape 10 : Déplacement du build
RUN cp -r /var/www/html/front-cine/build /var/www/html/react-build \
    && mv /var/www/html/react-build/* /var/www/html/ \
    && rmdir /var/www/html/react-build

# Étape 10 : Configuration Apache complète
RUN a2enmod rewrite \
    && a2enmod alias

# Configuration du VirtualHost principal
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    \n\
    # Alias pour l API Symfony\n\
    Alias /api /var/www/html/back-api/public\n\
    \n\
    # Configuration pour React (racine)\n\
    <Directory "/var/www/html">\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
        \n\
        # React Router - redirection vers index.html sauf pour /api\n\
        RewriteEngine On\n\
        RewriteCond %{REQUEST_URI} !^/api\n\
        RewriteCond %{REQUEST_FILENAME} !-f\n\
        RewriteCond %{REQUEST_FILENAME} !-d\n\
        RewriteRule . /index.html [L]\n\
    </Directory>\n\
    \n\
    # Configuration pour l API Symfony\n\
    <Directory "/var/www/html/back-api/public">\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
        \n\
        # Configuration Symfony\n\
        DirectoryIndex index.php\n\
        <IfModule mod_negotiation.c>\n\
            Options -MultiViews\n\
        </IfModule>\n\
        \n\
        RewriteEngine On\n\
        RewriteCond %{REQUEST_URI}::$0 ^(/.+)/(.*)::\\2$\n\
        RewriteRule .* - [E=BASE:%1]\n\
        RewriteCond %{HTTP:Authorization} .\n\
        RewriteRule ^ - [E=HTTP_AUTHORIZATION:%0]\n\
        RewriteCond %{ENV:REDIRECT_STATUS} !\n\
        RewriteRule ^index\\.php(?:/(.*)|$) %{ENV:BASE}/$1 [R=301,L]\n\
        RewriteCond %{REQUEST_FILENAME} !-f\n\
        RewriteRule ^ %{ENV:BASE}/index.php [L]\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

CMD ["apache2-foreground"]

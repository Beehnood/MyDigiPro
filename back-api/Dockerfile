FROM dunglas/frankenphp:php8.4

ENV APP_DEBUG=0
ENV APP_ENV=prod
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /app

RUN install-php-extensions \
    pdo_mysql \
    opcache \
    intl \
    zip \
    redis

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./

RUN APP_ENV=prod composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

COPY . .

RUN APP_ENV=prod APP_DEBUG=0 php bin/console cache:clear

RUN composer dump-autoload --optimize

CMD ["sh", "-c", "SERVER_NAME=:${PORT:-8080} frankenphp run --config /etc/caddy/Caddyfile --adapter caddyfile"]

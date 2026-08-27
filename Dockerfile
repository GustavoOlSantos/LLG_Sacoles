FROM php:8.2-apache

WORKDIR /var/www/html/sacoleVendas

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    libpng-dev \
    libzip-dev \
    zlib1g-dev \
    libicu-dev \
    && rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite

RUN docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        gd \
        intl \
        zip \
        opcache

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY . /var/www/html/sacoleVendas

RUN chown -R www-data:www-data /var/www/html/sacoleVendas

EXPOSE 80

CMD ["apache2-foreground"]

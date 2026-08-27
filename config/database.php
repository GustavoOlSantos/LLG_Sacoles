<?php
class Database {
    private static $envLoaded = false;

    public static function getConnection() {
        // Se NÃO estiver no Docker, carrega o arquivo .env (para compatibilidade com XAMPP)
        if (!getenv('DB_HOST') && !self::$envLoaded) {
            $path = dirname(__DIR__) . '/.env';
            if (file_exists($path)) {
                self::loadEnv($path);
            }
            self::$envLoaded = true;
        }

        // Pega as variáveis (que agora vêm ou do Docker ou do .env)
        // Se getenv('DB_HOST') vier vazio, ele usa o 'mysql' que é o nome do container no seu compose
        $host    = getenv('DB_HOST') ?: 'mysql';
        $dbname  = getenv('DB_NAME');
        $user    = getenv('DB_USER');
        $pass    = getenv('DB_PASS');

        try {
            // Força o uso de IP se o host ainda for localhost, para evitar o erro de socket
            if ($host === 'localhost' || $host === '127.0.0.1') {
                $host = '127.0.0.1';
            }

            return new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
        } catch (PDOException $e) {
            die("Erro na conexão: " . $e->getMessage());
        }
    }

    public static function loadEnv($path) {
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) {
                continue;
            }
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value, " \t\n\r\0\x0B\"'");
            
            putenv("{$name}={$value}");
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}
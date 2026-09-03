<?php
class Database {
    private static $envLoaded = false;

    public static function getConnection() {

        if (empty($_SERVER['DB_HOST']) && !getenv('DB_HOST') && !self::$envLoaded) {
            $path = dirname(__DIR__) . '/.env';
            if (file_exists($path)) {
                self::loadEnv($path);
            }
            self::$envLoaded = true;
        }

        $hostRaw = $_SERVER['DB_HOST'] ?? getenv('DB_HOST') ?: 'mysql';
        $dbname  = $_SERVER['DB_NAME'] ?? getenv('DB_NAME');
        $user    = $_SERVER['DB_USER'] ?? getenv('DB_USER');
        $pass    = $_SERVER['DB_PASS'] ?? getenv('DB_PASS');

        $host = $hostRaw;
        $port = '3306';
        if (strpos($hostRaw, ':') !== false) {
            list($host, $port) = explode(':', $hostRaw);
        }

        try {
            if ($host === 'localhost' || $host === '127.0.0.1') {
                $host = '127.0.0.1';
            }

            $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ];

            return new PDO($dsn, $user, $pass, $options);
            
        } catch (PDOException $e) {
            http_response_code(500);
            error_log("Erro de DB: " . $e->getMessage());
            die("Erro na conexão com o banco de dados.");
        }
    }

    public static function loadEnv($path) {
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) continue;
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value, " \t\n\r\0\x0B\"'");
            
            putenv("{$name}={$value}");
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}
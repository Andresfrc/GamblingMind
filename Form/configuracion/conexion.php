<?php
class Database {

    private static $host = "localhost";
    private static $user_name = "root";
    private static $db_name = "CasinoUser";
    private static $password = "";
    private static $charset = "utf8mb4";
    private static $pdo = null;

    // Evita instanciar la clase
    public function __construct(){}
    public function __clone(){}
    public function __wakeup(){}

    public static function connect(){
        if(self::$pdo === null){
            try{
                $dsn = "mysql:host=" . self::$host . ";dbname=" . self::$db_name . ";charset=" . self::$charset;

                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false
                ];

                self::$pdo = new PDO($dsn, self::$user_name, self::$password, $options);

            } catch(PDOException $e){
                die("Error de conexión: " . $e->getMessage());
            }
        }
        return self::$pdo;
    }
}

?>

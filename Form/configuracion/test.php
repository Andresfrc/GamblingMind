<?php
require_once "conexion.php";
try{
    $db = Database::connect();
    echo "Conexion Exitosa";
}
catch(PDOException $e){
    echo "Error de conexion: ".$e -> getMessage();
}
?>
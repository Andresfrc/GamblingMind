<?php


require_once "conexion.php";

try{
    
    $db = Database::connect();

    $email = "dani@add.com";

    
    $consul = $db -> prepare("SELECT * FROM usuario WHERE Correo = :email");
    $consul -> execute([":email" => $email]);

    
    if(!$consul -> fetch()){
        $pass = password_hash("1234", PASSWORD_BCRYPT);

        
        $sql = "INSERT INTO usuario (nombres, Correo, contrasena, rol, telefono) VALUES('Admin', :email, :clave, 'Administrador', '1000000')";

        $consulta = $db -> prepare($sql);
        $consulta -> execute([":email" => $email, ":clave" => $pass]);

        echo "Usuario administrador creado";
    }
    else{
        echo "Usuario administrador ya existe";
    }


}
catch(PDOException $e){
    echo "Error de conexion: ".$e -> getMessage();
}



?>
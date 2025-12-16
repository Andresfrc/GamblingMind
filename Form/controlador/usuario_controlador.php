<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once "../configuracion/conexion.php";
require_once "../modelo/usuario.php";

class Usuario_controlador{
    private $modelo_usuario;

    public function __construct(){

        $this->modelo_usuario = new Usuario();
    }

    public function validar_usuario(){
        if($_SERVER['REQUEST_METHOD'] === 'POST'){

            $usuario = $this->modelo_usuario->login($_POST['correo'], $_POST['contraseña']);

            if($usuario){
                session_start();
                $_SESSION['usuario'] = $usuario;
                
                // Redirige según rol pendiente a esto porque aqui puede estar el error
                if($usuario['rol'] === 'Cliente'){
                    header("Location:../vista/perfil.php");
                } else {
                    header("Location:../vista/perfil_admin.php");
                }
                exit();
            } else {
                session_start();
                $_SESSION['error_message'] = "Credenciales no válidas.";
                header("Location:../vista/Inicio_sesion.php");
                exit();
            }
        } else { 
            header("Location:../vista/Inicio_sesion.php");
            exit();
        }
    }


    public function cerrar_sesion(){
        session_start();
        session_unset();
        session_destroy();
        header("Location: ../vista/Index.php");
        exit();
    }


    public function registrar_usuario(){
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $nombre = $_POST['nombre'];
            $documento = $_POST['documento'];
            $rol = $_POST['rol'];
            $correo = $_POST['correo'];
            $telefono = $_POST['telefono'];
            $contrasena = $_POST['contrasena'];

            $usuario = new Usuario();
            $usuario->crear_usuario($rol, $nombre, $documento, $correo, $telefono, $contrasena);

            session_start();
            $_SESSION['success_message'] = true;
            header("Location: " . $_SERVER['HTTP_REFERER']);
            exit();
        } else { 
            echo "No se pudo registrar";
        }
    }

    // ==========================
    // Obtener o listar todos los usuarios
    // ==========================
    public function obtener_usuarios(){
        $usuario = new Usuario();
        return $usuario->listar_usuarios();
    }

    // ==========================
    // Obtener un usuario por su ID
    // ==========================
    public function obtener_usuario_id($id_usuario){
        $usuario = new Usuario();
        return $usuario->obtener_usuario_id($id_usuario);
    }

    // ==========================
    // Editar usuario existente
    // ==========================
    public function editar_usuario(){
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $id_usuario = $_POST['id_usuario'];
            $nombre = $_POST['nombre'];
            $documento = $_POST['documento'];
            $rol = $_POST['rol'];
            $correo = $_POST['correo'];
            $telefono = $_POST['telefono'];
            $contrasena = $_POST['contrasena'];

            $usuario = new Usuario();
            $usuario->editar_usuario($id_usuario, $nombre, $rol, $documento, $correo, $telefono, $contrasena);

            session_start();
            $_SESSION['success_message'] = true;
            header("Location: " . $_SERVER['HTTP_REFERER']);
            exit();
        } else { 
            echo "No se pudo editar";
        }
    }

    // ==========================
    // Eliminar un usuario
    // ==========================
    public function eliminar_usuario(){
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $id_usuario = $_POST['id_usuario'];

            $usuario = new Usuario();
            $usuario->eliminar_usuario($id_usuario);

            session_start();
            $_SESSION['success_message'] = true;
            header("Location: " . $_SERVER['HTTP_REFERER']);
            exit();
        } else { 
            echo "No se pudo eliminar el usuario";
        }
    }
}
?>

<?php
// Incluimos el archivo que tiene el controlador de usuarios
require_once "../controlador/usuario_controlador.php";

// Creamos una instancia del controlador de usuarios
$controlador = new Usuario_controlador();

// Capturamos la acción que nos llega por la URL (por ejemplo ?accion=login)
$accion = $_GET['accion'] ?? '';

// Según la acción que llegue, ejecutamos la función correspondiente
switch ($accion) {

    case 'login':
        // Validar que el usuario y la contraseña sean correctos
        $controlador->validar_usuario();
        break;

    case 'cerrar':
        // Cerrar la sesión del usuario
        $controlador->cerrar_sesion();
        break;

    case 'registrar':
        // Registrar un nuevo usuario
        $controlador->registrar_usuario();
        break;

    case 'listar':
        // Obtener la lista de todos los usuarios
        $controlador->obtener_usuarios();
        break;

    case 'usuario_id':
        // Obtener información de un usuario específico
        $id_usuario = $_GET['id_usuario'] ?? null;

        if ($id_usuario) {
            // Si nos dan id, buscamos ese usuario
            $resultado = $controlador->obtener_usuario_id($id_usuario);
            // print_r($resultado); // Opcional: imprimir los resultados
        } else {
            // Si no envían id, avisamos
            echo "Falta el parámetro id_usuario.";
        }
        break;

    case 'editar':
        // Editar la información de un usuario
        $controlador->editar_usuario();
        break;

    case 'eliminar':
        // Eliminar un usuario
        $controlador->eliminar_usuario();
        break;

    default:
        // Si la acción no coincide con ninguna conocida, avisamos
        echo "Acción no válida.";
        break;
}
?>

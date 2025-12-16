<?php
require_once "../controlador/usuario_controlador.php";

$usuario_controlador = new Usuario_controlador();
$id_usuario = $_GET['id_usuario'];
$usuario = $usuario_controlador->obtener_usuario_id($id_usuario);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Usuario - GourmetFood</title>
    
    <!-- Bootstrap -->
    <link rel="stylesheet" href="./bootstrap-5.0.2-dist/css/bootstrap.min.css">

    <!-- CSS PALETA E -->
    <link rel="stylesheet" href="./css/editarusuario.css">
</head>
<body>



    <!-- Formulario de edición de usuario -->
    <div class="container contact-container">
        <div class="card card-glass shadow p-4">
            <h2 class="text-center mb-4">Editar Usuario</h2>

            <?php
                if (isset($_SESSION['success_message'])) {
                    echo '<div class="alert alert-success">Información actualizada correctamente - <a href="./perfil.php">Ir a tu Perfil</a></div>';
                    unset($_SESSION['success_message']);
                }
            ?>

            <form action="../controlador/acciones_usuario.php?accion=editar" method="POST">
                <input type='hidden' name='id_usuario' value="<?php echo $usuario[0]['id_usuario']; ?>">

                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre:</label>
                    <input type="text" class="form-control" id="nombre" name="nombre" value="<?php echo $usuario[0]['nombres']; ?>" required>
                </div>

                <div class="mb-3">
                    <label for="documento" class="form-label">Documento:</label>
                    <input type="number" class="form-control" id="documento" name="documento" value="<?php echo $usuario[0]['documento']; ?>" required>
                </div>

                <div class="mb-3">
                    <label for="rol" class="form-label">Rol:</label>
                    <select name="rol" id="rol" class="form-control" required>
                        <option value="" hidden>Seleccionar</option>
                        <option value="Cliente" <?php if($usuario[0]['rol'] == 'Cliente') echo 'selected'; ?>>Cliente</option>
                        <option value="Admin" <?php if($usuario[0]['rol'] == 'Admin') echo 'selected'; ?>>Administrador</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label for="correo" class="form-label">Correo:</label>
                    <input type="email" class="form-control" id="correo" name="correo" value="<?php echo $usuario[0]['correo']; ?>" required>
                </div>

                <div class="mb-3">
                    <label for="contrasena" class="form-label">Contraseña:</label>
                    <input type="password" class="form-control" id="contrasena" name="contrasena" value="<?php echo $usuario[0]['contrasena']; ?>" required>
                </div>

                <div class="mb-3">
                    <label for="telefono" class="form-label">Teléfono:</label>
                    <input type="number" class="form-control" id="telefono" name="telefono" value="<?php echo $usuario[0]['telefono']; ?>" required>
                </div>

                <button type="submit" onclick="return confirmar_edicion()" class="btn btn-neon w-100">Editar</button>
                <button type="button" onclick="cancelar_edicion()" class="btn btn-danger w-100 mt-2">Cancelar</button>
            </form>
        </div>
    </div>

  

<script src="./bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>

<script>
function cancelar_edicion() {
    if(confirm("¿Estás seguro de quieres dejar de editar?")){
        window.location.href = "./perfil.php";
    }
}

function confirmar_edicion() {
    return confirm("¿Estás seguro de quieres editar este usuario?");
}
</script>
</body>
</html>

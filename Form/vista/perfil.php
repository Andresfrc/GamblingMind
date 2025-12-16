<?php
session_start();

// Verificar si usuario está logueado
if (!isset($_SESSION['usuario'])) {
    header("Location: Inicio_sesion.php");
    exit();
}

// Obtener datos del usuario desde sesión
$usuario = $_SESSION['usuario'];

$id_usuario = isset($usuario['id_usuario']) ? $usuario['id_usuario'] : 'Id no disponible';
$nombre = isset($usuario['nombres']) ? $usuario['nombres'] : 'Nombre no disponible';
$documento = isset($usuario['documento']) ? $usuario['documento'] : 'Documento no disponible';
$correo = isset($usuario['correo']) ? $usuario['correo'] : 'Correo no disponible';
$telefono = isset($usuario['telefono']) ? $usuario['telefono'] : 'Teléfono no disponible';
$rol = isset($usuario['rol']) ? $usuario['rol'] : 'Rol no disponible';
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Perfil | GourmetFood</title>
<link rel="stylesheet" href="./bootstrap-5.0.2-dist/css/bootstrap.min.css">
<link rel="stylesheet" href="./css/perfil.css">
</head>
<body class="body-neon">



<!-- Contenedor de información del usuario -->
<div class="container contact-container mt-5">
    <div class="card shadow p-4 neon-card text-center">
        <h2 class="neon-text mb-4">¡Bienvenido, <?php echo htmlspecialchars($nombre); ?>!</h2>

        <div class="user-info">
            <h4 class="neon-text">Nombre</h4>
            <p><?php echo htmlspecialchars($nombre); ?></p>

            <h4 class="neon-text">Documento</h4>
            <p><?php echo htmlspecialchars($documento); ?></p>

            <h4 class="neon-text">Correo</h4>
            <p><?php echo htmlspecialchars($correo); ?></p>

            <h4 class="neon-text">Teléfono</h4>
            <p><?php echo htmlspecialchars($telefono); ?></p>

            <h4 class="neon-text">Rol</h4>
            <p><?php echo htmlspecialchars($rol); ?></p>
        </div>

        <div class="row justify-content-center mt-4">
            <div class="col-auto d-flex gap-2 flex-wrap">
                <a href="../controlador/acciones_usuario.php?accion=cerrar" class="btn btn-neon-red" onclick="return confirmar()">Cerrar Sesión</a>
                <a href="./editar_perfil_usuario.php?id_usuario=<?php echo htmlspecialchars($id_usuario); ?>" class="btn btn-neon-blue ">Editar Perfil</a>
                <a href="http://localhost:5173" class="btn btn-neon-gold">🎰 Casino</a>
            </div>
        </div>
 
    </div>
</div>

<script>
function confirmar() {
    return confirm("¿Estás seguro de que quieres salir?");
}
</script>



<script src="./bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
</body>
</html>

<?php
session_start();

// Verificar si usuario está logueado
if (!isset($_SESSION['usuario'])) {
    header("Location: Inicio_sesion.php");
    exit();
}

// Obtener datos del usuario desde sesión
$usuario = $_SESSION['usuario'];
$nombre = isset($usuario['nombres']) ? $usuario['nombres'] : 'Nombre no disponible';
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Perfil | GourmetFood</title>
<link rel="stylesheet" href="./bootstrap-5.0.2-dist/css/bootstrap.min.css">
<link rel="stylesheet" href="./css/perfiladmin.css">
</head>
<body class="body-neon">




<!-- Contenedor con información del usuario -->
    <div class="container contact-container mt-5">
        <div class="card shadow p-4 neon-card text-center">
            <h2 class="neon-text mb-4">¡Bienvenido, <?php echo htmlspecialchars($nombre); ?>!</h2>
                    <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="./panel_usuarios.php">Usuarios</a></li>
                    <li class="nav-item"><a class="nav-link" href="http://localhost:5173">Casino</a></li>
                </ul>
            <a href="../controlador/acciones_usuario.php?accion=cerrar" class="btn btn-neon-red" onclick="return confirmar()">Cerrar Sesión</a>
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

<?php
session_start();

// Verificar si usuario está logueado
if (isset($_SESSION['usuario'])) {
    $usuario = $_SESSION['usuario'];
    $rol = isset($usuario['rol']) ? $usuario['rol'] : 'Rol no disponible';
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Registro | GourmetFood</title>
<link rel="stylesheet" href="./bootstrap-5.0.2-dist/css/bootstrap.min.css">
<link rel="stylesheet" href="./css/registro.css">
</head>
<body class="body-neon">


<!-- Formulario de registro -->
<div class="container contact-container mt-5">
    <div class="card shadow p-4 neon-card">
        <h2 class="text-center mb-4 neon-text">Registro de Usuario</h2>

        <?php
            if (isset($_SESSION['success_message'])) {
                echo '<div class="alert alert-success neon-text">Registro exitoso - <a href="./Index.php" class="neon-link">Inicia Sesion</a></div>';
                unset($_SESSION['success_message']);
            }
        ?>

        <form action="../controlador/acciones_usuario.php?accion=registrar" method="POST">
            <div class="mb-3">
                <label for="nombre" class="form-label neon-text">Nombre:</label>
                <input type="text" class="form-control neon-input" id="nombre" placeholder="Ingrese un nombre" name="nombre" required>
            </div>
            <div class="mb-3">
                <label for="documento" class="form-label neon-text">Documento:</label>
                <input type="number" class="form-control neon-input" id="documento" placeholder="Ingrese su documento" name="documento" required>
            </div>
            <div class="mb-3">
                <label for="rol" class="form-label neon-text">Rol:</label>
                <select name="rol" id="rol" class="form-control neon-input" required>
                    <option value="Cliente">Cliente</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="correo" class="form-label neon-text">Correo:</label>
                <input type="email" class="form-control neon-input" id="correo" placeholder="Ingrese su correo" name="correo" required>
            </div>
            <div class="mb-3">
                <label for="contrasena" class="form-label neon-text">Contraseña:</label>
                <input type="password" class="form-control neon-input" id="contrasena" placeholder="Ingrese la contraseña" name="contrasena" required>
            </div>
            <div class="mb-3">
                <label for="telefono" class="form-label neon-text">Telefono:</label>
                <input type="number" class="form-control neon-input" id="telefono" placeholder="Ingrese el telefono" name="telefono" required>
            </div>
            <div class="mb-3 neon-text">
                <a href="./Index.php" class="neon-link">¿Ya tienes cuenta?</a>
            </div>

            <button type="submit" class="btn btn-neon-blue w-100">Registrar</button>
        </form>
    </div>
</div>



<script src="./bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
</body>
</html>

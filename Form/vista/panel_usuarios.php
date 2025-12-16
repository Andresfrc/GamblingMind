<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Usuarios | GourmetFood</title>
<link rel="stylesheet" href="./bootstrap-5.0.2-dist/css/bootstrap.min.css">
<link rel="stylesheet" href="./css/panelusuarios.css">
</head>
<body class="body-neon">

    <div class="container contact-container mt-5">
        <div class="card shadow p-4 neon-card text-center">
                    <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="./perfil.php">Perfil</a></li>
                    <li class="nav-item"><a class="nav-link" href="./perfil_admin.php">Admin</a></li>
                    <li class="nav-item"><a class="nav-link" href="http://localhost:5173">Casino</a></li>
                </ul>
        </div>
    </div>



<!-- Tabla de usuarios -->
<div class="container mt-4">
    <div class="card shadow p-4 neon-card">
        <h2 class="neon-text mb-3">Usuarios</h2>
        <table class="table table-dark neon-table">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Rol</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <?php
                    require_once "../controlador/usuario_controlador.php";
                    $usuario_controlador = new Usuario_controlador();
                    $lista_usuarios = $usuario_controlador->obtener_usuarios();

                    foreach($lista_usuarios as $u){
                        echo "
                        <tr>
                            <td>{$u['id_usuario']}</td>
                            <td>{$u['nombres']}</td>
                            <td>{$u['documento']}</td>
                            <td>{$u['rol']}</td>
                            <td>{$u['correo']}</td>
                            <td>{$u['telefono']}</td>
                            <td><a href='./editar_usuario.php?id_usuario={$u['id_usuario']}' class='btn btn-neon'>Editar</a></td>
                            <td>
                                <form action='../controlador/acciones_usuario.php?accion=eliminar' method='POST'>
                                    <input type='hidden' name='id_usuario' value='{$u['id_usuario']}'>
                                    <button type='submit' class='btn btn-neon-red' onclick='return confirmarEliminar()'>Eliminar</button>
                                </form>
                            </td>
                        </tr>
                        ";
                    }

                    echo '
                        <script>
                            function confirmarEliminar() {
                                return confirm("¿Estás seguro de eliminar este usuario?");
                            }
                        </script>
                    ';
                ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Formulario de registro de usuarios -->
<div class="container contact-container mt-4">
    <div class="card shadow p-4 neon-card">
        <h2 class="text-center neon-text mb-4">Registrar Usuario</h2>
        <?php
            if (isset($_SESSION['success_message'])) {
                echo '<div class="alert alert-success neon-text">Usuario creado</div>';
                unset($_SESSION['success_message']);
            }
        ?>
        <form action="../controlador/acciones_usuario.php?accion=registrar" method="POST">
            <div class="mb-3">
                <label for="nombre" class="form-label neon-text">Nombre:</label>
                <input type="text" class="form-control" id="nombre" placeholder="Ingrese un nombre" name="nombre" required>
            </div>
            <div class="mb-3">
                <label for="documento" class="form-label neon-text">Documento:</label>
                <input type="number" class="form-control" id="documento" placeholder="Ingrese su documento" name="documento" required>
            </div>
            <div class="mb-3">
                <label for="rol" class="form-label neon-text">Rol:</label>
                <select name="rol" id="rol" class="form-control" required>
                    <option value="" hidden>Seleccionar</option>
                    <option value="Cliente">Cliente</option>
                    <option value="Admin">Administrador</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="correo" class="form-label neon-text">Correo:</label>
                <input type="email" class="form-control" id="correo" placeholder="Ingrese su correo" name="correo" required>
            </div>
            <div class="mb-3">
                <label for="contrasena" class="form-label neon-text">Contraseña:</label>
                <input type="password" class="form-control" id="contrasena" placeholder="Ingrese la contraseña" name="contrasena" required>
            </div>
            <div class="mb-3">
                <label for="telefono" class="form-label neon-text">Teléfono:</label>
                <input type="number" class="form-control" id="telefono" placeholder="Ingrese el teléfono" name="telefono" required>
            </div>
            <button type="submit" class="btn btn-neon w-100">Registrar</button>
        </form>
    </div>
</div>



<script src="./bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
</body>
</html>

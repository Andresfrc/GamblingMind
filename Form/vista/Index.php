<?php
session_start();

// Procesar la respuesta de verificación de edad
if (isset($_POST['verificar_edad'])) {
    if ($_POST['verificar_edad'] === 'si') {
        // Mostrar el formulario de login
        // No guardamos en sesión para que pregunte cada vez
    } else {
        // Redirigir a juegos para menores
        header("Location: https://www.juegosfriv.com/");
        exit();
    }
}

// Si NO ha enviado el formulario o seleccionó "NO", mostrar la verificación
if (!isset($_POST['verificar_edad']) || $_POST['verificar_edad'] !== 'si') {
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Verificación de Edad</title>
    </head>
    <body>
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; display: flex; align-items: center; justify-content: center;">
            <div style="background: #222; padding: 40px; border-radius: 10px; text-align: center; max-width: 500px;">
                <h2 style="color: #fff; margin-bottom: 20px;">VERIFICACIÓN DE EDAD</h2>
                <p style="color: #fff; margin-bottom: 30px; font-size: 18px;">
                    Para acceder a este sitio debes ser mayor de 18 años.<br>
                    ¿Eres mayor de edad?
                </p>
                
                <form method="POST" style="display: flex; gap: 20px; justify-content: center;">
                    <button type="submit" name="verificar_edad" value="si" 
                            style="padding: 15px 30px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                        SÍ, SOY MAYOR DE EDAD
                    </button>
                    <button type="submit" name="verificar_edad" value="no" 
                            style="padding: 15px 30px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                        NO, SOY MENOR
                    </button>
                </form>
                
                <p style="color: #ff9900; margin-top: 30px; font-size: 14px;">
                    El juego es entretenimiento para adultos. Juega con responsabilidad.
                </p>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit();
}

// Solo mostrar el formulario de login si seleccionó "SÍ" en ESTA visita
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Inicio de Sesión - GamblingMind</title>
<link rel="stylesheet" href="./bootstrap-5.0.2-dist/css/bootstrap.min.css">
<link rel="stylesheet" href="./css/iniciosesion.css">
</head>
<body class="body-neon">

<div class="container contact-container">
    <div class="card shadow p-4">
        <div class="text-center mb-3">
            <img src="../img/eye-icon.png" alt="GamblingMind Eye" class="login-eye-icon">
        </div>

        <h2 class="text-center mb-4 text-neon">GamblingMind</h2>

        <form action="../controlador/acciones_usuario.php?accion=login" method="POST">
            <div class="mb-3">
                <input type="email" class="form-control login-input" placeholder="Correo" name="correo" required>
            </div>

            <div class="mb-3">
                <input type="password" class="form-control login-input" placeholder="Contraseña" name="contraseña" required>
            </div>

            <button type="submit" class="btn btn-login w-100">Iniciar Sesión</button>

            <button type="button" class="btn btn-register w-100 mt-2" onclick="window.location.href='./Registro.php'">
                Crear Cuenta
            </button>

        </form>

        <?php
        if (isset($_SESSION['error_message'])) {
            echo '<div class="alert alert-danger mt-3 text-center neon-alert">Credenciales inválidas</div>';
            unset($_SESSION['error_message']);
        }
        ?>
    </div>
</div>

<script src="./bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
</body>
</html>
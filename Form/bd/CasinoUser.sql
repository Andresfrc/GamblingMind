CREATE DATABASE IF NOT EXISTS CasinoUser;
USE CasinoUser;

--Parce estos datos son los necesarios que creo que se necesitan para la tabla usuario
CREATE TABLE usuario (
  id_usuario INT(5) NOT NULL AUTO_INCREMENT,
  rol VARCHAR(20),
  nombres VARCHAR(40),
  documento VARCHAR(20),
  telefono VARCHAR(20),
  correo VARCHAR(100),
  contrasena VARCHAR(255),
  PRIMARY KEY (id_usuario),
  UNIQUE KEY (correo),
  UNIQUE KEY (documento)
);

-- Insertar datos de usuarios
INSERT INTO usuario (id_usuario, rol, nombres, documento, telefono, correo, contrasena) VALUES
(4, 'Administrador', 'Admin', NULL, '1000000', 'casino@add.com', '$2y$10$QergCHefSORfuMxwCwrQxev5PA.PRAKJsyLpkzIQ6vMFS580FTNdO'),
(5, 'Cliente', 'Lola', '1234', '1234', 'lola@gmail.com', '$2y$10$M4lw697UNfqlKPA.LKZPoestm8gTzKFA2mJsvm38TiME.sR84o.6.'),
(6, 'Cliente', 'joustin', '123456', '1234567', 'jus@jus.com', '$2y$10$7VtOoh8yg15hCT/UHCJq5O7.0JJhCIPmG4AiofWKiavfvSzzsuZna');

-- Ajustar AUTO_INCREMENT
ALTER TABLE usuario AUTO_INCREMENT = 7;
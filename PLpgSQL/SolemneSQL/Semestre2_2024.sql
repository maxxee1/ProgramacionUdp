

/*----------------------- Creacion de las Tablas -----------------------*/
CREATE TABLE Usuario (
    id_usuario SERIAL,
    nombre VARCHAR(32) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    fecha_registro DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_usuario)
);

CREATE TABLE Publicacion (
    id_publicacion SERIAL,
    id_usuario INT,
    contenido TEXT NOT NULL,
    fecha_publicacion DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_publicacion),
    FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario)
);

CREATE TABLE Comentario (
    id_comentario SERIAL,
    id_publicacion INT,
    id_usuario INT,
    contenido TEXT NOT NULL,
    fecha_comentario DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_comentario),
    FOREIGN KEY (id_publicacion) REFERENCES Publicacion (id_publicacion),
    FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario)
);

CREATE TABLE Amigo_de (
    id_usuario1 INT,
    id_usuario2 INT,
    fecha_inicio DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_usuario1, id_usuario2),
    FOREIGN KEY (id_usuario1) REFERENCES Usuario (id_usuario),
    FOREIGN KEY (id_usuario2) REFERENCES Usuario (id_usuario)
);

CREATE TABLE Reaccion (
    id_reaccion SERIAL,
    id_usuario INT,
    id_publicacion INT,
    tipo_reaccion VARCHAR(12),
    fecha_reaccion DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_reaccion),
    FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario),
    FOREIGN KEY (id_publicacion) REFERENCES Publicacion (id_publicacion)
);


/*----------------------- Insersion de Datos -----------------------*/
INSERT INTO Usuario (nombre, correo) VALUES
('Ana López', 'ana.lopez@example.com'),
('Carlos Pérez', 'carlos.perez@example.com'),
('María García', 'maria.garcia@example.com'),
('Juan Torres', 'juan.torres@example.com');

INSERT INTO Publicacion (id_usuario, contenido) VALUES
(1, 'Mi primera publicación en la plataforma.'),
(2, '¡Qué gran día para aprender SQL!'),
(3, 'Disfrutando del fin de semana en la playa.'),
(4, 'Preparándome para el examen de bases de datos.');

INSERT INTO Comentario (id_publicacion, id_usuario, contenido) VALUES
(1, 2, '¡Felicidades por tu primera publicación!'),
(2, 1, 'Totalmente de acuerdo, SQL es genial.'),
(3, 4, '¡Qué envidia! Disfruta mucho.'),
(4, 3, '¡Suerte en el examen, seguro te va bien!');

INSERT INTO Amigo_de (id_usuario1, id_usuario2) VALUES
(1, 2),
(1, 3),
(2, 4),
(3, 4);

INSERT INTO Reaccion (id_usuario, id_publicacion, tipo_reaccion) VALUES
(2, 1, 'like'),
(3, 2, 'comentario'),
(4, 3, 'like'),
(1, 4, 'dislike');


/*---------------------------- Consultas SQL ----------------------------*/

-- Encontrar el nombre de usuario y cantidad de amigos del usuario con mas conexiones
SELECT Usuario.nombre, COUNT(Amigo_de.id_usuario1) AS cantidad_amigos
FROM Usuario
JOIN Amigo_de ON Usuario.id_usuario = Amigo_de.id_usuario1
GROUP BY Usuario.id_usuario
ORDER BY cantidad_amigos DESC
LIMIT 1;


-- Cantidad de reacciones por tipo, ordenado con la publicacion con mas reacciones
SELECT Publicacion.id_publicacion, Reaccion.tipo_reaccion, COUNT(*) AS cantidad_reacciones
FROM Reaccion
JOIN Publicacion ON Reaccion.id_usuario = Publicacion.id_usuario
GROUP BY Publicacion.id_publicacion, Reaccion.tipo_reaccion
ORDER BY cantidad_reacciones DESC;


-- Listar cada usuario y cantidad de publicaciones (al menos 1 publicacion)
SELECT Usuario.id_usuario, Usuario.nombre, COUNT(Publicacion.id_publicacion) AS cantidad_publicaciones
FROM Usuario
JOIN Publicacion ON Usuario.id_usuario = Publicacion.id_usuario
GROUP BY Usuario.id_usuario, Usuario.nombre
HAVING COUNT(Publicacion.id_publicacion) > 0;


-- Listar cada usuario y contenido de publicaciones en los ultimos 7 dias (ordenadas por fecha)
SELECT Usuario.id_usuario, Usuario.nombre, Publicacion.contenido
FROM Usuario
JOIN Publicacion ON Usuario.id_usuario = Publicacion.id_usuario
WHERE Publicacion.fecha_publicacion BETWEEN '2024-11-22' AND '2024-11-29'
ORDER BY Publicacion.fecha_publicacion DESC;


-- Obtener el numero total de usuarios registrados el ultimo mes
SELECT COUNT(id_usuario) AS cantidad_usuarios
FROM Usuario
WHERE DATE_PART('month', fecha_registro) = 11 AND DATE_PART('year', fecha_registro) = 2024;


/*---------------------------- Manipulacion  ----------------------------*/

--1
ALTER TABLE Usuario
ADD COLUMN activo BOOLEAN DEFAULT TRUE,
ADD COLUMN rol VARCHAR(7) DEFAULT 'usuario';


--2
CREATE TABLE Registro_eventos (
    id_evento INT,
    id_usuario INT,
    tipo_evento TEXT,
    descripcion TEXT,
    fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_evento),
    FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario)
);


/*---------------------------- Procedimientos Almacenados  ----------------------------*/
--1
CREATE OR REPLACE FUNCTION Validar ()
RETURNS TRIGGER 
AS $$
BEGIN
    IF length(new.contenido) > 500 THEN
        RAISE EXCEPTION 'Te pasaste del límite de 500 caracteres, no se pudo actualizar la descripción';
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ValidarT
BEFORE INSERT OR UPDATE ON Publicacion
FOR EACH ROW
EXECUTE FUNCTION Validar();
 

-- Como las tablas no tienen DELETE ON CASCADE se deben borrar las aparicioones manualmente en orden para no violar la relacion referencial en la base de datos
--2
CREATE OR REPLACE PROCEDURE Eliminar_usuario(id_p INT)
AS $$
BEGIN
    DELETE FROM Reaccion WHERE id_usuario = id_p;
    DELETE FROM Amigo_de WHERE id_usuario1 = id_p OR id_usuario2 = id_p;
    DELETE FROM Comentario WHERE id_usuario = id_p;
    DELETE FROM Publicacion WHERE id_usuario = id_p;
    DELETE FROM Usuario WHERE id_usuario = id_p;
END;
$$ LANGUAGE plpgsql;

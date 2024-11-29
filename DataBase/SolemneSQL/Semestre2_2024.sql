

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


/*----------------------- Consultas SQL -----------------------*/

-- Encontrar el nombre de usuario y cantidad de amigos del usuario con mas conexiones
SELECT Usuario.nombre, COUNT(Amigo_de.id_usuario1) AS cantidad_amigos
FROM Usuario
JOIN Amigo_de ON Usuario.id_usuario = Amigo_de.id_usuario1
GROUP BY id_usuario
ORDER BY cantidad_amigos DESC
LIMIT 1;


-- Cantidad de reacciones por tipo, ordenado con la publicacion con mas reacciones
SELECT publicacion.id_publicacion, Reaccion.tipo_reaccion, COUNT(Reaccion.id_reaccion) AS cantidad_reacciones
FROM Reaccion
JOIN Publicacion ON Reaccion.id_usuario = Publicacion.id_usuario
GROUP BY Publicacion.id_publicacion, Reaccion.id_reaccion
ORDER BY cantidad_reacciones DESC;
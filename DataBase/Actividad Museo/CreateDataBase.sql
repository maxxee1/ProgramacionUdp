CREATE TABLE Artista (
    idArtista SERIAL, 
    nombre VARCHAR(32) NOT NULL UNIQUE,
    nacimiento DATE,
    edad INT,
    estilo VARCHAR(32),
    PRIMARY KEY (idArtista)
);

CREATE TABLE Pieza_Arte (
    idPieza SERIAL, 
    titulo VARCHAR(32) NOT NULL,
    idArtista INT NOT NULL, 
    ano INT,
    tipo_arte VARCHAR(32),
    precio INT,
    PRIMARY KEY (idPieza),
    FOREIGN KEY (idArtista) REFERENCES Artista(idArtista)
);

CREATE TABLE Grupo (
    id SERIAL,
    nombre_grupo VARCHAR(32) NOT NULL UNIQUE,
    descripcion VARCHAR(64),
    PRIMARY KEY (id)
);

CREATE TABLE Pertenece (
    id_grupo INT NOT NULL,
    idPieza INT NOT NULL,
    PRIMARY KEY (id_grupo, idPieza),
    FOREIGN KEY (id_grupo) REFERENCES Grupo(id),
    FOREIGN KEY (idPieza) REFERENCES Pieza_Arte(idPieza)
);

INSERT INTO Artista(nombre, nacimiento, edad, estilo) 
VALUES
('maxxocrack', '2004-01-01', 20, 'inside'),
('matimoyo', '2000-01-01', 80, 'sagitario'),
('Luchito', '0001-01-01', 1, 'god'),
('gabo', '1900-01-01', 88, 'goofy');

INSERT INTO Pieza_arte(titulo, nombre_artista, ano, tipo_arte, precio)
VALUES
('La obra maestra', 'maxxocrack', 2024, 'digital', 5000),
('Estilo único', 'matimoyo', 2022, 'abstracto', 3000),
('Infinito poder', 'Luchito', 1, 'escultura', 1000000),
('El payaso', 'gabo', 1950, 'pintura', 1500);

INSERT INTO Grupo(id, nombre_grupo, descripcion)
VALUES
(DEFAULT, 'Artistas Futuristas', 'Grupo de artistas con visión del futuro'),
(DEFAULT, 'Realistas Clásicos', 'Maestros del realismo clásico'),
(DEFAULT, 'Abstractos', 'Artistas enfocados en arte abstracto'),
(DEFAULT, 'Innovadores Digitales', 'Pioneros en arte digital');

INSERT INTO Pertenece(id_grupo, titulo)
VALUES
(1, 'La obra maestra'),
(2, 'Estilo único'),
(3, 'Infinito poder'),
(4, 'El payaso');

Ubicaciones(
id_ubicacion INT PRIMARY KEY,
ciudad VARCHAR(100) NOT NULL,
pais VARCHAR(100) NOT NULL
);

Restaurantes(
id_restaurante INT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
direccion TEXT NOT NULL,
id_ubicacion INT NOT NULL,
FOREIGN KEY (id_ubicacion) REFERENCES Ubicaciones(id_ubicacion)
);

Categorías(
id_categoria INT PRIMARY KEY,
nombre VARCHAR(50) NOT NULL
);

Platos(
id_plato INT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
precio DECIMAL(10, 2) NOT NULL,
id_restaurante INT NOT NULL,
id_categoria INT NOT NULL,
FOREIGN KEY (id_restaurante) REFERENCES Restaurantes(id_restaurante),
FOREIGN KEY (id_categoria) REFERENCES Categorías(id_categoria)
);

Clientes(
id_cliente INT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
correo VARCHAR(150) UNIQUE NOT NULL
);

Valoraciones(
id_valoracion INT PRIMARY KEY,
id_cliente INT NOT NULL,
id_plato INT NOT NULL,
calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
comentario TEXT,
FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
FOREIGN KEY (id_plato) REFERENCES Platos(id_plato)
);
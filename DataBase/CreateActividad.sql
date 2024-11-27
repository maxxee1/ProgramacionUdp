CREATE TABLE Cliente (
    idCliente INT,
    Nombre VARCHAR(50),
    Direccion VARCHAR(200),
    Telefono VARCHAR(9),
    Ciudad VARCHAR(20),
    PRIMARY KEY (idCliente)
);


CREATE TABLE Producto (
    idProducto INT,
    descripcion VARCHAR(200),
    precio INT,
    PRIMARY KEY (idProducto)
);


CREATE TABLE Venta (
    idVenta INT,
    idProducto INT,
    idCliente INT,
    Cantidad INT,
    Fecha DATE,
    PRIMARY KEY (idVenta),
    FOREIGN KEY (idProducto) REFERENCES Producto(idProducto),
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
);


INSERT INTO Cliente VALUES (1, 'Pretoriano', 'Temuco 426, Queens', '944781240', 'Santiago');
INSERT INTO Cliente VALUES (2, 'Pectoriano', 'Gimnasio 2233, Santiago', '992548109', 'Santiago');
INSERT INTO Cliente VALUES (3, 'Guido Meza', 'Mitnik 2245, Renca', '941228304', 'Santiago');
INSERT INTO Cliente VALUES (4, 'Jorge Perez', 'Mojon 2', '982350183', 'Antartida');
INSERT INTO Cliente VALUES (5, 'Willy Perez del Anular', 'Kuchen 448', '959273048', 'Villa Baviera');
INSERT INTO Cliente VALUES (6, 'Redro Alcanizo', 'Talavera 811', '933204755', 'Valparaiso');
INSERT INTO Cliente VALUES (7, 'Tato Hernandez', 'Argentina 347', '914238210', 'Valparaiso');
INSERT INTO Cliente VALUES (8, 'Flavio', 'Tortugas 112', '967822193', 'Vallenar');


INSERT INTO Producto VALUES (1, 'Router (ecologico) en forma de pepino', 400000);
INSERT INTO Producto VALUES (2, 'Lentes 3D anti-eclipse', 27000);
INSERT INTO Producto VALUES (3, 'Flaystation 1', 800000);
INSERT INTO Producto VALUES (4, 'Papel higienico reutilizable', 5000);
INSERT INTO Producto VALUES (5, 'Horno-refrigerador', 700000);
INSERT INTO Producto VALUES (6, 'Celular de palo de prepago', 3500);


INSERT INTO Venta VALUES (1, 2, 1, 5, '2021-09-22');
INSERT INTO Venta VALUES (2, 4, 1, 10, '2021-05-08');
INSERT INTO Venta VALUES (3, 6, 1, 1, '2021-08-25');
INSERT INTO Venta VALUES (4, 1, 2, 1, '2021-07-03');
INSERT INTO Venta VALUES (5, 2, 2, 3, '2021-04-07');
INSERT INTO Venta VALUES (6, 3, 2, 1, '2021-09-01');
INSERT INTO Venta VALUES (7, 4, 2, 20, '2021-04-04');
INSERT INTO Venta VALUES (8, 1, 3, 1, '2021-05-01');
INSERT INTO Venta VALUES (9, 4, 3, 3, '2021-06-17');
INSERT INTO Venta VALUES (10, 6, 3, 1, '2021-01-03');
INSERT INTO Venta VALUES (11, 3, 4, 1, '2021-08-01');
INSERT INTO Venta VALUES (12, 5, 4, 1, '2021-08-01');
INSERT INTO Venta VALUES (13, 1, 5, 1, '2021-05-12');
INSERT INTO Venta VALUES (14, 3, 5, 1, '2021-05-12');
INSERT INTO Venta VALUES (15, 6, 5, 1, '2021-05-12');
INSERT INTO Venta VALUES (16, 4, 6, 50, '2021-04-24');
INSERT INTO Venta VALUES (17, 1, 7, 1, '2021-06-11');
INSERT INTO Venta VALUES (18, 3, 7, 1, '2021-06-11');
INSERT INTO Venta VALUES (19, 2, 8, 10, '2021-05-10');
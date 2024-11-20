--Agregar un nuevo cliente: Para registrar un cliente en la base de datos.
CREATE OR REPLACE PROCEDURE addCLiente
  (
    idCliente INT,
    Nombre VARCHAR(50),
    Direccion VARCHAR(200),
    telefono VARCHAR(9),
    Ciudad VARCHAR(20)
  ) LANGUAGE plpgsql
  AS $$
  BEGIN
  INSERT INTO Cliente VALUES (idCliente,Nombre,Direccion,telefono,Ciudad);
  END
  $$;

call addCliente(77, 'Prueba1','Ejercito Libertador', '969613993', 'Santiago');

--Registrar una venta: Para crear una venta asociando un cliente y un producto, 
--actualizando automáticamente el stock si se requiere esa funcionalidad.
CREATE OR REPLACE PROCEDURE addSale(
    p_idProducto INT,
    p_idCliente INT,
    p_Cantidad INT,
    p_Fecha DATE,
    p_idVenta INT
) LANGUAGE plpgsql
AS $$
DECLARE 
    Newstock INT;
BEGIN

    SELECT stock INTO Newstock FROM Producto WHERE idProducto = p_idProducto;

    IF Newstock < p_Cantidad THEN
      RAISE NOTICE 'No hay suficiente stock para realizar la venta.';
    ELSE
      INSERT INTO Venta(idVenta, idProducto, idCliente, Cantidad, Fecha) 
      VALUES (p_idVenta, p_idProducto, p_idCliente, p_Cantidad, p_Fecha);

    UPDATE Producto
    SET stock = stock - p_Cantidad
    WHERE idProducto = p_idProducto;

    RAISE NOTICE 'Venta realizada con éxito.';
    END IF;
END;
$$;

CALL addSale(1, 77, 98, '2099-12-12', 20);
--Actualizar datos de un cliente: Para modificar datos de un cliente existente.
CREATE PROCEDURE editCLiente
  (
    p_idCliente INT,
    p_Nombre VARCHAR(50),
    p_Direccion VARCHAR(200),
    p_Telefono VARCHAR(9),
    P_Ciudad VARCHAR(20),
  ) LANGUAGE plpgsql
  AS $$
  BEGIN
  IF EXISTS (SELECT 1 FROM Cliente WHERE idCliente = p_idCliente) THEN 
  
  UPDATE Cliente
  SET
  idCliente = p_idCliente
  Nombre = p_Nombre
  Direccion = p_Direccion
  Telefono = p_Telefono
  Ciudad = p_Ciudad
  WHERE idCliente = p_idCliente;
  RAISE NOTICE 'Cliente con id % ha sido actualizado.', p_idCliente;
  
  ELSE
  
  RAISE NOTICE 'Cliente con id % no existe.', p_idCliente;
  END IF;
  END;
  $$;

CALL editCliente(1, 'Nuevo Nombre', 'Nueva Dirección 123', '987654321', 'Nueva Ciudad');
--Consultar ventas por cliente: Para obtener el historial de compras de un cliente
--específico.
CREATE OR REPLACE FUNCTION Historial(
    p_idCliente INT
) 
RETURNS TABLE(idVenta INT, idProducto INT, Cantidad INT, Fecha DATE)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT Venta.idVenta, Venta.idProducto, Venta.Cantidad, Venta.Fecha 
    FROM Venta 
    WHERE idCliente = p_idCliente;
END;
$$;

SELECT * FROM Historial(77);

--Calcular el total de ventas en una fecha específica: Para obtener un resumen de
--ventas en una fecha dada.
CREATE OR REPLACE PROCEDURE totalventas (
    p_fecha DATE
) 
LANGUAGE plpgsql
AS $$
DECLARE 
    total INTEGER;
BEGIN
    SELECT COALESCE(SUM(Cantidad), 0) INTO total
    FROM Venta
    WHERE fecha = p_fecha;

    RAISE NOTICE 'El total fue de: %', total;
END;
$$;

CALL totalventas('2021-09-22');

--Obtener el total de ventas de un cliente
CREATE OR REPLACE PROCEDURE totalventasporcliente (
    p_idCliente INT
) 
LANGUAGE plpgsql
AS $$
DECLARE 
    totalCliente INTEGER;
BEGIN
    SELECT COALESCE(SUM(Cantidad), 0) INTO totalCliente
    FROM Venta
    WHERE idCliente = p_idCliente;

    RAISE NOTICE 'El total fue de compras del cliente con ID: %, fue de %', p_idCliente, totalCliente;
END;
$$;

CALL totalventasporcliente(77);

--Eliminar un cliente y sus ventas asociadas
CREATE OR REPLACE PROCEDURE eliminarclienteyventas (
    p_idCliente INT
)
LANGUAGE plpgsql
AS $$
BEGIN

    DELETE FROM Venta
    WHERE idCliente = p_idCliente;


    DELETE FROM Cliente
    WHERE idCliente = p_idCliente;

    RAISE NOTICE 'El cliente con ID % y sus ventas asociadas han sido eliminados.', p_idCliente;
END;
$$;

call eliminarclienteyventas(77);

--Listar productos por precio mínimo y máximo
CREATE OR REPLACE FUNCTION ordenarproducts()
RETURNS TABLE (idProducto INT, precio INT)
language plpgsql AS $$
BEGIN
RETURN QUERY
SELECT Producto.idProducto, Producto.precio
FROM Producto
order by precio;
END
$$;

SELECT * FROM ordenarproducts();

--Actualizar el precio de un producto
CREATE OR REPLACE PROCEDURE editPricebyID
  (
    p_idProducto INT,
    p_precio INT
  ) LANGUAGE plpgsql
  AS $$
  BEGIN
  IF EXISTS (SELECT 1 FROM Producto WHERE p_idProducto = idProducto) THEN 
  
  UPDATE Producto
  SET
  precio = p_precio
  WHERE idProducto = p_idProducto;
  RAISE NOTICE 'Producto con id % ha sido actualizado.', p_idProducto;
  
  ELSE
  
  RAISE NOTICE 'PRODICTO OUTSIDE';
  END IF;
  END;
  $$;

CALL editPricebyID(6,400);
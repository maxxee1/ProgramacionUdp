

/*---------------------- Funciones y Procedimientos solicitados ----------------------*/

/*
1. Agregar un nuevo cliente: Para registrar un cliente en la base de datos.

2. Registrar una venta: Para crear una venta asociando un cliente y un producto,
actualizando automáticamente el stock si se requiere esa funcionalidad.

3. Actualizar datos de un cliente: Para modificar datos de un cliente existente.

4. Consultar ventas por cliente: Para obtener el historial de compras de un cliente
específico.

5. Calcular el total de ventas en una fecha específica: Para obtener un resumen de
ventas en una fecha dada.

6. Obtener el total de ventas de un cliente

7. Eliminar un cliente y sus ventas asociadas

8. Listar productos por precio mínimo y máximo

9. Actualizar el precio de un producto

10. Obtener la cantidad total vendida de un producto

11. Listar clientes por ciudad

12. Insertar un nuevo producto

13. Obtener las ventas de un producto en una fecha específica

14. Calcular el total de ingresos en un rango de fechas

15. Obtener el cliente con más compras en cantidad de productos

16. Crear un procedimiento que permita reajustar todos los precios de los productos de
la BD. Dicho reajuste debe ser porcentual e ingresado como input. Debe utilizar
cursores

17. Crear una función que retorne la cantidad de Clientes que al menos hayan hecho una
compra entre el 1-1-12024 y 31-12-2024, pertenecientes a una ciudad en particular.

18. Implementar un procedimiento, el cual debe crear la tabla premmy(idPremmy int,
descripcion varchar(100), precio int). Esta tabla debe llenarse con aquellas tuplas de
Producto (descripción y precio), en donde el precio sea mayor a 100,000. Debe
utilizar cursores.
*/


/*---------------------- Creacion de Procedimientos y Funciones ----------------------*/

--1
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

--2
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

--3
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

--4
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

--5
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

--6
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

--7
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

--8
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

--9
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




/*------------------------- LLamada de las consultas -------------------------*/

--1
CALL addCliente(77, 'Prueba1','Ejercito Libertador', '969613993', 'Santiago');

--2
CALL addSale(1, 77, 98, '2099-12-12', 20);

-3
CALL editCliente(1, 'Nuevo Nombre', 'Nueva Dirección 123', '987654321', 'Nueva Ciudad');

--4
SELECT * FROM Historial(77);

--5
CALL totalventas('2021-09-22');

--6
CALL totalventasporcliente(77);

--7
CALL eliminarclienteyventas(77);

--8
SELECT * FROM ordenarproducts();

--9
CALL editPricebyID(6,400);
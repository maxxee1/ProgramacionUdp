

/*---------------------- Consultas SQL solicitadas ----------------------*/
/*
1. Nombre y dirección de los clientes, ordenados de manera ascendente por el nombre, que
viven en la ciudad de Valparaíso.

2. Nombre de los clientes que han realizado compras.

3. Nombre y dirección de los clientes de la ciudad de Santiago que han comprado al menos un
producto con un precio mayor a 6000.

4. Id y precio de los productos vendidos entre el 1-Apr-2021 y 1-Sep-2021.

5. Nombre y teléfono del cliente que ha realizado la compra del producto más costoso.

6. Número de ventas a clientes residentes de la ciudad de Vallenar.

7 Por cada producto, mostrar el id y la cantidad de  ́ıtem vendidos.

8 Recaudación total realizada en el mes de Septiembre del 2021.
*/

--1 Version 1
SELECT Nombre, Direccion
FROM Cliente
WHERE TRANSLATE(Ciudad, 'Íí', 'Ii') ILIKE 'Valparaiso'
ORDER BY Nombre;

--1 Version 2
SELECT Nombre, Direccion
FROM Cliente 
WHERE Ciudad LIKE '_alpara_so';

--2
SELECT Cliente.Nombre 
FROM Cliente
JOIN Venta ON Cliente.idCliente = Venta.idCliente;

--3
SELECT DISTINCT Cliente.Nombre, Cliente.Direccion
FROM Cliente
JOIN Venta ON Cliente.idCliente = Venta.idCliente
JOIN Producto ON Producto.idProducto = Venta.idProducto
WHERE Producto.Precio > 6000;

--4
SELECT DISTINCT Producto.precio, Producto.idProducto
FROM Producto
JOIN Venta ON Producto.idProducto = Venta.idProducto
WHERE Fecha BETWEEN '2021-04-01' AND '2021-09-1';

--5
SELECT Cliente.Nombre, Cliente.Telefono
FROM Cliente
JOIN Venta ON Cliente.idCliente = Venta.idCliente
JOIN Producto ON Producto.idProducto = Venta.idProducto
WHERE Producto.precio = (SELECT MAX(Producto.precio) FROM Producto);

--6
SELECT COUNT(Venta.idVenta) as cantidad_de_ventas
FROM Venta
JOIN Cliente ON Cliente.idCliente = Venta.idCliente
WHERE Ciudad ILIKE 'Vallenar';

--7
SELECT idProducto, SUM(Cantidad) AS stock_vendido
FROM Venta
GROUP BY idProducto
ORDER BY idProducto;

--8
SELECT SUM(Venta.Cantidad * Producto.precio) as total_vendidoSep
FROM Venta
JOIN Producto ON Producto.idProducto = Venta.idProducto
WHERE Fecha BETWEEN '2021-09-01' AND '2021-09-30';

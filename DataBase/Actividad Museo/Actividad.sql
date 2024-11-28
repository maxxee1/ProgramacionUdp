/*--------------- Consultas SQL ---------------*/


-- Cantidad de artistas (distintos) que han realizado una pieza de arte entre los anos 2010 y 2020.
SELECT COUNT(DISTINCT nombre_artista) AS numero 
FROM pieza_arte
WHERE ano BETWEEN 2010 AND 2020;


--  Ranking de los grupos con mas obras, de manera descendente.
SELECT COUNT(titulo) AS cantidadObras
FROM pertenece
GROUP BY id_grupo
ORDER BY cantidadObras DESC;


--  Nombre y edad de los artistas que hayan realizado una obra dentro de algun grupo que contenga en la descripcion la palabra retrato.
SELECT DISTINCT nombre_artista, edad
FROM artista
JOIN pieza_arte ON artista.nombre = pieza_arte.nombre_artista
JOIN pertenece ON pieza_arte.titulo = pertenece.titulo
JOIN grupo ON grupo.id = pertenece.id_grupo
WHERE grupo.descripcion ILIKE '%retrato%';


--  Descripcion del grupo que contenga la Pieza de arte con el mayor precio.
SELECT descripcion
FROM grupo
JOIN pertenece ON pertenece.id_grupo = grupo.id
JOIN pieza_arte ON pertenece.titulo = pieza_arte.titulo
WHERE pieza_arte.precio = (SELECT MAX(precio) FROM pieza_arte);


--  Id de los grupos en donde este la obra Estilo único y El payaso
SELECT DISTINCT id_grupo
FROM pertenece
WHERE titulo = 'Estilo único' OR titulo = 'El payaso';


--  Artistas que han realizado al menos 3 piezas de arte.
SELECT nombre_artista
FROM pieza_arte
GROUP BY nombre_artista
HAVING COUNT(titulo) >= 1;


-- Nombre y edad de los artistas que tengan una obra con un precio de al menos 100.00
SELECT DISTINCT artista.nombre, artista.edad
FROM artista
JOIN pieza_arte ON artista.nombre = pieza_arte.nombre_artista
WHERE precio >= 100000;


--  Título de las obras que pertenecen al grupo INSIDES
SELECT pertenece.titulo
FROM pertenece
JOIN grupo ON pertenece.id_grupo = grupo.id
WHERE grupo.nombre_grupo = 'INSIDES';


-- Artistas que no tienen ninguna obra registrada en la galera.
SELECT artista.nombre
FROM artista
LEFT JOIN pieza_arte ON artista.nombre = pieza_arte.nombre_artista
WHERE pieza_arte.nombre_artista IS NULL;


--  Nombre y estilo de los artistas nacidos en el año 1963.
SELECT nombre, estilo
FROM artista
WHERE DATE_PART('year', nacimiento) = 1963;


/*--------------- Procedimientos ---------------*/

--Cambiar el precio de una obra de arte en especifico
CREATE OR REPLACE PROCEDURE actualizarprecio(p_precio int, p_titulo varchar(32))
language plpgsql
AS $$
BEGIN
UPDATE pieza_arte
SET precio = p_precio
WHERE titulo = p_titulo;
END;
$$;

--Exterminar un artista

--Agregar a una tabla extra las obras mas caras 1.000.000
CREATE OR REPLACE PROCEDURE chetarObras()
LANGUAGE plpgsql
AS $$
DECLARE
    cursor_epico CURSOR FOR SELECT titulo, nombre_artista, ano, tipo_arte, precio FROM pieza_artiste;
    c_titulo varchar(32);
    c_nombreart varchar(32);
    c_ano int;
    c_tipo_arte varchar(32);
    c_precio int;
BEGIN    
        CREATE TABLE chetao (
            n_titulo varchar(32),
            n_nombreart varchar(32),
            n_ano int,
            n_tipo_arte varchar(32),
            n_precio int
        );

    OPEN cursor_epico;

    LOOP
        FETCH cursor_epico INTO c_titulo, c_nombreart, c_ano, c_tipo_arte, c_precio;
        EXIT WHEN NOT FOUND;

        IF c_precio > 1000000 THEN
            INSERT INTO chetao (n_titulo, n_nombreart, n_ano, n_tipo_arte, n_precio)
            VALUES (c_titulo, c_nombreart, c_ano, c_tipo_arte, c_precio);
        END IF;
    END LOOP;

    CLOSE cursor_epico;
END;
$$;




/*Crear un trigger que se ejecute al agregar una nueva pieza de arte, de manera que
verifique que el precio de la pieza sea, como mınimo, 100.000. En caso de que el precio
sea inferior, el trigger deber ́a ajustarlo automaticamente a 100.000 */

CREATE OR REPLACE FUNCTION minprice()
RETURNS TRIGGER 
language plpgsql
AS $$
BEGIN

        IF NEW.precio < 100000
             NEW.precio := 100000;
        END IF;

        RETURN NEW;
END;
$$;

CREATE TRIGGER minpriceTrigger
BEFORE INSERT 
ON pieza_arte
FOR EACH ROW 
EXECUTE FUNCTION minprice();




CREATE OR REPLACE FUNCTION nombre_funcion_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Aquí va la lógica del trigger
    RETURN NEW; -- O RETURN OLD, dependiendo del caso
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER nombre_del_trigger
{ BEFORE | AFTER  } { INSERT | UPDATE | DELETE}
ON nombre_tabla
FOR EACH ROW 
EXECUTE FUNCTION nombre_funcion_trigger();





CREATE OR REPLACE FUNCTION procesar_datos()
RETURNS void AS $$
DECLARE
    mi_cursor CURSOR FOR SELECT id, nombre FROM empleados WHERE salario > 50000;
    c_id INT;
    c_nombre VARCHAR(100);
BEGIN
    -- Abrir el cursor
    OPEN mi_cursor;

    -- Recorrer las filas del cursor
    LOOP
        FETCH mi_cursor INTO c_id, c_nombre;
        EXIT WHEN NOT FOUND;

        -- Ejemplo: Registrar la información en una tabla de auditoría
        INSERT INTO auditoria_empleados (empleado_id, nombre, fecha)
        VALUES (c_id, c_nombre, now());
    END LOOP;

    -- Cerrar el cursor
    CLOSE mi_cursor;
END;
$$ LANGUAGE plpgsql;







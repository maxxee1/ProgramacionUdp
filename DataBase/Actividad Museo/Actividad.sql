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



/*--------------Procedimientos------------*/

--cambiar el precio de una obra
CREATE OR REPLACE PROCEDURE actualizarprecio(p_precio int, p_titulo varchar(32))
language plpgsql
as $$

begin
update pieza_arte
set precio = p_precio
WHERE titulo = p_titulo
end 
$$;

--eliminar un artista
CREATE OR REPLACE PROCEDURE destruirArtista(nombre varchar(32))
language plpgsql
as $$
begin 
end
$$;
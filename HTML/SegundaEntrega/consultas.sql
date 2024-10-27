CREATE TABLE IF NOT EXISTS Products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    Price INTEGER,
    stock INTEGER DEFAULT 10,
    image_path TEXT
    description TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    BOOLEAN DEFAULT FALSE,
    money INTEGER DEFAULT 100000
);

CREATE TABlE IF NOT EXISTS Sales (
    id SERIAL PRIMARY KEY,
    Userid INTERGER,
    ammount INTERGER
);

CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES carts(id),
    product_id INT REFERENCES products(id),
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (cart_id, product_id)
);

INSERT INTO Products (name, Price, stock, image_path, description) VALUES
('Kryptonita 97%', 9000, 10, '/resources/Kryptonita97.webp', '10 grs. Kryptonita de laboratorio ultra pura.'),
('Simbionte Klyntar', 200, 10, '/resources/Simbionte.jpg', 'Unico Especimen clase 3 mejorado geneticamente.'),
('Sable oscuro', 300, 10, '/resources/SableOscuro.jpg', 'Fuente de poder ilimitada al portador.'),
('Gas del Joker', 400, 10, '/resources/GasJoker.webp', 'Ultima version compatible con M79 y PGL-65.'),
('Guantelete 12 gemas', 500, 10, '/resources/Guantelete12.jpg', 'Con ultima tegnologia adaptado a gemas multiversales.'),
('Casco Mandalor', 600, 10, '/resources/CascoBeskar.webp', 'Hecho en Beskar, perteneciente a los neocruzados mandalorianos.'),
('Planos mansión Wayne', 700, 10, '/resources/PlanosMansion.webp', 'Planos detallados de las habitaciones secretas y "sotano".'),
('Escudo del capitan America', 800, 10, '/resources/EscudoRoto.jpg', 'Recuperado despues de los sucesos "End Game".'),
('Mapa Estelar', 900, 10, '/resources/MapaEstelar.webp', 'Sofware de navegacion, BIG DATA de todo el universo observable.'),
('Lazo de la verdad', 1000, 10, '/resources/LazoWW.jpg', 'Capaz de himnotizar y exponer deseos de quien sea sometido por este.'),
('Batimovil', 1100, 10, '/resources/Batimovil.jpg', 'Nuevo prototipo con tegnologia para camuflaje de invisivilidad.'),
('USB-Killer', 1200, 10, '/resources/UsbKiller.jpg', 'Condensadores 500M Volts. capaz de vulnerar cualquier hardware.');

INSERT INTO users (name, email) VALUES
('Matias', 'matias@gmail.com')
('Maximiliano', 'maximiliano@gmail.com');

INSERT INTO Sales (Userid, ammount) VALUES

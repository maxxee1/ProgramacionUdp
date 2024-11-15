# Proyecto de Desarrollo Web - Despliegue en AWS EC2

Este proyecto corresponde al desarrollo de una aplicación web que fue desplegada en un servidor EC2 de AWS. A continuación, se describen las características y fases de desarrollo, junto con las actualizaciones más importantes implementadas en la segunda entrega.

## Desplegado en un Servicio EC2 de AWS

- **IP del Servidor:** [123.123.123](http://123.123.123.123)

## Primer Entrega: Aplicación Básica

La primera fase del proyecto incluyó la creación de una aplicación web simple que fue desplegada en una instancia de EC2 de AWS. Las características principales de esta fase fueron:

- Despliegue inicial en AWS EC2.
- La aplicación utilizaba HTML estático y la lógica del servidor estaba "hardcodeada" directamente en las vistas.

## Segunda Entrega: Actualizaciones Importantes

En la segunda entrega se realizaron mejoras significativas al proyecto, entre las que destacan:

### Uso de Express y Motor de Plantillas

- **Framework Express**: Se reemplazó la estructura básica por Express, un framework de Node.js para mejorar la gestión de rutas y middleware.
  
- **Motor de plantillas**: Se integró un motor de plantillas (Handlebars) para eliminar el "hardcodeo" de la lógica en las vistas y mejorar la reutilización de componentes.

> [!TIP]  
> Las vistas ahora se generan dinámicamente a partir de datos extraídos de la base de datos, haciendo más eficiente y mantenible el código.

### Conexión a Base de Datos PostgreSQL

Se integró una base de datos **PostgreSQL** para manejar la persistencia de datos, lo que permitió:

- Almacenar y recuperar datos de forma estructurada.
- Manejar productos, usuarios y otros datos de manera dinámica.

> [!WARNING]  
> Asegúrate de configurar las variables de entorno correctamente para conectar la aplicación a la base de datos. Las credenciales de PostgreSQL no deben ser hardcodeadas.

### Seguridad Mejorada: Cifrado y Autenticación con JWT

Para mejorar la seguridad de la aplicación, se implementaron las siguientes características:

- **Cifrado de contraseñas**: Todas las contraseñas de los usuarios se cifran utilizando bcrypt antes de almacenarse en la base de datos.
  
- **Autenticación con JWT**: Se agregó un sistema de autenticación basado en tokens JWT (JSON Web Tokens) para validar las credenciales de los usuarios y gestionar sesiones de forma segura.

> [!NOTE]  
> Las cookies ahora almacenan tokens JWT tokenizados que se verifican en cada solicitud protegida. Asegúrate de que las rutas protegidas estén adecuadamente validadas.

## Instalación y Configuración

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/usuario/proyecto-web.git
   cd proyecto-web

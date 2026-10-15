# MiTienda API

API REST para la gestion de productos de MiTienda, construida con Express + TypeScript, siguiendo una arquitectura por capas (Route -> Controller -> Service -> Repository -> Base de datos).

## Tecnologias

- Node.js + Express 5
- TypeScript
- PostgreSQL (base de datos)
- Prisma (ORM para hablar con la base de datos)
- Awilix (inyeccion de dependencias)
- Winston (logging)
- dotenv (variables de entorno)

## Requisitos

- Node.js reciente (se desarrollo con la version 24)
- PostgreSQL instalado y funcionando en el puerto 5432

## Instalacion

1. Instalar las dependencias:

    npm install

2. Crear la base de datos en PostgreSQL (con psql o pgAdmin):

    CREATE DATABASE mitienda;

3. Crear un archivo .env en la raiz con (cambiar TU_CONTRASENA por la contrasena del usuario postgres):

    PORT=3000
    NODE_ENV=development
    DATABASE_URL="postgresql://postgres:TU_CONTRASENA@localhost:5432/mitienda"

4. Crear la tabla de productos aplicando las migraciones:

    npx prisma migrate dev

5. Generar el cliente de Prisma (esta carpeta no se sube a Git):

    npx prisma generate

6. Cargar los 3 productos iniciales (solo agrega datos si la tabla esta vacia):

    npx ts-node --transpile-only prisma/seed.ts

## Ejecutar en desarrollo

    npm run dev

## Compilar y ejecutar en produccion

    npm run build
    npm start

## Arquitectura

HTTP Request -> Route -> Controller -> Service -> Repository -> Prisma -> PostgreSQL

- Route: define los endpoints disponibles.
- Controller: recibe la peticion HTTP, llama al Service y devuelve la respuesta.
- Service: contiene la logica de negocio y lanza errores cuando algo no es valido.
- Repository: accede a los datos por medio de Prisma Client.
- Prisma: traduce las consultas a SQL y las envia a PostgreSQL.
- PostgreSQL: guarda los datos de forma permanente en la tabla productos.

Todos los metodos son asincronos (async/await) porque consultar la base de datos toma tiempo.

## Base de datos

- El esquema esta en prisma/schema.prisma (modelo Producto: id, nombre, precio, categoria, stock).
- El historial de cambios de la base esta en prisma/migrations.
- La conexion se crea en src/config/prisma.ts y usa la variable DATABASE_URL del archivo .env.
- El id lo asigna PostgreSQL automaticamente (autoincrement).

## Endpoints

GET /productos - Listar todos los productos
GET /productos/:id - Obtener un producto por id
POST /productos - Crear un producto
PUT /productos/:id - Actualizar un producto
DELETE /productos/:id - Eliminar un producto (responde 204 No Content)

## Pruebas en Postman

Con el servidor corriendo (npm run dev):

- GET http://localhost:3000/productos -> 200, lista de productos
- GET http://localhost:3000/productos/2 -> 200, un producto
- POST http://localhost:3000/productos -> 201, producto creado. Body (raw, JSON): {"nombre":"Pantalon","precio":80000,"categoria":"Ropa","stock":12}
- PUT http://localhost:3000/productos/2 -> 200, producto actualizado. Body (raw, JSON): {"precio":140000}
- DELETE http://localhost:3000/productos/4 -> 204, sin contenido

Casos de error:

- GET /productos/99 -> 404 PRODUCTO_NO_ENCONTRADO
- POST o PUT con "precio": -5 -> 400 PRECIO_INVALIDO

## Manejo de errores

Los errores se lanzan desde el Service usando una clase personalizada AppExeption, y son procesados por un middleware global (error.middleware.ts) que convierte cualquier error en una respuesta HTTP consistente (codigo y mensaje). Las rutas devuelven la promesa del Controller (return) para que Express 5 envie los errores asincronos al middleware.

## Inyeccion de dependencias

El proyecto utiliza Awilix para resolver Controllers, Services y Repositories sin crearlos manualmente con new. Las implementaciones se registran en src/config/container.ts.

## Objetivo

Este proyecto es el backend de MiTienda, construido como ejercicio progresivo para la materia de Desarrollo de Aplicaciones en Dispositivos Moviles. Los datos se guardan en PostgreSQL y se conservan al reiniciar el servidor.
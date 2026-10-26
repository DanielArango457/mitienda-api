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
- Service: contiene la logica de negocio, valida los datos y lanza errores cuando algo no es valido.
- Repository: accede a los datos por medio de Prisma Client.
- Prisma: traduce las consultas a SQL y las envia a PostgreSQL.
- PostgreSQL: guarda los datos de forma permanente en la tabla productos.

Todos los metodos son asincronos (async/await) porque consultar la base de datos toma tiempo.

## Versionado de la API

Las rutas llevan la version en la direccion (/api/v1/...), de modo que una version nueva (por ejemplo /api/v2/...) pueda convivir con la anterior sin romper a quienes ya consumen la API.

- src/server.ts monta el prefijo: app.use("/api/v1", v1Router)
- src/routes/v1/index.ts junta las rutas de la version 1: v1Router.use("/productos", productosRouter)
- src/routes/v1/productos.route.ts define los cinco endpoints de productos

## Base de datos

- El esquema esta en prisma/schema.prisma (modelo Producto: id, nombre, precio, categoria, stock).
- El historial de cambios de la base esta en prisma/migrations.
- La conexion se crea en src/config/prisma.ts y usa la variable DATABASE_URL del archivo .env.
- El id lo asigna PostgreSQL automaticamente (autoincrement) y no se reutiliza.

## Endpoints

GET /api/v1/productos - Listar todos los productos
GET /api/v1/productos/:id - Obtener un producto por id
POST /api/v1/productos - Crear un producto
PUT /api/v1/productos/:id - Actualizar un producto
DELETE /api/v1/productos/:id - Eliminar un producto (responde 204 No Content)

## Validaciones

El Service revisa los datos antes de llegar a la base de datos y responde 400 si algo no es valido:

- El id de la URL debe ser un numero entero positivo.
- El body debe ser un objeto JSON. Solo se aceptan los campos nombre, precio, categoria y stock (cualquier otro campo, incluido id, se rechaza).
- nombre y categoria: texto no vacio.
- precio y stock: numeros enteros entre 0 y 2147483647.
- POST: los cuatro campos son obligatorios.
- PUT: se puede enviar solo una parte de los campos, pero no un body vacio.

## Pruebas en Postman

Con el servidor corriendo (npm run dev):

- GET http://localhost:3000/api/v1/productos -> 200, lista de productos
- GET http://localhost:3000/api/v1/productos/2 -> 200, un producto
- POST http://localhost:3000/api/v1/productos -> 201, producto creado. Body (raw, JSON): {"nombre":"Pantalon","precio":80000,"categoria":"Ropa","stock":12}
- PUT http://localhost:3000/api/v1/productos/2 -> 200, producto actualizado. Body (raw, JSON): {"precio":140000}
- DELETE http://localhost:3000/api/v1/productos/ID -> 204, sin contenido (ID es el que devolvio el POST)

## Errores

Todos los errores responden en JSON con el formato { "code": "...", "message": "..." }:

- 404 PRODUCTO_NO_ENCONTRADO: no existe un producto con ese id
- 404 RUTA_NO_ENCONTRADA: la ruta no existe (por ejemplo /productos sin /api/v1)
- 400 ID_INVALIDO: el id de la URL no es un entero positivo
- 400 JSON_INVALIDO: el body no es un JSON valido
- 400 CUERPO_INVALIDO: el body no es un objeto JSON
- 400 CUERPO_VACIO: PUT sin ningun campo
- 400 CAMPO_NO_PERMITIDO: el body trae un campo que no existe (o intenta cambiar el id)
- 400 NOMBRE_INVALIDO, CATEGORIA_INVALIDA, PRECIO_INVALIDO, STOCK_INVALIDO: el campo falta o no cumple las reglas de Validaciones
- 500 INTERNAL_SERVER_ERROR: error inesperado del servidor

## Manejo de errores

Los errores se lanzan desde el Service usando una clase personalizada AppExeption, y son procesados por un middleware global (error.middleware.ts) que convierte cualquier error en una respuesta HTTP consistente (codigo y mensaje). Las rutas devuelven la promesa del Controller (return) para que Express 5 envie los errores asincronos al middleware. Una peticion a una ruta que no existe tambien termina en ese middleware, y un body con JSON mal escrito se responde con 400.

## Inyeccion de dependencias

El proyecto utiliza Awilix para resolver Controllers, Services y Repositories sin crearlos manualmente con new. Las implementaciones se registran en src/config/container.ts.

## Objetivo

Este proyecto es el backend de MiTienda, construido como ejercicio progresivo para la materia de Desarrollo de Aplicaciones en Dispositivos Moviles. Los datos se guardan en PostgreSQL y se conservan al reiniciar el servidor.
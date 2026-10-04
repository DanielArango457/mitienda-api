# MiTienda API

API REST para la gestion de productos de MiTienda, construida con Express + TypeScript, siguiendo una arquitectura por capas (Route -> Controller -> Service -> Repository -> Data).

## Tecnologias

- Node.js + Express
- TypeScript
- Awilix (inyeccion de dependencias)
- Winston (logging)
- dotenv (variables de entorno)

## Instalacion

npm install

Crear un archivo .env en la raiz con:

PORT=3000
NODE_ENV=development

## Ejecutar en desarrollo

npm run dev

## Compilar y ejecutar en produccion

npm run build
npm start

## Arquitectura

HTTP Request -> Route -> Controller -> Service -> Repository -> Data

- Route: define los endpoints disponibles.
- Controller: recibe la peticion HTTP, llama al Service y devuelve la respuesta.
- Service: contiene la logica de negocio y lanza errores cuando algo no es valido.
- Repository: accede directamente a los datos (por ahora, un arreglo en memoria).
- Data: el almacenamiento actual (sin base de datos todavia).

## Endpoints

GET /productos - Listar todos los productos
GET /productos/:id - Obtener un producto por id
POST /productos - Crear un producto
PUT /productos/:id - Actualizar un producto
DELETE /productos/:id - Eliminar un producto (responde 204 No Content)

## Manejo de errores

Los errores se lanzan desde el Service usando una clase personalizada AppExeption, y son procesados por un middleware global (error.middleware.ts) que convierte cualquier error en una respuesta HTTP consistente.

## Inyeccion de dependencias

El proyecto utiliza Awilix para resolver Controllers, Services y Repositories sin crearlos manualmente con new. Las implementaciones se registran en src/config/container.ts.

## Objetivo

Este proyecto es el backend de MiTienda, construido como ejercicio progresivo para la materia de Desarrollo de Aplicaciones en Dispositivos Moviles. Todavia no incluye base de datos real; los datos viven en memoria mientras el servidor esta corriendo.
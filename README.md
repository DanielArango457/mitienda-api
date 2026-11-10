# MiTienda API

API REST de MiTienda: productos, pedidos y acceso de administrador. Esta construida con Express + TypeScript, siguiendo una arquitectura por capas (Route -> Controller -> Service -> Repository -> Base de datos).

## Enlaces

| Que | Donde |
|---|---|
| API en produccion | https://mitienda-api-5561.onrender.com/api/v1/productos |
| Especificacion OpenAPI | docs/openapi.yaml (en este repositorio) |
| Documentacion (Wiki) | https://github.com/DanielArango457/mitienda-app/wiki |
| App movil | https://github.com/DanielArango457/mitienda-app |
| APK de la app | https://github.com/DanielArango457/mitienda-app/releases/tag/v1.0.0 |

La API en produccion esta en el plan gratuito de Render: si lleva 15 minutos sin uso se duerme y la primera peticion puede tardar cerca de 1 minuto.

## Tecnologias

- Node.js + Express 5
- TypeScript
- PostgreSQL (base de datos)
- Prisma (ORM para hablar con la base de datos)
- Awilix (inyeccion de dependencias)
- JSON Web Token (jsonwebtoken) para la sesion del administrador
- bcryptjs para guardar las contrasenas cifradas
- Winston (logging)
- dotenv (variables de entorno)

## Requisitos

- Node.js reciente (se desarrollo con la version 24)
- PostgreSQL instalado y funcionando en el puerto 5432

## Instalacion

1. Instalar las dependencias:

```
npm install
```

2. Crear la base de datos en PostgreSQL (con psql o pgAdmin):

```
CREATE DATABASE mitienda;
```

3. Crear un archivo .env en la raiz con estas variables (cambiar los valores en mayusculas por los propios):

```
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:TU_CONTRASENA@localhost:5432/mitienda"
JWT_SECRET=UNA_CADENA_LARGA_Y_SECRETA
ADMIN_EMAIL=admin@mitienda.com
ADMIN_PASSWORD=LA_CONTRASENA_DEL_ADMINISTRADOR
CORS_ORIGINS=
```

Tambien hay un archivo .env.example con estas variables y valores de ejemplo.

- JWT_SECRET es obligatorio: sin el, el servidor no arranca. Se puede generar con:
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- ADMIN_EMAIL y ADMIN_PASSWORD definen la cuenta del administrador que crea el seed.
- CORS_ORIGINS es opcional: lista de origenes web permitidos, separados por coma. Si se deja vacia, ningun sitio web externo puede llamar a la API (la app movil no se ve afectada, porque CORS solo aplica a navegadores).
- El archivo .env no se sube a Git.

4. Crear las tablas aplicando las migraciones (este proyecto usa Prisma 7 con un archivo de configuracion propio, por eso se indica --config):

```
npx prisma migrate dev --config prisma7.config.ts
```

5. Generar el cliente de Prisma (esta carpeta no se sube a Git):

```
npx prisma generate --config prisma7.config.ts
```

6. Cargar los datos iniciales (agrega los productos solo si la tabla esta vacia y crea el administrador si no existe):

```
npx ts-node prisma/seed.ts
```

## Ejecutar en desarrollo

```
npm run dev
```

## Compilar y ejecutar en produccion

```
npm run build
npm start
```

## Despliegue en la nube

La API esta desplegada en Render (servicio web, plan gratuito) y la base de datos en Neon (PostgreSQL).

| Campo de Render | Valor |
|---|---|
| Runtime | Node |
| Region | Ohio (US East) |
| Branch | main |
| Build Command | npm install --include=dev && npm run build:prod |
| Start Command | npm start |

Variables de entorno en Render: DATABASE_URL (cadena de Neon), JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD y NODE_ENV=production. No se define PORT: Render lo asigna.

El script build:prod genera el cliente de Prisma, aplica las migraciones, compila el proyecto y ejecuta el seed. Cada vez que se fusiona un cambio en main, Render despliega de nuevo automaticamente.

## Documentacion de la API

- La especificacion OpenAPI 3.0 esta en docs/openapi.yaml. Se puede abrir en https://editor.swagger.io (File > Import URL con https://raw.githubusercontent.com/DanielArango457/mitienda-api/main/docs/openapi.yaml) o importar en Postman.
- La Wiki del proyecto tiene el contexto, los diagramas (casos de uso, secuencia, entidad-relacion, componentes y arquitectura), el analisis de calidad con SonarQube Cloud y la guia de instalacion: https://github.com/DanielArango457/mitienda-app/wiki

## Arquitectura

HTTP Request -> Route -> Controller -> Service -> Repository -> Prisma -> PostgreSQL

- Route: define los endpoints disponibles y que rutas exigen ser administrador.
- Controller: recibe la peticion HTTP, llama al Service y devuelve la respuesta.
- Service: contiene la logica de negocio, valida los datos y lanza errores cuando algo no es valido.
- Repository: accede a los datos por medio de Prisma Client.
- Prisma: traduce las consultas a SQL y las envia a PostgreSQL.
- PostgreSQL: guarda los datos de forma permanente.

Todos los metodos son asincronos (async/await) porque consultar la base de datos toma tiempo.

## Versionado de la API

Las rutas llevan la version en la direccion (/api/v1/...), de modo que una version nueva (por ejemplo /api/v2/...) pueda convivir con la anterior sin romper a quienes ya consumen la API.

- src/server.ts monta el prefijo: app.use("/api/v1", v1Router)
- src/routes/v1/index.ts junta las rutas de la version 1: productos, auth y pedidos
- src/routes/v1/productos.route.ts define los endpoints de productos
- src/routes/v1/auth.route.ts define el login
- src/routes/v1/pedidos.route.ts define los endpoints de pedidos

## Base de datos

El esquema esta en prisma/schema.prisma con cuatro modelos:

- Producto: id, nombre, precio, categoria, stock, imagen (enlace opcional).
- Usuario: id, email (unico), nombre, passwordHash (contrasena cifrada), rol, creadoEn.
- Pedido: id, cliente, telefono, total, creadoEn.
- PedidoItem: cada linea de un pedido (producto, nombre y precio al momento de la compra, cantidad). Si se elimina un producto, sus lineas de pedido se conservan; si se elimina un pedido, se eliminan sus lineas.

Ademas:

- El historial de cambios de la base esta en prisma/migrations.
- La conexion se crea en src/config/prisma.ts y usa la variable DATABASE_URL del archivo .env.
- Los id los asigna PostgreSQL automaticamente (autoincrement) y no se reutilizan.

## Autenticacion

El administrador inicia sesion con correo y contrasena y recibe un token JWT que dura 8 horas. Las rutas protegidas exigen ese token en el encabezado:

```
Authorization: Bearer EL_TOKEN
```

- Los compradores no se registran ni inician sesion: ver productos y crear pedidos es publico.
- Solo existe el rol ADMIN. La cuenta se crea con el seed a partir de ADMIN_EMAIL y ADMIN_PASSWORD.
- La contrasena nunca se guarda en texto plano: se guarda cifrada con bcrypt.

## Endpoints

Publicos:

- GET /api/v1/productos - Listar todos los productos
- GET /api/v1/productos/:id - Obtener un producto por id
- POST /api/v1/auth/login - Iniciar sesion como administrador (devuelve token y usuario)
- POST /api/v1/pedidos - Crear un pedido (descuenta el stock)

Solo administrador (requieren token):

- POST /api/v1/productos - Crear un producto
- PUT /api/v1/productos/:id - Actualizar un producto
- DELETE /api/v1/productos/:id - Eliminar un producto (responde 204 No Content)
- GET /api/v1/pedidos - Listar los pedidos recibidos

## Validaciones

Productos. El Service revisa los datos antes de llegar a la base de datos y responde 400 si algo no es valido:

- El id de la URL debe ser un numero entero positivo.
- El body debe ser un objeto JSON. Solo se aceptan los campos nombre, precio, categoria, stock e imagen (cualquier otro campo, incluido id, se rechaza).
- nombre y categoria: texto no vacio.
- precio y stock: numeros enteros entre 0 y 2147483647.
- imagen (opcional): enlace que empiece por http:// o https://, sin espacios, de maximo 500 caracteres.
- POST: nombre, precio, categoria y stock son obligatorios.
- PUT: se puede enviar solo una parte de los campos, pero no un body vacio.

Pedidos. Solo se aceptan los campos cliente, telefono e items:

- cliente: texto de 2 a 100 caracteres.
- telefono: de 7 a 15 digitos (se permiten un + inicial, espacios y guiones).
- items: lista de 1 a 50 productos. Cada uno lleva productoId (entero positivo) y cantidad (entero de 1 a 1000).
- Si un mismo producto aparece varias veces, las cantidades se suman.
- El cliente no envia precios ni total: el servidor los calcula con los precios reales de la base de datos.
- El pedido se guarda dentro de una transaccion: si algun producto no tiene stock suficiente, no se crea el pedido ni se descuenta nada.

## Pruebas en Postman

Con el servidor corriendo (npm run dev):

- GET http://localhost:3000/api/v1/productos -> 200, lista de productos
- GET http://localhost:3000/api/v1/productos/2 -> 200, un producto
- POST http://localhost:3000/api/v1/auth/login -> 200, devuelve el token. Body (raw, JSON): {"email":"admin@mitienda.com","password":"LA_CONTRASENA"}
- Para las rutas de administrador, en la pestana Authorization elegir el tipo "Bearer Token" y pegar el token recibido.
- POST http://localhost:3000/api/v1/productos -> 201 (con token). Body (raw, JSON): {"nombre":"Pantalon","precio":80000,"categoria":"Ropa","stock":12,"imagen":"https://ejemplo.com/foto.jpg"}
- PUT http://localhost:3000/api/v1/productos/2 -> 200 (con token). Body (raw, JSON): {"precio":140000}
- DELETE http://localhost:3000/api/v1/productos/ID -> 204 (con token). ID es el que devolvio el POST.
- POST http://localhost:3000/api/v1/pedidos -> 201, devuelve el pedido con su total. Body (raw, JSON): {"cliente":"Daniel Prueba","telefono":"3001234567","items":[{"productoId":1,"cantidad":2}]}
- GET http://localhost:3000/api/v1/pedidos -> 200 (con token), lista de pedidos. Sin token responde 401.

## Errores

Todos los errores responden en JSON con el formato { "code": "...", "message": "..." }:

Generales:

- 404 RUTA_NO_ENCONTRADA: la ruta no existe (por ejemplo /productos sin /api/v1)
- 400 JSON_INVALIDO: el body no es un JSON valido
- 400 CUERPO_INVALIDO: el body no es un objeto JSON
- 400 CAMPO_NO_PERMITIDO: el body trae un campo que no existe (o intenta cambiar el id)
- 500 INTERNAL_SERVER_ERROR: error inesperado del servidor

Productos:

- 404 PRODUCTO_NO_ENCONTRADO: no existe un producto con ese id
- 400 ID_INVALIDO: el id de la URL no es un entero positivo
- 400 CUERPO_VACIO: PUT sin ningun campo
- 400 NOMBRE_INVALIDO, CATEGORIA_INVALIDO, PRECIO_INVALIDO, STOCK_INVALIDO, IMAGEN_INVALIDO: el campo falta o no cumple las reglas de Validaciones

Autenticacion:

- 401 CREDENCIALES_INVALIDAS: correo o contrasena incorrectos
- 401 TOKEN_REQUERIDO: la ruta exige token y no se envio
- 401 TOKEN_INVALIDO: el token no es valido o ya vencio
- 403 PERMISO_DENEGADO: el usuario no es administrador

Pedidos:

- 400 CLIENTE_INVALIDO: el nombre del cliente falta o no cumple las reglas
- 400 TELEFONO_INVALIDO: el telefono no tiene entre 7 y 15 digitos
- 400 ITEMS_INVALIDO: items no es una lista o tiene mas de 50 productos
- 400 PEDIDO_VACIO: el pedido no tiene productos
- 400 ITEM_INVALIDO: un producto del pedido no es un objeto o no tiene un productoId valido
- 400 CANTIDAD_INVALIDA: la cantidad no es un entero entre 1 y 1000
- 409 STOCK_INSUFICIENTE: no hay stock suficiente de algun producto

## Manejo de errores

Los errores se lanzan desde el Service usando una clase personalizada AppExeption, y son procesados por un middleware global (error.middleware.ts) que convierte cualquier error en una respuesta HTTP consistente (codigo y mensaje) y lo registra con Winston (warn para errores 4xx y error para el 500). Las rutas devuelven la promesa del Controller (return) para que Express 5 envie los errores asincronos al middleware. Una peticion a una ruta que no existe tambien termina en ese middleware, y un body con JSON mal escrito se responde con 400.

## Inyeccion de dependencias

El proyecto utiliza Awilix para resolver Controllers, Services y Repositories sin crearlos manualmente con new. Las implementaciones se registran en src/config/container.ts.

## Objetivo

Este proyecto es el backend de MiTienda, construido como ejercicio progresivo para la materia de Desarrollo de Aplicaciones en Dispositivos Moviles. Los datos se guardan en PostgreSQL y se conservan al reiniciar el servidor. La aplicacion movil que lo consume esta en el repositorio mitienda-app.
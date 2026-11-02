import * as bcrypt from "bcryptjs";
import { prisma } from "../src/config/prisma";
import { productosData } from "../src/data/productos.data";

async function crearProductos(): Promise<void> {
  const cantidad = await prisma.producto.count();

  if (cantidad > 0) {
    console.log(`La tabla ya tiene ${cantidad} productos. No se agrega nada.`);
    return;
  }

  const datos = productosData.map(({ id, ...resto }) => resto);

  await prisma.producto.createMany({ data: datos });

  console.log(`Se cargaron ${datos.length} productos iniciales.`);
}

async function crearAdministrador(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Faltan ADMIN_EMAIL o ADMIN_PASSWORD en el archivo .env");
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD debe tener mínimo 8 caracteres");
  }

  const existente = await prisma.usuario.findUnique({ where: { email } });

  if (existente) {
    console.log(`El administrador ${email} ya existe. No se crea otro.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.usuario.create({
    data: { email, nombre: "Administrador", passwordHash, rol: "ADMIN" },
  });

  console.log(`Administrador creado: ${email}`);
}

async function main(): Promise<void> {
  await crearProductos();
  await crearAdministrador();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
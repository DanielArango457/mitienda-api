import { prisma } from "../src/config/prisma";
import { productosData } from "../src/data/productos.data";

async function main(): Promise<void> {
  const cantidad = await prisma.producto.count();

  if (cantidad > 0) {
    console.log(`La tabla ya tiene ${cantidad} productos. No se agrega nada.`);
    return;
  }

  const datos = productosData.map(({ id, ...resto }) => resto);

  await prisma.producto.createMany({ data: datos });

  console.log(`Se cargaron ${datos.length} productos iniciales.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
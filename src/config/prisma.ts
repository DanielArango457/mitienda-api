import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida en el archivo .env");
}

const adapter = new PrismaPg({
  connectionString,
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 20000,
});

export const prisma = new PrismaClient({ adapter });
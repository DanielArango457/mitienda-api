import dotenv from "dotenv";
import packageJson from "../../package.json";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET no está definida en el archivo .env");
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  appName: packageJson.name,
  appVersion: packageJson.version,
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  jwtSecret,
};
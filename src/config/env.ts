import dotenv from "dotenv";
import packageJson from "../../package.json";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  appName: packageJson.name,
  appVersion: packageJson.version,
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
};
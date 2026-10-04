import { app } from "./server";
import { env } from "./config/env";
import { logger } from "./config/logger";

app.listen(env.port, () => {
  logger.info(`Servidor corriendo en http://localhost:${env.port}`);
});
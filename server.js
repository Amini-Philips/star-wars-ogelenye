import app from "./index.js";
import keys from "./config/keys.js";
import logger from "./winston.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

try {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.listen(keys.serverPort, () => {
    logger.info(`Star Wars server started on port ${keys.serverPort}..`);
  });
} catch (error) {
  logger.error(`Server startup failed.. ${error}`);
}

import app from "./index.js";
import keys from "./config/keys.js";
import logger from "./winston.js";
import expressOasGenerator from "express-oas-generator";

try {
  expressOasGenerator.init(app, {});

  app.listen(keys.serverPort, () => {
    logger.info(`Star Wars server started on port ${keys.serverPort}..`);
  });
} catch (error) {
  logger.error(`Server startup failed.. ${error}`);
}

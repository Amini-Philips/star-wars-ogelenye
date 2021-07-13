import app from "./index.js";
import keys from "./config/keys.js";
import logger from "./winston.js";

try {
  app.listen(keys.serverPort, () => {
    logger.info(`Star Wars server started on port ${keys.serverPort}..`);
  });
} catch (error) {
  logger.error(`Server startup failed.. ${error}`);
}

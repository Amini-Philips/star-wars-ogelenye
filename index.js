import express from "express";
import apiRoute from "./routes/api.js";
import expressOasGenerator from "express-oas-generator";
import fs from "fs";

// Initialize the Node.js Express Framework
const app = express();

expressOasGenerator.init(app, function (spec) {
  fs.writeFileSync("swagger.json", JSON.stringify(spec));
  return spec;
});

//expressOasGenerator.handleResponses(app, {});

// Tell Express to use its JSON parser with a file limiit of 10MB
app.use(express.json({ limit: "10mb" }));

// Set the default route for the API
app.use("/api/", apiRoute);

export default app;

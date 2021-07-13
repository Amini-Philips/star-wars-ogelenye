import express from "express";
import mongoose from "mongoose";
import sequelize from "./sequelize.js";
import keys from "./config/keys.js";
import axios from "axios";
import MoviePromise from "./models/Movie.js";
import CharacterPromise from "./models/Character.js";
import apiRoute from "./routes/api.js";
import logger from "./winston.js";
import expressOasGenerator from "express-oas-generator";

// Initialize the Node.js Express Framework
const app = express();

expressOasGenerator.init(
  app,
  function (spec) {
    return spec;
  },
  "api-spec.json",
  60 * 1000,
  "api-docs",
  true
);

//expressOasGenerator.handleResponses(app, {});

// Tell Express to use its JSON parser with a file limiit of 10MB
app.use(express.json({ limit: "10mb" }));

// Set the default route for the API
app.use("/api/", apiRoute);

// Connect to MongoDB Database - Star Wars
(async () => {
  try {
    console.log(`Connecting to Movies Database at ${keys.mongoDbURI}`);
    await mongoose.connect(keys.mongoDbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`Star Wars Movies database connected..`);
  } catch (error) {
    logger.error(`Unable to connect to Star Wars Movies database: ${error}`);
  }
})();

// Connect to SQL Database - Star Wars
(async () => {
  try {
    await sequelize;
    logger.console(`Star Wars Fans database connected..`);
  } catch (error) {
    logger.error(`Unable to connect to Star Wars Fans database: ${error}`);
  }
})();

(async () => {
  try {
    const peopleResponse = await axios.get(keys.dataSource.people);
    const filmsResponse = await axios.get(keys.dataSource.films);

    console.log(`Processing People data`);

    const Character = await CharacterPromise;

    let characters = [];
    peopleResponse.data.results.map(async (person) => {
      characters.push(new Character(person));
    });

    await Character.deleteMany({});
    const count = await Character.insertMany(characters);

    console.log(`Finished processing People data..`);

    console.log(`Processing Films data.`);

    const Movie = await MoviePromise;

    let movies = [];
    filmsResponse.data.results.map(async (film) => {
      movies.push(new Movie(film));
    });

    await Movie.deleteMany({});
    await Movie.insertMany(movies);

    console.log(`Finished processing Films data`);
  } catch (error) {
    logger.error(`An error occurred: ${error}`);
  }
})();

//expressOasGenerator.handleRequests();

export default app;

import mongoose from "mongoose";
import sequelize from "./sequelize.js";
import keys from "./config/keys.js";
import axios from "axios";
import MoviePromise from "./models/Movie.js";
import CharacterPromise from "./models/Character.js";
import logger from "./winston.js";
import app from "./index.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Connect to MongoDB Database - Star Wars
(async () => {
  try {
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

try {
  app.listen(keys.serverPort, () => {
    logger.info(`Star Wars server started on port ${keys.serverPort}..`);
  });
} catch (error) {
  logger.error(`Server startup failed.. ${error}`);
}

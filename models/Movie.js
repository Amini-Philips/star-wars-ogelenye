import mongoose from "mongoose";
import keys from "../config/keys.js";
import axios from "axios";
import GenerateSchema from "generate-schema";
import logger from "../winston.js";

const { Schema } = mongoose;

// Fetch data once https://swapi.dev to determine Schema from JSON response
const MoviePromise = new Promise(async (resolve, reject) => {
  try {
    const filmResponse = await axios.get(`${keys.dataSource.films}1`);

    const MovieSchema = new Schema(GenerateSchema.mongoose(filmResponse.data), {
      timestamps: true,
    });

    const Movie = mongoose.model("Movie", MovieSchema);

    console.log(`JSON transformed and Movie Schema generated..`);
    resolve(Movie);
  } catch (error) {
    logger.error(`An error occurred: ${error}`);
  }
});

export default MoviePromise;

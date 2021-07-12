import mongoose from "mongoose";
import keys from "../config/keys.js";
import axios from "axios";
import GenerateSchema from "generate-schema";
import logger from "../winston.js";

const { Schema } = mongoose;

// Fetch data once https://swapi.dev to determine Schema from JSON response

const CharacterPromise = new Promise(async (resolve, reject) => {
  try {
    const peopleResponse = await axios.get(`${keys.dataSource.people}1`);

    const paths = GenerateSchema.mongoose(peopleResponse.data);

    // Modify the generated Mongoose Schema properties because of a bug I noticed.
    paths.height = { type: "String" };
    paths.mass = { type: "String" };
    paths.homeworld = { type: "String" };
    paths.url = { type: "String" };

    const CharacterSchema = new Schema(
      { ...paths },
      {
        timestamps: true,
      }
    );

    const Character = mongoose.model("Character", CharacterSchema);

    console.log(`JSON transformed and Character Schema generated..`);
    resolve(Character);
  } catch (error) {
    logger.error(`An error occurred: ${error}`);
  }
});

export default CharacterPromise;

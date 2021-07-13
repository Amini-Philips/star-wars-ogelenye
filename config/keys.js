// This file contains all configuration settings

//import dotenv from "dotenv";

//dotenv.config();

const keys = {
  mongoDbURI: process.env.STAR_WARS_MOVIE_DB,
  sqlDbURI: process.env.STAR_WARS_FANS_DB,
  serverPort: 5000 || process.env.APP_SERVER_PORT,
  dataSource: {
    films: process.env.FILM_DS,
    people: process.env.PEOPLE_DS,
  },
};

//export default keys;

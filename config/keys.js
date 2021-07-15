// This file contains all configuration settings

const keys = {
  mongoDbURI: process.env.STAR_WARS_MOVIE_DB,
  sqlDbURI: process.env.STAR_WARS_FANS_DB,
  serverPort: process.env.PORT,
  dataSource: {
    films: process.env.FILM_DS,
    people: process.env.PEOPLE_DS,
  },
};

export default keys;

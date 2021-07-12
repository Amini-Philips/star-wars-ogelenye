import Sequelize from "sequelize";
import keys from "./config/keys.js";

const sequelize = new Promise(async (resolve, reject) => {
  try {
    const db = new Sequelize(keys.sqlDbURI);
    await db.authenticate();

    resolve(db);
  } catch (error) {
    console.log(`An error occurred: ${error}`);
  }
});

export default sequelize;

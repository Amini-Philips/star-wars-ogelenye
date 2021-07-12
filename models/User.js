import sequelizePromise from "../sequelize.js";
import DataTypes from "sequelize";
import logger from "../winston.js";

const UserPromise = new Promise(async (resolve, reject) => {
  try {
    const sequelize = await sequelizePromise;

    const User = sequelize.define("User", {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        // Validate this at POST API endpoint
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        // Validate this at POST API endpoint
        type: DataTypes.STRING,
        allowNull: false,
      },
      userid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    await User.sync();

    resolve(User);
  } catch (error) {
    logger.error(`An error occurred in User model: ${error}`);
  }
});

export default UserPromise;

import sequelizePromise from "../sequelize.js";
import DataTypes from "sequelize";
import UserPromise from "./User.js";
import logger from "../winston.js";

const CommentPromise = new Promise(async (resolve, reject) => {
  try {
    const sequelize = await sequelizePromise;

    const User = await UserPromise;

    const Comment = sequelize.define("Comment", {
      movie: {
        type: DataTypes.STRING, // The id of the movie from the Movies Database
        allowNull: false,
      },
      words: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      likes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      dislikes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      commenter: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: User,
          key: "id",
        },
      },
    });

    await Comment.sync();

    resolve(Comment);
  } catch (error) {
    logger.error(`An error occurred in Comment model: ${error}`);
  }
});

export default CommentPromise;

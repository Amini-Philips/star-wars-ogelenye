import Router from "express-promise-router";
import MoviePromise from "../models/Movie.js";
import CommentPromise from "../models/Comment.js";
import CharacterPromise from "../models/Character.js";
import logger from "../winston.js";

const router = Router();

router.use((err, req, res, next) => {
  res.status(403).send(err.message);
});

router.get("/movies/", async (req, res) => {
  try {
    const Movie = await MoviePromise;
    const Comment = await CommentPromise;

    const movies = await Movie.find({})
      .select({ _id: 1, title: 1, release_date: 1, opening_crawl: 1 })
      .sort({ release_date: -1 });

    const mutmovies = await Promise.all(
      movies.map(async (movie) => {
        const count = await Comment.count({
          where: {
            movie: `${movie._id}`,
          },
        });

        movie = { movie, commentCount: count };
        return movie;
      })
    );

    res.json(mutmovies);
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.status(500).json({ message: "Could not retrieve movies" });
  }
});

router.get("/characters/:gender/:sortkey/:sortorder", async (req, res) => {
  try {
    let sortkey;
    let sortorder;

    if (
      req.params.sortkey != null &&
      (req.params.sortkey === "name" || req.params.sortkey === "height")
    ) {
      sortkey = req.params.sortkey;
    } else {
      res.json({
        message: "Please enter a valid sort key (i.e. name or height)",
      });
    }

    if (
      req.params.sortorder != null &&
      (req.params.sortorder === "ASC" || req.params.sortorder === "DESC")
    ) {
      sortorder = req.params.sortorder === "ASC" ? 1 : -1;
    } else {
      res.json({
        message:
          "Please enter a valid sort order (i.e. ASC for ascending or DESC for descending)",
      });
    }

    let sort = {};

    sort[sortkey] = sortorder;

    const Character = await CharacterPromise;

    const characters = await Character.find({
      gender: req.params.gender,
    }).sort(sort);

    const heights = characters.map((character) => {
      return character.height;
    });

    const totalHeight = heights.reduce((totalHeight, characterHeight) => {
      totalHeight = parseInt(totalHeight) + parseInt(characterHeight);
      return totalHeight;
    });

    let feet = totalHeight * 0.0328084;
    feet = (feet + "").split(".");

    let heightInFeet = parseInt(feet[0]);
    let heightInInches = "0." + feet[1];
    heightInInches = parseFloat(heightInInches) * 12;

    const response = {
      characters: characters,
      totalCharacters: characters.length,
      totalHeightsInCm: `${totalHeight} cm`,
      totalHeightsInInches: `${heightInFeet} feet and ${heightInInches} inches`,
    };

    res.json(response);
  } catch (error) {
    logger.error(`An error occurred: ${error}`);
    res.status(500).json({ message: "Could not retrieve characters" });
  }
});

router.get("/comments/:page", async (req, res) => {
  try {
    let page;
    if (
      req.params.page != null &&
      typeof parseInt(req.params.page) === "number"
    ) {
      page = req.params.page;
    } else {
      res.json({
        message: "Please enter a valid page number parameter e.g. 1",
      });
    }

    const Comment = await CommentPromise;

    const comments = await Comment.findAll({
      attributes: [["words", "comment"], "ipAddress", "createdAt"],
      order: [["createdAt", "DESC"]],
      offset: page * 500,
      limit: 500,
    });

    res.json(comments);
  } catch (error) {
    logger.error(`An error occurred: ${error}`);
    res.status(500).json({ message: "Could not retrieve comments" });
  }
});

router.post("/comment/", async (req, res) => {
  try {
    const Comment = await CommentPromise;

    const comment = await Comment.create({
      movie: req.body.movieid,
      words: req.body.words,
      ipAddress: req.body.ipaddress,
    });

    res.json(comment);
  } catch (error) {
    logger.error(`An error occurred: ${error}`);
    res.status(500).json({ message: "Failed to add comment." });
  }
});

export default router;

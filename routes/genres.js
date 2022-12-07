const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");
const router = express.Router();
var morgan = require("morgan");
const admin = require("../middleware/admin");
router.use(morgan("tiny"));
// router.use(express.json())

const genresSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genresSchema);

async function createGenre() {
  const genresArray = ["horror", "action", "drama", "thriller", "animation"];

  for (let g of genresArray) {
    const genre = new Genre({
      name: g,
    });
    const result = await genre.save();
    console.log(result);
  }
}

router.get("/create", (req, res) => {
  createGenre();
  res.status(200).send("DONE");
});

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find();
    res.send(genres);
  } catch (error) {
    res.status(500).send("Something failed.");
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const genreName = await Genre.find({
    _id: id,
  });
  res.send(genreName[0].name);
});

router.post("/add", auth, async (req, res) => {
  const schema = {
    name: Joi.string().min(4).required(),
  };

  console.log(req.body);

  const validation = Joi.validate(req.body, schema);

  const { error } = validation;

  if (error) return res.status(400).send(error.details[0].message);

  const len = await Genre.find().count();

  const genre2add = new Genre({
    _id: len,
    name: req.body.name,
  });

  try {
    const result = await genre2add.save();
    console.log(result);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send(error);
  }
  return res.send(`Successfully added`);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Genre.findOneAndUpdate(
      {
        _id: id,
      },
      req.body,
      { new: true }
    );
    console.log(result);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send(error);
  }

  return res.send(`Successfully changed`);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const id = req.params.id;

  try {
    const foundGenre = await Genre.findOneAndDelete({
      _id: id,
    });
    console.log(foundGenre);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
  return res.send(`Successfully deleted`);
});

module.exports = router;
module.exports.genresSchema = genresSchema;

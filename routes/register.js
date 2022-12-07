const auth = require("../middleware/auth");
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 200,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  const existingName = await User.findOne({
    name,
  });
  if (existingName) {
    return res
      .status(400)
      .send({ message: "Username already taken. Provide another one" });
  }
  const salt = await bcrypt.genSalt(10);

  const newUser = new User({
    name,
    email,
    password: await bcrypt.hash(password, salt),
  });

  const result = await newUser.save();
  const token = newUser.generateAuthToken();
  console.log(result);

  res
    .header("x-auth-token", token)
    .status(200)
    .send(_.pick(result, ["name", "email"]));
});

module.exports = router;
module.exports.User = User;

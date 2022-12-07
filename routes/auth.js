const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User } = require("./register");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({
    email,
  });
  if (!existingUser) {
    return res.status(400).send({
      message: "No user corresponds to that email, please check again",
    });
  }

  const canBeLogged = await bcrypt.compare(password, existingUser.password);

  if (canBeLogged) {
    const token = existingUser.generateAuthToken();
    return res.status(200).send({ message: "User succesfully logged", token });
  } else {
    return res.status(400).send({
      message: "Incorrect password",
    });
  }
});

module.exports = router;

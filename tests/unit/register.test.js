const { User } = require("../../routes/register");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("test", () => {
  it("should do something", () => {
    const payload = { _id: new mongoose.Types.ObjectId(), isAdmin: true };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});

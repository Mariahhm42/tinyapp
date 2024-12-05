//Global user object
const bcrypt = require("bcryptjs");
const users = {
    userRandomID: {
      id: "userRandomID",
      email: "user@example.com",
      password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
    },
    user2RandomID: {
      id: "user2RandomID",
      email: "user2@example.com",
      password: bcrypt.hashSync("dishwasher-funk", 10),
    },
  };

  module.exports = users;
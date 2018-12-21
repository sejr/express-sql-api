const uuid = require("uuid/v4");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("../models/User");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const router = express.Router();

// todo: customize error
const errorMessage = {
  message: "There was an error while handling your request."
};

/**
 * Creates a new user.
 */
router.post("/", (req, res) => {
  const id = uuid();
  const SALT_ROUNDS = 10;
  const { email, password } = req.body;
  bcrypt.hash(password, SALT_ROUNDS).then(hashedPassword => {
    User.sync().then(() => {
      return User.create({ id, email, hashedPassword }).then(user => {
        const token = jwt.sign({ id: user.id }, process.env.API_SECRET, {
          expiresIn: "15m", // Client must re-authenticate after 15m
        });
        res.json({ id, token });
      }).catch(() => {
        res.sendStatus(500);
      });
    });
  }).catch(() => {
    res.sendStatus(500);
  });
});

/**
 * Retrieves a user with a given ID.
 * Does not return their hashed password.
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  User.sync().then(() => {
    User.findOne({
      attributes: ["id", "email"],
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    }).then(user => {
      res.json(user);
    }).catch(() => {
      res.sendStatus(500);
    });
  });
})

/**
 * Deletes a user with a given ID.
 */
router.delete("/:id", (req, res, next) => {
  // We restrict the delete route to clients with a token that matches the ID
  // of the user being deleted.
  try {
    // Fetch authorization header and remove "Bearer " prefix.
    const token = req.headers.authorization.slice(7);

    // Verify the JWT token and retrieve the client ID.
    const { id } = jwt.verify(token, process.env.API_SECRET);

    // Proceed if IDs match, return 401 error otherwise.
    if (id === req.params.id) { 
      next();
    } else {
      res.sendStatus(401);
    }
  } catch(error) {
    res.sendStatus(401);
  }
}, (req, res) => {
  const { id } = req.params;
  User.sync().then(() => {
    return User.destroy({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    }).then(() => {
      res.json({
        id,
        deletedAt: Date.now(),
      });
    });
  });
});

module.exports = router;
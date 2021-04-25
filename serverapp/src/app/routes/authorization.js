const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const HashStregth = 10;
const JwtSecret = "lj4lk5nm4lkflk5nmgm43lş5krds09v8d4s03lş5904po@dvdo5k45l4";

router.post("/signup", (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return res
      .status(500)
      .json({ message: "Username or password can not be empty!" });

  bcrypt.hash(req.body.password, HashStregth).then((hashedPassword) => {
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          message: "An error occured!",
          error: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(500).json({ message: "Username or password can not be empty!" });
    return;
  }

  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Auth failed!" });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({ message: "Auth failed!" });
      }
      // Create JWT
      const token = jwt.sign(
        { id: fetchedUser._id, email: fetchedUser.email },
        JwtSecret,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        message: "Logged in",
        token: token,
        expiresIn: 3600,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(401).json({ message: "Auth failed!" });
    });
});

module.exports = router;

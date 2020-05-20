const express = require("express");
const router = express.Router();
const Passenger = require("../models/Passenger");
const Driver = require("../models/Driver");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  if (req.headers["authorization"]) {
    // Get auth header value
    const bearerHeader = req.headers["authorization"];

    // Check if auth header is undefined
    if (typeof bearerHeader !== undefined) {
      // split at the space
      const bearer = bearerHeader.split(" ");

      // Get token from array
      const bearerToken = bearer[1];

      // Set token onto the req
      req.token = bearerToken;

      // call next
      next();
    } else {
      res.sendStatus(403);
    }
  } else {
    res.json({ message: "there is no jwt token in the header" });
  }
}

// Verify Tokens
router.post("/verify", verifyToken, (req, res) => {
  jwt.verify(req.token, "uber_clone", (err, auth_data) => {
    if (err) {
      if (err.name == "TokenExpiredError") {
        res.json({ message: "Token Expired" });
      } else {
        throw err;
      }
    }
    if (!err) {
      res.json({ message: "Verified" });
    }
  });
});

// Login Route
router.post("/login", (req, res) => {
  const { phone_number, password, type } = req.body;

  // Match User
  if (type == "passenger") {
    Passenger.findOne({ phone_number })
      .then((user) => {
        if (!user) {
          res.json({ message: "phone number is not registered" });
        } else {
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              let x = { phone_number, type: "passenger", name: user.name };
              jwt.sign(x, "uber_clone", { expiresIn: "10h" }, (err, token) => {
                if (err) throw err;
                else
                  res.json({
                    token,
                    phone_number: user.phone_number,
                    name: user.name,
                  });
              });
            } else {
              res.json({ message: "password incorrect" });
            }
          });
        }
      })
      .catch((err) => console.log(err));
  } else if (type == "driver") {
    Driver.findOne({ phone_number })
      .then((user) => {
        if (!user) {
          res.json({ message: "phone number is not registered" });
        } else {
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              let x = { phone_number, type: "driver", name: user.name };
              jwt.sign(x, "uber_clone", { expiresIn: "10h" }, (err, token) => {
                if (err) throw err;
                else {
                  res.json({
                    token,
                    phone_number: user.phone_number,
                    name: user.name,
                  });
                }
              });
            } else {
              res.json({ message: "password incorrect" });
            }
          });
        }
      })
      .catch((err) => console.log(err));
  } else {
    res.json({ message: "wrong user type" });
  }
});

// Register Route
router.post("/register", (req, res) => {
  const { name, phone_number, password, email, type } = req.body;
  if (name == "" || phone_number == "" || password == "") {
    res.json({ message: "Problem with input data" });
  } else {
    if (type == "passenger") {
      Passenger.findOne({ phone_number }).then((user) => {
        if (user) {
          res.json({ message: "Already registered with this phone number" });
        } else {
          const newUser = new Passenger({
            name,
            phone_number,
            password,
            email,
            trip: 0,
          });

          // Hash Passeord
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw user;

              // set password to hash
              newUser.password = hash;

              // save user
              newUser
                .save()
                .then((user) => {
                  // res.status(301).redirect("http://localhost:3000/login");
                  res.json({
                    name: user.name,
                    phone_number: user.phone_number,
                  });
                })
                .catch((err) => console.log(err));
            });
          });
        }
      });
    } else if (type == "driver") {
      const { vehicle, vehicle_number } = req.body;
      Driver.findOne({ phone_number }).then((user) => {
        if (user) {
          res.json({ message: "Already registered with this phone number" });
        } else {
          const newUser = new Driver({
            name,
            phone_number,
            email,
            password,
            vehicle,
            vehicle_number,
          });

          // Hash Passeord
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw user;

              // set password to hash
              newUser.password = hash;

              // save user
              newUser
                .save()
                .then((user) => {
                  res.json({ message: "Ok!" });
                })
                .catch((err) => console.log(err));
            });
          });
        }
      });
    } else {
      res.json({ message: "Choose a user type" });
    }
  }
});

module.exports = router;

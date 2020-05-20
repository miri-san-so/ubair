const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Passenger = require("../models/Passenger");
const Driver = require("../models/Driver");

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

router.get("/", verifyToken, (req, res) => {
  jwt.verify(req.token, "uber_clone", (err, auth_data) => {
    let { phone_number, type } = jwt.decode(req.token);
    if (!err) {
      if (type == "driver") {
        if (phone_number) {
          Driver.findOne(
            { phone_number: phone_number },
            { _id: 0, password: 0, updated_at: 0, __v: 0 },
            (err, user) => {
              res.json(user);
            }
          );
        } else {
          res.json({ message: "JWT Token Doesn't Match This Phone Number" });
        }
      }
      if (type == "passenger") {
        if (phone_number) {
          Passenger.findOne(
            { phone_number: phone_number },
            { _id: 0, password: 0, updated_at: 0, __v: 0 },
            (err, user) => {
              res.json(user);
            }
          );
        } else {
          res.json({ message: "JWT Token Doesn't Match This Phone Number" });
        }
      }
    } else {
      res.sendStatus(404);
      console.log(err.name, err.message);
    }
  });
});

router.get("/driverCar", verifyToken, (req, res) => {
  jwt.verify(
    req.token,
    "5E9FCB5489070102C06A055D804D9A9817E39122CF5F590D",
    (err, auth_data) => {
      if (err) throw err;
      if (auth_data) {
        const { phone_number } = req.body;

        Driver.findOne(
          { phone_number },
          { _id: 0, vehicle: 1, vehicle_number: 1 },
          (err, driver_doc) => {
            res.json(driver_doc);
          }
        );
      }
    }
  );
});
module.exports = router;

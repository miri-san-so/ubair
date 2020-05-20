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

router.put("/", verifyToken, (req, res) => {
  let return_data = [];
  jwt.verify(
    req.token,
    "5E9FCB5489070102C06A055D804D9A9817E39122CF5F590D",
    async (err, auth_data) => {
      if (err) throw err;
      let { internalrequest } = auth_data;
      if (internalrequest) {
        let { type, phone_number, updateQuery } = req.body;
        if (type == "passenger") {
          let x = {};
          for (key in updateQuery) {
            console.log(`${key} => ${updateQuery[key]}`);
            let query = {};
            query[key] = updateQuery[key];
            await Passenger.updateOne({ phone_number }, query, (err, doc) => {
              if (err) throw err;
              x[key] = doc;
            });
          }
          res.json(x);
        } else if (type == "driver") {
          let x = {};
          for (key in updateQuery) {
            console.log(`${key} => ${updateQuery[key]}`);
            let query = {};
            query[key] = updateQuery[key];
            await Driver.updateOne({ phone_number }, query, (err, doc) => {
              if (err) throw err;
              x[key] = doc;
            });
          }
          res.json(x);
        } else {
          res.json({ message: "Invalid User Type" });
        }
      }
    }
  );
});

module.exports = router;

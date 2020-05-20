const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const PassengerSchema = require("../models/Passenger");
const DriverSchema = require("../models/Driver");

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

router.post("/", verifyToken, (req, res) => {
	try {
		jwt.verify(req.token, "uber_clone", (err, auth_data) => {
			if (err) throw err;
			const { phone_number, rating_value } = req.body;

			// IF Request is to Rate Driver
			// that means the Request is By a Passenger
			if (auth_data.type == "passenger") {
				DriverSchema.findOne(
					{ phone_number: phone_number },
					(err, driver_doc) => {
						driver_doc.rating.push(rating_value);
						driver_doc.save().then(() => {
							res.json({ message: "Ok" });
						});
					}
				);
			} else if (auth_data.type == "driver") {
				PassengerSchema.findOne(
					{ phone_number: phone_number },
					(err, passenger_doc) => {
						passenger_doc.rating.push(rating_value);
						passenger_doc.save().then(() => {
							res.json({ message: "Ok" });
						});
					}
				);
			} else {
			}
		});
	} catch (error) {
		console.error(error);
	}
});

module.exports = router;

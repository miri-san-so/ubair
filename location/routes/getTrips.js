const express = require("express");
const jwt = require("jsonwebtoken");
const request = require("request");
const router = express.Router();

const TripSchema = require("../models/TripSchema");

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
		jwt.verify(
			req.token,
			"5E9FCB5489070102C06A055D804D9A9817E39122CF5F590D",
			(err, auth_data) => {
				if (err) throw err;
				if (auth_data.internalrequest == true) {
					const { type, phone_number } = req.body;

					if (type == "passenger") {
						TripSchema.find(
							{ passnegerPhoneNumber: phone_number },
							{},
							{ sort: { created_at: -1 }, limit: 10 },
							(err, doc) => {
								if (err) throw err;
								res.json(doc);
							}
						);
					} else if (type == "driver") {
						TripSchema.find(
							{ driverPhoneNumber: phone_number },
							{},
							{ sort: { created_at: -1 }, limit: 10 },
							(err, doc) => {
								if (err) throw err;
								res.json(doc);
							}
						);
					}
				}
			}
		);
	} catch (error) {
		console.error(error);
	}
});

module.exports = router;

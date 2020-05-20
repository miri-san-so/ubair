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
	jwt.verify(
		req.token,
		"5E9FCB5489070102C06A055D804D9A9817E39122CF5F590D",
		(err, auth_data) => {
			if (err) throw err;
			let { internalrequest } = auth_data;
			if (internalrequest) {
				let { type, phone_number } = req.body;
				if (type == "passenger") {
					Passenger.updateOne(
						{ phone_number: phone_number },
						{ $inc: { trips: 1 } },
						(err, doc) => {
							if (err) throw err;
							if (doc.nModified == 1) {
								res.sendStatus(200);
							}
						}
					);
				} else if (type == "driver") {
					Driver.updateOne(
						{ phone_number: phone_number },
						{ $inc: { trips: 1 } },
						(err, doc) => {
							if (err) throw err;
							if (doc.nModified == 1) {
								res.sendStatus(200);
							}
						}
					);
				}
			} else {
				res.json({ message: "Invalid User Type" });
			}
		}
	);
});

module.exports = router;

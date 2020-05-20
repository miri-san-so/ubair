const express = require("express");
const jwt = require("jsonwebtoken");
const request = require("request");

const router = express.Router();

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
	try {
		jwt.verify(req.token, "uber_clone", (err, auth_data) => {
			const type = auth_data.type;

			if (type == "passenger" || type == "driver") {
				var options = {
					method: "POST",
					url: "http://localhost:4001/getTrips",
					headers: {
						Authorization:
							"Bearer eyJhbGciOiJIUzI1NiIsInR577-9IjoiSldUIn0.eyJpbnRlcm5hbHJlcXVlc3QiOnRydWV9.FTGk1KvpUc5exws-DeSk19jg5w5GcyTsxewYHN_-tio",
						"Content-Type": "application/json",
					},

					body: JSON.stringify({
						type: auth_data.type,
						phone_number: auth_data.phone_number,
					}),
				};
				request(options, (error, response) => {
					if (error) throw new Error(error);
					res.json(JSON.parse(response.body));
				});
			}
		});
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;

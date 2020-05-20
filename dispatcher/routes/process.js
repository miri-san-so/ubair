const express = require("express");
const jwt = require("jsonwebtoken");
const TripSchema = require("../models/TripSchema");
const request = require("request");
const {
	PassengerLocationSchema,
	DriverLocationSchema,
} = require("../models/LocationSchema.js");

const router = new express.Router();

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

router.post("/find", verifyToken, (req, res) => {
	try {
		jwt.verify(req.token, "uber_clone", (err, auth_data) => {
			if (err) throw err;
			else {
				if (auth_data.type == "driver") {
					let x = Number(auth_data.phone_number);
					// Find the driver with the phone number
					DriverLocationSchema.findOne(
						{ phone_number: x },
						(err, driver_doc) => {
							if (err) throw err;
							else if (driver_doc) {
								// Get Drivers district to query passenger
								let pickUp_location = driver_doc.address.district;
								// Query Passenger Based on District i.e. pickup_location
								PassengerLocationSchema.find(
									{ "pickup_location.address.district": pickUp_location },
									{
										_id: 1,
										"pickup_location.address.label": 1,
										"drop_location.address.label": 1,
										trip_distance: 1,
										trip_info: 1,
									},
									(err, passenger_doc) => {
										if (err) throw err;
										else if (passenger_doc.length > 0) {
											res.json(passenger_doc);
										} else {
											pickup_location = driver_doc.address.city;
											PassengerLocationSchema.find(
												{ "pickup_location.address.city": pickup_location },
												{
													_id: 1,
													"pickup_location.address.label": 1,
													"drop_location.address.label": 1,
													trip_distance: 1,
													trip_info: 1,
												},
												(err, passenger_doc) => {
													console.log(passenger_doc);
													if (err) {
														throw err;
													} else if (passenger_doc.length > 0) {
														console.log(passenger_doc);
														res.json(passenger_doc);
													} else {
														res.json({ message: "No Passengers Nearby" });
													}
												}
											);
										}
									}
								);
							} else {
								console.log(driver_doc);
								res.json({ message: "Cant Find Driver, Try Refreshing page" });
							}
						}
					);
				} else {
					res.json({ message: "Wrong User Type" });
				}
			}
		});
	} catch (error) {
		if (error.name == "TokenExpiredError") {
			res.json({ message: "Token Expired" });
		} else {
			res.sendStatus(500);
			let x = new Date();
			console.log(
				`${x.toDateString()} | ${x.toLocaleTimeString()} \n ${error.name} \n ${
					error.message
				}\n${error}`
			);
		}
	}
});

router.post("/getTrip", verifyToken, (req, res) => {
	try {
		jwt.verify(req.token, "uber_clone", (err, auth_data) => {
			if (auth_data.type == "driver") {
				PassengerLocationSchema.findById(
					req.body.id,
					"phone_number name",
					(err, doc) => {
						res.json(doc);
					}
				);
			}
		});
	} catch (error) {
		res.sendStatus(500);
		let x = new Date();
		console.log(
			`[${x.toDateString()} | ${x.toLocaleTimeString()} ]\n${error.name} \n- ${
				error.message
			}\n> ${error}`
		);
	}
});

router.post("/accept", verifyToken, (req, res) => {
	jwt.verify(req.token, "uber_clone", (err, auth_data) => {
		if (err) throw err;
		else {
			if (auth_data.type == "driver") {
				// Increment Driver trips by 1
				var options = {
					method: "PUT",
					url: "http://localhost:4002/incTrip",
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
				request(options, function (error, response) {
					if (error) throw new Error(error);
				});

				// Pop the Driver from the driver location db
				DriverLocationSchema.findOne(
					{ phone_number: auth_data.phone_number },
					(err, driver_doc) => {
						if (err) throw err;
						if (!err) {
							const {
								passengerId,
								driverName,
								driverPhoneNumber,
								trip_distance,
								pickup_label,
								dropoff_label,
								trip_info,
							} = req.body;
							PassengerLocationSchema.findById(
								{ _id: passengerId },
								(err, passenger_doc) => {
									if (err) throw err;
									if (passenger_doc == null) {
										res.json({ message: "Passenger Not Available Anymore" });
									} else {
										const fare = (trip_distance / 1000) * 17;
										let newTrip = new TripSchema({
											passengerId: passengerId,
											driverId: driver_doc._id,
											passnegerName: passenger_doc.name,
											passnegerPhoneNumber: passenger_doc.phone_number,
											driverName,
											driverPhoneNumber,
											trip_distance,
											trip_fare: fare,
											pickup_label,
											dropoff_label,
											trip_info,
											pickup_lat: passenger_doc.pickup_location.lat,
											pickup_long: passenger_doc.pickup_location.long,
											dropoff_lat: passenger_doc.drop_location.lat,
											dropoff_long: passenger_doc.drop_location.long,
										});
										newTrip.save((err, doc) => {
											if (err) throw err;
											res.json(doc);
										});

										passenger_doc.remove();
									}
								}
							);
						}
					}
				);
			} else {
				res.json({ message: "Wrong User Type" });
			}
		}
	});

	// Pop the Passenger from the passenger location db
	// send them each others data
});

router.post("/completed", verifyToken, (req, res) => {
	try {
		jwt.verify(req.token, "uber_clone", (err, auth_data) => {
			if (err) throw err;
			if ((auth_data.type = "driver")) {
				var options = {
					method: "DELETE",
					url: "http://localhost:4001/stop",
					headers: {
						Authorization: "Bearer " + req.token,
					},
				};
				request(options, function (error, response) {
					if (error) throw error;
					if (
						response != undefined &&
						JSON.parse(response.body).message == "Removed From Queue"
					) {
						let { tripId } = req.body;
						console.log(tripId);
						TripSchema.findById(
							tripId,
							{ _id: 0, trip_distance: 1 },
							(err, doc) => {
								if (err) throw err;

								if (doc) {
									const fare = (doc.trip_distance / 1000) * 17;
									console.log(fare);

									res.json({ fare });
								} else {
									res.json({ message: "Couldn't Find Trip" });
								}
							}
						);
					} else {
						console.log(
							`Problem Removing the user\nName  : ${auth_data.name}\nphone : `
						);
					}
				});
			} else if (auth_data.type == "passenger") {
				var options = {
					method: "DELETE",
					url: "http://localhost:4001/stop",
					headers: {
						Authorization: "Bearer " + req.token,
					},
				};
				request(options, function (error, response) {
					if (JSON.parse(response.body).message == "Removed From Queue") {
						let { tripId } = req.body;
						if (error) throw error;
						TripSchema.findOne(
							{ _id: tripId },
							{ _id: 0, trip_distance: 1 },
							(err, doc) => {
								if (err) throw err;

								if (doc) {
									const fare = (doc.trip_distance / 1000) * 17;
									console.log(fare);

									res.json({ fare });
								} else {
									res.json({ message: "Couldn't Find Trip" });
								}
							}
						);
					} else {
						console.log(
							`Problem Removing the user\nName  : ${auth_data.name}\nphone : `
						);
					}
				});
			}
		});
	} catch (error) {
		console.log(error);
	}
});

router.get("/getTrip", verifyToken, (req, res) => {
	try {
		jwt.verify(req.token, "uber_clone", (err, auth_data) => {
			if (err) throw err;
			let id = req.body._id;
			if (auth_data.type == "passenger" || auth_data.type == "driver") {
				TripSchema.findOne({ _id: id }, (err, doc) => {
					if (err) throw err;
					res.json(doc);
				});
			}
		});
	} catch (error) {
		console.error(error);
	}
});

router.post("/cancel", verifyToken, (req, res) => {
	try {
		jwt.verify(req.token, "uber_clone", (err, auth_data) => {
			if (err) throw err;
			let { cancelFare, _id } = req.body;
			if (auth_data.type == "passenger" || auth_data.type == "driver") {
				TripSchema.findOne({ _id }, (err, doc) => {
					if (err) throw err;
					doc.driverCancel = true;
					doc.cancelFare = cancelFare;
					doc.distanceTraveled = Number(
						((Number(cancelFare) / 17) * 1000).toFixed(2)
					);
					doc.save((err, doc) => {
						if (err) throw err;
						res.json(doc);
					});
				});
			}
		});
	} catch (error) {
		console.error(error);
	}
});

module.exports = router;

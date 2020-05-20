const express = require("express");
const jwt = require("jsonwebtoken");
const request = require("request");
const router = express.Router();
const { HERE_REST_API_KEY, HERE_JS_MAPS_API_KEY } = require("../config/keys");

const {
	PassengerLocationSchema,
	DriverLocationSchema,
} = require("../models/LocationSchema");

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
		jwt.verify(req.token, "uber_clone", (err, auth_data) => {
			if (err) {
				res.sendStatus(403);
			} else {
				if (auth_data.type == "passenger") {
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
						console.log(response.body);
					});

					let { lat, long, drop_location, pickup_loc } = req.body;
					let newUser = {};
					newUser.name = auth_data.name;
					newUser.phone_number = auth_data.phone_number;
					newUser.pickup_location = {};
					if (pickup_loc != undefined) {
						if (lat != undefined || long != undefined) {
							res.json({ message: "Wrong input Data" });
							return;
						}
						pickup_loc = pickup_loc.replace(/[,]/g, "%2C").replace(/[ ]/g, "+");
						drop_location = drop_location
							.replace(/[,]/g, "%2C")
							.replace(/[ ]/g, "+");
						request(
							{
								url: `https://geocode.search.hereapi.com/v1/geocode?q=${pickup_loc}&apiKey=${HERE_REST_API_KEY}`,
								method: "GET",
							},
							(err, _res, body) => {
								if (err) throw err;
								newUser.pickup_location = {};
								let response = JSON.parse(body).items[0].position;
								// Pickup Location Co-Ords xx.xxxx, xx.xxxx
								let pickup_location = response["lat"] + "," + response["lng"];
								let y = JSON.parse(body).items[0];
								newUser.pickup_location.address = y.address;
								newUser.pickup_location.lat = y.position.lat;
								newUser.pickup_location.long = y.position.lng;

								request(
									{
										url: `https://geocode.search.hereapi.com/v1/geocode?q=${drop_location}&apiKey=${HERE_REST_API_KEY}`,
										method: "GET",
									},
									(err, _res, body) => {
										if (err) throw err;
										let x = JSON.parse(body).items[0];
										// Drop off Location Co-Ords xx.xxxx, xx.xxxx
										newUser.drop_location = {};
										newUser.drop_location.address = x.address;
										newUser.drop_location.lat = x.position.lat;
										newUser.drop_location.long = x.position.lng;
										let drop_location = x.position.lat + "," + x.position.lng;
										request(
											{
												url: `https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=${HERE_REST_API_KEY}&waypoint0=${pickup_location}&waypoint1=${drop_location}&mode=fastest;car;traffic:enabled&return=summary`,
												method: "POST",
											},
											(err, _res, body) => {
												newUser.name = auth_data.name;
												newUser.phone_number = auth_data.phone_number;
												let trip_info = JSON.parse(body).response.route[0]
													.summary;
												newUser.trip_distance = trip_info.distance;
												newUser.trip_duration = parseFloat(
													(trip_info.travelTime / 60).toFixed(2)
												);
												newUser.trip_info = trip_info.text
													.replace(/<span class="\w{0,}">/g, "")
													.replace(/<[/]span>/g, "");
												PassengerLocationSchema.findOne(
													{ phone_number: newUser.phone_number },
													(err, doc) => {
														if (doc == null) {
															const passenger = new PassengerLocationSchema(
																newUser
															);
															passenger
																.save()
																.then((doc) => {
																	res.json(doc);
																})
																.catch((err) => console.log("112 : ", err));
														} else {
															res.json({ message: "Already Queued" });
														}
													}
												);
											}
										);
									}
								);
							}
						);
					} else {
						// Workin with lat and long and not with location string
						request(
							{
								url: `https://revgeocode.search.hereapi.com/v1/revgeocode?apiKey=${HERE_REST_API_KEY}&at=${lat}%2C${long}&lang=en-US`,
								method: "GET",
							},
							(err, _res, body) => {
								if (err) throw err;
								newUser = {};
								newUser.name = auth_data.name;
								newUser.phone_number = auth_data.phone_number;
								location_data = JSON.parse(body);
								request(
									{
										url: ` https://geocode.search.hereapi.com/v1/geocode?q=${drop_location}&apiKey=${HERE_REST_API_KEY}`,
										method: "GET",
									},
									(err, _res, body_drp) => {
										// Add Pick up information
										let pickup_address = location_data["items"][0]["address"];
										newUser.pickup_location = { address: pickup_address };
										newUser.pickup_location.lat = lat;
										newUser.pickup_location.long = long;

										// Add Drop Locationa
										let drop_location_data = JSON.parse(body_drp);
										if (drop_location_data.items.length == 0) {
											res.json({
												message:
													"Cant Find The Drop Location, Try adding some other nearby location",
											});
										} else {
											let drop_location_address =
												drop_location_data["items"][0]["address"];
											let drop_location_position =
												drop_location_data["items"][0]["position"];
											newUser.drop_location = {
												address: drop_location_address,
											};
											newUser.drop_location.lat = drop_location_position.lat;
											newUser.drop_location.long = drop_location_position.lng;

											let passenger_pickup_location = `${newUser.pickup_location.lat},${newUser.pickup_location.long}`;
											let passenger_drop_location = `${newUser.drop_location.lat},${newUser.drop_location.long}`;

											request(
												{
													url: `https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=${HERE_REST_API_KEY}&waypoint0=${passenger_pickup_location}&waypoint1=${passenger_drop_location}&mode=fastest;car;traffic:enabled&return=summary`,
													method: "POST",
												},
												(err, _res, body) => {
													let trip_info = JSON.parse(body);
													let trip_summary =
														trip_info.response.route[0].summary;
													newUser.trip_distance = trip_summary.distance;
													newUser.trip_duration = parseFloat(
														(trip_summary.travelTime / 60).toFixed(2)
													);
													newUser.trip_info = trip_summary.text
														.replace(/<span class="\w{0,}">/g, "")
														.replace(/<[/]span>/g, "");
													PassengerLocationSchema.findOne(
														{ phone_number: newUser.phone_number },
														(err, doc) => {
															if (doc == null) {
																const passenger = new PassengerLocationSchema(
																	newUser
																);
																passenger
																	.save()
																	.then((doc) => {
																		res.json(doc);
																	})
																	.catch((err) => console.log("194 : ", err));
															} else {
																res.json({ message: "Already Queued" });
															}
														}
													);
												}
											);
										}
									}
								);
							}
						);
					}
				} else if (auth_data.type == "driver") {
					let { lat, long } = req.body;
					request(
						{
							url: `https://revgeocode.search.hereapi.com/v1/revgeocode?apiKey=${HERE_REST_API_KEY}&at=${lat}%2C${long}&lang=en-US`,
							method: "GET",
						},
						(err, _res, body) => {
							newUser = {};
							newUser.name = auth_data.name;
							newUser.phone_number = auth_data.phone_number;
							newUser.lat = parseFloat(lat);
							newUser.long = parseFloat(long);
							location_data = JSON.parse(body);
							newUser.address = location_data["items"][0]["address"];
							const driver = new DriverLocationSchema(newUser);
							DriverLocationSchema.findOne(
								{ phone_number: newUser.phone_number },
								(err, doc) => {
									if (err) throw err;
									if (doc) {
										res.json({ message: "User Already Queued", doc });
									} else {
										driver
											.save()
											.then((doc) => {
												res.json(doc);
											})
											.catch((err) => console.log("236 : ", err));
									}
								}
							);
						}
					);
				} else {
					res.json({ message: "Wrong User Type" });
				}
			}
		});
	} catch (error) {
		console.error(error);
	}
});

router.delete("/stop", verifyToken, (req, res) => {
	try {
		jwt.verify(req.token, "uber_clone", (err, auth_data) => {
			if (err) throw err;
			if (auth_data.type == "passenger") {
				PassengerLocationSchema.findOne(
					{ phone_number: auth_data.phone_number },
					(err, user) => {
						if (err) throw err;
						if (!err) {
							PassengerLocationSchema.deleteOne(
								{ phone_number: auth_data.phone_number },
								(err) => {
									if (err) throw err;
									res.json({ message: "Removed From Queue" });
								}
							);
						} else {
							res.json({ message: "Server Error" });
							console.log("265 : ", err);
						}
					}
				);
			} else if (auth_data.type == "driver") {
				DriverLocationSchema.findOne(
					{ phone_number: auth_data.phone_number },
					(err, user) => {
						if (user) {
							user.remove();
							res.json({ message: "Removed From Queue" });
						}
						if (err) {
							res.json({ message: "Server Error" });
							console.log("277 : ", err);
						}
					}
				);
			} else {
				res.json({ message: "Wrong User Type" });
			}
		});
	} catch (error) {
		console.error(error);
	}
});

router.post("/getPrice", verifyToken, (req, res) => {
	if (
		req.body.lat == "" ||
		req.body.long == "" ||
		req.body.drop_location == ""
	) {
		res.json({ message: "Enter Locations" });
		return;
	}
	jwt.verify(req.token, "uber_clone", (err, auth_data) => {
		if (err) {
			if (err.message === "invalid signature") {
				res.json({ message: "Invalid token" });
			}
			if (err.name === "TokenExpiredError") {
				res.json({ message: "Token Expired" });
			} else {
				throw err;
			}
		}
		if (!err) {
			if (auth_data.type == "passenger" || auth_data.type == "driver") {
				let { pickup_loc, drop_location, lat, long, dropoff } = req.body;
				lat = parseFloat(lat).toFixed(6);
				long = parseFloat(long).toFixed(6);
				if (drop_location != undefined) {
					drop_location = drop_location
						.replace(/[,]/g, "%2C")
						.replace(/[ ]/g, "+");
				}
				if (pickup_loc == undefined) {
					if (dropoff == undefined) {
						request(
							{
								url: `https://geocode.search.hereapi.com/v1/geocode?q=${drop_location}&apiKey=${HERE_REST_API_KEY}`,
								method: "GET",
							},
							(err, _res, body) => {
								if (err) throw err;
								body = JSON.parse(body);
								if (body.status) {
									res.json({ message: "Input Problem" });
									return;
								}
								let dropoff_lat = body.items[0].position.lat;
								let dropoff_long = body.items[0].position.lng;

								request(
									{
										url: `https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=${HERE_JS_MAPS_API_KEY}&waypoint0=geo!${lat},${long}&waypoint1=geo!${dropoff_lat},${dropoff_long}&mode=fastest;car;traffic:disabled&return=summary`,
										method: "POST",
									},
									(err, _res, body) => {
										if (
											JSON.parse(body).subtype != undefined &&
											JSON.parse(body).subtype == "NoRouteFound"
										) {
											res.json({
												message:
													"No Route Found, Please Check Your Pickup and Dropoff Locations",
											});
										} else {
											let price = parseFloat(
												(
													(JSON.parse(body).response.route[0].summary.distance /
														1000) *
													17
												).toFixed(2)
											);
											res.json({ price });
										}
									}
								);
							}
						);
					} else {
						dropoff = dropoff.replace(/[ ]/g, "");
						var options = {
							method: "GET",
							url: `https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=${HERE_JS_MAPS_API_KEY}&waypoint0=geo!${lat},${long}&waypoint1=geo!${dropoff}6&mode=fastest;car;traffic:disabled&return=summary`,
							headers: {},
						};
						request(options, function (error, response) {
							if (error) throw new Error(error);
							let distance = JSON.parse(response.body).response.route[0].summary
								.distance;
							let fare = ((distance / 1000) * 17).toFixed(2);

							res.json({ fare });
						});
					}
				} else {
					pickup_loc = pickup_loc.replace(/[,]/g, "%2C").replace(/[ ]/g, "+");
					try {
						request(
							{
								url: `https://geocode.search.hereapi.com/v1/geocode?q=${pickup_loc}&apiKey=${HERE_REST_API_KEY}`,
								method: "GET",
							},
							(err, _res, body) => {
								if (err) throw err;
								body = JSON.parse(body);
								let pickup_lat = body.items[0].position.lat;
								let pickup_long = body.items[0].position.lng;

								request(
									{
										url: `https://geocode.search.hereapi.com/v1/geocode?q=${drop_location}&apiKey=${HERE_REST_API_KEY}`,
										method: "GET",
									},
									(err, _res, body) => {
										if (err) throw err;
										body = JSON.parse(body);
										let dropoff_lat = body.items[0].position.lat;
										let dropoff_long = body.items[0].position.lng;

										request(
											{
												url: `https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=${HERE_JS_MAPS_API_KEY}&waypoint0=geo!${pickup_lat},${pickup_long}&waypoint1=geo!${dropoff_lat},${dropoff_long}&mode=fastest;car;traffic:disabled&return=summary`,
												method: "POST",
											},
											(err, _res, body) => {
												if (err) throw err;
												if (
													JSON.parse(body).subtype != undefined &&
													JSON.parse(body).subtype == "NoRouteFound"
												) {
													res.json({
														message:
															"Try to add a more descriptive location or more general location",
													});
													return true;
												} else {
													console.log(JSON.parse(body).response);
													let price = parseFloat(
														(
															(JSON.parse(body).response.route[0].summary
																.distance /
																1000) *
															17
														).toFixed(2)
													);
													// res.json(JSON.parse(body).response);
													res.json({ price });
												}
											}
										);
									}
								);
							}
						);
					} catch (error) {
						console.error(error);
					}
				}
			}
		}
	});
});

router.post("/rideId", verifyToken, (req, res) => {
	try {
		jwt.verify(req.token, "uber_clone", (err, auth_data) => {
			if (err) {
				res.json({ message: err.name });
				throw err;
			}
			// check if token has user as passenger
			if (auth_data.type == "passenger") {
				// get id for that users ride
				PassengerLocationSchema.findOne(
					{ phone_number: auth_data.phone_number },
					{ _id: 1, phone_number: 1 },
					(err, doc) => {
						if (err) throw err;
						if (doc == null) {
							res.json("Not Queued");
						} else {
							res.json(doc);
						}
					}
				);
			}
		});
	} catch (error) {
		console.error(error);
	}
});

router.post("/userLocationInfo", verifyToken, (req, res) => {
	try {
		jwt.verify(
			req.token,
			"5E9FCB5489070102C06A055D804D9A9817E39122CF5F590D",
			(err, auth_data) => {
				const { type } = req.body;
				if (type == "passenger") {
					try {
						const { phone_number } = req.body;
						PassengerLocationSchema.findOne(
							{ phone_number: phone_number },
							{ _id: 0, address: 1, lat: 1, long: 1 },
							(err, doc) => {
								if (doc) {
									res.json(doc);
								} else {
									res.json({ message: "Cant Find User" });
								}
								if (err) {
									throw err;
								}
							}
						);
					} catch (e) {
						console.error(e);
					}
				} else if (type == "driver") {
					try {
						const { phone_number } = req.body;
						DriverLocationSchema.findOne(
							{ phone_number: phone_number },
							{ _id: 0, "address.label": 1, lat: 1, long: 1 },

							(err, doc) => {
								if (doc) {
									res.json(doc);
								} else {
									res.json({ message: "Cant Find User" });
								}
								if (err) {
									throw err;
								}
							}
						);
					} catch (e) {
						console.error(e);
					}
				} else {
					console.log("Wrong User type");
				}
			}
		);
	} catch (e) {
		console.error(e);
	}
});

router.get("/getTripFare", verifyToken, (req, res) => {
	try {
		jwt.verify(
			req.token,
			"5E9FCB5489070102C06A055D804D9A9817E39122CF5F590D",
			(err, auth_data) => {
				let { phone_number } = req.body;

				TripSchema.findOne(
					{ driverPhoneNumber: phone_number },
					{ _id: 0, trip_distance: 1 },
					(err, doc) => {
						if (err) throw err;

						if (doc) {
							const fare = (doc.trip_distance / 1000) * 17;
							res.json({ fare });
						} else {
							res.json({ message: "Couldn't Find Trip" });
						}
					}
				);
			}
		);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
});

module.exports = router;

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const request = require("request");

const connections = new Set();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const trip = io.of("trip");

trip.on("connection", (socket) => {
	Object.keys(socket.adapter.rooms).forEach((sockID) => {
		if (connections.has(sockID) == false) {
			trip.adapter.del(sockID, sockID, (err, done) => {
				if (err) throw err;
			});
		}
	});
	socket.on("join_room", (data) => {
		try {
			jwt.verify(data.token, "uber_clone", (err, auth_data) => {
				if (err) throw err;
				if (!err) {
					socket.join(data.num, (err) => {
						if (socket.adapter.rooms[data.num].length < 3) {
							if (auth_data.type == "driver") {
								socket
									.to(data.num)
									.emit("driverConnected", `${auth_data.name} is Connected!`);
							}
							console.log(auth_data.name, "Joined the room\nRoom: ", data.num);
							if (err) throw err;
							connections.add(data.num);

							console.log("Driver Has Connected to Room : ", data.num);

							// Get Location Info
							var options = {
								method: "POST",
								url: "http://localhost:4001/userLocationInfo",
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
							request(options, (error, locationInfoData) => {
								if (error) throw error;

								// Get Car Info
								options = {
									method: "GET",
									url: "http://localhost:4002/driverCar",
									headers: {
										Authorization:
											"Bearer eyJhbGciOiJIUzI1NiIsInR577-9IjoiSldUIn0.eyJpbnRlcm5hbHJlcXVlc3QiOnRydWV9.FTGk1KvpUc5exws-DeSk19jg5w5GcyTsxewYHN_-tio",
										"Content-Type": "application/json",
									},
									body: JSON.stringify({ phone_number: data.num }),
								};

								request(options, function (error, carInfoData) {
									if (error) throw new Error(error);
									let carInfo = JSON.parse(carInfoData.body);
									let locationInfo = JSON.parse(locationInfoData.body);
									let driver = {
										name: auth_data.name,
										phone_number: auth_data.phone_number,
										type: auth_data.type,
									};
									socket
										.to(data.num)
										.emit("driverConnected", { carInfo, locationInfo, driver });
								});
							});
						}
						if (data.num == 0) {
							socket.adapter.del(socket.id, 0);
						}
					});
				}
			});
		} catch (error) {
			console.error(error);
			socket.emit("tokenExpired", true);
		}
	});

	socket.on("start", (id, data) => {
		console.log("Emitted Start");
		socket.to(id).emit("started", data);
	});

	socket.on("cancelByPassenger", (id, data) => {
		socket.to(id).emit("pingDriver", data);
		console.log(id, data);
	});

	socket.on("cancelByDriver", (id, data) => {
		console.log(id, data);
		socket.to(id).emit("canceledByDriver", data);
	});

	socket.on("complete", (id, data, trip) => {
		console.log("Completed > \n", data, trip);
		socket.to(id).emit("completed", data, trip);
	});

	socket.on("cancel", (id, cancelFare) => {
		console.log("Emiiting : ", id, " - ", cancelFare);
		socket.to(id).emit("canceled", cancelFare);
	});

	socket.on("trip", (id, data) => {
		console.log("Sending Trip Info...");
		console.log(id, " = ", data);
		socket.to(id).emit("tripData", data);
	});

	socket.on("getRooms", () => {
		let rooms = socket.adapter.rooms;
		socket.emit("allRooms", rooms);
	});

	socket.on("hello", (data) => {
		trip.emit("recieve_msg", data);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});

	socket.on("receive", (id, data) => {
		console.log("recieved");
		socket.to(id).emit("received", data);
	});
});

trip.on("disconnect", () => {
	console.log("user disconnected");
});

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

app.get("/xd", (req, res) => {
	res.send(trip);
	console.log("hello /");
	// res.sendFile(__dirname + "/index.html");
	// Creating a trip namespace
	// const trip = io.of("/trip");

	// on Connection event, create a socket
	// io.on("connection", (socket) => {
	//   // on hi event join the user to the room provided as a arg
	//   socket.on("hi", (roomName) => {
	//     socket.join(roomName, () => {
	//       socket.on("chat message", (msg) => {
	//         let users = Object.keys(socket.adapter.rooms[roomName].sockets);
	//         console.log("room name : " + roomName);
	//         let text = {};
	//         text.msg = msg;
	//         text.sender = socket.id;
	//         socket.in(roomName).emit("msg", text);
	//       });
	//     });
	//   });
	// });
});
app.get("/2", (req, res) => {
	res.sendFile(__dirname + "/index2.html");
});

const PORT = 4005;

http.listen(PORT, () => {
	console.log(__filename.split("\\").reverse()[1] + " Running on " + PORT);
});

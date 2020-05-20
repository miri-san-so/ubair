const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const db = require("./config/keys").mongoURI;

const getProfile = require("./routes/getProfile");
const updateProfile = require("./routes/updateProfile");
const incTrip = require("./routes/incTrip");
const rating = require("./routes/rating");
const getTrips = require("./routes/getTrips");

// Connect to mongoDB
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(console.log("Connected to mongoDB"))
	.catch((err) => console.log(`[err] ${err}`));

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", getProfile);
app.use("/updateProfile", updateProfile);
app.use("/incTrip", incTrip);
app.use("/rating", rating);
app.use("/getTrips", getTrips);

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
	console.log(`Profile Running on ${PORT}`);
});

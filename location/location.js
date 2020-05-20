const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const user_loc = require("./routes/user_loc");
const getTrips = require("./routes/getTrips");
const cors = require("cors");

const app = express();

app.use(cors());

const db = require("./config/keys").mongoURI;

mongoose
	.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(console.log("Connected to mongoDB"))
	.catch((err) => console.log(`[err] ${err}`));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", user_loc);
app.use("/getTrips", getTrips);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
	console.log(`Location API running on ${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const cors = require("cors");

// Importing login route
const loginRoute = require("./routes/login");

// Initializing the express app
const app = express();

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to mongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(console.log("Connected to mongoDB"))
  .catch((err) => console.log(`[err] ${err}`));

app.use(cors());

// Route requests for user login & Register
app.use("/u", loginRoute);

// Defining Port
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Authentication running on ${PORT}`);
});

const express = require("express");
const processRoute = require("./routes/process");
const mongoose = require("mongoose");
const cors = require("cors");
const db = require("./config/keys").mongoURI;

const PORT = process.env.PORT || 4003;

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", processRoute);

// Connect to mongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(console.log("Connected to mongoDB"))
  .catch((err) => console.log(`[err] ${err}`));

app.listen(PORT, () => {
  console.log(`Dispatcher Running on ${PORT}`);
});

require("dotenv").config();

const bodyParser = require("body-parser");

//import npm packages
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const app = express();
//port
const PORT = process.env.PORT || 8080;
//route
const routes = require("./routes/api");

mongoose.connect(
  process.env.CODE_PATH || "mongodb://localhost/writeaboutphoto",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("error", function (err) {
  console.error("ERORR: " + err);
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!"); //just for checking if the routes are connected or not bro!
});

//cors for cross transfer of urls. only after just adding this, things start working like fooo!
// app.use(cors());

//similarly we are not getting any body parsed into the request, so we just pass the data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//HTTP logger is used here
app.use(morgan("tiny"));

//routes
app.use("/api", routes);

//checking where the application is running

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

//listening here
app.listen(PORT, console.log(`Server is starting at port ${PORT}`));

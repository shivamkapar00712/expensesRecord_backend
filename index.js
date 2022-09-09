require("dotenv").config();
require("express-async-errors");
const express = require("express");

const handleErrors = require("./app/startup/error");
const app = express();

// data base connectivity
require("./app/startup/db")();
//error handling and loging that errors
handleErrors.handleErrors();
//middlewares and routes
require("./app/startup/routes")(app);

app.get("/", (req, res) => {
  res.send("this is root of the application");
});
//listining application
app.listen(5000, () => handleErrors.logInfo("listening on port 5000"));

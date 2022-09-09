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
app.listen(process.env.PORT || 5000,'0:0:0:0', () => handleErrors.logInfo(`listing on port ${process.env.PORT || 5000}`));

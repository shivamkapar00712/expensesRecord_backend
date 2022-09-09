const jwt = require("jsonwebtoken");
const { JWT_TOKEN } = process.env;
module.exports = function (req, res, next) {
  try {
    const token = req.header("authorization").split(" ")[1];
    const decoded = jwt.verify(token, JWT_TOKEN);
    req.user = decoded;
    next();
  } catch (ex) {
    console.log(ex);
    res.status(400).send(ex);
  }
};

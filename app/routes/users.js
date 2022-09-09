const express = require("express");
const router = express.Router();

const { login, register, getUser } = require("../controllers/users");

router.post("/login", login);
router.post("/register", register);
router.get("/user/:id", getUser);

module.exports = router;

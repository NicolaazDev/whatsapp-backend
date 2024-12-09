const express = require("express");

const { loginSub, registerSub } = require("../controllers/subController");

const router = express.Router();

router.post("/register", registerSub);
router.post("/login", loginSub);

module.exports = router;

const express = require("express");

const {
  loginSub,
  registerSub,
  toggleSubDesativated,
} = require("../controllers/subController");

const router = express.Router();

router.post("/register", registerSub);
router.post("/login", loginSub);

router.post("/toggle/:subId", toggleSubDesativated);

module.exports = router;

const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  toggleAdminDesativated,
} = require("../controllers/adminController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.put("/toggle/:adminId", toggleAdminDesativated);

module.exports = router;

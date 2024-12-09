const express = require("express");
const { generateQRCode } = require("../controllers/whatsappController");

const router = express.Router();

router.get("/generate-qrcode", generateQRCode);

module.exports = router;

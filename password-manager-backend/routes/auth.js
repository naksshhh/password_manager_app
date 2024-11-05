// routes/auth.js
const express = require("express");
const { signup, login } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/mfa/generate", generateMFASecret);
router.post("/mfa/verify", verifyMFA);


module.exports = router;

// routes/password.js
const express = require("express");
const { createPassword, getPasswords } = require("../controllers/passwordController");
const router = express.Router();

router.post("/generate", generatePassword);
router.post("/store", createPassword);
router.get("/", getPasswords);


module.exports = router;

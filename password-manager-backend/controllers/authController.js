// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const speakeasy = require("speakeasy");

exports.generateMFASecret = (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  res.json({ secret: secret.base32 });
};


exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Error in saving user");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Error in login");
  }
};

exports.verifyMFA = (req, res) => {
  const { token, secret } = req.body;
  const verified = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
  });
  res.json({ verified });
};

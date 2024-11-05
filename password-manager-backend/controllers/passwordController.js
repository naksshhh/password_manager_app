// controllers/passwordController.js
const Password = require("../models/password");
const { encrypt, decrypt } = require("../utils/encryption");
const passwordGenerator = require("password-generator");

exports.generatePassword = (req, res) => {
  const { length = 12, uppercase = true, numbers = true, symbols = true } = req.body;
  const charset = "abcdefghijklmnopqrstuvwxyz" +
                  (uppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "") +
                  (numbers ? "0123456789" : "") +
                  (symbols ? "!@#$%^&*()" : "");

  const password = passwordGenerator(length, false, charset);
  res.json({ password });
};


exports.createPassword = async (req, res) => {
  const { name, password, category } = req.body;
  const userId = req.user.id; // Ensure the user is authenticated

  try {
    const encryptedPassword = encrypt(password);
    const newPassword = new Password({ userId, name, category, encryptedPassword });
    await newPassword.save();
    res.status(201).json({ message: "Password stored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving password", error });
  }
};

exports.getPasswords = async (req, res) => {
  const userId = req.user.id;

  try {
    const passwords = await Password.find({ userId });
    const decryptedPasswords = passwords.map((item) => ({
      id: item._id,
      name: item.name,
      category: item.category,
      password: decrypt(item.encryptedPassword),
    }));
    res.json(decryptedPasswords);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving passwords", error });
  }
};

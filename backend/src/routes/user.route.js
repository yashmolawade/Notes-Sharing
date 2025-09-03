const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const NoteModel = require("../models/note.model");
const authMiddleware = require("../middlewares/authMiddleware..js");
const authRouter = express.Router();

// Singup
authRouter.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    let emailCheck = await UserModel.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({ message: "Email already exits" });
    }
    const hash = await bcrypt.hash(password, 10);
    let user = await UserModel.create({ ...req.body, password: hash });
    res.status(201).json({ message: "Singup success", data: user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
});

// Login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.status(200).json({ message: "Login success", token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
});


// Get user profile
authRouter.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
});

// Update user profile
authRouter.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await UserModel.findByIdAndUpdate(req.user.id,{ name, email },{ new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
});

// Get all users
authRouter.get("/users", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
});

// Share note by email
authRouter.post("/share-by-email", authMiddleware, async (req, res) => {
  try {
    const { noteId, email } = req.body;
    const userToShare = await UserModel.findOne({ email });
    if (!userToShare) {
      return res.status(404).json({ message: "User with this email not found" });
    }
    const note = await NoteModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to share this note" });
    }
    if (!note.sharedWith.includes(userToShare._id)) {
      note.sharedWith.push(userToShare._id);
      await note.save();
    }
    res.status(200).json({ message: "Note shared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
});

module.exports = authRouter;

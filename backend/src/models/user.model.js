const mongoose = require("mongoose");

const userShema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: /^\S+@\S+\.\S+$/,
      unique: true,
    },
    password: { type: String, min: 4, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userShema);

module.exports = UserModel;

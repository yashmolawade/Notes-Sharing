const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] 
  },
  { timestamps: true }
);

const NoteModel = mongoose.model("Note", noteSchema);

module.exports = NoteModel;

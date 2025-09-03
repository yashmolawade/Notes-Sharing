const express = require("express");
const NoteModel = require("../models/note.model");
const authMiddleware = require("../middlewares/authMiddleware..js");
const checkNoteAccess = require("../middlewares/checkNoteAccess");

const notesRouter = express.Router();

// create Note
notesRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newNote = await NoteModel.create({title,description,user: req.user.id,});
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get all Notes
notesRouter.get("/", authMiddleware, async (req, res) => {
  try {
    let filter = {
      $or: [{ user: req.user.id }, { sharedWith: req.user.id }],
    };
    if (req.user.role === "admin") {
      filter = {};
    }
    const notes = await NoteModel.find(filter)
      .populate("user", "name email role")
      .populate("sharedWith", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get single note
notesRouter.get("/:id", authMiddleware, checkNoteAccess("view"), (req, res) => {
  res.status(200).json(req.note);
});

// Update note
notesRouter.put("/:id",authMiddleware,checkNoteAccess("edit"),async (req, res) => {
    try {
      const updatedNote = await NoteModel.findByIdAndUpdate(req.params.id,req.body,{ new: true });
      res.status(200).json(updatedNote);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// Delete Note
notesRouter.delete("/:id",authMiddleware,checkNoteAccess("delete"),async (req, res) => {
    try {
      await NoteModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// Share Note
notesRouter.post("/:id/share",authMiddleware,checkNoteAccess("share"),async (req, res) => {
    try {
      const { userId } = req.body;
      if (!req.note.sharedWith.includes(userId)) {
        req.note.sharedWith.push(userId);
        await req.note.save();
      }
      res.status(200).json({ message: "Note shared successfully", note: req.note });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

module.exports = notesRouter;

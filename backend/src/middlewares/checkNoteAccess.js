const NoteModel = require("../models/note.model");

const checkNoteAccess = (action) => {
  return async (req, res, next) => {
    try {
      const note = await NoteModel.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      req.note = note;
      const isCreator = note.user.toString() === req.user.id;
      const isAdmin = req.user.role === "admin";
      const isShared = note.sharedWith.includes(req.user.id);
      if (action === "view") {
        if (isCreator || isAdmin || isShared) return next();
      }

      if (["edit", "delete", "share"].includes(action)) {
        if (isCreator || isAdmin) return next();
      }
      return res.status(403).json({ message: "Not authorized" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };
};

module.exports = checkNoteAccess;

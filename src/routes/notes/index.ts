import { Router } from "express";
import {
  getNotesByUser,
  getNoteById,
  addNote,
  updateNote,
  deleteNote,
} from "../../controllers/notes";
import { auth } from "../../middleware";

const noteRouter: Router = Router();

noteRouter.get("/", auth, getNotesByUser);

noteRouter.get("/:id", auth, getNoteById);

noteRouter.post("/", auth, addNote);

noteRouter.put("/:id", auth, updateNote);

noteRouter.delete("/:id", auth, deleteNote);

export default noteRouter;

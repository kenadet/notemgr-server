import { Response, Request } from "express";
import { INote } from "../../types/note";
import Note from "../../models/note";
import User from "../../models/user";
import { IUser } from "../../types/user";

const getNotesByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const offset = Number(req.query.page) - 1;
    const limit = Number(req.query.limit);

    const { email } = req.body;

    let user = (await User.findOne({ email: email })) as IUser;

    const notes: INote[] = await Note.find({ creator: user._id })
      .skip(offset)
      .limit(limit);

    const count = await Note.count();

    // return response with posts, total pages, and current page
    res.status(200).json({
      notes,
      totalPages: Math.ceil(count / limit),
      currentPage: offset + 1,
    });
  } catch (error) {
    throw error;
  }
};

const getNoteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const note: INote | null = await Note.findById(req.params.id);

    res.status(200).json({
      note: note,
    });
  } catch (error) {
    throw error;
  }
};

const addNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as any;

    const note: INote = new Note({
      title: body.title,
      description: body.description,
      category: body.category,
    });

    let user = (await User.findOne({ email: body.email })) as IUser;

    note.creator = user._id;

    const newNote: INote = await note.save();

    res.status(201).json({ message: "Note added", note: newNote });
  } catch (error) {
    throw error;
  }
};

const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
      body,
    } = req;

    const updateNote: INote | null = await Note.findByIdAndUpdate(
      { _id: id },
      body,
      { new: true }
    );

    res.status(200).json({
      message: "Note updated",
      note: updateNote,
    });
  } catch (error) {
    throw error;
  }
};

const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedNote: INote | null = await Note.findByIdAndRemove(
      req.params.id
    );

    res.status(200).json({
      message: "Note deleted",
      note: deletedNote,
    });
  } catch (error) {
    throw error;
  }
};

export { getNotesByUser, getNoteById, addNote, updateNote, deleteNote };

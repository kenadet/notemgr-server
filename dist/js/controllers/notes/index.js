"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.addNote = exports.getNoteById = exports.getNotesByUser = void 0;
const note_1 = __importDefault(require("../../models/note"));
const user_1 = __importDefault(require("../../models/user"));
const getNotesByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offset = Number(req.query.page) - 1;
        const limit = Number(req.query.limit);
        const { email } = req.body;
        let user = (yield user_1.default.findOne({ email: email }));
        const notes = yield note_1.default.find({ creator: user._id })
            .skip(offset)
            .limit(limit);
        const count = yield note_1.default.count();
        // return response with posts, total pages, and current page
        res.status(200).json({
            notes,
            totalPages: Math.ceil(count / limit),
            currentPage: offset + 1,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.getNotesByUser = getNotesByUser;
const getNoteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield note_1.default.findById(req.params.id);
        res.status(200).json({
            note: note,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.getNoteById = getNoteById;
const addNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const note = new note_1.default({
            title: body.title,
            description: body.description,
            category: body.category,
        });
        let user = (yield user_1.default.findOne({ email: body.email }));
        note.creator = user._id;
        const newNote = yield note.save();
        res.status(201).json({ message: "Note added", note: newNote });
    }
    catch (error) {
        throw error;
    }
});
exports.addNote = addNote;
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id }, body, } = req;
        const updateNote = yield note_1.default.findByIdAndUpdate({ _id: id }, body, { new: true });
        res.status(200).json({
            message: "Note updated",
            note: updateNote,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.updateNote = updateNote;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedNote = yield note_1.default.findByIdAndRemove(req.params.id);
        res.status(200).json({
            message: "Note deleted",
            note: deletedNote,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.deleteNote = deleteNote;

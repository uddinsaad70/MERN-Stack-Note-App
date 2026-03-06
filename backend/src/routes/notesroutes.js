import e from "express";
import express from "express";
import { getAllNotes, getNodebyId, createNote, updateNote, deleteNote} from "../controllers/notesController.js";

const router = express.Router();

router.get('/', getAllNotes);
router.get('/:id', getNodebyId);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);


export default router;
import Note from '../models/Note.js';

export async function getAllNotes (req, res) {
    try {
        const notes = await Note.find().sort({createdAt: -1});
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({message: error.message});
    }
};

export async function getNodebyId (req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if(!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (error) {
        console.error("Error fetching note id:", error);
        res.status(500).json({message: error.message});
    }
}

export async function createNote (req, res) {
    try {
        const { title, content } = req.body;
        const newNote = new Note({ title: title, content: content });
        await newNote.save();
        res.status(201).json({ note: newNote });
    } catch (error) {
        console.error("Error creating note:", error);

    }
};

export async function updateNote (req, res) {
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, {title,content}, { new: true });
        if(!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ note: updatedNote });
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ message: error.message });        
    }
};

export async function deleteNote (req, res) {
    try {
        const deletedID = await Note.findByIdAndDelete(req.params.id);
        if(!deletedID){
            return res.status(404).json({message: "Note not found"});
        }
        res.status(200).json({ message: "Note deleted successfully" })
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: error.message });    
    }
};

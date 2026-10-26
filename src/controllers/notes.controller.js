const NoteService = require('../services/notes.service');
const AppError = require('../utils/AppError');

const createNoteController = async (req, res) => {
    try {
        const { title, content, status } = req.body;
        if (!title || !content) {
            throw new AppError('Title and content are required', 400);
        }
        const note = await NoteService.createNote({
            title,
            content,
            userId: req.userId,
            status
        })
        res.status(201).json({ note });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  
}

const getAllNotesController = async (req, res) => {
    try {
        const notes = await NoteService.getAllNotes();
        res.status(200).json({ notes });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getNotesController = async (req, res) => {
    try {
        const notes = await NoteService.getNotes(req.userId);
        res.status(200).json({ notes });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getNoteByIdController = async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await NoteService.getNoteById(noteId);
        if (!note) {
            throw new AppError('Note not found or accessible', 404);
        }
        res.status(200).json({ note });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const editNoteController = async (req, res) => {
    try {
        const { title, content, status } = req.body;
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (status !== undefined) updateData.status = status;

        if (Object.keys(updateData).length === 0) {
            throw new AppError('No valid fields provided for update', 400);
        }

        const note = await NoteService.editNote(req.params.id, req.userId, updateData);
        if (!note) {
            throw new AppError('Note not found or you do not have permission to edit it', 404);
        }
        res.status(200).json({ note });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteNoteController = async (req, res) => {
    try {
        const note = await NoteService.deleteNote(req.params.id, req.userId);

        if (!note) {
            throw new AppError('Note not found or you do not have permission to delete it', 404);
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { 
    createNoteController,
    getAllNotesController,
    getNotesController,
    getNoteByIdController,
    editNoteController,
    deleteNoteController

};
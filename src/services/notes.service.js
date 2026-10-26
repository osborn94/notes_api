const NoteModel = require('../models/note.model');

const createNote = async ({ title, content, userId, status }) => {

    return await NoteModel.create({ title, content, userId, status });

};

const getAllNotes = async () => {
    return await NoteModel.find({ status: 'public' });
}

const getNoteById = async (noteId) => {
    return await NoteModel.findOne({
        _id: noteId,
        status: 'public'
    });
}

const getNotes = async (userId) => {
    return await NoteModel.find({ userId });
}

const editNote = async (noteId, userId, updateData ) => {
    return await NoteModel.findOneAndUpdate(
        { _id:noteId, userId },
        updateData,
        { new: true, runValidators: true }
    )
}

const deleteNote = async (noteId, userId) => {
    return await NoteModel.findOneAndDelete({ _id: noteId, userId });
}


module.exports = { 
    createNote, 
    getAllNotes,
    getNoteById,
    getNotes,
    editNote,
    deleteNote

};
const express = require('express');
const noteController = require('../controllers/notes.controller');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/newNote', authenticate, noteController.createNoteController);
router.get('/getAllNotes', noteController.getAllNotesController);
router.get('/getNotes', authenticate, noteController.getNotesController);
router.get('/getNote/:id', noteController.getNoteByIdController);

router.patch('/editNote/:id', authenticate, noteController.editNoteController);
router.delete('/deleteNote/:id', authenticate, noteController.deleteNoteController);


module.exports = router;
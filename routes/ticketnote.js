const express = require('express');
const router = express.Router();
const {
  getNotesByTicket,
  getNoteById,
  addNote,
  updateNote,
  deleteNote,
} = require('../controllers/ticketnotecontroller');

router.get('/ticket/:ticketId', getNotesByTicket);
router.get('/:id', getNoteById);
router.post('/', addNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
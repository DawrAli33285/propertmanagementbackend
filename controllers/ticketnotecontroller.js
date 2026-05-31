const TicketNote = require('../models/Ticketnote');
const Ticket = require('../models/Ticket');

// @desc    Get all notes for a ticket
// @route   GET /api/ticket-notes/ticket/:ticketId
const getNotesByTicket = async (req, res) => {
  try {
    const notes = await TicketNote.find({ ticket_id: req.params.ticketId })
      .populate('user_id', '-password')
      .sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single note by ID
// @route   GET /api/ticket-notes/:id
const getNoteById = async (req, res) => {
  try {
    const note = await TicketNote.findById(req.params.id)
      .populate('ticket_id')
      .populate('user_id', '-password');
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a note to a ticket
// @route   POST /api/ticket-notes
const addNote = async (req, res) => {
  try {
    const { ticket_id, user_id, note, visibility } = req.body;

    const ticket = await Ticket.findById(ticket_id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticketNote = await TicketNote.create({ ticket_id, user_id, note, visibility });

    const populatedNote = await TicketNote.findById(ticketNote._id)
      .populate('ticket_id')
      .populate('user_id', '-password');

    res.status(201).json(populatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/ticket-notes/:id
const updateNote = async (req, res) => {
  try {
    const { note, visibility } = req.body;

    const ticketNote = await TicketNote.findById(req.params.id);
    if (!ticketNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const updatedNote = await TicketNote.findByIdAndUpdate(
      req.params.id,
      { note, visibility },
      { new: true, runValidators: true }
    )
      .populate('ticket_id')
      .populate('user_id', '-password');

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/ticket-notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await TicketNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await TicketNote.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotesByTicket,
  getNoteById,
  addNote,
  updateNote,
  deleteNote,
};
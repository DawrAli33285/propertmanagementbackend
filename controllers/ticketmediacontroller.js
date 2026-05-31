const TicketMedia = require('../models/Ticketmedia');
const Ticket = require('../models/Ticket');

// @desc    Get all media for a ticket
// @route   GET /api/ticket-media/ticket/:ticketId
const getMediaByTicket = async (req, res) => {
  try {
    const media = await TicketMedia.find({ ticket_id: req.params.ticketId });
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single media by ID
// @route   GET /api/ticket-media/:id
const getMediaById = async (req, res) => {
  try {
    const media = await TicketMedia.findById(req.params.id).populate('ticket_id');
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add media to a ticket
// @route   POST /api/ticket-media
const addMedia = async (req, res) => {
  try {
    const { ticket_id, file_url, file_type } = req.body;

    const ticket = await Ticket.findById(ticket_id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const media = await TicketMedia.create({ ticket_id, file_url, file_type });
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete media by ID
// @route   DELETE /api/ticket-media/:id
const deleteMedia = async (req, res) => {
  try {
    const media = await TicketMedia.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    await TicketMedia.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMediaByTicket,
  getMediaById,
  addMedia,
  deleteMedia,
};
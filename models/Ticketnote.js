const mongoose = require('mongoose');

const ticketNoteSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    note: { type: String, required: true },
    visibility: {
      type: String,
      enum: ['internal', 'public'],
      default: 'internal',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TicketNote', ticketNoteSchema);
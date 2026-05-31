const mongoose = require('mongoose');

const ticketMediaSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    file_url: { type: String, required: true },
    file_type: {
      type: String,
      enum: ['image', 'video', 'document'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TicketMedia', ticketMediaSchema);
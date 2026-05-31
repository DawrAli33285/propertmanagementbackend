const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticket_number: { type: String, required: true, unique: true },
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    unit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      required: true,
    },
    issue_type: {
      type: String,
      enum: [
        'plumbing',
        'roofing',
        'electrical',
        'hvac',
        'locksmith',
        'pest_control',
        'handyman',
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ['emergency', 'high', 'normal'],
      required: true,
    },
    description: { type: String, required: true },
    permission_to_enter: { type: Boolean, default: false },
    preferred_contact_method: {
      type: String,
      enum: ['email', 'sms', 'phone'],
      default: 'email',
    },
    status: {
      type: String,
      enum: [
        'submitted',
        'under_review',
        'assigned',
        'contractor_notified',
        'accepted',
        'scheduled',
        'in_progress',
        'waiting_on_parts',
        'waiting_on_approval',
        'completed',
        'closed',
        'rejected',
        'cancelled',
      ],
      default: 'submitted',
    },
    assigned_contractor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contractor',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
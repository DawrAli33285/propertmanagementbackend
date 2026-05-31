const mongoose = require('mongoose');

const contractorAssignmentSchema = new mongoose.Schema(
  {
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    contractor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contractor',
      required: true,
    },
    trade_type: {
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
    priority_order: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContractorAssignment', contractorAssignmentSchema);
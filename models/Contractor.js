const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true },
    contact_name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
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
    service_area: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contractor', contractorSchema);
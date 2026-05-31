const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema(
  {
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    unit_number: { type: String, required: true },
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Unit', unitSchema);
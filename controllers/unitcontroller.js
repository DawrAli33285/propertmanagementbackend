const Unit = require('../models/Unit');

// @desc    Get all units
// @route   GET /api/units
const getUnits = async (req, res) => {
  try {
    const units = await Unit.find()
      .populate('property_id')
      .populate('tenant_id');
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single unit by ID
// @route   GET /api/units/:id
const getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id)
      .populate('property_id')
      .populate('tenant_id');
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }
    res.status(200).json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all units by property
// @route   GET /api/units/property/:propertyId
const getUnitsByProperty = async (req, res) => {
  try {
    const units = await Unit.find({ property_id: req.params.propertyId })
      .populate('property_id')
      .populate('tenant_id');
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new unit
// @route   POST /api/units
const createUnit = async (req, res) => {
  try {
    const { property_id, unit_number, tenant_id } = req.body;

    const unit = await Unit.create({ property_id, unit_number, tenant_id });
    res.status(201).json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a unit
// @route   PUT /api/units/:id
const updateUnit = async (req, res) => {
  try {
    const { property_id, unit_number, tenant_id } = req.body;

    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const updatedUnit = await Unit.findByIdAndUpdate(
      req.params.id,
      { property_id, unit_number, tenant_id },
      { new: true, runValidators: true }
    )
      .populate('property_id')
      .populate('tenant_id');

    res.status(200).json(updatedUnit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a unit
// @route   DELETE /api/units/:id
const deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    await Unit.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Unit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUnits,
  getUnitById,
  getUnitsByProperty,
  createUnit,
  updateUnit,
  deleteUnit,
};
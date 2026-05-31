const ContractorAssignment = require('../models/Contractorssignment');

// @desc    Get all contractor assignments
// @route   GET /api/contractor-assignments
const getContractorAssignments = async (req, res) => {
  try {
    const assignments = await ContractorAssignment.find()
      .populate('property_id')
      .populate('contractor_id');
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single contractor assignment by ID
// @route   GET /api/contractor-assignments/:id
const getContractorAssignmentById = async (req, res) => {
  try {
    const assignment = await ContractorAssignment.findById(req.params.id)
      .populate('property_id')
      .populate('contractor_id');
    if (!assignment) {
      return res.status(404).json({ message: 'Contractor assignment not found' });
    }
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all assignments by property
// @route   GET /api/contractor-assignments/property/:propertyId
const getAssignmentsByProperty = async (req, res) => {
  try {
    const assignments = await ContractorAssignment.find({
      property_id: req.params.propertyId,
    })
      .populate('property_id')
      .populate('contractor_id')
      .sort({ trade_type: 1, priority_order: 1 });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assignments by property and trade type
// @route   GET /api/contractor-assignments/property/:propertyId/trade/:tradeType
const getAssignmentsByPropertyAndTrade = async (req, res) => {
  try {
    const assignments = await ContractorAssignment.find({
      property_id: req.params.propertyId,
      trade_type: req.params.tradeType,
    })
      .populate('property_id')
      .populate('contractor_id')
      .sort({ priority_order: 1 });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new contractor assignment
// @route   POST /api/contractor-assignments
const createContractorAssignment = async (req, res) => {
  try {
    const { property_id, contractor_id, trade_type, priority_order } = req.body;

    const existingAssignment = await ContractorAssignment.findOne({
      property_id,
      contractor_id,
      trade_type,
    });
    if (existingAssignment) {
      return res.status(400).json({
        message: 'This contractor is already assigned to this property for this trade type',
      });
    }

    const assignment = await ContractorAssignment.create({
      property_id,
      contractor_id,
      trade_type,
      priority_order,
    });

    const populatedAssignment = await ContractorAssignment.findById(assignment._id)
      .populate('property_id')
      .populate('contractor_id');

    res.status(201).json(populatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a contractor assignment
// @route   PUT /api/contractor-assignments/:id
const updateContractorAssignment = async (req, res) => {
  try {
    const { property_id, contractor_id, trade_type, priority_order } = req.body;

    const assignment = await ContractorAssignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Contractor assignment not found' });
    }

    const updatedAssignment = await ContractorAssignment.findByIdAndUpdate(
      req.params.id,
      { property_id, contractor_id, trade_type, priority_order },
      { new: true, runValidators: true }
    )
      .populate('property_id')
      .populate('contractor_id');

    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a contractor assignment
// @route   DELETE /api/contractor-assignments/:id
const deleteContractorAssignment = async (req, res) => {
  try {
    const assignment = await ContractorAssignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Contractor assignment not found' });
    }

    await ContractorAssignment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contractor assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getContractorAssignments,
  getContractorAssignmentById,
  getAssignmentsByProperty,
  getAssignmentsByPropertyAndTrade,
  createContractorAssignment,
  updateContractorAssignment,
  deleteContractorAssignment,
};
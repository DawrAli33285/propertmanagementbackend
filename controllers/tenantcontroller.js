const Tenant = require('../models/Tenant');

// @desc    Get all tenants
// @route   GET /api/tenants
const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find()
      .populate('user_id', '-password')
      .populate('property_id')
      .populate('unit_id');
    res.status(200).json(tenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single tenant by ID
// @route   GET /api/tenants/:id
const getTenantById = async (req, res) => {
  console.log(req.params.id)
  console.log("CALLING GET TENANT BY ID")
  try {
    
    const tenant = await Tenant.findOne({user_id:req.params.id})
      .populate('user_id', '-password')
      .populate('property_id')
      .populate('unit_id');
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tenants by property
// @route   GET /api/tenants/property/:propertyId
const getTenantsByProperty = async (req, res) => {
  try {
    const tenants = await Tenant.find({ property_id: req.params.propertyId })
      .populate('user_id', '-password')
      .populate('property_id')
      .populate('unit_id');
    res.status(200).json(tenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new tenant
// @route   POST /api/tenants
const createTenant = async (req, res) => {
  try {
    const { user_id, property_id, unit_id, lease_status } = req.body;

    const existingTenant = await Tenant.findOne({ user_id });
    if (existingTenant) {
      return res.status(400).json({ message: 'User is already registered as a tenant' });
    }

    const tenant = await Tenant.create({ user_id, property_id, unit_id, lease_status });

    const populatedTenant = await Tenant.findById(tenant._id)
      .populate('user_id', '-password')
      .populate('property_id')
      .populate('unit_id');

    res.status(201).json(populatedTenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a tenant
// @route   PUT /api/tenants/:id
const updateTenant = async (req, res) => {
  try {
    const { property_id, unit_id, lease_status } = req.body;

    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const updatedTenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      { property_id, unit_id, lease_status },
      { new: true, runValidators: true }
    )
      .populate('user_id', '-password')
      .populate('property_id')
      .populate('unit_id');

    res.status(200).json(updatedTenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a tenant
// @route   DELETE /api/tenants/:id
const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    await Tenant.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTenants,
  getTenantById,
  getTenantsByProperty,
  createTenant,
  updateTenant,
  deleteTenant,
};
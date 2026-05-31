const Property = require('../models/Property');

// @desc    Get all properties
// @route   GET /api/properties
const getProperties = async (req, res) => {

  console.log("HI")
  try {
    const properties = await Property.find().populate('property_manager_id', '-password');
    res.status(200).json(properties);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('property_manager_id', '-password');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new property
// @route   POST /api/properties
const createProperty = async (req, res) => {
  try {
    const { property_name, address, city, state, zip, property_manager_id } = req.body;

    const property = await Property.create({
      property_name,
      address,
      city,
      state,
      zip,
      property_manager_id,
    });

    res.status(201).json(property);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const { property_name, address, city, state, zip, property_manager_id } = req.body;

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { property_name, address, city, state, zip, property_manager_id },
      { new: true, runValidators: true }
    ).populate('property_manager_id', '-password');

    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
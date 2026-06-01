const Contractor = require('../models/Contractor');
const User = require('../models/User');

// @desc    Get all contractors
// @route   GET /api/contractors
const getContractors = async (req, res) => {
  try {
    const contractors = await Contractor.find();
    res.status(200).json(contractors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single contractor by ID
// @route   GET /api/contractors/:id
const getContractorById = async (req, res) => {
  try {


    const contractor = await Contractor.findById(req.params.id);
   
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }
    res.status(200).json(contractor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contractors by trade type
// @route   GET /api/contractors/trade/:tradeType
const getContractorsByTrade = async (req, res) => {
  try {
    const contractors = await Contractor.find({
      trade_type: req.params.tradeType,
      status: 'active',
    });
    res.status(200).json(contractors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new contractor
// @route   POST /api/contractors
const createContractor = async (req, res) => {
  try {
    const { company_name, contact_name, phone, email, trade_type, service_area, status } = req.body;

    const existingContractor = await Contractor.findOne({ email });
    if (existingContractor) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const contractor = await Contractor.create({
      company_name,
      contact_name,
      phone,
      email,
      trade_type,
      service_area,
      status,
    });

    res.status(201).json(contractor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a contractor
// @route   PUT /api/contractors/:id
const updateContractor = async (req, res) => {
  try {
    const { company_name, contact_name, phone, email, trade_type, service_area, status } = req.body;

    
    const contractor = await Contractor.findById(req.params.id)
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    if (email && email !== contractor.email) {
      const existingContractor = await Contractor.findOne({email:user.email});
      if (existingContractor) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updatedContractor = await Contractor.updateOne({email:user.email},{ company_name, contact_name, phone, email, trade_type, service_area, status },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedContractor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const adminUpdateContractor = async (req, res) => {
  try {
    const { company_name, contact_name, phone, email, trade_type, service_area, status } = req.body;

  
    const contractor = await Contractor.findById(req.params.id)
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    if (email && email !== contractor.email) {
      const existingContractor = await Contractor.findById(req.params.id);
      if (existingContractor) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updatedContractor = await Contractor.findByIdAndUpdate(req.params.id,{ company_name, contact_name, phone, email, trade_type, service_area, status },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedContractor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a contractor
// @route   DELETE /api/contractors/:id
const deleteContractor = async (req, res) => {
  try {
 
    const contractor = await Contractor.findById(req.params.id)
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    await Contractor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contractor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const adminDeleteContractor = async (req, res) => {
  try {
   
    const contractor = await Contractor.findById(req.params.id);
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    await Contractor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contractor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getContractors,
  getContractorById,
  getContractorsByTrade,
  createContractor,
  updateContractor,
  deleteContractor,
  adminUpdateContractor,
  adminDeleteContractor
};
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const Contractor = require('../models/Contractor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ─── Helper: generate JWT ─────────────────────────────────────────────────────

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── @desc    Login — all roles (admin, tenant, contractor)
// ─── @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check status
    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact support.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Build response payload — attach role-specific profile
    let profile = null;

    if (user.role === 'tenant') {
      profile = await Tenant.findOne({ user_id: user._id })
        .populate('property_id')
        .populate('unit_id');
    }

    if (user.role === 'contractor') {
      profile = await Contractor.findOne({ email: user.email });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @desc    Register tenant
// ─── @route   POST /api/auth/register/tenant
const registerTenant = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      property_id,
      unit_id,
    } = req.body;

  
    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password || !property_id || !unit_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      phone,
      role: 'tenant',
      password: hashedPassword,
      status: 'active',
    });

    // Create tenant profile
    const tenant = await Tenant.create({
      user_id: user._id,
      property_id,
      unit_id,
      lease_status: 'active',
    });

    const populatedTenant = await Tenant.findById(tenant._id)
      .populate('property_id')
      .populate('unit_id');

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
      profile: populatedTenant,
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
};

// ─── @desc    Register contractor
// ─── @route   POST /api/auth/register/contractor
const registerContractor = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      company_name,
      trade_type,
      service_area,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password || !company_name || !trade_type || !service_area) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      phone,
      role: 'contractor',
      password: hashedPassword,
      status: 'active',
    });

    // Create contractor profile
    const contractor = await Contractor.create({
      company_name,
      contact_name: `${firstName} ${lastName}`,
      phone,
      email,
      trade_type: trade_type.toLowerCase().replace(' ', '_'),
      service_area,
      status: 'active',
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
      profile: contractor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @desc    Get current logged-in user
// ─── @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile = null;

    if (user.role === 'tenant') {
      profile = await Tenant.findOne({ user_id: user._id })
        .populate('property_id')
        .populate('unit_id');
    }

    if (user.role === 'contractor') {
      profile = await Contractor.findOne({ email: user.email });
    }

    res.status(200).json({ user, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const registerAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      company,
      jobTitle,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !company) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user — same User model, role = 'admin'
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      phone,
      role: 'admin',
      password: hashedPassword,
      status: 'active',
      company,        // optional extra fields
      jobTitle,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        company: user.company,
        jobTitle: user.jobTitle,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  login,
  registerTenant,
  registerContractor,
  registerAdmin,
  getMe,
};
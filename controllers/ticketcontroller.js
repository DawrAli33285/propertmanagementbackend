const Ticket = require('../models/Ticket');
const ContractorAssignment = require('../models/Contractorssignment');
const User = require('../models/User');
const Contractor = require('../models/Contractor');
const Tenant = require('../models/Tenant');

// @desc    Get all tickets
// @route   GET /api/tickets
const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('tenant_id')
      .populate('property_id')
      .populate('unit_id')
      .populate('assigned_contractor_id')
      .sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single ticket by ID
// @route   GET /api/tickets/:id
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('tenant_id')
      .populate('property_id')
      .populate('unit_id')
      .populate('assigned_contractor_id');
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tickets by property
// @route   GET /api/tickets/property/:propertyId
const getTicketsByProperty = async (req, res) => {
  try {
    const tickets = await Ticket.find({ property_id: req.params.propertyId })
      .populate('tenant_id')
      .populate('property_id')
      .populate('unit_id')
      .populate('assigned_contractor_id')
      .sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tickets by tenant
// @route   GET /api/tickets/tenant/:tenantId
const getTicketsByTenant = async (req, res) => {
  try {
    console.log(req.params)
    const tickets = await Ticket.find({ tenant_id: req.params.tenantId })
      .populate('tenant_id')
      .populate('property_id')
      .populate('unit_id')
      .populate('assigned_contractor_id')
      .sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tickets by contractor
// @route   GET /api/tickets/contractor/:contractorId
const getTicketsByContractor = async (req, res) => {
  try {
 
   
    const contractor = await Contractor.findById(req.params.contractorId)
   
    const tickets = await Ticket.find({ assigned_contractor_id: contractor._id })
      .populate('tenant_id')
      .populate('property_id')
      .populate('unit_id')
      .populate('assigned_contractor_id')
      .sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tickets by status
// @route   GET /api/tickets/status/:status
const getTicketsByStatus = async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: req.params.status })
      .populate('tenant_id')
      .populate('property_id')
      .populate('unit_id')
      .populate('assigned_contractor_id')
      .sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new ticket and auto-assign contractor
// @route   POST /api/tickets
const createTicket = async (req, res) => {
  try {
    const {
      tenant_id,
      property_id,
      unit_id,
      issue_type,
      priority,
      description,
      permission_to_enter,
      preferred_contact_method,
    } = req.body;

    // Generate ticket number
    const count = await Ticket.countDocuments();
    const ticket_number = `TKT-${String(count + 1).padStart(5, '0')}`;

    // Auto-assign contractor based on property and issue type
    const assignment = await ContractorAssignment.findOne({
      property_id,
      trade_type: issue_type,
    }).sort({ priority_order: 1 });

  
    const ticket = await Ticket.create({
      ticket_number,
      tenant_id,
      property_id,
      unit_id,
      issue_type,
      priority,
      description,
      permission_to_enter,
      preferred_contact_method,
      status: 'submitted',
      assigned_contractor_id: assignment ? assignment.contractor_id : null,
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('tenant_id')
      .populate('property_id')
      .populate('unit_id')
      .populate('assigned_contractor_id');

    res.status(201).json(populatedTicket);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket status
// @route   PUT /api/tickets/:id/status
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('tenant_id')
      .populate('property_id')
      .populate('unit_id')
      .populate('assigned_contractor_id');

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign or reassign contractor to ticket
// @route   PUT /api/tickets/:id/assign
const assignContractor = async (req, res) => {
  try {
    const { contractor_id } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assigned_contractor_id: contractor_id, status: 'assigned' },
      { new: true, runValidators: true }
    )
      .populate('tenant_id')
      .populate('property_id')
      .populate('unit_id')
      .populate('assigned_contractor_id');

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a ticket
// @route   DELETE /api/tickets/:id
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    await Ticket.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTickets,
  getTicketById,
  getTicketsByProperty,
  getTicketsByTenant,
  getTicketsByContractor,
  getTicketsByStatus,
  createTicket,
  updateTicketStatus,
  assignContractor,
  deleteTicket,
};
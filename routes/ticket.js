const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/ticketcontroller');

router.get('/', getTickets);
router.get('/property/:propertyId', getTicketsByProperty);
router.get('/tenant/:tenantId', getTicketsByTenant);
router.get('/contractor/:contractorId', getTicketsByContractor);
router.get('/status/:status', getTicketsByStatus);
router.get('/:id', getTicketById);
router.post('/', createTicket);
router.put('/:id/status', updateTicketStatus);
router.put('/:id/assign', assignContractor);
router.delete('/:id', deleteTicket);

module.exports = router;
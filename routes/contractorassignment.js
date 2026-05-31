const express = require('express');
const router = express.Router();
const {
  getContractorAssignments,
  getContractorAssignmentById,
  getAssignmentsByProperty,
  getAssignmentsByPropertyAndTrade,
  createContractorAssignment,
  updateContractorAssignment,
  deleteContractorAssignment,
} = require('../controllers/contractorassingment');

router.get('/', getContractorAssignments);
router.get('/property/:propertyId', getAssignmentsByProperty);
router.get('/property/:propertyId/trade/:tradeType', getAssignmentsByPropertyAndTrade);
router.get('/:id', getContractorAssignmentById);
router.post('/', createContractorAssignment);
router.put('/:id', updateContractorAssignment);
router.delete('/:id', deleteContractorAssignment);

module.exports = router;
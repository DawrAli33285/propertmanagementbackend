const express = require('express');
const router = express.Router();
const {
  getContractors,
  getContractorById,
  getContractorsByTrade,
  createContractor,
  updateContractor,
  adminUpdateContractor,
  deleteContractor,
  adminDeleteContractor
} = require('../controllers/contractorcontroller');

router.get('/', getContractors);
router.get('/trade/:tradeType', getContractorsByTrade);
router.get('/:id', getContractorById);
router.post('/', createContractor);
router.put('/:id', updateContractor);
router.delete('/:id', deleteContractor);
router.put('/admin/:id',adminUpdateContractor)
router.delete('/admin/:id',adminDeleteContractor)

module.exports = router;
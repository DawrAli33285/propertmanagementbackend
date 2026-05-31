const express = require('express');
const router = express.Router();
const {
  getUnits,
  getUnitById,
  getUnitsByProperty,
  createUnit,
  updateUnit,
  deleteUnit,
} = require('../controllers/unitcontroller');

router.get('/', getUnits);
router.get('/property/:propertyId', getUnitsByProperty);
router.get('/:id', getUnitById);
router.post('/', createUnit);
router.put('/:id', updateUnit);
router.delete('/:id', deleteUnit);

module.exports = router;
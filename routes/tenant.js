const express = require('express');
const router = express.Router();
const {
  getTenants,
  getTenantById,
  getTenantsByProperty,
  createTenant,
  updateTenant,
  deleteTenant,
} = require('../controllers/tenantcontroller');

router.get('/', getTenants);
router.get('/property/:propertyId', getTenantsByProperty);
router.get('/:id', getTenantById);
router.post('/', createTenant);
router.put('/:id', updateTenant);
router.delete('/:id', deleteTenant);

module.exports = router;
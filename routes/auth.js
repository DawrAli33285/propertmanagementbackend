const express = require('express');
const router = express.Router();
const { login, registerTenant, registerContractor, getMe, registerAdmin} = require('../controllers/authcontroller');
const { protect } = require('../middleware/middleware');

router.post('/login', login);
router.post('/register/tenant', registerTenant);
router.post('/register/contractor', registerContractor);
router.get('/me', protect, getMe);
router.post('/register/admin', registerAdmin);

module.exports = router;
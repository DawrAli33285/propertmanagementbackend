const express = require('express');
const router = express.Router();
const {
  getMediaByTicket,
  getMediaById,
  addMedia,
  deleteMedia,
} = require('../controllers/ticketmediacontroller');

router.get('/ticket/:ticketId', getMediaByTicket);
router.get('/:id', getMediaById);
router.post('/', addMedia);
router.delete('/:id', deleteMedia);

module.exports = router;
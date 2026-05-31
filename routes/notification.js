const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getNotificationById,
  getNotificationsByRecipient,
  getNotificationsByTicket,
  createNotification,
  updateNotificationStatus,
  deleteNotification,
} = require('../controllers/notificationcontroller');

router.get('/', getNotifications);
router.get('/recipient/:recipientId', getNotificationsByRecipient);
router.get('/ticket/:ticketId', getNotificationsByTicket);
router.get('/:id', getNotificationById);
router.post('/', createNotification);
router.put('/:id/status', updateNotificationStatus);
router.delete('/:id', deleteNotification);

module.exports = router;
const Notification = require('../models/Notification');
const Ticket = require('../models/Ticket');

// @desc    Get all notifications
// @route   GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('ticket_id')
      .populate('recipient_id', '-password')
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single notification by ID
// @route   GET /api/notifications/:id
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('ticket_id')
      .populate('recipient_id', '-password');
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all notifications for a recipient
// @route   GET /api/notifications/recipient/:recipientId
const getNotificationsByRecipient = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient_id: req.params.recipientId,
    })
      .populate('ticket_id')
      .populate('recipient_id', '-password')
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all notifications for a ticket
// @route   GET /api/notifications/ticket/:ticketId
const getNotificationsByTicket = async (req, res) => {
  try {
    const notifications = await Notification.find({
      ticket_id: req.params.ticketId,
    })
      .populate('ticket_id')
      .populate('recipient_id', '-password')
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a notification
// @route   POST /api/notifications
const createNotification = async (req, res) => {
  try {
    const { ticket_id, recipient_id, channel, message } = req.body;

    const ticket = await Ticket.findById(ticket_id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const notification = await Notification.create({
      ticket_id,
      recipient_id,
      channel,
      message,
      status: 'pending',
    });

    const populatedNotification = await Notification.findById(notification._id)
      .populate('ticket_id')
      .populate('recipient_id', '-password');

    res.status(201).json(populatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update notification status
// @route   PUT /api/notifications/:id/status
const updateNotificationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        status,
        sent_at: status === 'sent' ? new Date() : notification.sent_at,
      },
      { new: true, runValidators: true }
    )
      .populate('ticket_id')
      .populate('recipient_id', '-password');

    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  getNotificationsByRecipient,
  getNotificationsByTicket,
  createNotification,
  updateNotificationStatus,
  deleteNotification,
};
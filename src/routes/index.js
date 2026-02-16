const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const events = require('../controllers/eventController');
const bookings = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middlewares/auth');

// Auth Routes
router.post('/register', auth.register);
router.post('/login', auth.login);

// Event Routes
router.get('/events', events.getAllEvents);
router.post('/events', protect, restrictTo('organizer'), events.createEvent);

// Booking Routes
router.post('/bookings', protect, restrictTo('attendee'), bookings.bookTicket);

module.exports = router;
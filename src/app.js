const express = require('express');
const { protect, restrictTo } = require('./middlewares/auth');
const eventCtrl = require('./controllers/eventController');
const bookingCtrl = require('./controllers/bookingController');

const app = express();
app.use(express.json());

// Public Routes
app.get('/events', eventCtrl.getAllEvents);

// Organizer Routes
app.post('/events', protect, restrictTo('ORGANIZER'), eventCtrl.createEvent);

// Attendee Routes
app.post('/bookings', protect, restrictTo('ATTENDEE'), bookingCtrl.bookTicket);

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
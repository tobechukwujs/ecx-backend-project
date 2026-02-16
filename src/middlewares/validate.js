const Joi = require('joi');

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('organizer', 'attendee').required()
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  createEvent: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    location: Joi.string().required(),
    dateTime: Joi.date().iso().required(),
    ticketPrice: Joi.number().min(0).default(0),
    totalSeats: Joi.number().integer().min(1).required()
  }),
  booking: Joi.object({
    eventId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).max(10).required()
  })
};

const validate = (schemaName) => (req, res, next) => {
  const { error } = schemas[schemaName].validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validate };
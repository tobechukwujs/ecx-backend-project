const db = require('../config/db');

exports.createEvent = async (req, res, next) => {
    try {
        const { title, description, location, dateTime, ticketPrice, totalSeats } = req.body;
        const result = await db.query(
            'INSERT INTO events (title, description, location, date_time, ticket_price, total_seats, remaining_seats, organizer_id) VALUES ($1, $2, $3, $4, $5, $6, $6, $7) RETURNING *',
            [title, description, location, dateTime, ticketPrice, totalSeats, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

exports.getAllEvents = async (req, res, next) => {
    try {
        const { page = 1, location } = req.query;
        const offset = (page - 1) * 10;
        
        let queryText = 'SELECT * FROM events WHERE status = $1';
        let queryParams = ['published'];

        if (location) {
            queryText += ' AND location ILIKE $2 LIMIT 10 OFFSET $3';
            queryParams.push(`%${location}%`, offset);
        } else {
            queryText += ' LIMIT 10 OFFSET $2';
            queryParams.push(offset);
        }

        const result = await db.query(queryText, queryParams);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};
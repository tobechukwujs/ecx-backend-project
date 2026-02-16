const db = require('../config/db');

exports.bookTicket = async (req, res, next) => {
    const { eventId, quantity } = req.body;
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        const eventRes = await client.query(
            'SELECT * FROM events WHERE id = $1 FOR UPDATE', 
            [eventId]
        );
        const event = eventRes.rows[0];

        if (!event || event.status !== 'published') throw new Error("Event unavailable");
        if (event.remaining_seats < quantity) throw new Error("Not enough seats");
        if (new Date(event.date_time) < new Date()) throw new Error("Event date has passed");

        await client.query(
            'UPDATE events SET remaining_seats = remaining_seats - $1 WHERE id = $2',
            [quantity, eventId]
        );

        const booking = await client.query(
            'INSERT INTO bookings (user_id, event_id, ticket_quantity) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, eventId, quantity]
        );

        await client.query('COMMIT');
        res.status(201).json(booking.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
};
exports.getMyBookings = async (req, res, next) => {
    try {
        const result = await db.query(
            `SELECT b.id, b.ticket_quantity, b.status, b.created_at, 
                    e.title, e.location, e.date_time 
             FROM bookings b 
             JOIN events e ON b.event_id = e.id 
             WHERE b.user_id = $1`, 
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) { next(err); }
};
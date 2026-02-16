const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await db.query(
            'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
            [email, hashedPassword, role || 'attendee']
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token, data: { user } });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        next(err);
    }
};
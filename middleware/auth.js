// middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../db/db');
const JWT_SECRET = 'secret';

function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'Token required' });
	}

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ message: 'Invalid token' });
		}

		// Fetch user from the database using the decoded token
		const dbUser = db.prepare('SELECT * FROM user WHERE id = ?').get(user.id);
		if (!dbUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		req.user = dbUser;
		next();
	});
}

module.exports = authenticateToken;

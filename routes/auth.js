const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

const router = express.Router();
const JWT_SECRET = 'secret';

router.post('/register', (req, res) => {
	const { email, password, name } = req.body;

	const existingUser = db.prepare('SELECT * FROM user WHERE email = ?').get(email);
	if (existingUser){
		return res.status(400).json({ message: 'User already exists' });
	}

	const hashedPassword = bcrypt.hashSync(password, 8);
	db.prepare('INSERT INTO user (name, email, password) VALUES (?, ?, ?').run(name, email, hashedPassword);

	res.status(201).json({ message: 'User registered' });
});

router.post('/login', (req, res) => {
	const { email, password } = req.body;

	const user = db.prepare('SELECT * FROM user WHERE email = ?').get(email);
	if (!user) {
		return res.status(400).json({ message: 'Invalid email or password' });
	}

	const validPassword = bcrypt.compareSync(password, user.password);
	if (!validPassword) {
		return res.status(400).json({ message: 'Invalid email or password' });
	}

	const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {expiresIn: '1h' });
	res.json({ token });
});

module.exports = router;

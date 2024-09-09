// tasks.js
const express = require('express');
const db = require('../db/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Use authentication middleware for all routes
router.use(authenticateToken);

router.get('/', (req, res) => {
	const tasks = db.prepare('SELECT * FROM task WHERE user_id = ?').all(req.user.id);
	res.json(tasks);
});

router.post('/', (req, res) => {
	const { title, description } = req.body;
	const task = db.prepare('INSERT INTO task (title, description, user_id) VALUES (?, ?, ?)').run(title, description, req.user.id);
	res.status(201).json({ id: task.lastInsertRowId });
});

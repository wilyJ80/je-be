const express = require('express');
const db = require('../db/db');

const router = express.Router();

router.get('/', (req, res) => {
	const tasks = db.prepare('SELECT * FROM task WHERE user_id = ?').all(req.user.id);
	res.json(tasks);
});

router.post('/', (req, res) => {
	const { title, description } = req.body;
	const task = db.prepare('INSERT INTO TASK (title, description, user_id) VALUES (?, ?, ?').run(title, description, req.user.id);
	res.status(201).json({id: task.lastInsertRowId });
});

router.put('/:id/complete', (req, res) => {
	const { id } = req.params;
	db.prepare('UPDATE task SET finished = 1 WHERE id = ? AND user_id = ?').run(id, req.user.id);
	res.json({ message: 'Task marked as completed' })
});

router.put('/:id', (req, res) => {
	const { id } = req.params;
	const { title, description } = req.body;
	db.prepare('UPDATE task SET title = ?, description = ? WHERE id = ? AND user_id = ?').run(title, description, id, req.user.id);
	res.json({ message: 'Task updated' });
});

router.delete('/:id', (req, res) => {
	const { id } = req.params;
	db.prepare('DELETE FROM task WHERE id = ? AND user_id = ?').run(id, req.user.id);
	res.json({ message: 'Task deleted' });
});

module.exports = router;

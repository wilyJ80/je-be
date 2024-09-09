import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import db from '../../db/db';

beforeAll(() => {
	db.exec(`DELETE FROM task`);
	db.exec(`DELETE FROM user`);
});

describe('Database Unit Tests', () => {
	it('should insert a user and fetch it from the database', () => {
		const stmt = db.prepare('INSERT INTO user (name, email, password) VALUES (?, ?, ?)');
		stmt.run('Victor Hugo', 'victor@example.com', 'plaintextpassword');

		const user = db.prepare('SELECT * FROM user WHERE email = ?').get('victor@example.com');
		expect(user).toBeTruthy();
		expect(user.name).toBe('Victor Hugo');
	});

	it('should insert a task for a user and fetch it', () => {
		const userStmt = db.prepare('INSERT INTO user (name, email, password) VALUES (?, ?, ?)');
		userStmt.run('Vitao Fulano', 'fulano@vmail.com', 'anotherpassword');

		const user = db.prepare('SELECT id FROM user WHERE email = ?').get('fulano@vmail.com');
		const userId = user.id;

		const taskStmt = db.prepare('INSERT INTO task (title, description, user_id) VALUES (?, ?, ?)');
		taskStmt.run('Sunbath', 'Try it in the beach', userId);

		const task = db.prepare('SELECT * FROM task WHERE user_id = ?').get(userId);
		expect(task).toBeTruthy();
		expect(task.title).toBe('Sunbath');
	});
});

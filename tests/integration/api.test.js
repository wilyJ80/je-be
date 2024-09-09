const request = require('supertest');
const app = require('../../app'); // Assuming this is your Express app

describe('API Integration Tests', () => {
	it('should register a user and login', async () => {
		const userPayload = { email: 'test@example.com', password: 'test', name: 'Test User' };

		await request(app)
			.post('/auth/register')
			.send(userPayload)
			.expect(201);

		const loginRes = await request(app)
			.post('/auth/login')
			.send({ email: 'test@example.com', password: 'test' })
			.expect(200);

		const token = loginRes.body.token;
		expect(token).toBeDefined();
	});

	it('should create a task after logging in', async () => {
		const loginRes = await request(app)
			.post('/auth/login')
			.send({ email: 'test@example.com', password: 'test' });

		const token = loginRes.body.token;

		await request(app)
			.post('/tasks')
			.set('Authorization', `Bearer ${token}`)
			.send({ title: 'Test Task', description: 'Description' })
			.expect(201);
	});
});

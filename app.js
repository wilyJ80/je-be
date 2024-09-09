const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'secret';

app.use(cors());
app.use(bodyParser.json());

const authenticateToken = (req, res, next) => {
	const token = req.headers['authorization'];
	if (!token) {
		return res.sendStatus(403);
	}

	jwt.verify(token,JWT_SECRET, (err, user) => {
		if (err) {
			return res.sendStatus(403);
		}
		req.user = user;
		next();
	});
};

app.use('/auth', authRoutes);
app.use('/tasks', authenticateToken, taskRoutes);

app.listen(PORT () => {
	console.log(`Server running on port ${PORT}`);
});

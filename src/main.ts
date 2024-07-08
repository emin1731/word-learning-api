import express from 'express';
import { LoggerService } from './logger/logger.service';

const PORT = 5002;

const app = express();

app.get('/hello', (req, res) => {
	res.send('Привет!');
});

app.listen(PORT, () => {
	const logger = new LoggerService();
	logger.log(`Server is running on http://localhost:${PORT}`);
});

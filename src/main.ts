import express from 'express';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from './config/config.service';

const configService = new ConfigService();
const PORT = configService.get('PORT');

const app = express();

app.get('/hello', (req, res) => {
	res.send('Привет!');
});

app.listen(PORT, () => {
	const logger = new LoggerService();
	logger.log(`Server is running on http://localhost:${PORT}`);
});

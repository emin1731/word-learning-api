import express, { Express } from 'express';
import { Server } from 'http';
import { ILoggerService } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { SequelizeService } from './config/sequelize';
import { Sequelize } from 'sequelize';
import 'reflect-metadata';

@injectable()
export class App {
	app: Express;
	port: string;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILoggerService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.SequelizeService) private sequelizeService: SequelizeService,
	) {
		this.app = express();
		this.port = configService.get('PORT');
	}

	public async init(): Promise<void> {
		this.server = this.app.listen(this.port);
		this.sequelizeService
			.getInstance()
			.authenticate()
			.then(() => {
				this.logger.log('Connection to the database has been established successfully.');
			})
			.catch((err: Error) => {
				this.logger.error('Unable to connect to the database:', err);
			});

		this.logger.log(`Server is running on http://localhost:${this.port}`);
	}
}

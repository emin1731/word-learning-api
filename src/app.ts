import express, { Express } from 'express';
import { Server } from 'http';
import { ILoggerService } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { SequelizeService } from './config/sequelize';
import { Sequelize } from 'sequelize';
import 'reflect-metadata';
import { UserController } from './controllers/user.controller';

// @injectable()
// export class App {
// 	app: Express;
// 	port: string;
// 	server: Server;

// 	constructor(
// 		@inject(TYPES.ILogger) private logger: ILoggerService,
// 		@inject(TYPES.IConfigService) private configService: IConfigService,
// 		@inject(TYPES.SequelizeService) private sequelizeService: SequelizeService,
// 		@inject(TYPES.IUsersController) private userController: UserController,
// 	) {
// 		this.app = express();
// 		this.port = configService.get('PORT');
// 	}
// 	useRoutes(): void {
// 		this.app.use('/users', this.userController.router);
// 	}

// 	public async init(): Promise<void> {
// 		this.useRoutes();
// 		this.server = this.app.listen(this.port);

// 		this.sequelizeService
// 			.getInstance()
// 			.authenticate()
// 			.then(() => {
// 				this.logger.log('Connection to the database has been established successfully.');
// 			})
// 			.catch((err: Error) => {
// 				this.logger.error('Unable to connect to the database:', err);
// 			});

// 		this.logger.log(`Server is running on http://localhost:${this.port}`);
// 	}
// }

import { json } from 'body-parser';
import { ExeptionFilter } from './error/exeption.filter';
@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILoggerService,
		@inject(TYPES.IUsersController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
		@inject(TYPES.SequelizeService) private sequelizeService: SequelizeService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.sequelizeService.getInstance();

		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}
}

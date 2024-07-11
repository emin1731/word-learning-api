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
import { json } from 'body-parser';
import { ExeptionFilter } from './error/exeption.filter';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILoggerService,
		@inject(TYPES.IUsersController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = +configService.get('PORT');
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
		await this.prismaService.connect();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}
}

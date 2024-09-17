import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'http';
import { ILoggerService } from './interfaces/common/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { IConfigService } from './interfaces/config/config.service.interface';
import { UserController } from './controllers/user.controller';
import { json } from 'body-parser';
import { ExceptionFilter } from './error/exception.filter';
import { PrismaService } from './database/prisma.service';
import { AuthController } from './controllers/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ModuleController } from './controllers/module.controller';
import { TermController } from './controllers/term.controller';

import cors from 'cors';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILoggerService,
		@inject(TYPES.IUsersController) private userController: UserController,
		@inject(TYPES.IAuthController) private authController: AuthController,
		@inject(TYPES.IModuleController) private moduleController: ModuleController,
		@inject(TYPES.ITermController) private termController: TermController,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: ExceptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = +configService.get('API_PORT');
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService, this.logger);
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
		this.app.use('/auth', this.authController.router);
		this.app.use('/', this.moduleController.router);
		this.app.use('/', this.termController.router);
	}
	useCors(): void {
		// Enable CORS for all routes
		this.app.use(
			cors({
				origin: 'http://localhost:5173', // Replace with your frontend origin
				methods: 'GET,POST,PUT,DELETE', // Specify the allowed methods
				credentials: true, // Include credentials like cookies, authorization headers
			}),
		);
	}

	useExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useCors();
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilter();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is running on http://localhost:${this.port}`);
	}
}

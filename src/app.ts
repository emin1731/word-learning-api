import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'http';
import { ILoggerService } from './common/logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { UserController } from './controllers/user.controller';
import { json } from 'body-parser';
import { ExeptionFilter } from './error/exeption.filter';
import { PrismaService } from './database/prisma.service';
import { AuthController } from './controllers/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILoggerService,
		@inject(TYPES.IUsersController) private userController: UserController,
		@inject(TYPES.IAuthController) private authController: AuthController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = +configService.get('PORT');
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService, this.logger);
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
		this.app.use('/auth', this.authController.router);
	}

	useExceptionFilter(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilter();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is running on http://localhost:${this.port}`);
	}
}

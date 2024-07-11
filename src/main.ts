import express from 'express';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';

import { ILoggerService } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { App } from './app';
import { SequelizeService } from './config/sequelize';
import { IUsersController } from './controllers/user.controller.interface';
import { IUsersService } from './services/user.service.interface';
// import { UsersService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { ExeptionFilter } from './error/exeption.filter';
import { IExeptionFilter } from './error/exeption.filter.interface';
import { UserService } from './services/user.service';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<ILoggerService>(TYPES.ILogger).to(LoggerService);
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IUsersController>(TYPES.IUsersController).to(UserController);
	bind<IUsersService>(TYPES.IUsersService).to(UserService);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<SequelizeService>(TYPES.SequelizeService).to(SequelizeService);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();

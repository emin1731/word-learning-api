import express from 'express';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';

import { ILoggerService } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { App } from './app';
import { SequelizeService } from './config/sequelize';

const configService = new ConfigService();
const PORT = configService.get('PORT');

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<ILoggerService>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<SequelizeService>(TYPES.SequelizeService).to(SequelizeService).inSingletonScope();
});

export interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();

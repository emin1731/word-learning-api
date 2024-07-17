import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';

import { ILoggerService } from './common/logger/logger.interface';
import { LoggerService } from './common/logger/logger.service';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { App } from './app';
import { IUsersController } from './controllers/user.controller.interface';
import { IUsersService } from './services/user.service.interface';
import { UserController } from './controllers/user.controller';
import { ExeptionFilter } from './error/exeption.filter';
import { IExeptionFilter } from './error/exeption.filter.interface';
import { UserService } from './services/user.service';
import { PrismaService } from './database/prisma.service';
import { IUsersRepository } from './repository/users.repository.interface';
import { UsersRepository } from './repository/users.repository';
import { IAuthController } from './controllers/auth.controller.interface';
import { AuthRepository } from './repository/auth.repository';
import { AuthController } from './controllers/auth.controller';
import { IAuthService } from './services/auth.service.interface';
import { AuthService } from './services/auth.service';
import { IAuthRepository } from './repository/auth.repository.interface';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<ILoggerService>(TYPES.ILogger).to(LoggerService);
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();

	bind<IUsersController>(TYPES.IUsersController).to(UserController);
	bind<IUsersService>(TYPES.IUsersService).to(UserService);
	bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository).inSingletonScope();

	bind<IAuthController>(TYPES.IAuthController).to(AuthController);
	bind<IAuthService>(TYPES.IAuthService).to(AuthService);
	bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepository);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();

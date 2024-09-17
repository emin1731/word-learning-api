import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';

import { ILoggerService } from './interfaces/common/logger.interface';
import { LoggerService } from './common/logger.service';
import { ConfigService } from './config/config.service';
import { IConfigService } from './interfaces/config/config.service.interface';
import { App } from './app';
import { IUsersController } from './interfaces/controllers/user.controller.interface';
import { IUsersService } from './interfaces/services/user.service.interface';
import { UserController } from './controllers/user.controller';
import { ExceptionFilter } from './error/exception.filter';
import { IExceptionFilter } from './interfaces/error/exception.filter.interface';
import { UserService } from './services/user.service';
import { PrismaService } from './database/prisma.service';
import { IUsersRepository } from './interfaces/repositories/users.repository.interface';
import { UsersRepository } from './repository/user.repository';
import { IAuthController } from './interfaces/controllers/auth.controller.interface';
import { AuthRepository } from './repository/auth.repository';
import { AuthController } from './controllers/auth.controller';
import { IAuthService } from './interfaces/services/auth.service.interface';
import { AuthService } from './services/auth.service';
import { IAuthRepository } from './interfaces/repositories/auth.repository.interface';
import { JWTService } from './common/jwt';
import { IModuleService } from './interfaces/services/module.service.interface';
import { ModuleService } from './services/module.service';
import { IModuleRepository } from './interfaces/repositories/module.repository.interface';
import { ModuleRepository } from './repository/module.repository';
import { IModuleController } from './interfaces/controllers/module.controller.interface';
import { ModuleController } from './controllers/module.controller';
import { ITermRepository } from './interfaces/repositories/term.repository.interface';
import { TermRepository } from './repository/term.repository';
import { ITermService } from './interfaces/services/term.service.interface';
import { TermService } from './services/term.service';
import { ITermController } from './interfaces/controllers/term.controller.interface';
import { TermController } from './controllers/term.controller';
import { IResetTokenRepository } from './interfaces/repositories/reset-token.repository.interface';
import { ResetTokenRepository } from './repository/reset-token.repository';
import { ITokenSender } from './interfaces/common/token-sender';
import { TokenSender } from './common/token-sender';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<ILoggerService>(TYPES.ILogger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();

	bind<IUsersController>(TYPES.IUsersController).to(UserController);
	bind<IUsersService>(TYPES.IUsersService).to(UserService);
	bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository).inSingletonScope();

	bind<IAuthController>(TYPES.IAuthController).to(AuthController);
	bind<IAuthService>(TYPES.IAuthService).to(AuthService);
	bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepository);
	bind<JWTService>(TYPES.JWTService).to(JWTService);

	bind<IModuleRepository>(TYPES.IModuleRepository).to(ModuleRepository);
	bind<IModuleService>(TYPES.IModuleService).to(ModuleService);
	bind<IModuleController>(TYPES.IModuleController).to(ModuleController);

	bind<ITermRepository>(TYPES.ITermRepository).to(TermRepository);
	bind<ITermService>(TYPES.ITermService).to(TermService);
	bind<ITermController>(TYPES.ITermController).to(TermController);

	bind<IResetTokenRepository>(TYPES.IResetTokenRepository).to(ResetTokenRepository);
	bind<ITokenSender>(TYPES.ITokenSender).to(TokenSender);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();

import { inject, injectable } from 'inversify';
import { ILoggerService } from '../common/logger/logger.interface';
import { TYPES } from '../types';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from 'express';
import { IUsersController } from './user.controller.interface';
import { UserLoginDto } from '../dto/user.login.dto';
import { UserRegisterDto } from '../dto/user.register.dto';
import { HTTPError } from '../error/http-error';
import { IUsersService } from '../services/user.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { sign } from 'jsonwebtoken';
import { ValidateMiddleware } from '../middlewares/validate.middleware';
import { IAuthController } from './auth.controller.interface';
import { IAuthService } from '../services/auth.service.interface';

@injectable()
export class AuthController extends BaseController implements IAuthController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILoggerService,
		@inject(TYPES.IUsersService) private userService: IUsersService,
		@inject(TYPES.IAuthService) private authService: IAuthService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				function: this.register,
				middleware: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				function: this.register,
				middleware: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/refreshToken',
				method: 'post',
				function: this.register,
				middleware: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}
	login: (req: Request, res: Response, next: NextFunction) => void;

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.userService.createUser({
			name: body.name,
			email: body.email,
			password: body.password,
		});
		if (!user) {
			return next(new HTTPError(422, 'user already exists'));
		}
		const tokens = this.authService.addRefreshTokenToWhitelist(user);
		this.ok(res, tokens);
	}
}

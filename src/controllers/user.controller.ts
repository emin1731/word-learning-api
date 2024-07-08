import { inject } from 'inversify';
import { ILoggerService } from '../logger/logger.interface';
import { TYPES } from '../types';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from 'express';
import { IUsersController } from './user.interface';
import { UserLoginDto } from '../dto/user.login.dto';
import { UserRegisterDto } from '../dto/user.register.dto';
import { HTTPError } from '../error/http-error';

export class UserController extends BaseController implements IUsersController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILoggerService) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				function: this.login,
				// middleware: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				function: this.register,
				// middleware: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/info',
				method: 'get',
				function: this.info,
				// middleware: [new GuardMiddleware()],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		// const result = await this.userService.validateUser(body);
		// if (!result) {
		// 	return next(new HTTPError('Authorization error', 401, 'login'));
		// }
		// const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
		this.ok(res, 'login res');
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		// const result = await this.userService.createUser(body);
		// if (!result) {
		// 	return next(new HTTPError('The user is already exists', 422));
		// }

		this.ok(res, 'register result');
	}
	async info(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		// const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, 'info res');
	}
}

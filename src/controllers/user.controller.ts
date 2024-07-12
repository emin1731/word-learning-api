import { inject, injectable } from 'inversify';
import { ILoggerService } from '../logger/logger.interface';
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

@injectable()
export class UserController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILoggerService,
		@inject(TYPES.IUsersService) private userService: IUsersService,
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
				function: this.login,
				middleware: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/demo',
				method: 'get',
				function: this.demo,
				// middleware: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}
	demo(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		next(new HTTPError(401, 'auth error', 'login'));
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HTTPError(401, 'Authorization error', 'login'));
		}
		this.ok(res, {});
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'user already exists'));
		}
		this.ok(res, { res: result.email });
	}
}

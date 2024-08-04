import { inject, injectable } from 'inversify';
import { ILoggerService } from '../interfaces/common/logger.interface';
import { TYPES } from '../types';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from 'express';
import { IUsersController } from '../interfaces/controllers/user.controller.interface';
import { UserLoginDto } from '../dto/user.login.dto';
import { UserRegisterDto } from '../dto/user.register.dto';
import { HTTPError } from '../error/http-error';
import { IUsersService } from '../interfaces/services/user.service.interface';
import { ValidateMiddleware } from '../middlewares/validate.middleware';
import { IConfigService } from '../interfaces/config/config.service.interface';

@injectable()
export class UserController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILoggerService,
		@inject(TYPES.IUsersService) private userService: IUsersService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
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
				path: '/profile',
				method: 'get',
				function: this.getProfile,
			},
		]);
	}

	async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user = await this.userService.getUserInfoById(req.body.payload.userId);
			this.ok(res, { res: user });
		} catch (err) {
			if (err instanceof Error) {
				next(new HTTPError(422, 'Error while getting user info', err.message));
			}
		}
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
		this.ok(res, { body });
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

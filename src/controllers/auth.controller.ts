import { inject, injectable } from 'inversify';
import { ILoggerService } from '../interfaces/common/logger.interface';
import { TYPES } from '../types';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from 'express';
import { UserLoginDto } from '../dto/user.login.dto';
import { UserRegisterDto } from '../dto/user.register.dto';
import { HTTPError } from '../error/http-error';
import { IUsersService } from '../interfaces/services/user.service.interface';
import { ValidateMiddleware } from '../middlewares/validate.middleware';
import { IAuthController } from '../interfaces/controllers/auth.controller.interface';
import { IAuthService } from '../interfaces/services/auth.service.interface';
import { RefreshTokenDto } from '../dto/refresh-token';

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
				function: this.login,
				middleware: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/refreshToken',
				method: 'post',
				function: this.refreshToken,
				middleware: [new ValidateMiddleware(RefreshTokenDto)],
			},
			{
				path: '/revokeRefreshTokens',
				method: 'post',
				function: this.revokeRefreshTokens,
			},
		]);
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.userService.createUser(body);
		if (!user) {
			return next(new HTTPError(422, 'user already exists'));
		}
		const tokens = this.authService.addRefreshTokenToWhitelist(user);
		this.ok(res, tokens);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const existingUser = await this.userService.getUserInfo({
			email: body.email,
			password: body.password,
		});
		if (!existingUser) {
			this.loggerService.warn('Null detected');
			return next(new HTTPError(401, 'Authorization error', 'login'));
		}
		const tokens = await this.authService.addRefreshTokenToWhitelist(existingUser);
		this.loggerService.warn('Everying works ');
		this.ok(res, tokens);
	}

	async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshToken } = req.body;
			if (!refreshToken) {
				res.status(400);
				throw new Error('Missing refresh token.');
			}

			const newTokens = await this.authService.refreshTokens(refreshToken);
			this.ok(res, newTokens);
		} catch (err) {
			next(err);
		}
	}

	async revokeRefreshTokens({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { userId } = body;
			await this.authService.revokeTokens(userId);
			this.ok(res, { message: `Tokens revoked for user with id #${userId}` });
		} catch (err) {
			next(err);
		}
	}
}

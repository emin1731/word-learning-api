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

@injectable()
export class AuthController extends BaseController implements IAuthController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILoggerService,
		@inject(TYPES.IUsersService) private userService: IUsersService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				function: this.register1,
				middleware: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}
	login: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => void;

	async register1(
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

	// async register(
	// 	req: Request<{}, {}, UserRegisterDto>,
	// 	res: Response,
	// 	next: NextFunction,
	// ): Promise<void> {
	// 	try {
	// 		const { email, password } = req.body;
	// 		if (!email || !password) {
	// 			res.status(400);
	// 			throw new Error('You must provide an email and a password.');
	// 		}

	// 		const existingUser = await findUserByEmail(email);

	// 		if (existingUser) {
	// 			res.status(400);
	// 			throw new Error('Email already in use.');
	// 		}

	// 		const user = await createUserByEmailAndPassword({ email, password });
	// 		const jti = uuidv4();
	// 		const { accessToken, refreshToken } = generateTokens(user, jti);
	// 		await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

	// 		res.json({
	// 			accessToken,
	// 			refreshToken,
	// 		});
	// 	} catch (err) {
	// 		next(err);
	// 	}
	// }
}

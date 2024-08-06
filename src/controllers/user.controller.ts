import { inject, injectable } from 'inversify';
import { ILoggerService } from '../interfaces/common/logger.interface';
import { TYPES } from '../types';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from 'express';
import { IUsersController } from '../interfaces/controllers/user.controller.interface';
import { HTTPError } from '../error/http-error';
import { IUsersService } from '../interfaces/services/user.service.interface';
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
}

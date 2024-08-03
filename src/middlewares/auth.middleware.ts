import { IMiddleware } from '../interfaces/common/middleware.interface';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../interfaces/config/config.service.interface';
import { ILoggerService } from '../interfaces/common/logger.interface';
import { ExpressReturnType } from '../interfaces/common/routes.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.ILogger) private loggerService: ILoggerService,
	) {}

	execute(req: Request, res: Response, next: NextFunction): ExpressReturnType | void {
		const auth = req.headers.authorization;

		if (!auth) {
			this.loggerService.error('[AuthMiddleware] No authorization header found.');
			return next();
		}

		try {
			const token = auth.split(' ')[1];
			const payload = verify(token, this.configService.get('JWT_ACCESS_SECRET')) as JwtPayload;
			req.body.payload = payload;
			next();
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(`[AuthMiddleware] Authorization error: ${e.message}`);

				if (e.name === 'TokenExpiredError') {
					this.loggerService.error('[AuthMiddleware] TokenExpiredError: ' + e.message);
					return res.status(401).json({ message: 'Token expired' });
				}

				return res.status(401).json({ message: 'Invalid token' });
			}

			this.loggerService.error('[AuthMiddleware] Unknown error during authorization');
			return res.status(500).json({ message: 'Internal server error' });
		}
	}
}

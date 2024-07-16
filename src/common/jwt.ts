import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import jwt from 'jsonwebtoken';
import { UserModel } from '@prisma/client';

injectable();
export class JWTService {
	constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {}

	// Usually I keep the token between 5 minutes - 15 minutes
	generateAccessToken(user: UserModel): string {
		return jwt.sign({ userId: user.id }, this.configService.get('JWT_ACCESS_SECRET'), {
			expiresIn: '5m',
		});
	}

	// I choosed 8h because i prefer to make the user login again each day.
	// But keep him logged in if he is using the app.
	// You can change this value depending on your app logic.
	// I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
	generateRefreshToken(user: UserModel, jti: any): string {
		return jwt.sign(
			{
				userId: user.id,
				jti,
			},
			this.configService.get('JWT_REFRESH_SECRET'),
			{
				expiresIn: '8h',
			},
		);
	}

	public generateTokens(user: UserModel, jti: any): any {
		const accessToken = this.generateAccessToken(user);
		const refreshToken = this.generateRefreshToken(user, jti);

		return {
			accessToken,
			refreshToken,
		};
	}
}

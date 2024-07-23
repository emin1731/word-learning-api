import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '@prisma/client';
import crypto from 'crypto';

export interface GenerateTokensReturn {
	accessToken: string;
	refreshToken: string;
}

@injectable()
export class JWTService {
	constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {}

	// '5m' can usually vary between 5 and 15
	generateAccessToken(user: UserModel): string {
		return jwt.sign({ userId: user.id }, this.configService.get('JWT_ACCESS_SECRET'), {
			expiresIn: '5m',
		});
	}

	// 8h can be changed to another value depending on the application logic.
	// In case of '8h' the user will have to log in if there is no activity for 8 hours
	generateRefreshToken(user: UserModel, jti: string): string {
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

	public generateTokens(user: UserModel, jti: string): GenerateTokensReturn {
		const accessToken = this.generateAccessToken(user);
		const refreshToken = this.generateRefreshToken(user, jti);

		return {
			accessToken,
			refreshToken,
		};
	}
	verify(token: string, secret: string): JwtPayload | string {
		return jwt.verify(token, secret);
	}
	hashToken(token: string): string {
		return crypto.createHash('sha512').update(token).digest('hex');
	}
	generateJti(): string {
		return uuidv4();
	}
}

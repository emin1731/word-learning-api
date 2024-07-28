import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { RefreshToken, UserModel } from '@prisma/client';
import { IAuthService } from './auth.service.interface';
import { IAuthRepository } from '../repository/auth.repository.interface';
import { GenerateTokensReturn, JWTService } from '../common/jwt';
import { IUsersRepository } from '../repository/users.repository.interface';

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.IAuthRepository) private authRepository: IAuthRepository,
		@inject(TYPES.JWTService) private jwtService: JWTService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		// @inject(TYPES.IUsersService) private userService: IUsersService,
		@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository,
	) {}

	async addRefreshTokenToWhitelist(user: UserModel): Promise<GenerateTokensReturn> {
		const jti = this.jwtService.generateJti();
		const { accessToken, refreshToken } = await this.jwtService.generateTokens(user, jti);
		await this.authRepository.addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });
		return { accessToken, refreshToken };
	}
	async validateRefreshToken(refreshToken: string): Promise<RefreshToken | null> {
		const secret = await this.configService.get('JWT_REFRESH_SECRET');

		if (!secret) {
			throw new Error('JWT refresh secret is not defined');
		}

		const payload = this.jwtService.verify(refreshToken, secret);

		if (typeof payload === 'string' || !payload.jti) {
			throw new Error('JWT payload is invalid or does not exist');
		}

		const savedRefreshToken = await this.authRepository.findRefreshTokenById(payload.jti);
		return savedRefreshToken;
	}
	async refreshTokens(refreshToken: string): Promise<GenerateTokensReturn> {
		const secret = await this.configService.get('JWT_REFRESH_SECRET');

		if (!secret) {
			throw new Error('JWT refresh secret is not defined');
		}

		const payload = this.jwtService.verify(refreshToken, secret);

		if (typeof payload === 'string' || !payload.jti) {
			throw new Error('JWT payload is invalid or does not exist');
		}
		const savedRefreshToken = await this.authRepository.findRefreshTokenById(payload.jti);

		if (!savedRefreshToken || savedRefreshToken.revoked) {
			throw new Error('Unauthorized');
		}

		const hashedToken = this.jwtService.hashToken(refreshToken);
		if (hashedToken !== savedRefreshToken.hashedToken) {
			throw new Error('Unauthorized');
		}

		const user = await this.usersRepository.findById(payload.userId);
		if (!user) {
			throw new Error('Unauthorized');
		}

		await this.authRepository.deleteRefreshToken(savedRefreshToken.id);
		const jti = this.jwtService.generateJti();
		const { accessToken, refreshToken: newRefreshToken } = this.jwtService.generateTokens(
			user,
			jti,
		);
		await this.authRepository.addRefreshTokenToWhitelist({
			jti,
			refreshToken: newRefreshToken,
			userId: user.id,
		});

		return { accessToken, refreshToken: newRefreshToken };
	}

	async revokeTokens(userId: string): Promise<void> {
		this.authRepository.updateRefreshTokens(userId);
	}
}

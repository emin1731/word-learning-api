import { inject, injectable } from 'inversify';
import { IConfigService } from '../interfaces/config/config.service.interface';
import { TYPES } from '../types';
import { RefreshToken, UserModel } from '@prisma/client';
import { IAuthService } from '../interfaces/services/auth.service.interface';
import { IAuthRepository } from '../interfaces/repositories/auth.repository.interface';
import { GenerateTokensReturn, JWTService } from '../common/jwt';
import { IUsersRepository } from '../interfaces/repositories/users.repository.interface';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';
import { IResetTokenRepository } from '../interfaces/repositories/reset-token.repository.interface';
import { ITokenSender } from '../interfaces/common/token-sender';
import { compare, hash } from 'bcryptjs';

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.IAuthRepository) private authRepository: IAuthRepository,
		@inject(TYPES.JWTService) private jwtService: JWTService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.IResetTokenRepository) private resetTokenRepository: IResetTokenRepository,
		@inject(TYPES.ITokenSender) private tokenSender: ITokenSender,
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

	async requestPasswordReset(email: string): Promise<void> {
		const user = await this.usersRepository.findByEmail(email);
		if (!user) {
			throw new Error('User not found');
		}

		const token = randomBytes(32).toString('hex'); // Generate token
		const expiresAt = addMinutes(new Date(), 15); // Token valid for 15 mins

		// Save the token in the database
		await this.resetTokenRepository.createResetToken({
			token,
			userId: user.id,
			expiresAt,
		});

		// Send the token via email (setup email service)
		await this.tokenSender.sendResetPasswordEmail(user.email, token);
	}

	async resetPassword(token: string, newPassword: string): Promise<void> {
		const resetToken = await this.resetTokenRepository.findByToken(token);
		if (!resetToken || resetToken.expiresAt < new Date()) {
			throw new Error('Invalid or expired token');
		}

		const hashedPassword = await hash(newPassword, 10);
		await this.usersRepository.updatePassword(resetToken.userId, hashedPassword);

		// Optionally, delete the token after use
		await this.resetTokenRepository.deleteByUserId(resetToken.userId, resetToken.token);
	}
	async changePassword(
		userId: string,
		currentPassword: string,
		newPassword: string,
	): Promise<void> {
		const user = await this.usersRepository.findById(userId);
		if (!user) {
			throw new Error('[AuthService - changePassword()]User not found');
		}

		// Verify current password
		const isPasswordValid = await compare(currentPassword, user.password);
		if (!isPasswordValid) {
			throw new Error('[AuthService - changePassword()] Invalid password');
		}

		// Hash the new password
		const hashedPassword = await hash(newPassword, 10);
		await this.usersRepository.updatePassword(userId, hashedPassword);
	}
}

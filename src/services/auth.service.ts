import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserModel } from '@prisma/client';
import { IAuthService } from './auth.service.interface';
import { IAuthRepository } from '../repository/auth.repository.interface';
import { GenerateTokensReturn, JWTService } from '../common/jwt';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.IAuthRepository) private authRepository: IAuthRepository,
		@inject(TYPES.JWTService) private jwtService: JWTService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {}

	async addRefreshTokenToWhitelist(user: UserModel): Promise<GenerateTokensReturn> {
		const jti = uuidv4();
		const { accessToken, refreshToken } = await this.jwtService.generateTokens(user, jti);
		await this.authRepository.addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });
		return { accessToken, refreshToken };
	}
}

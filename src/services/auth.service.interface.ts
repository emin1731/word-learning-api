import { RefreshToken, UserModel } from '@prisma/client';
import { GenerateTokensReturn } from '../common/jwt';

export interface IAuthService {
	addRefreshTokenToWhitelist: (user: UserModel) => Promise<GenerateTokensReturn>;
	validateRefreshToken: (refreshToken: string) => Promise<RefreshToken | null>;
	refreshTokens: (refreshToken: string) => Promise<GenerateTokensReturn>;
	revokeTokens: (userId: string) => Promise<void>;
}

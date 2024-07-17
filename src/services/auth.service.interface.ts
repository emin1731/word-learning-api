import { UserModel } from '@prisma/client';
import { GenerateTokensReturn } from '../common/jwt';

export interface IAuthService {
	addRefreshTokenToWhitelist: (user: UserModel) => GenerateTokensReturn;
}

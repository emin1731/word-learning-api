import { Prisma, RefreshToken, UserModel } from '@prisma/client';
import { User } from '../models/user.entity';
import { AddRefreshTokenInput } from './auth.repository';

export interface IAuthRepository {
	addRefreshTokenToWhitelist({
		jti,
		refreshToken,
		userId,
	}: AddRefreshTokenInput): Promise<RefreshToken>;

	findRefreshTokenById(id: string): Promise<RefreshToken | null>;

	deleteRefreshToken(id: string): Promise<RefreshToken>;

	revokeTokens(userId: string): Promise<Prisma.BatchPayload>;
}

import { Prisma, RefreshToken } from '@prisma/client';
import { AddRefreshTokenInput } from './auth.repository';

export interface IAuthRepository {
	addRefreshTokenToWhitelist({
		jti,
		refreshToken,
		userId,
	}: AddRefreshTokenInput): Promise<RefreshToken>;

	findRefreshTokenById(id: string): Promise<RefreshToken | null>;

	deleteRefreshToken(id: string): Promise<RefreshToken>;

	updateRefreshTokens(userId: string): Promise<Prisma.BatchPayload>;
}

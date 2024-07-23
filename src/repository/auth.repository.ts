import { RefreshToken, UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { JWTService } from '../common/jwt';

export interface AddRefreshTokenInput {
	jti: string;
	refreshToken: string;
	userId: string;
}

@injectable()
export class AuthRepository {
	constructor(
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.JWTService) private jwtService: JWTService,
	) {}

	// used when we create a refresh token.
	async addRefreshTokenToWhitelist({
		jti,
		refreshToken,
		userId,
	}: AddRefreshTokenInput): Promise<RefreshToken> {
		return this.prismaService.client.refreshToken.create({
			data: {
				id: jti,
				hashedToken: this.jwtService.hashToken(refreshToken),
				userId,
			},
		});
	}

	// used to check if the token sent by the client is in the database.
	async findRefreshTokenById(id: string): Promise<RefreshToken | null> {
		return this.prismaService.client.refreshToken.findUnique({
			where: {
				id,
			},
		});
	}

	// soft delete tokens after usage.
	async deleteRefreshToken(id: string): Promise<RefreshToken> {
		return this.prismaService.client.refreshToken.update({
			where: {
				id,
			},
			data: {
				revoked: true,
			},
		});
	}

	async revokeTokens(userId: string): Promise<Prisma.BatchPayload> {
		return this.prismaService.client.refreshToken.updateMany({
			where: {
				userId,
			},
			data: {
				revoked: true,
			},
		});
	}
}

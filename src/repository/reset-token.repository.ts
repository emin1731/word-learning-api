import { ResetToken } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { JWTService } from '../common/jwt';

@injectable()
export class ResetTokenRepository {
	constructor(
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.JWTService) private jwtService: JWTService,
	) {}

	async createResetToken(resetToken: {
		token: string;
		userId: string;
		expiresAt: Date;
	}): Promise<ResetToken> {
		return await this.prismaService.client.resetToken.create({
			data: {
				token: resetToken.token,
				expiresAt: resetToken.expiresAt,
				userId: resetToken.userId,
			},
		});
	}
}

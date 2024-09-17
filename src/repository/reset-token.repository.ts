import { ResetToken } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { JWTService } from '../common/jwt';
import { IResetTokenRepository } from '../interfaces/repositories/reset-token.repository.interface';

@injectable()
export class ResetTokenRepository implements IResetTokenRepository {
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
	async findByToken(token: string): Promise<ResetToken | null> {
		return await this.prismaService.client.resetToken.findFirst({
			where: {
				token: token,
			},
		});
	}
	async deleteByToken(token: string): Promise<ResetToken> {
		return await this.prismaService.client.resetToken.delete({
			where: {
				token: token,
			},
		});
	}
	async deleteByUserId(userId: string, token: string): Promise<ResetToken> {
		return await this.prismaService.client.resetToken.delete({
			where: {
				id: userId,
				token: token, // Replace with the actual token value
			},
		});
	}
}

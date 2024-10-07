import { ResetToken } from '@prisma/client';

export interface IResetTokenRepository {
	createResetToken: (resetToken: {
		token: string;
		userId: string;
		expiresAt: Date;
	}) => Promise<ResetToken>;
	findByToken(token: string): Promise<ResetToken | null>;
	deleteByToken(token: string): Promise<ResetToken>;
	deleteByUserId(userId: string, token: string): Promise<ResetToken | null | false>;
}

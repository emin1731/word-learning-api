import { ResetToken } from '@prisma/client';

export interface IResetTokenRepository {
	createResetToken: (resetToken: {
		token: string;
		userId: string;
		expiresAt: Date;
	}) => Promise<ResetToken>;
}

import { IsString } from 'class-validator';

export class RefreshTokenDto {
	@IsString({ message: 'Not valid refresh token' })
	refreshToken: string;
}

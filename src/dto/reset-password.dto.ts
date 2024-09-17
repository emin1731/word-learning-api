import { IsString } from 'class-validator';

export class ResetPasswordDto {
	@IsString({ message: 'Not valid token' })
	token: string;

	@IsString({ message: 'Not valid newPassword' })
	newPassword: string;
}

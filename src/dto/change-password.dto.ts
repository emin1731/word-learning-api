import { IsString } from 'class-validator';

export class ChangePasswordDto {
	@IsString({ message: 'Not valid currentPassword' })
	currentPassword: string;

	@IsString({ message: 'Not valid newPassword' })
	newPassword: string;
}

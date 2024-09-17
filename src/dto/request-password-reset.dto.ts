import { IsString } from 'class-validator';

export class RequestPasswordResetDto {
	@IsString({ message: 'Not valid email' })
	email: string;
}

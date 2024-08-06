import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class ModuleDto {
	@IsString({ message: 'Not valid module name' })
	@Length(3, 255, { message: 'Module name must be between 3 and 255 characters' })
	name: string;

	@IsString({ message: 'Not valid password' })
	@Length(3, 255, { message: 'Module name must be between 3 and 255 characters' })
	description: string;

	@IsBoolean({ message: 'Not valid boolean value for isPrivate' })
	@IsOptional()
	isPrivate?: boolean;
}

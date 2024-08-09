import { IsBoolean, IsIn, IsOptional, IsString, Length } from 'class-validator';

export class TermDto {
	@IsString({ message: 'Not valid term name (It should be string)' })
	@Length(1, 255, { message: 'Module name must be between 3 and 255 characters' })
	term: string;

	@IsString({ message: 'Not valid definition name (It should be string)' })
	@Length(1, 255, { message: 'Module name must be between 3 and 255 characters' })
	definition: string;

	@IsBoolean()
	@IsOptional()
	isStarred: boolean = false;

	@IsIn(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'], {
		message: 'Status must be one of the following: NOT_STARTED, IN_PROGRESS, or COMPLETED',
	})
	status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

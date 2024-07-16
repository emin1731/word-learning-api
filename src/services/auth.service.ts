import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserRegisterDto } from '../dto/user.register.dto';
import { UserLoginDto } from '../dto/user.login.dto';
import { IUsersService } from './user.service.interface';
import { User } from '../models/user.entity';
import { IUsersRepository } from '../repository/users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class AuthService {
	constructor(
		@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {}
}

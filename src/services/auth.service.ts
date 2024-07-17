import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserRegisterDto } from '../dto/user.register.dto';
import { UserLoginDto } from '../dto/user.login.dto';
import { IUsersService } from './user.service.interface';
import { User } from '../models/user.entity';
import { IUsersRepository } from '../repository/users.repository.interface';
import { UserModel } from '@prisma/client';
import { IAuthService } from './auth.service.interface';
import { IAuthRepository } from '../repository/auth.repository.interface';

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.IAuthRepository) private authRepository: IAuthRepository,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {}

	// async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
	// 	const newUser = new User(email, name);
	// 	await newUser.setPassword(password, +this.configService.get('SALT'));
	// 	const existedUser = await this.usersRepository.findByEmail(newUser.email);
	// 	if (existedUser) {
	// 		return null;
	// 	}
	// 	return this.usersRepository.create(newUser);
	// }
}

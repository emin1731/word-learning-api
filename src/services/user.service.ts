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
export class UserService implements IUsersService {
	constructor(
		@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password, +this.configService.get('SALT'));
		const existedUser = await this.usersRepository.find(newUser.email);
		if (existedUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		return newUser.comparePassword(existedUser.password);
	}
	getUserInfo: (email: string) => Promise<UserRegisterDto | null>;
}

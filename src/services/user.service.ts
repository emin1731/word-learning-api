import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserRegisterDto } from '../dto/user.register.dto';
import { UserLoginDto } from '../dto/user.login.dto';
import { IUsersService } from './user.service.interface';
import { User } from '../models/user.entity';
// import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements IUsersService {
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		// await newUser.setPassword(password, );
		// проверка что он есть?
		// если есть - возвращаем null
		// если нет - создаём
		return null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
	getUserInfo: (email: string) => Promise<UserRegisterDto | null>;
}

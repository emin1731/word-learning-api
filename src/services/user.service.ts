import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserRegisterDto } from '../dto/user.register.dto';
import { UserLoginDto } from '../dto/user.login.dto';
import { IUsersService } from './user.service.interface';
// import { UserModel } from '@prisma/client';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		// @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}
	async createUser({ name, email, password }: UserRegisterDto): Promise<UserRegisterDto> {
		// const newUser = new User(email, name);
		// const salt = this.configService.get('SALT');
		// await newUser.setPassword(password, Number(salt));
		// const existedUser = await this.usersRepository.find(email);
		// if (existedUser) {
		// 	return null;
		// }
		// return this.usersRepository.create(newUser);
		return { name: 'name', email: 'email', password: 'password' };
	}
	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		// const existedUser = await this.usersRepository.find(email);
		// if (!existedUser) {
		// 	return false;
		// }
		// const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		// return newUser.comparePassword(password);
		return true;
	}
	public async getUserInfo(email: string): Promise<UserLoginDto> {
		// return this.usersRepository.find(email);
		return { email: 'email', password: 'password' };
	}
}

import { UserLoginDto } from '../dto/user.login.dto';
import { UserRegisterDto } from '../dto/user.register.dto';

export interface IUsersService {
	createUser: ({ name, email, password }: UserRegisterDto) => Promise<UserRegisterDto | null>;
	validateUser: ({ email, password }: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserRegisterDto | null>;
}

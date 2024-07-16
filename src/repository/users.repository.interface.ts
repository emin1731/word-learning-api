import { UserModel } from '@prisma/client';
import { User } from '../models/user.entity';

export interface IUsersRepository {
	create: (user: User) => Promise<UserModel>;
	findByEmail: (email: string) => Promise<UserModel | null>;
	findById: (id: string) => Promise<UserModel | null>;
}

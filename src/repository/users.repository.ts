import { UserModel } from '@prisma/client';
import { User } from '../models/user.entity';
import { IUsersRepository } from './users.repository.interface';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({ email, password, name }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: { email, password, username: name },
		});
	}
	findByEmail(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findUnique({ where: { email } });
	}
	findById(id: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findUnique({ where: { id } });
	}
}

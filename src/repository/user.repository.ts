import { UserModel } from '@prisma/client';
import { User } from '../models/user.entity';
import { IUsersRepository } from '../interfaces/repositories/users.repository.interface';
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
	async findByEmail(email: string): Promise<UserModel | null> {
		const res = await this.prismaService.client.userModel.findUnique({ where: { email } });
		return res;
	}
	async findById(id: string): Promise<UserModel | null> {
		return await this.prismaService.client.userModel.findUnique({ where: { id } });
	}
	async updatePassword(id: string, password: string): Promise<UserModel> {
		return await this.prismaService.client.userModel.update({
			where: { id },
			data: { password },
		});
	}
}

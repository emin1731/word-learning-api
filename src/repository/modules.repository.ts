import { Module as ModuleModel } from '@prisma/client';
import { IModulesRepository } from '../interfaces/repositories/modules.repository.interface';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { Module } from '../models/module.entitry';

@injectable()
export class ModulesRepository implements IModulesRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async createModule(userId: string, { name, description }: Module): Promise<ModuleModel> {
		return await this.prismaService.client.module.create({
			data: { authorId: userId, name, description },
		});
	}

	async getModulesByUser(userId: string): Promise<ModuleModel[]> {
		return await this.prismaService.client.module.findMany({
			where: { authorId: userId },
		});
	}

	async deleteModule(userId: string, moduleId: string): Promise<void> {
		await this.prismaService.client.module.deleteMany({
			where: {
				id: moduleId,
				authorId: userId,
			},
		});
	}
	async updateModule(
		userId: string,
		moduleId: string,
		moduleData: Partial<ModuleModel>,
	): Promise<ModuleModel> {
		return await this.prismaService.client.module.update({
			where: {
				id: moduleId,
				authorId: userId,
			},
			data: moduleData,
		});
	}
}

import { ModuleModel } from '@prisma/client';
import { IModuleRepository } from '../interfaces/repositories/module.repository.interface';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { Module } from '../models/module.entitry';

@injectable()
export class ModuleRepository implements IModuleRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async createModule(userId: string, { name, description }: Module): Promise<ModuleModel> {
		return await this.prismaService.client.moduleModel.create({
			data: { authorId: userId, name, description },
		});
	}

	async getModulesByUser(userId: string): Promise<ModuleModel[]> {
		return await this.prismaService.client.moduleModel.findMany({
			where: { authorId: userId },
		});
	}
	async getModuleByName(name: string): Promise<ModuleModel[] | null> {
		return await this.prismaService.client.moduleModel.findMany({
			where: { name },
		});
	}
	async getModuleById(userId: string, moduleId: string): Promise<ModuleModel | null> {
		return await this.prismaService.client.moduleModel.findFirst({
			where: { id: moduleId, authorId: userId },
		});
	}

	async deleteModule(userId: string, moduleId: string): Promise<void> {
		await this.prismaService.client.moduleModel.deleteMany({
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
		return await this.prismaService.client.moduleModel.update({
			where: {
				id: moduleId,
				authorId: userId,
			},
			data: moduleData,
		});
	}
}

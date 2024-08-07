import { inject, injectable } from 'inversify';
import { IConfigService } from '../interfaces/config/config.service.interface';
import { TYPES } from '../types';
import { IModuleService } from '../interfaces/services/module.service.interface';
import { ModuleDto } from '../dto/module.dto';
import { Module } from '../models/module.entitry';
import { ModuleModel } from '@prisma/client';
import { IModuleRepository } from '../interfaces/repositories/module.repository.interface';

@injectable()
export class ModuleService implements IModuleService {
	constructor(
		@inject(TYPES.IModuleRepository) private moduleRepository: IModuleRepository,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {}

	async createModule(
		authorId: string,
		{ name, description, isPrivate }: ModuleDto,
	): Promise<ModuleModel | null> {
		const newModule = new Module(name, description, isPrivate);

		const existedModule = await this.moduleRepository.getModuleByName(authorId, newModule.name);
		if (existedModule?.length !== 0) {
			return null;
		}

		return await this.moduleRepository.createModule(authorId, newModule);
	}

	async updateModule(
		authorId: string,
		moduleId: string,
		{ name, description, isPrivate }: ModuleDto,
	): Promise<ModuleModel | null> {
		const existedModule = await this.moduleRepository.getModuleById(authorId, moduleId);
		if (!existedModule) {
			return null;
		}
		return await this.moduleRepository.updateModule(authorId, moduleId, {
			name,
			description,
			isPrivate,
		});
	}
	async getModules(authorId: string): Promise<ModuleModel[] | null> {
		return await this.moduleRepository.getModulesByUser(authorId);
	}
	async getModuleById(authorId: string, moduleId: string): Promise<ModuleModel | null> {
		return await this.moduleRepository.getModuleById(authorId, moduleId);
	}

	async deleteModule(authorId: string, moduleId: string): Promise<void> {
		return await this.moduleRepository.deleteModule(authorId, moduleId);
	}
}

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
	): Promise<ModuleModel> {
		try {
			const newModule = new Module(name, description, isPrivate);
			const existedModule = await this.moduleRepository.getModuleByName(authorId, newModule.name);
			if (existedModule?.length !== 0) {
				throw new Error('Module already exists');
			}

			return await this.moduleRepository.createModule(authorId, newModule);
		} catch (error) {
			throw new Error(`Failed to create module: ${(error as Error).message}`);
		}
	}

	async updateModule(
		authorId: string,
		moduleId: string,
		{ name, description, isPrivate }: ModuleDto,
	): Promise<ModuleModel> {
		try {
			const existedModule = await this.moduleRepository.getModuleById(authorId, moduleId);
			if (!existedModule) {
				throw new Error('Module not found');
			}

			return await this.moduleRepository.updateModule(authorId, moduleId, {
				name,
				description,
				isPrivate,
			});
		} catch (error) {
			throw new Error(`Failed to update module: ${(error as Error).message}`);
		}
	}

	async getModules(authorId: string): Promise<ModuleModel[]> {
		try {
			return await this.moduleRepository.getModulesByUser(authorId);
		} catch (error) {
			throw new Error(`Failed to retrieve modules: ${(error as Error).message}`);
		}
	}

	async getModuleById(authorId: string, moduleId: string): Promise<ModuleModel> {
		try {
			const module = await this.moduleRepository.getModuleById(authorId, moduleId);
			if (!module) {
				throw new Error('Module not found');
			}
			return module;
		} catch (error) {
			throw new Error(`Failed to retrieve module: ${(error as Error).message}`);
		}
	}

	async deleteModule(authorId: string, moduleId: string): Promise<void> {
		try {
			await this.moduleRepository.deleteModule(authorId, moduleId);
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to delete module: ${error.message}`);
			}
		}
	}
}

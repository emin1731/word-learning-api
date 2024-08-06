import { ModuleModel } from '@prisma/client';
import { Module } from '../../models/module.entitry';

export interface IModulesRepository {
	createModule: (userId: string, module: Module) => Promise<ModuleModel>;
	getModulesByUser: (userId: string) => Promise<ModuleModel[]>;
	getModuleByName: (userId: string, name: string) => Promise<ModuleModel[] | null>;
	getModuleById: (userId: string, moduleId: string) => Promise<ModuleModel | null>;
	deleteModule: (userId: string, moduleId: string) => Promise<void>;
	updateModule: (
		userId: string,
		moduleId: string,
		moduleData: Partial<ModuleModel>,
	) => Promise<ModuleModel>;
}

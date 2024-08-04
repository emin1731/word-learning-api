import { Module as ModuleModel } from '@prisma/client';
import { Module } from '../../models/module.entitry';

export interface IModulesRepository {
	createModule: (userId: string, module: Module) => Promise<ModuleModel>;
	getModulesByUser: (userId: string) => Promise<ModuleModel[]>;
	deleteModule: (userId: string, moduleId: string) => Promise<void>;
	updateModule: (
		userId: string,
		moduleId: string,
		moduleData: Partial<ModuleModel>,
	) => Promise<ModuleModel>;
}

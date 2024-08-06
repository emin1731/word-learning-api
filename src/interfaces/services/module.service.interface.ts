import { ModuleModel } from '@prisma/client';
import { ModuleDto } from '../../dto/module.dto';

export interface IModuleService {
	createModule: (
		authorId: string,
		{ name, description, isPrivate }: ModuleDto,
	) => Promise<ModuleModel | null>;
	updateModule: (
		authorId: string,
		moduleId: string,
		{ name, description, isPrivate }: ModuleDto,
	) => Promise<ModuleModel | null>;
	deleteModule: (authorId: string, moduleId: string) => Promise<void>;
	getModules: (authorId: string) => Promise<ModuleModel[] | null>;
	getModuleById: (authorId: string, moduleId: string) => Promise<ModuleModel | null>;
}

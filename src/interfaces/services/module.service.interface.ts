import { ModuleModel } from '@prisma/client';
import { ModuleDto } from '../../dto/module.dto';
import { SortBy } from '../common/sort-by.interface';

export interface IModuleService {
	createModule: (
		authorId: string,
		{ name, description, isPrivate }: ModuleDto,
	) => Promise<ModuleModel>;
	updateModule: (
		authorId: string,
		moduleId: string,
		{ name, description, isPrivate }: ModuleDto,
	) => Promise<ModuleModel | null>;
	deleteModule: (authorId: string, moduleId: string) => Promise<void>;
	getModules: (authorId: string, sortBy: SortBy) => Promise<ModuleModel[] | null>;
	getModuleById: (authorId: string, moduleId: string) => Promise<ModuleModel>;
}

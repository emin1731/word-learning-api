import { inject, injectable } from 'inversify';
import { IConfigService } from '../interfaces/config/config.service.interface';
import { TYPES } from '../types';
import { Prisma, TermModel } from '@prisma/client';
import { TermDto } from '../dto/term.dto';
import { ITermService } from '../interfaces/services/term.service.interface';
import { ITermRepository } from '../interfaces/repositories/term.repository.interface';
import { Term } from '../models/term.entity';
import { IModuleRepository } from '../interfaces/repositories/module.repository.interface';
import { SortBy } from '../interfaces/common/sort-by.interface';

@injectable()
export class TermService implements ITermService {
	constructor(
		@inject(TYPES.ITermRepository) private termRepository: ITermRepository,
		@inject(TYPES.IModuleRepository) private moduleRepository: IModuleRepository,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {}

	async createTerm(
		userId: string,
		moduleId: string,
		{ term, definition, status, isStarred }: TermDto,
	): Promise<TermModel | null> {
		const existedModule = await this.moduleRepository.getModuleById(userId, moduleId);
		if (!existedModule) {
			throw new Error('Module does not exist');
		}

		const newTerm = new Term(term, definition, status, isStarred);

		return await this.termRepository.createTerm(moduleId, newTerm);
	}

	async updateTerm(
		userId: string,
		moduleId: string,
		termId: string,
		{ term, definition, status, isStarred }: TermDto,
	): Promise<TermModel | null> {
		const existedModule = await this.moduleRepository.getModuleById(userId, moduleId);
		if (!existedModule) {
			throw new Error('Module does not exist');
		}

		const existedTerm = await this.termRepository.getTermById(moduleId, termId);
		if (!existedTerm) {
			throw new Error('Term to be updated does not exist');
		}

		return this.termRepository.updateTerm(moduleId, termId, {
			term,
			definition,
			status,
			isStarred,
		});
	}

	async deleteTerm(userId: string, moduleId: string, termId: string): Promise<void> {
		const existedModule = await this.moduleRepository.getModuleById(userId, moduleId);
		if (!existedModule) {
			throw new Error('Module does not exist');
		}

		const existedTerm = await this.termRepository.getTermById(moduleId, termId);
		if (!existedTerm) {
			throw new Error('Term to be deleted does not exist');
		}

		await this.termRepository.deleteTerm(moduleId, termId);
	}

	async getTerms(userId: string, moduleId: string, sortBy: SortBy): Promise<TermModel[] | null> {
		const existedModule = await this.moduleRepository.getModuleById(userId, moduleId);
		if (!existedModule) {
			throw new Error('Module does not exist');
		}

		// let orderBy: Prisma.ModuleModelOrderByWithRelationInput;
		let orderBy: Prisma.TermModelOrderByWithRelationInput;
		switch (sortBy) {
			case 'name_asc':
				orderBy = { term: 'asc' };
				break;
			case 'name_desc':
				orderBy = { term: 'desc' };
				break;
			case 'date_asc':
				orderBy = { createdAt: 'asc' };
				break;
			case 'date_desc':
				orderBy = { createdAt: 'desc' };
				break;
			default:
				orderBy = { createdAt: 'desc' }; // Default sorting
		}

		return await this.termRepository.getTerms(moduleId, orderBy);
	}

	async getTermById(userId: string, moduleId: string, termId: string): Promise<TermModel | null> {
		const existedModule = await this.moduleRepository.getModuleById(userId, moduleId);
		if (!existedModule) {
			throw new Error('Module does not exist');
		}

		return await this.termRepository.getTermById(moduleId, termId);
	}
}

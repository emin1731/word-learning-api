import { inject, injectable } from 'inversify';
import { IConfigService } from '../interfaces/config/config.service.interface';
import { TYPES } from '../types';
import { TermModel } from '@prisma/client';
import { TermDto } from '../dto/term.dto';
import { ITermService } from '../interfaces/services/term.service.interface';
import { ITermRepository } from '../interfaces/repositories/term.repository.interface';
import { Term } from '../models/term.entity';
import { IModuleRepository } from '../interfaces/repositories/module.repository.interface';

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

	async getTerms(userId: string, moduleId: string): Promise<TermModel[] | null> {
		const existedModule = await this.moduleRepository.getModuleById(userId, moduleId);
		if (!existedModule) {
			throw new Error('Module does not exist');
		}

		return await this.termRepository.getTerms(moduleId);
	}

	async getTermById(userId: string, moduleId: string, termId: string): Promise<TermModel | null> {
		const existedModule = await this.moduleRepository.getModuleById(userId, moduleId);
		if (!existedModule) {
			throw new Error('Module does not exist');
		}

		return await this.termRepository.getTermById(moduleId, termId);
	}
}

import { inject, injectable } from 'inversify';
import { IConfigService } from '../interfaces/config/config.service.interface';
import { TYPES } from '../types';
import { TermModel } from '@prisma/client';
import { TermDto } from '../dto/term.dto';
import { ITermService } from '../interfaces/services/term.service.interface';
import { ITermRepository } from '../interfaces/repositories/term.repository.interface';
import { Term } from '../models/term.entity';

@injectable()
export class TermService implements ITermService {
	constructor(
		@inject(TYPES.ITermRepository) private termRepository: ITermRepository,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {}

	async createTerm(
		moduleId: string,
		{ term, definition, status, isStarred }: TermDto,
	): Promise<TermModel | null> {
		const newTerm = new Term(term, definition, status, isStarred);

		return await this.termRepository.createTerm(moduleId, newTerm);
	}

	async updateTerm(
		moduleId: string,
		termId: string,
		{ term, definition, status, isStarred }: TermDto,
	): Promise<TermModel | null> {
		const existedModule = await this.termRepository.getTermById(moduleId, termId);
		if (!existedModule) {
			return null;
		}
		return this.termRepository.updateTerm(moduleId, termId, {
			term,
			definition,
			status,
			isStarred,
		});
	}

	async deleteTerm(moduleId: string, termId: string): Promise<void> {
		await this.termRepository.deleteTerm(moduleId, termId);
	}

	async getTerms(moduleId: string): Promise<TermModel[] | null> {
		return await this.termRepository.getTerms(moduleId);
	}

	async getTermById(moduleId: string, termId: string): Promise<TermModel | null> {
		return await this.termRepository.getTermById(moduleId, termId);
	}
}

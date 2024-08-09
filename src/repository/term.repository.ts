import { TermModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { ITermRepository } from '../interfaces/repositories/term.repository.interface';
import { Term } from '../models/term.entity';

@injectable()
export class TermRepository implements ITermRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async createTerm(
		moduleId: string,
		{ term, definition, status, isStarred }: Term,
	): Promise<TermModel> {
		return await this.prismaService.client.termModel.create({
			data: {
				moduleId,
				term: term,
				definition: definition,
				status: status,
				isStarred: isStarred,
			},
		});
	}

	async getTerms(moduleId: string): Promise<TermModel[]> {
		return await this.prismaService.client.termModel.findMany({
			where: { moduleId: moduleId },
		});
	}

	async getTermById(moduleId: string, termId: string): Promise<TermModel | null> {
		return await this.prismaService.client.termModel.findFirst({
			where: { moduleId: moduleId, id: termId },
		});
	}

	async deleteTerm(moduleId: string, termId: string): Promise<void> {
		await this.prismaService.client.termModel.delete({
			where: { moduleId: moduleId, id: termId },
		});
	}

	async updateTerm(
		moduleId: string,
		termId: string,
		termData: Partial<TermModel>,
	): Promise<TermModel> {
		return await this.prismaService.client.termModel.update({
			where: {
				id: moduleId,
				moduleId: moduleId,
			},
			data: termData,
		});
	}
}

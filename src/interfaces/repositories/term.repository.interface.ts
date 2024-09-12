import { Prisma, TermModel } from '@prisma/client';
import { Term } from '../../models/term.entity';

export interface ITermRepository {
	createTerm: (moduleId: string, term: Term) => Promise<TermModel>;
	getTerms: (
		moduleId: string,
		orderBy: Prisma.TermModelOrderByWithRelationInput,
		searchQuery?: string,
	) => Promise<TermModel[]>;
	getTermById: (moduleId: string, termId: string) => Promise<TermModel | null>;
	deleteTerm: (moduleId: string, termId: string) => Promise<void>;
	updateTerm: (
		moduleId: string,
		termId: string,
		termData: Partial<TermModel>,
	) => Promise<TermModel>;
}

import { TermModel } from '@prisma/client';
import { TermDto } from '../../dto/term.dto';

export interface ITermService {
	createTerm: (
		moduleId: string,
		{ term, definition, status, isStarred }: TermDto,
	) => Promise<TermModel | null>;
	updateTerm: (
		moduleId: string,
		termId: string,
		{ term, definition, status, isStarred }: TermDto,
	) => Promise<TermModel | null>;
	deleteTerm: (moduleId: string, termId: string) => Promise<void>;
	getTerms: (moduleId: string) => Promise<TermModel[] | null>;
	getTermById: (moduleId: string, termId: string) => Promise<TermModel | null>;
}

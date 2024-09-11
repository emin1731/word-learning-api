import { TermModel } from '@prisma/client';
import { TermDto } from '../../dto/term.dto';

export interface ITermService {
	createTerm: (
		userId: string,
		moduleId: string,
		{ term, definition, status, isStarred }: TermDto,
	) => Promise<TermModel | null>;
	updateTerm: (
		userId: string,
		moduleId: string,
		termId: string,
		{ term, definition, status, isStarred }: TermDto,
	) => Promise<TermModel | null>;
	deleteTerm: (userId: string, moduleId: string, termId: string) => Promise<void>;
	getTerms: (userId: string, moduleId: string) => Promise<TermModel[] | null>;
	getTermById: (userId: string, moduleId: string, termId: string) => Promise<TermModel | null>;
}
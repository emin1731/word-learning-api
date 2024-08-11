import { NextFunction, Request, Response } from 'express';

export interface ITermController {
	createTerm: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getTerms: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getTermById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	updateTerm: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	deleteTerm: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

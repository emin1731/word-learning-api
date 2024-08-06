import { NextFunction, Request, Response } from 'express';

export interface IModuleController {
	getModules: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	createModule: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getModuleById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	deleteModule: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	updateModule: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

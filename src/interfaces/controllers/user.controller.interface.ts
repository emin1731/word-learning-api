import { NextFunction, Request, Response } from 'express';

export interface IUsersController {
	// login: (req: Request, res: Response, next: NextFunction) => void;
	// register: (req: Request, res: Response, next: NextFunction) => void;
	getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	// info: (req: Request, res: Response, next: NextFunction) => void;
}

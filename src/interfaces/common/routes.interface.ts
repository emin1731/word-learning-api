import { Request, Response, NextFunction, Router } from 'express';
import { IMiddleware } from '../interfaces/common/middleware.interface';

export interface IControllerRoute {
	path: string;
	function: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'put'>;
	middleware?: IMiddleware[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExpressReturnType = Response<any, Record<string, any>>;

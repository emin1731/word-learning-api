import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ILoggerService } from '../interfaces/common/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IExceptionFilter } from '../interfaces/error/exception.filter.interface';
import { HTTPError } from './http-error';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILoggerService) {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).json({ error: err.message }); // Consider adding more structure to the response
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).json({ error: 'Internal Server Error' }); // Avoid exposing raw errors in production
		}
	}
}

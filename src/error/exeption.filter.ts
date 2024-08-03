import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ILoggerService } from '../interfaces/common/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IExeptionFilter } from '../interfaces/error/exeption.filter.interface';
import { HTTPError } from './http-error';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILoggerService) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}

import { inject, injectable } from 'inversify';
import { ILoggerService } from '../interfaces/common/logger.interface';
import { TYPES } from '../types';
import { BaseController } from './base.controller';
import { ITermController } from '../interfaces/controllers/term.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { ITermService } from '../interfaces/services/term.service.interface';
import { HTTPError } from '../error/http-error';
import { ValidateMiddleware } from '../middlewares/validate.middleware';
import { TermDto } from '../dto/term.dto';
import { SortBy } from '../interfaces/common/sort-by.interface';

@injectable()
export class TermController extends BaseController implements ITermController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILoggerService,
		@inject(TYPES.ITermService) private termService: ITermService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/modules/:moduleId/terms',
				method: 'get',
				function: this.getTerms,
			},
			{
				path: '/modules/:moduleId/terms/:termId',
				method: 'get',
				function: this.getTermById,
			},
			{
				path: '/modules/:moduleId/terms/:termId',
				method: 'delete',
				function: this.deleteTerm,
			},
			{
				path: '/modules/:moduleId/terms',
				method: 'post',
				function: this.createTerm,
				middleware: [new ValidateMiddleware(TermDto)],
			},
			{
				path: '/modules/:moduleId/terms/:termId',
				method: 'put',
				function: this.updateTerm,
				middleware: [new ValidateMiddleware(TermDto)],
			},
		]);
	}

	async createTerm(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body.payload) {
			return next(new HTTPError(401, 'Bearer token is missing'));
		}
		if (!req.body.payload.userId) {
			return next(new HTTPError(401, 'userId in Bearer token is missing'));
		}

		try {
			const term = await this.termService.createTerm(
				req.body.payload.userId,
				req.params.moduleId,
				req.body,
			);
			this.ok(res, term);
		} catch (err) {
			if (err instanceof Error) {
				next(new HTTPError(422, 'Error while creating term: ', err.message));
			}
		}
	}

	async getTerms(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body.payload) {
			return next(new HTTPError(401, 'Bearer token is missing'));
		}
		if (!req.body.payload.userId) {
			return next(new HTTPError(401, 'userId in Bearer token is missing'));
		}

		const { sortBy } = req.query;

		const validSortOptions = ['name_asc', 'name_desc', 'date_asc', 'date_desc'];

		if (!validSortOptions.includes(String(sortBy))) {
			return next(new HTTPError(400, 'Invalid sort option'));
		}

		try {
			const terms = await this.termService.getTerms(
				req.body.payload.userId,
				req.params.moduleId,
				sortBy as SortBy,
			);
			if (!terms) {
				return next(new HTTPError(404, 'Modules not found'));
			}

			this.ok(res, terms);
		} catch (err) {
			if (err instanceof Error) {
				next(new HTTPError(422, 'Error while getting term: ', err.message));
			}
		}
	}

	async getTermById(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body.payload) {
			return next(new HTTPError(401, 'Bearer token is missing'));
		}
		if (!req.body.payload.userId) {
			return next(new HTTPError(401, 'userId in Bearer token is missing'));
		}

		try {
			const term = await this.termService.getTermById(
				req.body.payload.userId,
				req.params.moduleId,
				req.params.termId,
			);
			this.ok(res, term);
		} catch (err) {
			if (err instanceof Error) {
				next(new HTTPError(422, 'Error while getting term by id: ', err.message));
			}
		}
	}

	async updateTerm(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body.payload) {
			return next(new HTTPError(401, 'Bearer token is missing'));
		}
		if (!req.body.payload.userId) {
			return next(new HTTPError(401, 'userId in Bearer token is missing'));
		}

		try {
			const term = await this.termService.updateTerm(
				req.body.payload.userId,
				req.params.moduleId,
				req.params.termId,
				req.body,
			);
			this.ok(res, term);
		} catch (err) {
			if (err instanceof Error) {
				next(new HTTPError(422, 'Error while updating term: ', err.message));
			}
		}
	}

	async deleteTerm(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body.payload) {
			return next(new HTTPError(401, 'Bearer token is missing'));
		}
		if (!req.body.payload.userId) {
			return next(new HTTPError(401, 'userId in Bearer token is missing'));
		}

		try {
			await this.termService.deleteTerm(
				req.body.payload.userId,
				req.params.moduleId,
				req.params.termId,
			);
			this.ok(res, 'Module deleted');
		} catch (err) {
			if (err instanceof Error) {
				next(new HTTPError(422, 'Error while deleting term: ', err.message));
			}
		}
	}
}

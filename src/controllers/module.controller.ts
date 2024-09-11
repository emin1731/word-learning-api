import { inject, injectable } from 'inversify';
import { ILoggerService } from '../interfaces/common/logger.interface';
import { TYPES } from '../types';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../error/http-error';
import { ValidateMiddleware } from '../middlewares/validate.middleware';
import { IModuleController } from '../interfaces/controllers/module.controller.interface';
import { IModuleService } from '../interfaces/services/module.service.interface';
import { ModuleDto } from '../dto/module.dto';

@injectable()
export class ModuleController extends BaseController implements IModuleController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILoggerService,
		@inject(TYPES.IModuleService) private moduleService: IModuleService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/modules',
				method: 'get',
				function: this.getModules,
			},
			{
				path: '/modules/:id',
				method: 'get',
				function: this.getModuleById,
			},
			{
				path: '/modules',
				method: 'post',
				function: this.createModule,
				middleware: [new ValidateMiddleware(ModuleDto)],
			},
			{
				path: '/modules/:id',
				method: 'delete',
				function: this.deleteModule,
			},
			{
				path: '/modules/:id',
				method: 'put',
				function: this.updateModule,
				middleware: [new ValidateMiddleware(ModuleDto)],
			},
		]);
	}
	async getModules(req: Request, res: Response, next: NextFunction): Promise<void> {
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

		const modules = await this.moduleService.getModules(req.body.payload.userId, String(sortBy));
		if (!modules) {
			return next(new HTTPError(404, 'Modules not found'));
		}
		this.ok(res, modules);
	}

	async createModule(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body.payload) {
			return next(new HTTPError(401, 'Bearer token is missing'));
		}
		if (!req.body.payload.userId) {
			return next(new HTTPError(401, 'userId in Bearer token is missing'));
		}

		const module = await this.moduleService.createModule(req.body.payload.userId, req.body);
		if (!module) {
			return next(new HTTPError(422, 'Module already exists'));
		}
		this.ok(res, module);
	}
	async getModuleById(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body.payload) {
			return next(new HTTPError(401, 'Bearer token is missing'));
		}
		if (!req.body.payload.userId) {
			return next(new HTTPError(401, 'userId in Bearer token is missing'));
		}

		try {
			const module = await this.moduleService.getModuleById(req.body.payload.userId, req.params.id);
			if (!module) {
				return next(new HTTPError(404, 'Module not found'));
			}
			this.ok(res, module);
		} catch (error) {
			return next(new HTTPError(404, 'Module not found'));
		}
	}
	async deleteModule(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body.payload) {
			return next(new HTTPError(401, 'Bearer token is missing'));
		}
		if (!req.body.payload.userId) {
			return next(new HTTPError(401, 'userId in Bearer token is missing'));
		}

		this.moduleService.deleteModule(req.body.payload.userId, req.params.id);
		this.ok(res, 'Module deleted');
	}

	async updateModule(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body.payload) {
			return next(new HTTPError(401, 'Bearer token is missing'));
		}
		if (!req.body.payload.userId) {
			return next(new HTTPError(401, 'userId in Bearer token is missing'));
		}

		const module = await this.moduleService.updateModule(
			req.body.payload.userId,
			req.params.id,
			req.body,
		);
		this.ok(res, module);
	}
}

import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILoggerService } from '../common/logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
	client: PrismaClient;
	constructor(@inject(TYPES.ILogger) private loggerService: ILoggerService) {
		this.client = new PrismaClient();
	}
	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.loggerService.log('[PrismaService] Connection to database is succesful');
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(
					'[PrismaService] Error occured while trying to connect to database: ' + e,
				);
			}
		}
	}
	async disconnect(): Promise<void> {
		try {
			await this.client.$disconnect();
			this.loggerService.log('[PrismaService] Disconnected from database');
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(
					'[PrismaService] Error occured while trying to disconnect from database: ' + e,
				);
			}
		}

		this.loggerService.log('[PrismaService] Connection to database is succesful');
	}
}

import { inject, injectable } from 'inversify';
import { Sequelize } from 'sequelize';
import { TYPES } from '../types';
import { ILoggerService } from '../logger/logger.interface';
import { IConfigService } from './config.service.interface';

@injectable()
export class SequelizeService {
	private sequelize: Sequelize;

	constructor(
		@inject(TYPES.ILogger) private logger: ILoggerService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		this.sequelize = new Sequelize(
			configService.get('DB_NAME'),
			configService.get('DB_USER'),
			configService.get('DB_PASSWORD'),
			{
				dialect: 'postgres',
				host: configService.get('DB_HOST'),
				port: +configService.get('PORT'),
			},
		);
		// this.sequelize
		// 	.authenticate()
		// 	.then(() => {
		// 		this.logger.log('Connection to the database has been established successfully.');
		// 	})
		// 	.catch((err: Error) => {
		// 		this.logger.error('Unable to connect to the database:', err);
		// 	});
	}

	public getInstance(): Sequelize {
		return this.sequelize;
	}
}

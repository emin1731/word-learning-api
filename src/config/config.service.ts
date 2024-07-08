import { injectable } from 'inversify';
import { LoggerService } from '../logger/logger.service';
import { IConfigService } from './config.service.interface';
import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	logger = new LoggerService();
	constructor() {
		const res: DotenvConfigOutput = config();
		if (res.error) {
			this.logger.error('[ConfigService] Unable to read .env file or it does not exists');
		} else {
			this.logger.log('[ConfigService] .env config is loaded ');
			this.config = res.parsed as DotenvParseOutput;
		}
	}
	get(key: string): string {
		return this.config[key];
	}
}

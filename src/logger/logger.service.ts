import { Logger } from 'tslog';
import { ILoggerService } from './logger.interface';

export class LoggerService implements ILoggerService {
	public logger: Logger<any>;
	constructor() {
		this.logger = new Logger();
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}
	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
	error(...args: unknown[]): void {
		this.logger.error(...args);
	}
}

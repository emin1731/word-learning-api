import { Logger } from 'tslog';

export class LoggerService {
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

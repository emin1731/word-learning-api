import { Sequelize } from 'sequelize';

export const TYPES = {
	Application: Symbol.for('Application'),
	ILogger: Symbol.for('ILogger'),
	IConfigService: Symbol.for('IConfigService'),
	SequelizeService: Symbol.for('SequelizeService'),
};

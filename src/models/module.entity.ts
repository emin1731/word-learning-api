export class Module {
	constructor(
		private readonly _name: string,
		private readonly _description: string,
		private readonly _isPrivate: boolean = false,
	) {}

	get name(): string {
		return this._name;
	}
	get description(): string {
		return this._description;
	}
	compareNames(name: string): boolean {
		return this._name === name;
	}
	get isPrivate(): boolean {
		return this._isPrivate;
	}
}

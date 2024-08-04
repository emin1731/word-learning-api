export class Module {
	constructor(
		private readonly _name: string,
		private readonly _description: string,
		private readonly _progress: string,
		private readonly _userId: string,
		private readonly _isPrivate: boolean = false,
	) {}

	get name(): string {
		return this._name;
	}
	get description(): string {
		return this._description;
	}
	get progress(): string {
		return this._progress;
	}
	get isPrivate(): boolean {
		return this._isPrivate;
	}
	get userId(): string {
		return this._userId;
	}
}

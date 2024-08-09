export class Term {
	private readonly _term: string;
	private readonly _definition: string;
	private _status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
	private readonly _isStarred: boolean;

	constructor(
		term: string,
		definition: string,
		status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED',
		isStarred: boolean,
	) {
		this._term = term;
		this._definition = definition;
		this._status = status;
		this._isStarred = isStarred;
	}

	get term(): string {
		return this._term;
	}
	get definition(): string {
		return this._definition;
	}
	get status(): string {
		return this._status;
	}

	get isStarred(): boolean {
		return this._isStarred;
	}

	updateStatus(): void {
		if (this._status === 'COMPLETED') {
			return;
		}

		if (this._status === 'NOT_STARTED') {
			this._status = 'IN_PROGRESS';
		} else if (this._status === 'IN_PROGRESS') {
			this._status = 'COMPLETED';
		} else {
			this._status = 'NOT_STARTED';
		}
	}
}

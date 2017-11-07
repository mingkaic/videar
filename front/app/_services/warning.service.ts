import { EventEmitter } from '@angular/core';

export class WarningService {
	private issue: EventEmitter<string>;

	constructor() {
		this.issue = new EventEmitter();
	}

	getWarningEmitter() {
		return this.issue;
	}

	warn(message) {
		this.issue.emit(message);
	}
}

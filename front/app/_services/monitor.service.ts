import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { EventEmitter } from '@angular/core';
import { Microservice } from '../_models/mservice.model';

@Injectable()
export class MonitorService {
	private healthUpdate = new EventEmitter<string>();

	constructor(private _http: Http) {
		this.update();
	};

	getHealthUpdateEmitter(): EventEmitter<string> {
		return this.healthUpdate;
	};

	update() {
		this._http.get('/api/health')
		.subscribe((data: Response) => {
			let freshServ = data.json().services.map((serv) => {
				return new Microservice(serv.name, serv.status);
			});
			this.healthUpdate.emit(freshServ);
		});
	};
}

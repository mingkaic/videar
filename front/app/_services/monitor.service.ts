import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { EventEmitter } from '@angular/core';
import { Microservice } from '../_models/mservice.model';

const serviceMap = {
	"uas": "unified audio service",
	"s2t": "speech to text"
};

@Injectable()
export class MonitorService {
	private healthUpdate = new EventEmitter<Microservice[]>();

	constructor(private _http: Http) {
		this.update();
	};

	getHealthUpdateEmitter(): EventEmitter<Microservice[]> {
		return this.healthUpdate;
	};

	update() {
		let response_handler = (data) => {
			let services: Microservice[] = [];
			let res = data.json();
			for (const sid of Object.keys(res)) {
				let name = serviceMap[sid];
				let status;
				if (res[sid].ok === true) {
					status = "OK";
				}
				else {
					status = res[sid].error.code;
				}
				services.push(new Microservice(sid, name, status));
			}
			this.healthUpdate.emit(services);
		}

		this._http.get('/api/health')
		.subscribe(response_handler, response_handler);
	};
}

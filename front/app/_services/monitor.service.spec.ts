import { HttpModule, XHRBackend } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MockBackend } from '@angular/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';

import { MonitorService } from './monitor.service';

describe('MonitorService', () => {
	let service: MonitorService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ HttpModule ],
			providers: [
				MonitorService,
				DomSanitizer,
				{ provide: XHRBackend, useClass: MockBackend },
			]
		});
	}));

	it('should create', () => {
		inject([MonitorService], (service) => {
			expect(service).toBeTruthy();;
		});
	});

	// todo: get health from mock server
});

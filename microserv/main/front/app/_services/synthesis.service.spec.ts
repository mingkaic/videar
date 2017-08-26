import { HttpModule, XHRBackend } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MockBackend } from '@angular/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { SynthesisService } from './synthesis.service';

const testId: string = "SECRET_VID_ID";

describe('SynthesisService', () => {
	let service: SynthesisService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
  			imports: [ HttpModule ],
			providers: [
				SynthesisService, 
				DomSanitizer,
				{ provide: XHRBackend, useClass: MockBackend },
			]
		});
	}))

	it('should create', () => {
		inject([SynthesisService], (service) => {
			expect(service).toBeTruthy();;
		});
	});
});

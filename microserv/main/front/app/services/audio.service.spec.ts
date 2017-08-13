import { HttpModule, XHRBackend } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MockBackend } from '@angular/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { AudioHandleService } from './audio.service';

const testId: string = "SECRET_VID_ID";

describe('AudioHandleService', () => {
	let service: AudioHandleService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
  			imports: [ HttpModule ],
			providers: [
				AudioHandleService, 
				DomSanitizer,
        		{ provide: XHRBackend, useClass: MockBackend },
			]
		});
	}))

	it('should return a null url', () => {
		inject([AudioHandleService], (audioService) => {
			expect(audioService.getAudioUrl(testId)).toEqual(null);
		});
	});
});
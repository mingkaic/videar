import { HttpModule, XHRBackend } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MockBackend } from '@angular/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { PopularAudioService } from './popular.service';

const testId: string = "SECRET_VID_ID";

describe('PopularAudioService', () => {
	let service: PopularAudioService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ HttpModule ],
			providers: [
				PopularAudioService, 
				DomSanitizer,
				{ provide: XHRBackend, useClass: MockBackend },
			]
		});
	}))

	it('does not have fake audio using hasAudio', () => {
		inject([PopularAudioService], (audioService) => {
			expect(audioService.hasAudioModel(testId)).toEqual(false);
		});
	});
});

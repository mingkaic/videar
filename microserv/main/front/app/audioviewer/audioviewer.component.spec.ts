import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioviewerComponent } from './audioviewer.component';
import { AudioHandleService } from '../_services/audio.service';

describe('AudioviewerComponent', () => {
	let component: AudioviewerComponent;
	let fixture: ComponentFixture<AudioviewerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
  			imports: [HttpModule],
			declarations: [ AudioviewerComponent ],
			providers: [
				AudioHandleService,
				DomSanitizer,
        		{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AudioviewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

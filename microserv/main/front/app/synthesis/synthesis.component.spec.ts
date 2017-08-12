import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesisComponent } from './synthesis.component';
import { AudioHandleService } from '../services/audio.service';
import { AudioviewerComponent } from '../audioviewer/audioviewer.component';

describe('SynthesisComponent', () => {
	let component: SynthesisComponent;
	let fixture: ComponentFixture<SynthesisComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
  			imports: [HttpModule],
			declarations: [ SynthesisComponent, AudioviewerComponent ],
			providers: [
				AudioHandleService,
				DomSanitizer,
        		{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SynthesisComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

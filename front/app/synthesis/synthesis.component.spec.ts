import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesisComponent } from './synthesis.component';
import {
	QueuedAudioService,
	MonitorService,
	WarningService
} from '../../_services';
import { CollapseDirective, ProgressDirective } from '../../_directives';
import { Progressbar, Bar } from '../../progressbar';

describe('SynthesisComponent', () => {
	let component: SynthesisComponent;
	let fixture: ComponentFixture<SynthesisComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ HttpModule ],
			declarations: [
				SynthesisComponent,
				ProgressDirective,
				CollapseDirective,
				Progressbar,
				Bar
			],
			providers: [
				QueuedAudioService,
				MonitorService,
				WarningService,
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
	
	// todo: test synthesize (with mock server)
});

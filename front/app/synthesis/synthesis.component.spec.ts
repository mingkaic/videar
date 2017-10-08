import { HttpModule, XHRBackend } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { 
	SynthesisComponent,
	QueuedViewerComponent,
	SynthViewerComponent
} from './index';
import {
	QueuedAudioService,
	SynthesisService,
	WarningService
} from '../_services';
import { CollapseDirective, ProgressDirective } from '../_directives';
import { Progressbar, Bar } from '../progressbar';

describe('SynthesisComponent', () => {
	let component: SynthesisComponent;
	let fixture: ComponentFixture<SynthesisComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ HttpModule, FormsModule ],
			declarations: [ 
				SynthesisComponent,
				QueuedViewerComponent,
				SynthViewerComponent,
				CollapseDirective,
				ProgressDirective,
				Progressbar,
				Bar
			],
			providers: [
				QueuedAudioService,
				SynthesisService,
				WarningService,
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

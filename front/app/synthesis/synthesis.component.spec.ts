import { HttpModule, XHRBackend } from '@angular/http';
import { FormsModule } from '@angular/forms'; 
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DndModule } from 'ng2-dnd';

import { SynthesisComponent } from './synthesis.component';
import {
	SynthesisService,
	QueuedAudioService,
	MonitorService,
	WarningService
} from '../_services';
import { CollapseDirective, ProgressDirective } from '../_directives';
import { Progressbar, Bar } from '../progressbar';
import { SynthViewerComponent } from './viewer/synthviewer.component';

describe('SynthesisComponent', () => {
	let component: SynthesisComponent;
	let fixture: ComponentFixture<SynthesisComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ HttpModule, FormsModule, DndModule.forRoot() ],
			declarations: [
				SynthesisComponent,
				SynthViewerComponent,
				ProgressDirective,
				CollapseDirective,
				Progressbar,
				Bar
			],
			providers: [
				SynthesisService,
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

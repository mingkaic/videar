import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuedViewerComponent } from './queuedviewer.component';
import { QueuedAudioService, WarningService } from '../../_services';
import { CollapseDirective, ProgressDirective } from '../../_directives';
import { Progressbar, Bar } from '../../progressbar';

describe('QueuedViewerComponent', () => {
	let component: QueuedViewerComponent;
	let fixture: ComponentFixture<QueuedViewerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ HttpModule ],
			declarations: [
				QueuedViewerComponent,
				ProgressDirective,
				CollapseDirective,
				Progressbar,
				Bar
			],
			providers: [
				QueuedAudioService,
				WarningService,
				DomSanitizer,
				{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(QueuedViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

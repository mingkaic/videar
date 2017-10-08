import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposedViewerComponent } from './exposedviewer.component';
import { ExposedAudioService, QueuedAudioService } from '../../_services';

describe('ExposedViewerComponent', () => {
	let component: ExposedViewerComponent;
	let fixture: ComponentFixture<ExposedViewerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ HttpModule ],
			declarations: [
				ExposedViewerComponent
			],
			providers: [
				ExposedAudioService,
				QueuedAudioService,
				DomSanitizer,
				{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ExposedViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

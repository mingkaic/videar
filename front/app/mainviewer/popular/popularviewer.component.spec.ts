import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularViewerComponent } from './popularviewer.component';
import { PopularAudioService, QueuedAudioService } from '../../_services';

describe('PopularViewerComponent', () => {
	let component: PopularViewerComponent;
	let fixture: ComponentFixture<PopularViewerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ HttpModule ],
			declarations: [
				PopularViewerComponent
			],
			providers: [
				PopularAudioService,
				QueuedAudioService,
				DomSanitizer,
				{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PopularViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

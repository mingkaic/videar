import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { YtViewerComponent } from './ytviewer.component';
import { YoutubeAudioService, QueuedAudioService } from '../../_services/audioservices';

describe('YtViewerComponent', () => {
	let component: YtViewerComponent;
	let fixture: ComponentFixture<YtViewerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ BrowserModule, FormsModule, HttpModule],
			declarations: [ YtViewerComponent ],
			providers: [
				YoutubeAudioService,
				QueuedAudioService,
				DomSanitizer,
				{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(YtViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Uploader } from 'angular2-http-file-upload';
import { FormsModule } from '@angular/forms';

import { UploadViewerComponent } from './uploaderviewer.component';
import { UploadAudioService, QueuedAudioService } from '../../_services';

describe('UploadViewerComponent', () => {
	let component: UploadViewerComponent;
	let fixture: ComponentFixture<UploadViewerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ BrowserModule, FormsModule, HttpModule],
			declarations: [ UploadViewerComponent ],
			providers: [
				UploadAudioService,
				QueuedAudioService,
				Uploader,
				DomSanitizer,
				{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UploadViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Uploader } from 'angular2-http-file-upload';
import { FormsModule } from '@angular/forms';

import { UploadAudioService, QueuedAudioService } from '../_services';
import { UploaderDirective } from '../_directives/uploader.directive';
import { UploadComponent, UploadViewerComponent } from './index';

describe('UploadComponent', () => {
	let component: UploadComponent;
	let fixture: ComponentFixture<UploadComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ BrowserModule, FormsModule, HttpModule ],
			declarations: [
				UploadComponent,
				UploaderDirective,
				UploadViewerComponent
			],
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
		fixture = TestBed.createComponent(UploadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// todo: test uploadFile (with mock server)
});

import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { UploadAudioService } from '../_services/audioservices';
import { UploaderDirective } from '../_directives/uploader.directive';
import { UploadComponent, SimpleViewerComponent } from './index';

describe('VidUploadComponent', () => {
	let component: UploadComponent;
	let fixture: ComponentFixture<UploadComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ BrowserModule, FormsModule, HttpModule ],
			declarations: [ 
				UploadComponent, 
				UploaderDirective,
				SimpleViewerComponent
			],
			providers: [
				UploadAudioService,
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
});

import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { VidUploadComponent } from './viduploader.component';
import { AudioHandleService } from '../_services/audio.service';
import { VidUploaderDirective } from '../_directives/viduploader.directive';
import { SimpleViewerComponent } from '../simpleviewer/simpleviewer.component';

describe('VidUploadComponent', () => {
	let component: VidUploadComponent;
	let fixture: ComponentFixture<VidUploadComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ BrowserModule, FormsModule, HttpModule ],
			declarations: [ 
				VidUploadComponent, 
				VidUploaderDirective,
				SimpleViewerComponent
			],
			providers: [
				AudioHandleService,
				DomSanitizer,
        		{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VidUploadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

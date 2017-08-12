import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VidUploadComponent } from './viduploader.component';
import { AudioHandleService } from '../services/audio.service';
import { AudioviewerComponent } from '../audioviewer/audioviewer.component';
import { VidUploaderDirective } from '../viduploader/viduploader.directive';

describe('VidUploadComponent', () => {
	let component: VidUploadComponent;
	let fixture: ComponentFixture<VidUploadComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
  			imports: [HttpModule],
			declarations: [ VidUploadComponent, AudioviewerComponent, VidUploaderDirective ],
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

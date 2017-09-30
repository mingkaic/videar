import { HttpModule, XHRBackend } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkerComponent } from './vidlinker.component';
import { UploadAudioService } from '../_services/audioservices/popular.service';
import { SimpleViewerComponent } from '../simpleviewer/simpleviewer.component';

describe('LinkerComponent', () => {
	let component: LinkerComponent;
	let fixture: ComponentFixture<LinkerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ HttpModule, FormsModule ],
			declarations: [
				LinkerComponent,
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
		fixture = TestBed.createComponent(LinkerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

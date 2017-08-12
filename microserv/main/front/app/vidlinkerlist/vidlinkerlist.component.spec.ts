import { HttpModule, XHRBackend } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VidLinkerListComponent } from './vidlinkerlist.component';
import { AudioHandleService } from '../services/audio.service';
import { VidLinkerComponent } from '../vidlinker/vidlinker.component';
import { AudioviewerComponent } from '../audioviewer/audioviewer.component';

describe('VidLinkerListComponent', () => {
	let component: VidLinkerListComponent;
	let fixture: ComponentFixture<VidLinkerListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
  			imports: [ HttpModule, FormsModule ],
			declarations: [ VidLinkerListComponent, VidLinkerComponent, AudioviewerComponent ],
			providers: [
				AudioHandleService,
				DomSanitizer,
        		{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VidLinkerListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

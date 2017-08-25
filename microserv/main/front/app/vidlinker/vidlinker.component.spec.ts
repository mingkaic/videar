import { HttpModule, XHRBackend } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VidLinkerComponent } from './vidlinker.component';
import { AudioHandleService } from '../_services/audio.service';

describe('VidLinkerComponent', () => {
	let component: VidLinkerComponent;
	let fixture: ComponentFixture<VidLinkerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
  			imports: [ HttpModule, FormsModule ],
			declarations: [ VidLinkerComponent, VidLinkerComponent ],
			providers: [
				AudioHandleService,
				DomSanitizer,
        		{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VidLinkerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

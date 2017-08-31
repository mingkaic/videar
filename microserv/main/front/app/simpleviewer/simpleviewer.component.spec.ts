import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { SimpleViewerComponent } from './simpleviewer.component';
import { AudioHandleService } from '../_services/audio.service';

describe('SimpleViewerComponent', () => {
	let component: SimpleViewerComponent;
	let fixture: ComponentFixture<SimpleViewerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
  			imports: [ BrowserModule, FormsModule, HttpModule],
			declarations: [ SimpleViewerComponent ],
			providers: [
				AudioHandleService,
				DomSanitizer,
        		{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SimpleViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

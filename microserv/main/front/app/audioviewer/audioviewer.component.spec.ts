import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { AudioViewerComponent } from './audioviewer.component';
import { AudioHandleService } from '../_services/audio.service';
import { WarningService } from '../_services/warning.service';
import { CollapseDirective } from '../_directives/collapse.directive';
import { ProgressDirective } from '../_directives/progress.directive';
import { Progressbar, Bar } from '../progressbar';

describe('AudioViewerComponent', () => {
	let component: AudioViewerComponent;
	let fixture: ComponentFixture<AudioViewerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
  			imports: [ BrowserModule, FormsModule, HttpModule ],
			declarations: [ 
				AudioViewerComponent, 
				CollapseDirective,
				ProgressDirective,
				Progressbar,
				Bar ],
			providers: [
				AudioHandleService,
				WarningService,
				DomSanitizer,
        		{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AudioViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

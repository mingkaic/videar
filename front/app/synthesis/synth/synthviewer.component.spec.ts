import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthViewerComponent } from './synthviewer.component';
import { SynthesisService } from '../../_services/synthesis.service';
import { WarningService } from '../../_services/warning.service';
import { ProgressDirective } from '../../_directives/progress.directive';
import { Progressbar, Bar } from '../../progressbar';

describe('SynthViewerComponent', () => {
	let component: SynthViewerComponent;
	let fixture: ComponentFixture<SynthViewerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ HttpModule ],
			declarations: [
				SynthViewerComponent,
				ProgressDirective,
				Progressbar,
				Bar
			],
			providers: [
				SynthesisService,
				WarningService,
				DomSanitizer,
				{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SynthViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

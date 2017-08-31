import { HttpModule, XHRBackend } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesisComponent } from './synthesis.component';
import { AudioHandleService, SynthesisService, WarningService } from '../_services';
import { AudioViewerComponent } from '../audioviewer/audioviewer.component';
import { SynthViewerComponent } from './synthviewer/synthviewer.component';
import { CollapseDirective } from '../_directives/collapse.directive';
import { ProgressDirective } from '../_directives/progress.directive';
import { Progressbar, Bar } from '../progressbar';

describe('SynthesisComponent', () => {
	let component: SynthesisComponent;
	let fixture: ComponentFixture<SynthesisComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
  			imports: [ HttpModule, FormsModule ],
			declarations: [ 
				SynthesisComponent, 
				AudioViewerComponent,
				CollapseDirective,
				SynthViewerComponent,
				ProgressDirective,
				Progressbar,
				Bar
			],
			providers: [
				AudioHandleService,
				SynthesisService,
				WarningService,
        		{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SynthesisComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

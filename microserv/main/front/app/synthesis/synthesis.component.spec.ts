import { HttpModule, XHRBackend } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesisComponent } from './synthesis.component';
import { AudioHandleService } from '../services/audio.service';

describe('SynthesisComponent', () => {
	let component: SynthesisComponent;
	let fixture: ComponentFixture<SynthesisComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
  			imports: [ HttpModule, FormsModule ],
			declarations: [ SynthesisComponent ],
			providers: [
				AudioHandleService,
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

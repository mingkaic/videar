import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VidLinkerComponent } from './vidlinker.component';

describe('VidLinkerComponent', () => {
	let component: VidLinkerComponent;
	let fixture: ComponentFixture<VidLinkerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ VidLinkerComponent ]
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

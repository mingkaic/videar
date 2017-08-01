import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VidlinkerComponent } from './vidlinker.component';

describe('VidlinkerComponent', () => {
	let component: VidlinkerComponent;
	let fixture: ComponentFixture<VidlinkerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ VidlinkerComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VidlinkerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

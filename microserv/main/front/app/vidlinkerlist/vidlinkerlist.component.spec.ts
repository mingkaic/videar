import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VidLinkerListComponent } from './vidlinkerlist.component';

describe('VidLinkerListComponent', () => {
	let component: VidLinkerListComponent;
	let fixture: ComponentFixture<VidLinkerListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ VidLinkerListComponent ]
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

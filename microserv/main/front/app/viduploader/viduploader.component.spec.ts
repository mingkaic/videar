import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VidUploadComponent } from './viduploader.component';

describe('VidUploadComponent', () => {
	let component: VidUploadComponent;
	let fixture: ComponentFixture<VidUploadComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ VidUploadComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VidUploadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

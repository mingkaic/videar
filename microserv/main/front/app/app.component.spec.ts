import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { AudioviewerComponent } from './audioviewer/audioviewer.component';
import { AudioHandleService } from './_services/audio.service';

@Component({
  template: ''
})
class DummyComponent {}

describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule.withRoutes([
					{ path: 'settings/:collection/edit/:item', component: DummyComponent }
				]),
				HttpModule
			],
			declarations: [
				AppComponent,
				DummyComponent,
				AudioviewerComponent
			],
			providers: [
				AudioHandleService, 
				DomSanitizer,
        		{ provide: XHRBackend, useClass: MockBackend },
			]
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});

	it(`should have as title 'Videar'`, () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app.title).toEqual('Videar');
	});

	it('should render title in an a tag', () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('a').textContent).toContain('Videar');
	});
});

import { HttpModule, XHRBackend } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YtLinkerComponent, YtLink } from './ytlinker.component';
import { YoutubeAudioService, QueuedAudioService } from '../_services';
import { YtViewerComponent } from './viewer/ytviewer.component';

describe('YtLinkerComponent', () => {
	let component: YtLinkerComponent;
	let fixture: ComponentFixture<YtLinkerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ HttpModule, FormsModule ],
			declarations: [
				YtLinkerComponent,
				YtViewerComponent
			],
			providers: [
				YoutubeAudioService,
				QueuedAudioService,
				DomSanitizer,
				{ provide: XHRBackend, useClass: MockBackend },
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(YtLinkerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should addLink a YtLink with empty link and "unprocessed" getStatus', () => {
		expect(component.links.length).toBe(1);
		component.addLink();
		expect(component.links.length).toBe(2);
		let link = component.links[1];
		expect(link.link.length).toBe(0);
		expect(link.getStatus()).toBe("unprocessed");
	});

	it('should reject garabage link in processLink', () => {
		let link = component.links[0];
		link.link = "garabageLink";
		component.processLink(0);
		expect(link.getStatus()).toBe("rejected");
	});

	// todo: test processing (with mock server)

	// todo: test rejected (with mock server)

	it('should clear link string and status using clearLink', () => {
		// taint a link
		let link = component.links[0];
		link.link = "garabageLink";
		component.processLink(0);

		// clear
		component.clearLink(0);
		expect(link.link.length).toBe(0);
		expect(link.getStatus()).toBe("unprocessed");
	});

	it('should clear link using removeLink (with a single link)', () => {
		expect(component.links.length).toBe(1);
		// taint a link
		let link = component.links[0];
		link.link = "garabageLink";
		component.processLink(0);

		// remove
		component.removeLink(0);
		expect(component.links.length).toBe(1);
		link = component.links[0];
		expect(link.link.length).toBe(0);
		expect(link.getStatus()).toBe("unprocessed");
	});

	it('should remove link using removeLink with no change in order', () => {
		component.addLink();
		component.addLink();
		component.addLink();
		component.addLink();
		expect(component.links.length).toBe(5);

		component.links.forEach((link, idx) => {
			link.link = "" + idx;
		});

		component.removeLink(4); // expect order [0, 1, 2, 3]
		expect(component.links.map((link) => link.link)).toEqual(["0", "1", "2", "3"]);

		component.removeLink(0); // expect order [1, 2, 3]
		expect(component.links.map((link) => link.link)).toEqual(["1", "2", "3"]);

		component.removeLink(1); // expect order [1, 3]
		expect(component.links.map((link) => link.link)).toEqual(["1", "3"]);
	});
});

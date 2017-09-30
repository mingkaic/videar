import { Component, OnInit } from '@angular/core';

import { AudioModel } from '../../_models/audio.model';
import { PopularAudioService, QueuedAudioService } from '../../_services';
import { SelectableViewerComponent } from '../../_interfaces/viewer.abstract';

@Component({
	selector: 'app-popularviewer',
	templateUrl: '../plainviewer.component.html',
	styleUrls: ['../../shared.css'],
	providers: [ PopularAudioService ]
})
export class PopularViewerComponent extends SelectableViewerComponent implements OnInit {
	viewtitle: string = "Popular Podcasts";

	constructor(private _popularService: PopularAudioService, queuedService: QueuedAudioService) {
		super(10, _popularService, queuedService);
	};

	ngOnInit() {
		this._popularService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._popularService));
	};
};

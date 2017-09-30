import { Component, OnInit } from '@angular/core';

import { SelectableViewerComponent } from '../../_interfaces/viewer.abstract';
import { YoutubeAudioService, QueuedAudioService } from '../../_services/audioservices';

@Component({
	selector: 'app-ytviewer',
	templateUrl: './ytviewer.component.html',
	styleUrls: ['../../shared.css']
})
export class YtViewerComponent extends SelectableViewerComponent implements OnInit {
	constructor(private _ytService: YoutubeAudioService, queuedService: QueuedAudioService) {
		super(20, _ytService, queuedService);
	};

	ngOnInit() {
		this._ytService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._ytService));
	};
};

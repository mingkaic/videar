import { Component, OnInit } from '@angular/core';

import { SelectableViewerComponent } from '../../_interfaces/viewer.abstract';
import { YoutubeAudioService, QueuedAudioService } from '../../_services/audioservices';

@Component({
	selector: 'app-ytviewer',
	templateUrl: '../../_html/plainviewer.component.html',
	styleUrls: ['../../shared.css']
})
export class YtViewerComponent extends SelectableViewerComponent implements OnInit {
	viewtitle: string = "Youtube Audio";
	emptymessage: string = "No Youtube Audios Discovered";

	constructor(private _ytService: YoutubeAudioService, queuedService: QueuedAudioService) {
		super(20, _ytService, queuedService);
	};

	ngOnInit() {
		this._ytService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._ytService));
	};
};

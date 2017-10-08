import { Component, OnInit } from '@angular/core';

import { AudioModel } from '../../_models/audio.model';
import { ExposedAudioService, QueuedAudioService } from '../../_services';
import { SelectableViewerComponent } from '../../_utils/viewer.abstract';

@Component({
	selector: 'app-exposedviewer',
	templateUrl: '../../_html/plainviewer.component.html',
	providers: [ ExposedAudioService ]
})
export class ExposedViewerComponent extends SelectableViewerComponent implements OnInit {
	viewtitle: string = "Public Audio";
	emptymessage: string = "No Public Audio Available";

	constructor(private _exposedService: ExposedAudioService, queuedService: QueuedAudioService) {
		super(10, _exposedService, queuedService);
	};

	ngOnInit() {
		this._exposedService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._exposedService));
	};
};

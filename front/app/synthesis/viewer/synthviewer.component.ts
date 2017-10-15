import { Component, OnInit, SimpleChange } from '@angular/core';

import { AudioModel } from '../../_models/audio.model';
import { SynthesisService } from '../../_services/synthesis.service';
import { AbstractViewerComponent } from '../../_utils/viewer.abstract';

@Component({
	selector: 'app-synthviewer',
	templateUrl: './synthviewer.component.html'
})
export class SynthViewerComponent extends AbstractViewerComponent implements OnInit {
	constructor(private _synthService: SynthesisService) {
		super(20, _synthService);
	};

	ngOnInit() {
		this._synthService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._synthService));
	};
}

import { Component, OnInit } from '@angular/core';

import { AudioModel } from '../../_models/audio.model';
import { UploadAudioService, QueuedAudioService } from '../../_services';
import { SelectableViewerComponent } from '../../_utils/viewer.abstract';

class EditableAudio extends AudioModel {
	private edit = false;
	private edited = false;

	constructor(model: AudioModel, protected _uploadService: UploadAudioService) {
		super(model._id, model.name, model.ref);
		this.source = model.source;
	};

	changed() { this.edited = true; };

	getEdit() {
		return this.edit;
	};

	toggleEdit() {
		if (this.edit && this.edited) {
			// update model
			this._uploadService.updateTitle(this);
		}
		this.edit = !this.edit;
		this.edited = false;
	};
}

@Component({
	selector: 'app-uploadviewer',
	templateUrl: './uploaderviewer.component.html'
})
export class UploadViewerComponent extends SelectableViewerComponent implements OnInit {
	constructor(private _uploadService: UploadAudioService, queuedService: QueuedAudioService) {
		super(20, _uploadService, queuedService);
	};

	ngOnInit() {
		this._uploadService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._uploadService));
	};

	protected wrapAudio(audio: AudioModel): AudioModel {
		return new EditableAudio(audio, this._uploadService);
	};
}

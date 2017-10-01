import { IAudioService, QueuedAudioService } from '../_services/audioservices';
import { AudioModel } from '../_models/audio.model';
import { Cache } from '../_utils/cache';

export class AbstractViewerComponent {
	cache: Cache<string, AudioModel>;

	constructor(limit: number, aservice: IAudioService) {
		this.cache = new Cache<string, AudioModel>(limit);

		aservice.getAudioChangeEmitter()
		.subscribe((key: string) => this.cacheUpdate(key, aservice));
	};

	protected wrapAudio(audio: AudioModel): AudioModel {
		return audio;
	}

	protected cacheUpdate(key: string, aservice: IAudioService) {
		if (aservice.hasAudioModel(key)) {
			let freshEntry = aservice.getAudioModel(key);
			this.cache.set(key, this.wrapAudio(freshEntry));
		}
		else {
			this.cache.delete(key);
		}
	};
}

export class SelectableViewerComponent extends AbstractViewerComponent {
	constructor(limit: number, aservice: IAudioService, private selector: QueuedAudioService) {
		super(limit, aservice);
	};

	addToSelected(id: string) {
		if (this.cache.has(id)) {
			this.selector.addAudio(this.cache.get(id));
		}
	};

	removeFromSelected(id: string) {
		this.selector.removeAudio(id);
	}

	isSelected(id: string) : boolean {
		return this.selector.hasAudioModel(id);
	}
}

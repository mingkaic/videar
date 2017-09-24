import { IAudioService } from '../_interfaces/audioservice.interface';
import { AudioModel } from '../_models/audio.model';
import { Cache } from '../_utils/cache';

export abstract class AudioWrapper {
    constructor(public model: AudioModel) {}
};

export abstract class AbstractViewerComponent {
	cache: Cache<string, AudioWrapper>;

	constructor(limit: number, _audioService: IAudioService) {
		this.cache = new Cache<string, AudioWrapper>(limit);

		_audioService.getAudioChangeEmitter()
		.subscribe((key: string) => this.cacheUpdate(key, _audioService));
    };
    
	protected abstract wrapAudio(audio: AudioModel): AudioWrapper;
	
	protected cacheUpdate(key: string, _audioService: IAudioService) {
		let freshEntry = _audioService.getAudioModel(key);
		this.cache.set(key, this.wrapAudio(freshEntry));
	};
};

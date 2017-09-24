import { EventEmitter } from '@angular/core';

import { AudioModel } from '../_models/audio.model';

export interface IAudioService {
    getAudioChangeEmitter(): EventEmitter<string>;

    getAudioModel(key: string): AudioModel;

    getAllKeys(): string[];
}

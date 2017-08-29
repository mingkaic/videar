import { EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as io from 'socket.io-client';

import { AudioModel } from '../_models/audio.model';
import { IAudioService } from './audioservice.interface';

export abstract class AbstractSocketAudio implements IAudioService {
    protected socket: io.Socket = io();
    
    private audios: Map<string, AudioModel> = new Map;
    private audioChange = new EventEmitter<string>();
    
	constructor(private _sanitizer: DomSanitizer) {}
	
    getAudioChangeEmitter(): EventEmitter<string> {
		return this.audioChange;
	};

    getAudioModel(key: string): AudioModel {
        return this.audios.get(key);
    };
    
    getAllKeys(): string[] {
        return Array.from(this.audios.keys());
    };
    
    hasAudioModel(key: string): boolean {
        return this.audios.has(key);
    };
    
    protected abstract getCallsign(id: string, source: string): string;
    
    protected setName(id: string, source: string) {
        let callsign = this.getCallsign(id, source);

        let soundInfo;
        if (this.audios.has(id)) {
            soundInfo = this.audios.get(id);
            soundInfo.name = callsign;
        }
        else {
            soundInfo = new AudioModel(id, callsign, null);
        }
        this.audios.set(id, soundInfo);
        this.audioChange.emit(id);
    };
    
    protected setAudioData(id: string, soundData) {
        let soundBlob = new Blob(soundData);
        let safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(soundBlob));
        
        let soundInfo;
        if (this.audios.has(id)) {
            soundInfo = this.audios.get(id);
            soundInfo.ref = safeURL;
        }
        else {
            soundInfo = new AudioModel(id, id, safeURL);
        }
        this.audios.set(id, soundInfo);
        this.audioChange.emit(id);
    };
}

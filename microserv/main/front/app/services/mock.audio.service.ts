import { Injectable } from '@angular/core';
import { AudioHandleService } from './audio.service';

@Injectable()
export class MockAudioHandleService extends AudioHandleService {
    private TEST_IDS : string[] = [
        "TEST1", 
        "TEST2", 
        "TEST3", 
        "TEST4"
    ];

    constructor()
    {
        super(null, null);
    };
    
    sendAudio(file, onSuccess?: (() => void)) {
        onSuccess();
    };

	setYTId(vidId: string, onSuccess?: (() => void), onFail?: (() => void)) {
        if (vidId) {
            onSuccess();
        }
        else {
            onFail();
        }
    };

	setAdder(addId: ((_: string) => void)) {
        this.TEST_IDS.forEach((id) => {
            addId(id);
        });
    };

	hasAudio(vidId: string): boolean {
        return this.TEST_IDS.findIndex((id) => { return id == vidId; }) >= 0;
    };

	getAudioUrl(id: string) {
        return "";
    }
}
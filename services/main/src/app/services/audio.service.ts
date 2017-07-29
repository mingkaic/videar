export class AudioStorage {
	soundIds: string[];
    private sounds: Map<string, string>;
    
    constructor() {}

    addAudio(id: string, soundData) {
        this.soundIds.push(id);
        let soundBlob = new Blob(soundData);
        this.sounds[id] = URL.createObjectURL(soundBlob);
    }

    getSoundUrl(id: string): string {
        return this.sounds[id];
    };
}
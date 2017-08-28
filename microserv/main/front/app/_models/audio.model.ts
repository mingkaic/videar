import { SafeResourceUrl } from '@angular/platform-browser';

export class AudioModel {
    subtitles: [string];

    constructor(public name: string, public ref: SafeResourceUrl) {}
}

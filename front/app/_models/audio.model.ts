import { SafeResourceUrl } from '@angular/platform-browser';

export class AudioModel {
    constructor(public _id: string, 
        public name: string, public ref: SafeResourceUrl) {};
}

import { Component, OnInit, SimpleChange } from '@angular/core';
import { AudioHandleService } from '../services/audio.service';

@Component({
	selector: 'audioviewer-component',
	templateUrl: './audioviewer.component.html',
	styleUrls: ['./audioviewer.component.css']
})
export class AudioviewerComponent implements OnInit {
	mapKeys = Array.from;

	constructor(private _audioService: AudioHandleService) {};

	ngOnInit() {};

	ngOnDestroy() {};
};

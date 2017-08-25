import { Component, OnInit, SimpleChange } from '@angular/core';
import { SynthesisService } from '../_services/synthesis.service';

@Component({
	selector: 'app-synthviewer',
	templateUrl: './synthviewer.component.html',
	styleUrls: ['./synthviewer.component.css']
})
export class SynthviewerComponent implements OnInit {
	mapKeys = Array.from;

	constructor(private _synthService: SynthesisService) {};

	ngOnInit() {};

	ngOnDestroy() {};
};

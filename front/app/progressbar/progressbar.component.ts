import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

import { ProgressDirective } from '../_directives/progress.directive';

// taken from https://embed.plnkr.co/rx4RJUFjHqGYMA3jRxDL/
@Component({
	selector: 'progressbar, [progressbar]',
	templateUrl: './progressbar.component.html'
})
export class Progressbar {
	@Input() private animate:boolean;
	@Input() private max:number;
	@Input() private type:string;
	@Input() private value:number;
}

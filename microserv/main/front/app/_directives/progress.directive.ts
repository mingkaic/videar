import { Directive, OnInit, Input, HostBinding } from '@angular/core';

import { Bar } from '../progressbar/bar.component';

const progressConfig = {
	animate: true,
	max: 100
};

// taken from https://embed.plnkr.co/rx4RJUFjHqGYMA3jRxDL/
@Directive({ selector: 'bs-progress, [progress]' })
export class ProgressDirective implements OnInit {
	@Input() public animate:boolean;

	@HostBinding('attr.max')
	@Input() public get max():number {
		return this._max;
	};

	@HostBinding('class') private addClass = 'progress';

	public set max(v:number) {
		this._max = v;
		this.bars.forEach((bar:Bar) => {
			bar.recalculatePercentage();
		});
	};

	public bars:Array<any> = [];

	private _max:number;

	constructor() {};

	ngOnInit() {
		this.animate = this.animate !== false;
		this.max = typeof this.max === 'number' ? this.max : progressConfig.max;
	};


	public addBar(bar:Bar) {
		if (!this.animate) {
			bar.transition = 'none';
		}
		this.bars.push(bar);
	};

	public removeBar(bar:Bar) {
		this.bars.splice(this.bars.indexOf(bar), 1);
	};
}

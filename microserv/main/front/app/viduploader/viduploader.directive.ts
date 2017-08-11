// taken from https://github.com/minrock/DnDExample
import {Directive, HostListener, HostBinding, EventEmitter, Output, Input} from '@angular/core';
import {forEach} from "@angular/router/src/utils/collection";

@Directive({
	selector: '[uploadDir]'
})
export class VidUploaderDirective {
	@Input() 
	private allowed_extensions : Array<string> = [];

	@Output() 
	private fileChangeEmiter : EventEmitter<FileList> = new EventEmitter();
	@Output()
	private filesInvalidEmiter : EventEmitter<File[]> = new EventEmitter();
	
	@HostBinding('style.background')
	private background = '#eee';
	
	constructor() { }
	
	@HostListener('dragover', ['$event'])
	public onDragOver(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		this.background = '#999';
	}

	@HostListener('dragleave', ['$event'])
	public onDragLeave(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		this.background = '#eee'
	}

	@HostListener('drop', ['$event'])
	public onDrop(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		this.background = '#eee';
		let files = evt.dataTransfer.files;
		let valid_files : Array<File> = [];
		let invalid_files : Array<File> = [];
		if(files.length > 0) {
			forEach(files, (file: File) => {
				let ext = file.name.split('.')[file.name.split('.').length - 1];
				if(this.allowed_extensions.lastIndexOf(ext) != -1) {
					valid_files.push(file);
				}
				else {
					invalid_files.push(file);
				}
			});
			this.filesChangeEmiter.emit(valid_files);
			this.filesInvalidEmiter.emit(invalid_files);
		}
	}
}

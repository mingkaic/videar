import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NguiPopupModule } from '@ngui/popup';
import { DndModule } from 'ng2-dnd';

import { AppComponent } from './app.component';

import { SynthesisComponent, SynthViewerComponent } from './synthesis';
import { MainViewerComponent, PopularViewerComponent, ExposedViewerComponent } from './mainviewer';
import { UploadComponent, UploadViewerComponent } from './uploader';
import { YtLinkerComponent, YtViewerComponent } from './ytlink';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';

import { 
	UploaderDirective,
	CollapseDirective,
	ProgressDirective,
	ModalDirective
} from './_directives';

import { Progressbar, Bar } from './progressbar';
import { routing } from './app.routing';

@NgModule({
	declarations: [
		AppComponent,

		MainViewerComponent,
		PopularViewerComponent,
		ExposedViewerComponent,

		UploadComponent,
		UploadViewerComponent,

		YtLinkerComponent,
		YtViewerComponent,

		SynthesisComponent,
		SynthViewerComponent,

		Progressbar,
		Bar,

		LoginComponent,
		RegisterComponent,

		UploaderDirective,
		CollapseDirective,
		ProgressDirective,
		ModalDirective
	],
	imports: [
		NguiPopupModule,
		BrowserModule,
		FormsModule,
		HttpModule,
		DndModule.forRoot(),
		RouterModule.forRoot(
			routing,
			{ enableTracing: true }
		)
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {};

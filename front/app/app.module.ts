import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NguiPopupModule } from '@ngui/popup';

import { AppComponent } from './app.component';

import { SynthesisComponent, SynthViewerComponent, QueuedViewerComponent } from './synthesis';
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
import { routes } from './routes';

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
		QueuedViewerComponent,

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
		RouterModule.forRoot(
			routes,
			{ enableTracing: true }
		)
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {};

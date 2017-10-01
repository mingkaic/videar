import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NguiPopupModule } from '@ngui/popup';

import { AppComponent } from './app.component';

import { UploadComponent, UploadViewerComponent } from './uploader';
import { YtLinkerComponent, YtViewerComponent } from './ytlink';

import { SynthesisComponent, SynthViewerComponent, QueuedViewerComponent } from './synthesis';
import { MainViewerComponent, PopularViewerComponent, ExposedViewerComponent } from './mainviewer';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';

import { 
	UploaderDirective,
	CollapseDirective,
	ProgressDirective,
	ModalDirective
} from './_directives';

import { Progressbar, Bar } from './progressbar';

import {
	QueuedAudioService,
	UploadAudioService,
	YoutubeAudioService,
	WarningService,
	ModalService
} from './_services';

const routes: Routes = [
	// basic routes
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: MainViewerComponent },
	{ path: 'upload', component: UploadComponent },
	{ path: 'ytlink', component: YtLinkerComponent },
	{ path: 'synthesis', component: SynthesisComponent },

	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent }
];

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
	providers: [
		UploadAudioService, 
		YoutubeAudioService, 
		QueuedAudioService, 
		WarningService, 
		ModalService
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {};

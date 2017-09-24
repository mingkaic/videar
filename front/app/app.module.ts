import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { NguiPopupModule } from '@ngui/popup';

import { AppComponent } from './app.component';

import { VidUploadComponent } from './viduploader/viduploader.component';
import { VidLinkerComponent } from './vidlinker/vidlinker.component';
import { SimpleViewerComponent } from './simpleviewer/simpleviewer.component';

import { SynthesisComponent } from './synthesis/synthesis.component';
import { AudioViewerComponent } from './audioviewer/audioviewer.component';
import { SynthViewerComponent } from './synthesis/synthviewer/synthviewer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';

import { VidUploaderDirective } from './_directives/viduploader.directive';
import { CollapseDirective } from './_directives/collapse.directive';
import { ProgressDirective } from './_directives/progress.directive';

import { Progressbar, Bar } from './progressbar';

import { AudioHandleService, WarningService } from './_services';

const routes: Routes = [
	// basic routes
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: SynthesisComponent },
	{ path: 'upload', component: VidUploadComponent },
	{ path: 'vidlink', component: VidLinkerComponent },
	{ path: 'synthesis', component: SynthesisComponent },
	{ path: 'vidview', component: AudioViewerComponent },

	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent }
];

@NgModule({
	declarations: [
		AppComponent,

		VidUploadComponent,
		VidUploaderDirective,
		VidLinkerComponent,
		SimpleViewerComponent,

		SynthesisComponent,
		SynthViewerComponent,

		AudioViewerComponent,
		CollapseDirective,
		ProgressDirective,
		
		Progressbar,
		Bar,

		LoginComponent,
		RegisterComponent
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
	providers: [ AudioHandleService, WarningService ],
	bootstrap: [ AppComponent ]
})
export class AppModule {};

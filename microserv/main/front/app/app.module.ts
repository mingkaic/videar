import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { VidUploadComponent } from './viduploader/viduploader.component';
import { VidLinkerComponent } from './vidlinker/vidlinker.component';
import { SimpleViewerComponent } from './simpleviewer/simpleviewer.component';

import { SynthesisComponent } from './synthesis/synthesis.component';
import { AudioviewerComponent } from './audioviewer/audioviewer.component';
import { SynthviewerComponent } from './synthesis/synthviewer/synthviewer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';

import { VidUploaderDirective } from './_directives/viduploader.directive';

import { AudioHandleService } from './_services/audio.service';

const routes: Routes = [
	// basic routes
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: VidUploadComponent },
	{ path: 'vidlink', component: VidLinkerComponent },
	{ path: 'synthesis', component: SynthesisComponent },
	{ path: 'vidview', component: AudioviewerComponent },

	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent }
];

@NgModule({
	declarations: [
		AppComponent,

		VidUploadComponent,
		VidLinkerComponent,
		SimpleViewerComponent,

		SynthesisComponent,
		AudioviewerComponent,
		SynthviewerComponent,
		VidUploaderDirective,

		LoginComponent,
		RegisterComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
	    RouterModule.forRoot(
			routes,
			{ enableTracing: true }
		)
	],
	providers: [ AudioHandleService ],
	bootstrap: [ AppComponent ]
})
export class AppModule {};

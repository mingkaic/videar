import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { VidUploadComponent } from './viduploader/viduploader.component';
import { VidLinkerComponent } from './vidlinker/vidlinker.component';
import { SynthesisComponent } from './synthesis/synthesis.component';
import { AudioviewerComponent } from './audioviewer/audioviewer.component';
import { SynthviewerComponent } from './synthviewer/synthviewer.component';

import { VidUploaderDirective } from './viduploader/viduploader.directive';

import { AudioHandleService } from './services/audio.service';

const routes: Routes = [
	// basic routes
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: VidUploadComponent },
	{ path: 'vidlink', component: VidLinkerComponent },
	{ path: 'synthesis', component: SynthesisComponent }
];

@NgModule({
	declarations: [
		AppComponent,
		VidUploadComponent,
		VidLinkerComponent,
		SynthesisComponent,
		AudioviewerComponent,
		SynthviewerComponent,
		VidUploaderDirective
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

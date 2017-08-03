import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { VidlinkerComponent } from './vidlinker/vidlinker.component';
import { AudioviewerComponent } from './audioviewer/audioviewer.component';
import { ConcaterComponent } from './concater/concater.component';

import { AudioHandleService } from './services/audio.service';

const routes: Routes = [
	// basic routes
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: VidlinkerComponent },
	{ path: 'view_audio', component: AudioviewerComponent },
	{ path: 'synthesis', component: ConcaterComponent }
];

@NgModule({
	declarations: [
		AppComponent,
		VidlinkerComponent,
		AudioviewerComponent,
		ConcaterComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
	    RouterModule.forRoot(routes)
	],
	providers: [AudioHandleService],
	bootstrap: [AppComponent]
})
export class AppModule {};

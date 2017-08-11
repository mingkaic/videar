import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { VidUploadComponent } from './viduploader/viduploader.component';
import { VidLinkerListComponent } from './vidlinkerlist/vidlinkerlist.component';
import { SynthesisComponent } from './synthesis/synthesis.component';

import { AudioHandleService } from './services/audio.service';

const routes: Routes = [
	// basic routes
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: VidUploadComponent },
	{ path: 'vidlink', component: VidLinkerListComponent },
	{ path: 'synthesis', component: SynthesisComponent }
];

@NgModule({
	declarations: [
		AppComponent,
		VidUploadComponent,
		VidLinkerListComponent,
		SynthesisComponent
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

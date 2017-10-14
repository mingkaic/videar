import { Routes } from '@angular/router';

import { MainViewerComponent } from './mainviewer';
import { SynthesisComponent } from './synthesis';
import { UploadComponent } from './uploader';
import { YtLinkerComponent } from './ytlink';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';

export const routing: Routes = [
	// basic routes
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: MainViewerComponent },
	{ path: 'upload', component: UploadComponent },
	{ path: 'ytlink', component: YtLinkerComponent },
	{ path: 'synthesis', component: SynthesisComponent },

	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent }
];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnePixelComponent } from './one-pixel/one-pixel.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'one-pixel', component: OnePixelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

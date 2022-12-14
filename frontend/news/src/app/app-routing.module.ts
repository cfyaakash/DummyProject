import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { StoryComponent } from './story/story.component';
import { SourcesComponent } from'./sources/sources.component';
import { HomeComponent } from './home/home.component';
import { StoryAddComponent } from './story-add/story-add.component';
const routes: Routes = [
  {
  path: 'home',
  component:AppComponent
  },
  ]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

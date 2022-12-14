import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoryComponent } from './story/story.component';
import { SourcesComponent } from './sources/sources.component';
import { StoryTabDirective } from './story-tab.directive';
import { HomeComponent } from './home/home.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoryAddComponent } from './story-add/story-add.component';
import { AddSourceComponent } from './add-source/add-source.component';
import {HttpClientXsrfModule} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { EditstoryComponent } from './editstory/editstory.component';
import { EditsourceComponent } from './editsource/editsource.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    StoryComponent,
    SourcesComponent,
    StoryTabDirective,
    HomeComponent,
    StoryAddComponent,
    AddSourceComponent,
    EditstoryComponent,
    EditsourceComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxPaginationModule


//     HttpClientXsrfModule.withOptions({
//       cookieName: 'csrftoken',
//       headerName: 'HTTP_X_CSRFTOKEN',
//       })
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  entryComponents:[
    StoryComponent,
    SourcesComponent,
    StoryAddComponent,
    AddSourceComponent

    ]
})
export class AppModule {
}

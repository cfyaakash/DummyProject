import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SourcesService } from './sources.service';
import { SourcesComponent } from'./sources/sources.component';
import { sources } from './sources';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'news';

  constructor() {}
//   source(){
//     this.router.navigate(['/sources']);
//
//   }
//
//   story(){
//   this.router.navigate(['/story']);
//  }



}

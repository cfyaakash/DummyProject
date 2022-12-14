import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, filter } from 'rxjs';
import { sources } from '../sources';
import { SourcesService } from '../sources.service';
import { StoryapiService } from '../storyapi.service';
import { Router } from '@angular/router';
import {EditsourceComponent} from '../editsource/editsource.component';
import {AddSourceComponent} from '../add-source/add-source.component'



@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.css']
})

export class SourcesComponent implements OnInit {
        filterTerm!: string;
//   sources$ !: Observable<sources[]>;
        sources : any;
        Editsource: any;
        display: any;
        p: number =1;
        total : number = 0;

//   deletedSource !: sources;

  constructor(private sourcesService: SourcesService,private router: Router) {
      this.Source();
      this.sourcesService.Refreshrequired.subscribe(result=>{
          this.Source();
      });
  }

//  prepareDeleteSource(deleteSource:  sources){
//   this.deletedSource = deleteSource;
//  }

  ngOnInit(): void {
      this.Source();
  }

  Source(){
      this.sources = this.sourcesService.sources()
  }

  @ViewChild(AddSourceComponent) addview !: AddSourceComponent


//    sourcelist : any;
//    Sources(){
//         this.sourcesService.Sources().subscribe(result => {
//         this.sourcelist = result;
//         });
//       }

   functionedit(source:any){
       this.addview.LoadEditData(source);

  }



  deleteSource(id: any){
      if(confirm("Are you sure to delete this " + (id)) ){
          console.log(id)
          this.sourcesService.deleteSource(id).subscribe(source =>  this.Source());
      }
  }


  editSource(source : any){
  console.log(source)
      this.Editsource = source;
      this.display  = ! this.display;
  }
//     console.log(id)
//     console.log(data)


//   public getSources(){
//   this.sources$ = this.sourcesService.getSources();
//   }
//    story(){
//   this.router.navigate(['/story']);


 pageChangeEvent(event: number){
      this.p = event;
      this.Source();
 }
}


import { Component, OnInit,ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { story } from '../story';
import { sources } from '../sources';
import { StoryapiService } from '../storyapi.service';
import { SourcesService } from '../sources.service';
import {CookieService} from 'ngx-cookie-service';
import { FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import { EditstoryComponent } from '../editstory/editstory.component'
import {StoryAddComponent} from'../story-add/story-add.component'



@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {
    filterTerm!: any;
    stories : any;
    company : any;
    sources : any;
    Editstory : any;
    display : any;
    p: number =1;
    total : number = 0;


//    editstoryForm = new FormGroup({
//     title : new FormControl(),
//     body_text : new FormControl(),
//     source : new FormControl(),
//     client : new FormControl(),
//     pub_date : new FormControl(),
//     url : new FormControl(),
//     companies : new FormControl(),
//   });

  constructor(private storyapiService: StoryapiService,private sourcesService : SourcesService) {
      this.sources = this.sourcesService.sources();
      this.company = this.storyapiService.company();
      this.storyapiService.Refreshrequired.subscribe(result=>{
          this.story();
      });
  }


  ngOnInit(): void {
      this.story();
  }

  story(){
      this.stories = this.storyapiService.story();
  }

  @ViewChild(StoryAddComponent) addview !: StoryAddComponent


  functionedit(story:any){
       this.addview.LoadEditData(story);
  }


  deleteStory(id : string){
      if(confirm("Are you sure to delete this " + (id)) ){
          console.log(id)
          this.storyapiService.deleteStory(id).subscribe(story => this.story());
      }
  }

  editStory(story : any){
      console.log(story)
      this.Editstory = story;
      this.display  = ! this.display;
  }

  pageChangeEvent(event: number){
      this.p = event;
      this.story();
  }
}

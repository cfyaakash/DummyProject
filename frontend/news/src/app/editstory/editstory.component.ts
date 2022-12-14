import { Component,Input ,OnInit } from '@angular/core';
import {story} from '../story';
import { StoryapiService } from '../storyapi.service';
import { SourcesService } from '../sources.service';
import { sources } from '../sources';
import { Observable , of, throwError } from 'rxjs';
import { FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import { StoryComponent } from '../story/story.component';
@Component({
  selector: 'app-editstory',
  templateUrl: './editstory.component.html',
  styleUrls: ['./editstory.component.css']
})
export class EditstoryComponent implements OnInit {
   company : any;
  sources : any;

  storyeditForm = new FormGroup({
   title : new FormControl(),
    body_text : new FormControl(),
    source : new FormControl(),
    client : new FormControl(),
    pub_date : new FormControl(),
    url : new FormControl(),
    companies : new FormControl(),
   });
  @Input() particularstory :any;



  constructor(private storyapiService: StoryapiService, private sourcesService : SourcesService) {  this.sources = this.sourcesService.sources();
   this.company = this.storyapiService.company() }

  ngOnInit(): void {
  this.storyeditForm = new FormGroup({
   title : new FormControl(),
    body_text : new FormControl(),
    source : new FormControl(),
    client : new FormControl(),
    pub_date : new FormControl(),
    url : new FormControl(),
    companies : new FormControl(),
   })
  }

  storyData_post: any;

  saveStory(id: any){
    if(this.validate_form()){
      this.storyData_post = this.storyeditForm.value;

      this.storyapiService.updateStory(id, this.storyData_post).subscribe((story)=>{
      alert('story added');
      });
      }

      else{
      alert('please fill from correctly');
      }
  }
  validate_form(){
    const formData = this.storyeditForm.value;
    if(formData.title == null){
      return false;
      }else if(formData.url == null || formData.body_text == null){
      return false;
      }else{
      return true;
      }
      }

}

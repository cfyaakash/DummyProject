import { Component, OnInit,ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import {story} from '../story';
import { StoryapiService } from '../storyapi.service';
import { SourcesService } from '../sources.service';
import { sources } from '../sources';
import { Observable , of, throwError } from 'rxjs';
import { FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {StoryComponent} from '../story/story.component';


@Component({
  selector: 'app-story-add',
  templateUrl: './story-add.component.html',
  styleUrls: ['./story-add.component.css']
})
export class StoryAddComponent implements OnInit {

// a form for entering and validating data
//    storyForm = new FormGroup({
//     title : new FormControl(),
//     body_text : new FormControl(),
//     source : new FormControl(),
//     client : new FormControl(),
//     pub_date : new FormControl(),
//     url : new FormControl(),
//     companies : new FormControl(),
//   });
  constructor(private storyapiService: StoryapiService, private sourcesService : SourcesService, private modalService: NgbModal) {
   this.saveStory();
   this.storyapiService.Refreshrequired.subscribe(result=>{
        this.saveStory();
      });
      }


 @ViewChild('content') addview !: ElementRef

  ngOnInit(): void {
  this.LoadCompanyData();
  this.LoadSourceData();
  }


  errormessage = '';
  errorclass = '';
  saveresponse: any;
  source: any;
  editdata: any;
  company : any;
//   sources : any;


  storyForm = new FormGroup({
    id : new FormControl({value:0, disabled:true},),
    title : new FormControl('', Validators.compose([Validators.required, Validators.minLength(15)])),
    body_text : new FormControl(''),
    source : new FormControl(),
//     client : new FormControl(''),
    pub_date : new FormControl('', Validators.compose([Validators.required])),
    url : new FormControl('', Validators.compose([Validators.required])),
    companies : new FormControl(),
  });


//   storyData_post: any;

  saveStory(){
      if(this.storyForm.valid){
          const Editid =this.storyForm.getRawValue().id;
          this.saveresponse = this.storyForm.getRawValue();
          if(Editid!=0 && Editid!= null){
//           this.saveresponse = this.sourceForm.getRawValue();
              this.storyapiService.updateStory(Editid,this.saveresponse).subscribe(result => {
                  this.saveresponse = result;
                  console.log(this.saveresponse)
                  this.errormessage = "Saved Sucessfully";
                  this.errorclass = "sucessmessage";
                  setTimeout(()=>{
                      this.modalService.dismissAll();
                  },1000)
              });

          }else{
           console.log(this.storyForm.getRawValue());
              this.saveresponse = this.storyForm.getRawValue();
              this.storyapiService.addStory(this.saveresponse).subscribe(result => {
                  this.saveresponse = result;
                  console.log(this.saveresponse)
                  this.errormessage = "Saved Sucessfully";
                  this.errorclass = "sucessmessage";
                  setTimeout(()=>{
                      this.modalService.dismissAll();
                  },1000)
              });
           }
           }
     }


  LoadSourceData(){
    this.sourcesService.sources().subscribe(result=>{
    this.source = result;
    })
    }

 LoadCompanyData(){
    this.storyapiService.company().subscribe(result=>{
    this.company = result;
    })
    }


  LoadEditData(story: any) {
      this.open();
      this.storyapiService.GetStorybyid(story).subscribe(result => {
          this.editdata = result;
          console.log(this.editdata)
          this.storyForm.setValue({id:this.editdata.id, title:this.editdata.title,url:this.editdata.url,body_text:this.editdata.body_text,
          source:this.editdata.source, companies:this.editdata.companies, pub_date:this.editdata.pub_date});
      });
  }


  Clearform(){
      this.storyForm.setValue({id:0, title:'',url:'',source:'',body_text:'',pub_date:'',companies:''})
  }

  open() {
      this.Clearform();
      this.modalService.open(this.addview,{ ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      }, (reason) => {
      });
  }

  private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
      } else {
          return `with: ${reason}`;
      }
  }

  get title() {
      return this.storyForm.get("title");
  }
  get url() {
      return this.storyForm.get("url");
  }

  get pub_date() {
      return this.storyForm.get("pub_date");
  }

   get companies() {
      return this.storyForm.get("companies");
  }



}




//     if(this.validate_form()){
//       this.storyData_post = this.storyForm.value;
//
//
//       this.storyapiService.addStory(this.storyData_post).subscribe((story)=>{
//       alert('story added');
//
//       });
//       }
//
//       else{
//       alert('please fill from correctly');
//       }
//   }
//   validate_form(){
//     const formData = this.storyForm.value;
//     if(formData.title == null){
//       return false;
//       }else if(formData.url == null || formData.body_text == null){
//       return false;
//       }else{
//       return true;
//       }
//       }
// }




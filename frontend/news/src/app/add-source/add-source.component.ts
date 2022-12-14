import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { sources } from '../sources';
import { SourcesService } from '../sources.service';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {SourcesComponent} from '../sources/sources.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-source',
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.css']
})
export class AddSourceComponent implements OnInit {
   // a form for entering and validating data
//    sourceForm = new FormGroup({
//     name : new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)])),
//     url : new FormControl('', Validators.compose([Validators.required])),
// //     client : new FormControl(),
//   });


  constructor(private sourcesService: SourcesService, private modalService: NgbModal) { this.saveSource();

      this.sourcesService.Refreshrequired.subscribe(result=>{
        this.saveSource();
      });
    }

  @ViewChild('content') addview !: ElementRef


  ngOnInit(): void {
      }

  errormessage = '';
  errorclass = '';
  saveresponse: any;
  source: any;
  editdata: any;

//   destdata:any;

 sourceForm = new FormGroup({
      id: new FormControl({value:0, disabled:true} ),
      name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)])),
      url: new FormControl('', Validators.compose([Validators.required])),
//     client : new FormControl(),
  });

//   sourceData_post: any;
  saveSource(){
      if(this.sourceForm.valid){
          const Editid =this.sourceForm.getRawValue().id;
          this.saveresponse = this.sourceForm.getRawValue();
          if(Editid!=0 && Editid!= null){
//           this.saveresponse = this.sourceForm.getRawValue();
              this.sourcesService.updateSource(Editid,this.saveresponse).subscribe(result => {
                  this.saveresponse = result;
                  console.log(this.saveresponse)
                  this.errormessage = "Saved Sucessfully";
                  this.errorclass = "sucessmessage";
                  setTimeout(()=>{
                      this.modalService.dismissAll();
                  },1000)
              });

          }else{
           console.log(this.sourceForm.getRawValue());
              this.saveresponse = this.sourceForm.getRawValue();
              this.sourcesService.addSource(this.saveresponse).subscribe(result => {
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


  LoadEditData(source: any) {
      this.open();
      this.sourcesService.GetSourcebyid(source).subscribe(result => {
          this.editdata = result;
          console.log(this.editdata)
          this.sourceForm.setValue({id:this.editdata.id, name:this.editdata.name,url:this.editdata.url});
      });
  }


  Clearform(){
      this.sourceForm.setValue({id:0, name:'',url:''})
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

  get name() {
      return this.sourceForm.get("name");
  }
  get url() {
      return this.sourceForm.get("url");
  }

}

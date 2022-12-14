import { Component,Input, OnInit } from '@angular/core';

import { sources } from '../sources';
import { SourcesService } from '../sources.service';
import { FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import {SourcesComponent} from '../sources/sources.component';

@Component({
  selector: 'app-editsource',
  templateUrl: './editsource.component.html',
  styleUrls: ['./editsource.component.css']
})
export class EditsourceComponent implements OnInit {
    editsourceForm = new FormGroup({
        name : new FormControl(),
        url : new FormControl(),

    });

    @Input() particularsource :any;
    constructor(private sourcesService: SourcesService) { }

    ngOnInit(): void {
         this.editsourceForm  = new FormGroup({
         name : new FormControl(),
         url : new FormControl(),
         })
    }

  sourceData_post: any;
  saveSource(id : any){
      if(this.validate_form()){
          this.sourceData_post = this.editsourceForm .value;
          this.sourcesService.updateSource(id, this.sourceData_post).subscribe((source)=>{
              alert('source added');
          });
      }else{
          alert('please fill from correctly');
      }
  }

  validate_form(){
      const formData = this.editsourceForm.value;
      if(formData.name == null){
          return false;
      }else if(formData.url == null){
          return false;
      }else{
          return true;
      }
  }
}

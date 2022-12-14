import { Injectable, Component,  AfterViewInit, ComponentFactoryResolver, ViewContainerRef, ViewChild} from '@angular/core';
import { isNullOrUndefined } from 'util';
import { StoryapiService } from '../storyapi.service';

import { SourcesComponent } from'../sources/sources.component';
import { StoryTabDirective } from '../story-tab.directive';
import { StoryComponent } from '../story/story.component';
import {StoryAddComponent } from '../story-add/story-add.component';
import {AddSourceComponent} from '../add-source/add-source.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
@Injectable()
export class HomeComponent implements  AfterViewInit {
  _component : any;
  componentsList : any[] = [];


  @ViewChild(StoryTabDirective,{static: false}) tabHost !: StoryTabDirective;
  constructor(private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver) { }

  ngAfterViewInit(): void{
  console.log('hi')
    this.loadTabComponent("STORY");
}

  loadTabComponent(_selectedTab: any) {
  // remove loaded Component
//   if (!isNullOrUndefined(this.componentsList)) {
//     this.componentsList.map((cm, i) => {
//       let tmp = this.viewContainerRef;
// //
//   this.viewContainerRef.remove(this.viewContainerRef.indexOf(cm));
//         this.viewContainerRef.remove(i);
//         this.componentsList.splice(i, 1);
//       });
//     }


    if (_selectedTab == "STORY")
      this._component = StoryComponent;
    else if (_selectedTab == "SOURCE")
      this._component = SourcesComponent;
    else if (_selectedTab == "ADDSTORY")
      this._component = StoryAddComponent;
    else if(_selectedTab == "ADDSOURCE")
      this._component = AddSourceComponent;



    this.viewContainerRef.detach();
    this.viewContainerRef.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this._component);
    this.viewContainerRef = this.tabHost.viewContainerRef;

    let componentRef = this.viewContainerRef.createComponent(componentFactory);
    this.componentsList.push(componentRef);
  }

}

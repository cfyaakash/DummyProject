import { Directive , ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appStoryTab]'
})
export class StoryTabDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}

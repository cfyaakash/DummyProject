import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryAddComponent } from './story-add.component';

describe('StoryAddComponent', () => {
  let component: StoryAddComponent;
  let fixture: ComponentFixture<StoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditstoryComponent } from './editstory.component';

describe('EditstoryComponent', () => {
  let component: EditstoryComponent;
  let fixture: ComponentFixture<EditstoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditstoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditstoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

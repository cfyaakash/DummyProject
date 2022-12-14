import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditsourceComponent } from './editsource.component';

describe('EditsourceComponent', () => {
  let component: EditsourceComponent;
  let fixture: ComponentFixture<EditsourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditsourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditsourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

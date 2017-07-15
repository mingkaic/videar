import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioviewerComponent } from './audioviewer.component';

describe('AudioviewerComponent', () => {
  let component: AudioviewerComponent;
  let fixture: ComponentFixture<AudioviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

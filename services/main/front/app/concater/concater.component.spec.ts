import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcaterComponent } from './concater.component';

describe('ConcaterComponent', () => {
  let component: ConcaterComponent;
  let fixture: ComponentFixture<ConcaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

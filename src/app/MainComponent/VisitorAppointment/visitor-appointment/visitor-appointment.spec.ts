import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorAppointment } from './visitor-appointment';

describe('VisitorAppointment', () => {
  let component: VisitorAppointment;
  let fixture: ComponentFixture<VisitorAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorAppointment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

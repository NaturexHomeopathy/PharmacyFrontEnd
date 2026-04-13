import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorOrders } from './visitor-orders';

describe('VisitorOrders', () => {
  let component: VisitorOrders;
  let fixture: ComponentFixture<VisitorOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

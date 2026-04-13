import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Healthproduct } from './healthproduct';

describe('Healthproduct', () => {
  let component: Healthproduct;
  let fixture: ComponentFixture<Healthproduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Healthproduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Healthproduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

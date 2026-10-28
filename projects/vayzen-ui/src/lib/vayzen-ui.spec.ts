import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VayzenUi } from './vayzen-ui';

describe('VayzenUi', () => {
  let component: VayzenUi;
  let fixture: ComponentFixture<VayzenUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VayzenUi],
    }).compileComponents();

    fixture = TestBed.createComponent(VayzenUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

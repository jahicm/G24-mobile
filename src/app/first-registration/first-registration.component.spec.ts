import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstRegistrationComponent } from './first-registration.component';

describe('FirstRegistrationComponent', () => {
  let component: FirstRegistrationComponent;
  let fixture: ComponentFixture<FirstRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

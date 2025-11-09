import { ComponentFixture, TestBed } from '@angular/core/testing';

import { G24Component } from './g24.component';

describe('G24Component', () => {
  let component: G24Component;
  let fixture: ComponentFixture<G24Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [G24Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(G24Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

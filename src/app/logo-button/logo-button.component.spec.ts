import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoButtonComponent } from './logo-button.component';

describe('LogoButtonComponent', () => {
  let component: LogoButtonComponent;
  let fixture: ComponentFixture<LogoButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogoButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

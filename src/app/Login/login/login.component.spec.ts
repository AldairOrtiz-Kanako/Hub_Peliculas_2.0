import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginHtmlComponent } from './login.component';

describe('LoginHtmlComponent', () => {
  let component: LoginHtmlComponent;
  let fixture: ComponentFixture<LoginHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginHtmlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

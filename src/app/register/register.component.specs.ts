import { TestBed, async } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import {} from 'jasmine';
describe('RegisterComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterComponent
      ],
    }).compileComponents();
  }));
  it('should show the register page', async(() => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

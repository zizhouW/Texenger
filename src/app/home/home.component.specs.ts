import { TestBed, async } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import {} from 'jasmine';
describe('HomeComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
    }).compileComponents();
  }));
  it('should show the home page', async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

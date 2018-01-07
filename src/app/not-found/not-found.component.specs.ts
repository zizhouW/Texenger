import { TestBed, async } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import {} from 'jasmine';
describe('NotFoundComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotFoundComponent
      ],
    }).compileComponents();
  }));
  it('should show the home page', async(() => {
    const fixture = TestBed.createComponent(NotFoundComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

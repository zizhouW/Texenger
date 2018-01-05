import { TestBed, async } from '@angular/core/testing';
import { RoomComponent } from './room.component';
import {} from 'jasmine';
describe('RoomComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RoomComponent
      ],
    }).compileComponents();
  }));
  it('should show the room', async(() => {
    const fixture = TestBed.createComponent(RoomComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

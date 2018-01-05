import { TestBed, async } from '@angular/core/testing';
import { RoomListComponent } from './room-list.component';
describe('RoomListComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RoomListComponent
      ],
    }).compileComponents();
  }));
  it('should show the room list', async(() => {
    const fixture = TestBed.createComponent(RoomListComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

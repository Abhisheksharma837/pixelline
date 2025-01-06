import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HowToWorkPage } from './how-to-work.page';

describe('HowToWorkPage', () => {
  let component: HowToWorkPage;
  let fixture: ComponentFixture<HowToWorkPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToWorkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpPagePage } from './help-page.page';

describe('HelpPagePage', () => {
  let component: HelpPagePage;
  let fixture: ComponentFixture<HelpPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

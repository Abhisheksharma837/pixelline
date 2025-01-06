import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultFileNamePage } from './default-file-name.page';

describe('DefaultFileNamePage', () => {
  let component: DefaultFileNamePage;
  let fixture: ComponentFixture<DefaultFileNamePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultFileNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

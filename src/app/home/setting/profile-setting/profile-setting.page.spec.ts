import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileSettingPage } from './profile-setting.page';

describe('ProfileSettingPage', () => {
  let component: ProfileSettingPage;
  let fixture: ComponentFixture<ProfileSettingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

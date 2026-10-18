import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageInfosSection } from './landing-page-infos-section';

describe('LandingPageInfosSection', () => {
  let component: LandingPageInfosSection;
  let fixture: ComponentFixture<LandingPageInfosSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageInfosSection],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageInfosSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

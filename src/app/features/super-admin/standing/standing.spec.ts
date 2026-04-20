import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Standing } from './standing';

describe('Standing', () => {
  let component: Standing;
  let fixture: ComponentFixture<Standing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Standing],
    }).compileComponents();

    fixture = TestBed.createComponent(Standing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

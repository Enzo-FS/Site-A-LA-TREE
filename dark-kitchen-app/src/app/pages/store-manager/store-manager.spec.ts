import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManager } from './store-manager';

describe('StoreManager', () => {
  let component: StoreManager;
  let fixture: ComponentFixture<StoreManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreManager],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

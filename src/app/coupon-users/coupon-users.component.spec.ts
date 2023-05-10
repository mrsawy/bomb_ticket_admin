import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponUsersComponent } from './coupon-users.component';

describe('CouponUsersComponent', () => {
  let component: CouponUsersComponent;
  let fixture: ComponentFixture<CouponUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

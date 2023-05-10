import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// *******************************************************************************
// Layouts

import { Layout1Component } from './layout/layout-1/layout-1.component';

// *******************************************************************************
// Pages

import { UsersComponent } from './users/users.component';
import { EventsComponent } from './events/events.component';
import { OrdersComponent } from './orders/orders.component';
import { CouponsComponent } from './coupons/coupons.component';
import { CreateeventComponent } from './createevent/createevent.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { TicketsComponent } from './tickets/tickets.component';
import { SigninComponent } from './signin/signin.component';
import { AuthGuard } from './guards/auth.guard';
import { ForwardGuard } from './guards/forward.guard';
import { ImagesComponent } from './images/images.component';
import { AdminsComponent } from './admins/admins.component';
import { ComplainsAndSuggestionsComponent } from './complains-and-suggestions/complains-and-suggestions.component';
import { CouponUsersComponent } from './coupon-users/coupon-users.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

// *******************************************************************************
// Routes

const routes: Routes = [

  { path: 'signin', component: SigninComponent, canActivate: [AuthGuard] },

  {
    path: '',
    component: Layout1Component,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UsersComponent, canActivate: [ForwardGuard] },
      { path: 'admins', component: AdminsComponent, canActivate: [ForwardGuard] },
      { path: 'events', component: EventsComponent, canActivate: [ForwardGuard] },
      { path: 'createevent', component: CreateeventComponent, canActivate: [ForwardGuard] },
      { path: 'editevent/:eventId', component: CreateeventComponent, canActivate: [ForwardGuard] },
      { path: 'images/:type', component: ImagesComponent, canActivate: [ForwardGuard] },
      { path: 'coupons', component: CouponsComponent, canActivate: [ForwardGuard] },
      { path: 'orders', component: OrdersComponent, canActivate: [ForwardGuard] },
      { path: 'withdraw/:type', component: WithdrawComponent, canActivate: [ForwardGuard] },
      { path: 'tickets/:type', component: TicketsComponent, canActivate: [ForwardGuard] },
      { path: 'complains-and-suggestions', component: ComplainsAndSuggestionsComponent, canActivate: [ForwardGuard] },
      { path: 'coupon-users/:couponId', component: CouponUsersComponent, },
      { path: 'order-detail/:orderId', component: OrderDetailComponent, },
    ],
  },

];

// *******************************************************************************
//

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

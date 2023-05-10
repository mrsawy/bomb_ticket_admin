import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// *******************************************************************************
// NgBootstrap

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// *******************************************************************************
// App

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { LayoutModule } from './layout/layout.module';

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

// *******************************************************************************
// Others

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { TextMaskModule } from 'angular2-text-mask';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { FileUploadModule } from 'ng2-file-upload';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
// import { AgmCoreModule } from '@agm/core';
import { DatePipe } from '@angular/common';
import { ImagesComponent } from './images/images.component';
import { AdminsComponent } from './admins/admins.component';
import { ComplainsAndSuggestionsComponent } from './complains-and-suggestions/complains-and-suggestions.component';
import { MyDateTimePipe } from './pipes/my-date-time.pipe';
import { CouponUsersComponent } from './coupon-users/coupon-users.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';



// *******************************************************************************
//

@NgModule({
  declarations: [
    AppComponent,

    // Pages
    UsersComponent,
    EventsComponent,
    OrdersComponent,
    CouponsComponent,
    CreateeventComponent,
    WithdrawComponent,
    TicketsComponent,
    SigninComponent,
    ImagesComponent,
    AdminsComponent,
    ComplainsAndSuggestionsComponent,
    MyDateTimePipe,
    CouponUsersComponent,
    OrderDetailComponent,
  ],

  imports: [
    BrowserModule,
    NgbModule.forRoot(),

    // App
    AppRoutingModule,
    LayoutModule,
    FormsModule,
    HttpClientModule,
    NgxImageGalleryModule,
    DropzoneModule,
    FileUploadModule,
    GooglePlaceModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyCBuZJQoWf164jtX6ML5-ArJy8ZPTvbars',
    //   libraries: ['places']
    // }),
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-lg btn-primary mx-2',
      cancelButtonClass: 'btn btn-lg btn-default mx-2'
    }),
    ToastrModule.forRoot({
      timeOut: 2100,
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    TextMaskModule,
  ],

  providers: [
    Title,
    AppService,
    DatePipe,
  ],

  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }

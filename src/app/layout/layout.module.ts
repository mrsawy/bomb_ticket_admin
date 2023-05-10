import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


// *******************************************************************************
// Layouts

import { Layout1Component } from './layout-1/layout-1.component';


// *******************************************************************************
// Components

import { LayoutNavbarComponent } from './layout-navbar/layout-navbar.component';
import { LayoutSidenavComponent } from './layout-sidenav/layout-sidenav.component';


// *******************************************************************************
// Libs

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidenavModule } from '../../vendor/libs/sidenav/sidenav.module';


// *******************************************************************************
// Services

import { LayoutService } from './layout.service';
import { TranslateModule } from '@ngx-translate/core';


// *******************************************************************************
//

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    SidenavModule,
    TranslateModule
  ],
  declarations: [
    Layout1Component,

    LayoutNavbarComponent,
    LayoutSidenavComponent,
  ],
  providers: [
    LayoutService
  ]
})
export class LayoutModule { }

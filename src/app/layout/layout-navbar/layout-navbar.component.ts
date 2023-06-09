import { Component, Input, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { LayoutService } from '../../layout/layout.service';

@Component({
  selector: 'app-layout-navbar',
  templateUrl: './layout-navbar.component.html',
  styles: [':host { display: block; }']
})
export class LayoutNavbarComponent {
  isExpanded = false;
  isRTL: boolean;

  @Input() sidenavToggle = true;

  @HostBinding('class.layout-navbar') private hostClassMain = true;

  constructor(
    private appService: AppService,
    private layoutService: LayoutService,
    private router: Router,
    ) {
    this.isRTL = appService.isRTL;
  }

  currentBg() {
    return `bg-${this.appService.layoutNavbarBg}`;
  }

  toggleSidenav() {
    this.layoutService.toggleCollapsed();
  }

  onLogout(){
    localStorage.clear();
    this.router.navigate(['/signin'])
  }
}

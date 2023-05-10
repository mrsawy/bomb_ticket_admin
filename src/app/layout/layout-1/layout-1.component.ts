import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { ToolService } from '../../services/tool.service';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-layout-1',
  templateUrl: './layout-1.component.html',
  styles: [':host { display: block; }', ':host /deep/ .layout-loading .sidenav-link { transition: none !important; }']
})
export class Layout1Component implements AfterViewInit, OnDestroy {
  // Prevent "blink" effect
  public initialized = false;

  constructor(
    private layoutService: LayoutService,
    public toolService: ToolService,
  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initialized = true;

      this.layoutService.init();
      this.layoutService.update();
      this.layoutService.setAutoUpdate(true);
    });
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.layoutService.destroy();
    });
  }

  closeSidenav() {
    setTimeout(() => {
      this.layoutService.setCollapsed(true);
    });
  }
}

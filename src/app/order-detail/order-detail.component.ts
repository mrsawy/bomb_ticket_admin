import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss',
    '../../vendor/libs/spinkit/spinkit.scss']
})
export class OrderDetailComponent implements OnInit {


  constructor(
    public dataService: DataService,
    public toolService: ToolService,
    private activatedRoute: ActivatedRoute,
    public location: Location,
  ) {
    this.toolService.pageTitle = 'Order Detail';
  }

  userData: any;
  ticketData: any;
  eventData: any;
  sellerData: any;

  orderDetail: any;
  orderTicketsList = [];

  ngOnInit() {
    this.toolService.showLoading = true;
    this.showOrderDetail();
  }


  showOrderDetail() {
    this.toolService.showLoading = true;
    let orderId = this.activatedRoute.snapshot.params.orderId;
    this.dataService.getOrderDetail(orderId).subscribe((resp: any) => {
      this.orderDetail = resp;
      this.toolService.showLoading = false;
    })
  }





}

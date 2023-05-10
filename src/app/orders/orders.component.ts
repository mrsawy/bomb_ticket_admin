import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss',
    '../../vendor/libs/spinkit/spinkit.scss']
})
export class OrdersComponent implements OnInit {

  constructor(
    public dataService: DataService,
    public toolService: ToolService,
  ) {
    this.toolService.pageTitle = 'Orders';
  }

  allOrdersData = [];
  ordersData = [];


  ngOnInit() {
    this.toolService.showLoading = true;
    this.getOrdersData();
  }


  getOrdersData() {
    this.dataService.getAllOrders().subscribe((resp: any) => {
      this.allOrdersData = resp.map(item => {
        item["sellerName"] = item.seller ? `${item.seller.firstName} ${item.seller.lastName}` : '';
        item["buyerName"] = item.user ? `${item.user.firstName} ${item.user.lastName}` : '';
        return item;
      });
      this.ordUpdate();
      this.toolService.showLoading = false;
    })
  }


  // Filter and Sorting data
  ordSearchKeys = ['id', 'orderNumber', 'sellerName', 'buyerName', 'phoneNumber', 'orderAmount', 'discount', 'price', 'quantity'];
  ordSortBy = 'id';
  ordSortDesc = true;
  ordPerPage = 10;
  ordFilterVal = '';
  ordCurrentPage = 1;
  ordTotalItems = 0;
  get ordTotalPages() {
    return Math.ceil(this.ordTotalItems / this.ordPerPage);
  }
  ordUpdate() {
    const data = this.ordFilter(this.allOrdersData);
    this.ordTotalItems = data.length;
    this.ordSort(data);
    this.ordersData = this.ordPaginate(data);
  }
  ordFilter(data) {
    const filter = this.ordFilterVal.toLowerCase();
    return !filter ?
      data.slice(0) :
      data.filter(d => {
        return Object.keys(d)
          .filter(k => this.ordSearchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(filter) !== -1 || !filter;
      });
  }
  ordSort(data) {
    data.sort((a: any, b: any) => {
      a = typeof (a[this.ordSortBy]) === 'string' ? a[this.ordSortBy].toUpperCase() : a[this.ordSortBy];
      b = typeof (b[this.ordSortBy]) === 'string' ? b[this.ordSortBy].toUpperCase() : b[this.ordSortBy];
      if (a < b) { return this.ordSortDesc ? 1 : -1; }
      if (a > b) { return this.ordSortDesc ? -1 : 1; }
      return 0;
    });
  }
  ordPaginate(data) {
    const perPage = parseInt(String(this.ordPerPage), 10);
    const offset = (this.ordCurrentPage - 1) * perPage;
    return data.slice(offset, offset + perPage);
  }
  ordSetSort(key) {
    if (this.ordSortBy !== key) {
      this.ordSortBy = key;
      this.ordSortDesc = false;
    } else {
      this.ordSortDesc = !this.ordSortDesc;
    }
    this.ordCurrentPage = 1;
    this.ordUpdate();
  }



}

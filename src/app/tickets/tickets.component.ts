import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataService } from "../services/data.service";
import { ToolService } from "../services/tool.service";
import { WhatsappService } from "../services/whatsapp.service";

@Component({
  selector: "app-tickets",
  templateUrl: "./tickets.component.html",
  styleUrls: [
    "./tickets.component.scss",
    "../../vendor/libs/spinkit/spinkit.scss",
  ],
})
export class TicketsComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    public dataService: DataService,
    public toolService: ToolService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public whatsappService: WhatsappService
  ) {
    this.toolService.pageTitle = "Withdraw";
  }

  modalType: any;
  ticketsType: any;
  ticketsData = [];
  pendingData = [];
  approvedData = [];
  soldData = [];
  rejectedData = [];
  ticketModalData: any;
  bulkUpdateData = {
    status: null,
    rejectedReason: null,
    ticketIds: [],
  };

  ngOnInit() {
    this.checkRoute();
    this.getTicketPercentage();
  }

  checkRoute() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.ticketsType = params.type;
      if (params.type == "pending") {
        this.onClear();
        this.getPendingData();
      } else if (params.type == "approved") {
        this.onClear();
        this.getApprovedData();
      } else if (params.type == "sold") {
        this.onClear();
        this.getSoldData();
      } else if (params.type == "rejected") {
        this.onClear();
        this.getRejectedData();
      }
    });
  }

  onClear() {
    this.toolService.showLoading = true;
    this.ticketsData = [];
  }

  getPendingData() {
    this.dataService.getPendingTickets().subscribe((resp: any) => {
      this.pendingData = resp;
      this.update();
      this.toolService.showLoading = false;
    });
  }

  getApprovedData() {
    this.dataService.getApprovedTickets().subscribe((resp: any) => {
      this.approvedData = resp;
      this.update();
      this.toolService.showLoading = false;
    });
  }

  getSoldData() {
    this.dataService.getSoldTickets().subscribe((resp: any) => {
      this.soldData = resp;
      this.update();
      this.toolService.showLoading = false;
    });
  }

  getRejectedData() {
    this.dataService.getRejectedTickets().subscribe((resp: any) => {
      this.rejectedData = resp;
      this.update();
      this.toolService.showLoading = false;
    });
  }

  openTicketImg(image) {
    window.open(this.dataService.url + image);
  }

  onShowModal(type, content, item) {
    this.modalType = type;
    this.ticketModalData = item;
    this.modalService.open(content, { centered: true });
  }

  ticketTaxPercentage = 0;

  getTicketPercentage() {
    this.dataService.getTicketPercentage().subscribe((resp: any) => {
      if (resp.data) {
        this.ticketTaxPercentage = resp.data.percentage;
      }
    });
  }

  priceReturn(price) {
    let data = {
      tax: null,
      price: null,
      finalPrice: null,
    };
    if (price) {
      let tax = price * (this.ticketTaxPercentage / 100);
      let finalPrice = price + price * (this.ticketTaxPercentage / 100);
      data = {
        tax: tax.toFixed(2),
        price: price.toFixed(2),
        finalPrice: finalPrice.toFixed(2),
      };
    }
    return data;
  }

  onSelectTicket(id, event) {
    let value = event.target.checked;
    if (value) {
      this.bulkUpdateData.ticketIds.push(id);
    } else {
      this.bulkUpdateData.ticketIds.splice(
        this.bulkUpdateData.ticketIds.findIndex((item) => item.id == id),
        1
      );
    }
  }

  openRejectModal(content) {
    this.bulkUpdateData.status = "rejected";
    this.modalService.open(content, { centered: true });
  }

  onBulkUpdateTickets() {
    if (
      this.bulkUpdateData.status == "rejected" &&
      this.bulkUpdateData.rejectedReason == null
    ) {
      this.toolService.showMyAlert(
        "warning",
        "Please enter reason of rejection!"
      );
    } else {
      this.toolService.btnLoading = true;
      this.dataService.updateDeleteBulkTicket(this.bulkUpdateData).subscribe(
        (resp: any) => {
          this.bulkUpdateData.ticketIds.forEach((ticketId) => {
            let status = this.bulkUpdateData.status;
            if (status == "approved" || status == "rejected") {
              this.pendingData.splice(
                this.pendingData.findIndex((item) => item.id == ticketId),
                1
              );
            } else if (status == "sold") {
              this.approvedData.splice(
                this.approvedData.findIndex((item) => item.id == ticketId),
                1
              );
            } else if (status == "delete") {
              if (this.ticketsType == "pending") {
                this.pendingData.splice(
                  this.pendingData.findIndex((item) => item.id == ticketId),
                  1
                );
              } else if (this.ticketsType == "approved") {
                this.approvedData.splice(
                  this.approvedData.findIndex((item) => item.id == ticketId),
                  1
                );
              } else if (this.ticketsType == "sold") {
                this.soldData.splice(
                  this.soldData.findIndex((item) => item.id == ticketId),
                  1
                );
              } else if (this.ticketsType == "rejected") {
                this.rejectedData.splice(
                  this.rejectedData.findIndex((item) => item.id == ticketId),
                  1
                );
              }
            }
          });
          this.toolService.showMyAlert("success", resp.message);
          this.bulkUpdateData = {
            status: null,
            rejectedReason: null,
            ticketIds: [],
          };
          this.modalService.dismissAll();
          this.update();
          this.toolService.btnLoading = false;
        },
        (err) => {
          this.toolService.btnLoading = false;
          this.toolService.showMyAlert("danger", err.error.error);
        }
      );
    }
  }

  onSellTicket() {
    this.toolService.btnLoading = true;
    let myId = this.ticketModalData.id;
    let myData = { status: "sold" };
    this.dataService.updateTicket(myId, myData).subscribe(
      (resp: any) => {
        this.approvedData.splice(
          this.approvedData.findIndex((item) => item.id == myId),
          1
        );
        this.update();
        this.modalService.dismissAll();
        this.toolService.showMyAlert("success", "Ticket sold successfully!");
        this.toolService.btnLoading = false;
      },
      (err) => {
        this.toolService.showMyAlert("danger", err.error.error);
        this.toolService.btnLoading = false;
      }
    );
  }

  childTicketId: any;
  parentTicketId: any;

  deleteTicket(item) {
    this.childTicketId = item.id;
    this.parentTicketId = item.sell_ticket.id;
  }

  onDeleteTicket() {
    let data = {
      ticketId: this.childTicketId,
      sellTicketId: this.parentTicketId,
    };
    this.dataService.deleteTicket(data).subscribe(
      (resp: any) => {
        this.toolService.showMyAlert("success", resp.message);
        this.update();
      },
      (err) => {
        this.toolService.showMyAlert("danger", err.error.message);
      }
    );
  }

  onUpdateTicket() {
    let myId = this.ticketModalData.id;
    let myData = { price: this.ticketModalData.sell_ticket.price };
  }

  ///////////////////////////////////////////////
  ///////////////////////////////////////////////
  //////////////////////////   approving the ticket  /////////////////////
  ///////////////////////////////////////////////

  onApproveTicket() {
    this.toolService.btnLoading = true;
    let myId = this.ticketModalData.id;
    let myData = { status: "approved" };
    this.dataService.updateTicket(myId, myData).subscribe(
      (resp: any) => {
        this.pendingData.splice(
          this.pendingData.findIndex((item) => item.id == myId),
          1
        );
        this.update();
        this.modalService.dismissAll();
        this.toolService.showMyAlert(
          "success",
          "Ticket approved successfully!"
        );
        this.toolService.btnLoading = false;

        this.whatsappService.sendAfterApproval(this.ticketModalData).subscribe(
          (resp) => {
            console.log(resp);
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        this.toolService.showMyAlert("danger", err.error.error);
        this.toolService.btnLoading = false;
      }
    );
  }

  rejectedReason: any;

  onRejectTicket() {
    let myId = this.ticketModalData.id;
    let myData = {
      status: "rejected",
      rejectedReason: this.rejectedReason,
    };
    if (this.rejectedReason) {
      this.toolService.btnLoading = true;
      this.dataService.updateTicket(myId, myData).subscribe(
        (resp: any) => {
          var ind = this.pendingData.findIndex(function (item) {
            return item.id == myId;
          });
          if (ind != -1) this.pendingData.splice(ind, 1);
          this.update();
          this.modalService.dismissAll();
          this.toolService.showMyAlert(
            "success",
            "Ticket rejected successfully!"
          );
          this.toolService.btnLoading = false;

          this.whatsappService
            .sendAfterRejection(this.ticketModalData)
            .subscribe((resp) => {
              console.log(resp);
            });
        },
        (err) => {
          this.toolService.showMyAlert("danger", err.error.error);
          this.toolService.btnLoading = false;
        }
      );
    } else {
      this.toolService.showMyAlert(
        "warning",
        "Please enter reason of rejection!"
      );
    }
  }

  // Filter and Sorting
  searchKeys = ["id", "price"];
  sortBy = "id";
  sortDesc = true;
  perPage = 10;
  filterVal = "";
  currentPage = 1;
  totalItems = 0;
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  update() {
    let data = [];
    if (this.ticketsType == "pending") {
      data = this.pendingData;
    } else if (this.ticketsType == "approved") {
      data = this.approvedData;
    } else if (this.ticketsType == "sold") {
      data = this.soldData;
    } else if (this.ticketsType == "rejected") {
      data = this.rejectedData;
    }
    this.totalItems = data.length;
    this.sort(data);
    this.ticketsData = this.paginate(data);
  }
  sort(data) {
    data.sort((a: any, b: any) => {
      a =
        typeof a[this.sortBy] === "string"
          ? a[this.sortBy].toUpperCase()
          : a[this.sortBy];
      b =
        typeof b[this.sortBy] === "string"
          ? b[this.sortBy].toUpperCase()
          : b[this.sortBy];
      if (a < b) {
        return this.sortDesc ? 1 : -1;
      }
      if (a > b) {
        return this.sortDesc ? -1 : 1;
      }
      return 0;
    });
  }
  paginate(data) {
    const perPage = parseInt(String(this.perPage), 10);
    const offset = (this.currentPage - 1) * perPage;
    return data.slice(offset, offset + perPage);
  }
  setSort(key) {
    if (this.sortBy !== key) {
      this.sortBy = key;
      this.sortDesc = false;
    } else {
      this.sortDesc = !this.sortDesc;
    }
    this.currentPage = 1;
    this.update();
  }
}

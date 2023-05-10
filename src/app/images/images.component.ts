import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NgxImageGalleryComponent, GALLERY_CONF } from 'ngx-image-gallery';
import { DropzoneComponent, DropzoneDirective } from 'ngx-dropzone-wrapper';
import 'hammerjs';
import { DataService } from '../services/data.service';
import { ToolService } from '../services/tool.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

const Masonry = require('masonry-layout/dist/masonry.pkgd.js');

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss',
    '../../vendor/libs/ngx-image-gallery/ngx-image-gallery.scss',
    '../../vendor/libs/ngx-dropzone-wrapper/ngx-dropzone-wrapper.scss',
    '../../vendor/libs/spinkit/spinkit.scss']
})
export class ImagesComponent implements OnInit {

  constructor(
    private zone: NgZone,
    public dataService: DataService,
    public toolService: ToolService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) {
    this.toolService.pageTitle = 'Sliders';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkRoute();
      }
    })
  }


  ngOnInit() {
  }

  allImages = [];
  uploadImages = [];

  pageImagesType = 'slider';

  checkRoute() {
    this.allImages = [];
    this.toolService.showLoading = true;
    this.activatedRoute.params.subscribe((params: any) => {
      if (params.type == 'slider') {
        this.pageImagesType = 'slider';
        this.getImagesData('slider');
      } else if (params.type == 'partner') {
        this.pageImagesType = 'partner';
        this.getImagesData('partner');
      }
    });
  }

  getImagesData(type) {
    if (type == 'slider') {
      this.dataService.getAllSliders().subscribe((resp: any) => {
        if (resp.length !== 0) {
          this.allImages = resp.map(img => {
            let myUrl = this.dataService.url;
            return {
              id: img.id,
              image: img.image,
              url: myUrl + img.image
            }
          })
        }
        this.toolService.showLoading = false;
      })
    } else if (type == 'partner') {
      this.dataService.getAllPartners().subscribe((resp: any) => {
        if (resp.length !== 0) {
          this.allImages = resp.map(img => {
            let myUrl = this.dataService.url;
            return {
              id: img.id,
              image: img.image,
              url: myUrl + img.image
            }
          })
        }
        this.toolService.showLoading = false;
      })
    }
  }


  //
  // ngx-dropzone-wrapper
  //

  @ViewChild(DropzoneDirective) dropzoneInstance: DropzoneDirective;
  @ViewChild("dz") drpzone: DropzoneComponent;


  dropzoneConfig = {
    url: this.dataService.sliderUrl,
    parallelUploads: 1,
    maxFilesize: 50000,
    filesizeBase: 1000,
    addRemoveLinks: false,
    paramName: "image",
    acceptedFiles: "image/*",
    previewTemplate: `
<div class="dz-preview dz-file-preview">
  <div class="dz-details">
    <div class="dz-thumbnail">
      <img data-dz-thumbnail>
      <span class="dz-nopreview">No preview</span>
      <div class="dz-success-mark"></div>
      <div class="dz-error-mark"></div>
      <div class="dz-error-message"><span data-dz-errormessage></span></div>
      <div class="progress">
        <div class="progress-bar progress-bar-primary"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          data-dz-uploadprogress></div>
      </div>
    </div>
    <div class="dz-filename" data-dz-name></div>
    <div class="dz-size" data-dz-size></div>
  </div>
</div>`
  };


  onUploadSuccess(event) {
    let imageData = {
      image: event[1]
    };
    this.uploadImages.push(imageData);
  }

  onReset() {
    this.dropzoneInstance.reset();
    this.uploadImages = [];
  }

  onSubmit() {
    this.toolService.btnLoading = true;
    for (let ind = 0; ind < this.uploadImages.length; ind++) {
      const imgData = this.uploadImages[ind];
      if (this.pageImagesType == 'slider') {
        this.dataService.createSlider(imgData).subscribe((resp: any) => {
          let myImage = resp.slider;
          myImage.url = this.dataService.url + resp.slider.image;
          this.allImages.unshift(myImage);
          if (ind == this.uploadImages.length - 1) {
            this.toolService.showMyAlert('success', resp.message);
            this.uploadImages = [];
            this.onReset();
            this.toolService.btnLoading = false;
          }
        })
      } else if (this.pageImagesType == 'partner') {
        this.dataService.createPartner(imgData).subscribe((resp: any) => {
          let myImage = resp.partnerShip;
          myImage.url = this.dataService.url + resp.partnerShip.image;
          this.allImages.unshift(myImage);
          if (ind == this.uploadImages.length - 1) {
            this.toolService.showMyAlert('success', resp.message);
            this.uploadImages = [];
            this.onReset();
            this.toolService.btnLoading = false;
          }
        })
      }
    }
  }


  // NGX Gallery

  @ViewChild('galleryContainer') galleryContainer: any;
  @ViewChild(NgxImageGalleryComponent) gallery: NgxImageGalleryComponent;


  imagesLoaded = 0;
  private masonry: any;
  private observer: any;

  conf: GALLERY_CONF = {
    imageOffset: '0px',
    imageBorderRadius: '0',
    showDeleteControl: true,
    showImageTitle: false,
  };

  dialogOptions = { title: 'Are you sure?', text: 'You won\'t be able to revert this!', type: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!', showCloseButton: true, confirmButtonClass: 'btn btn-lg btn-warning' }

  imageIndex: any;
  pageImageData: any;

  deleteImage() {
    this.imageIndex = this.gallery.activeImageIndex;
    this.pageImageData = this.gallery.activeImage;
    this.gallery.close();
  }

  onDeletePageImage() {
    if (this.pageImagesType == 'slider') {
      this.dataService.deleteSlider(this.pageImageData.id).subscribe((resp: any) => {
        this.allImages.splice(this.imageIndex, 1);
        this.toolService.showMyAlert('success', resp.message);
      }, err => {
        this.toolService.showMyAlert('danger', err.error.error);
      })
    } else if (this.pageImagesType == 'partner') {
      this.dataService.deletePartner(this.pageImageData.id).subscribe((resp: any) => {
        this.allImages.splice(this.imageIndex, 1);
        this.toolService.showMyAlert('success', resp.message);
      }, err => {
        this.toolService.showMyAlert('danger', err.error.error);
      })
    }
  }

  imgLoaded() {
    if (++this.imagesLoaded === this.allImages.length) {
      this.initMasonry();
    }
  }

  openGallery(image) {
    this.gallery.open(this.allImages.indexOf(image));
  }

  initMasonry() {
    this.zone.runOutsideAngular(() => {
      this.masonry = new Masonry(this.galleryContainer.nativeElement, {
        transitionDuration: '0.3s',
        itemSelector: '.gallery-thumbnail',
        columnWidth: '.gallery-sizer'
      });

      const MutationObserver = window['MutationObserver'] || window['WebKitMutationObserver'];

      if (MutationObserver) {
        /** Watch for any changes to subtree */
        this.observer = new MutationObserver(() => {
          setTimeout(() => {
            this.masonry.reloadItems();
            this.masonry.layout();
          }, 30);
        });

        this.observer.observe(this.galleryContainer.nativeElement, {
          subtree: true,
          childList: true
        });
      }
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.observer) { this.observer.disconnect(); }
      if (this.masonry) { this.masonry.destroy(); }
    });
  }


}


import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: any, private appService: AppService) {}
  showBars = true;
  leftOpen: boolean = false;
  rightOpen: boolean = false;
  showFullscreen = false;
  documentElem!: any;
  marginZero = false;
  ngOnInit(): void {
    this.documentElem = document.documentElement;
    this.appService.isFullscreen$.next(this.showBars);
  }

  // ngOnInit(): void {
  //   
  // }

  fullscreen() {
    this.showFullscreen = !this.showFullscreen;
    let content = document.getElementById('page-Content');
    let dialogContent = document.getElementById('cdk-overlay-0');
    // let dialogContent = document.querySelector('cdk-overlay-pane');
    console.log("dialogContent",dialogContent);
    
    if (
      !this.document.fullscreenElement && // alternative standard method
      !this.document.mozFullScreenElement &&
      !this.document.webkitFullscreenElement &&
      !this.document.msFullscreenElement
    ) {
    
      console.log("this.documentElem1212",this.documentElem);
      if (this.documentElem.requestFullscreen) {
        this.documentElem.requestFullscreen();
        console.log("111");
        console.log("dialogContent",dialogContent);
      } else if (this.documentElem.mozRequestFullScreen) {
        this.documentElem.mozRequestFullScreen();
      } else if (this.documentElem.webkitRequestFullscreen) {
        this.documentElem.webkitRequestFullscreen();
      } else if (this.documentElem.msRequestFullscreen) {
        this.documentElem.msRequestFullscreen();
      }
      this.marginZero = true;
      this.showBars = false;
    } else {
      console.log("this.documentElem121211112121131232143123",this.documentElem);
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
        console.log("2");
      } else if (this.document.msExitFullscreen) {
        this.document.msExitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        this.document.webkitExitFullscreen();
      }
      this.marginZero = false;
      this.showBars = true;
    }
    this.appService.isFullscreen$.next(this.showBars);
  }

  toggleSidebar(option: any) {
    switch (option.flag) {
      case 'left': {
        this.leftOpen = !this.leftOpen;
        break;
      }
      case 'right': {
        this.rightOpen = !this.rightOpen;
        break;
      }
      default: {
        this.leftOpen = true;
        break;
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  leftOpen: boolean = false;
  rightOpen: boolean = false;
  showFullscreen=false;

  ngOnInit(): void {
    let contentWrap = document.getElementById('page-Content');
    contentWrap?.addEventListener('fullscreenchange', (event) => {
      if (document.fullscreenElement) {
        console.log(`Element: ${document.fullscreenElement.id} entered fullscreen mode.`);
        this.showFullscreen=true;
        contentWrap?.classList.add('fullscreenContent');
      } else {
        console.log('Leaving full-screen mode.');
        this.showFullscreen=false
        contentWrap?.classList.remove('fullscreenContent');
      }
      });
  }

  fullscreen() {
    this.showFullscreen = !this.showFullscreen
    let content = document.getElementById('page-Content');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      content?.requestFullscreen();
    }
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

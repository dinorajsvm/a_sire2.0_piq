import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { AppService } from './services/app.service';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterContentChecked {
  constructor(private appService: AppService) {}
  showBars = true;
  leftOpen: boolean = false;
  rightOpen: boolean = false;
  showFullscreen = false;
  marginZero = false;
  ngOnInit(): void {
    this.appService.isFullscreen$.next(this.showBars);
  }
 
  fullscreen() {
    this.showFullscreen = !this.showFullscreen;
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
  ngAfterContentChecked(): void {
    if (this.showFullscreen) {
      document.addEventListener('keydown', (event) => {
        if (event.keyCode === 27) {
          this.showFullscreen = false;
        }
      });
    }
  }
}
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  leftOpen: boolean = false;
  rightOpen: boolean = false;
  
  ngOnInit(): void {
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

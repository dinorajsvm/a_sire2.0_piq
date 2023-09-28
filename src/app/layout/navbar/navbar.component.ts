import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { PromptService } from 'src/app/core/shared/prompt/prompt.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ROLE_MAPPING } from 'src/app/core/mgntDBconstants';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter<any>();
  public userDetails:any;
  public userRole:any;
  documentElem:any;
  isShowAlerts: boolean = false ;
  isShowNotification: boolean = false ;
  selectedLanguage: any ="gb";
  notification:any=[];
  alertsNotification:any=[];
  constructor(private _authService: AuthService, private _layoutService: LayoutService, private _storage: StorageService, private _promptService: PromptService, @Inject(DOCUMENT) private document: any) { }

  ngOnInit(): void {
    this.userDetails = this._storage.getUserDetails();
    const roleCode: string = this._storage.getRoleCode();
    this.userRole = (ROLE_MAPPING as any)[roleCode];
    this.documentElem = document.documentElement;
  }

  toggleLeftSidenav() {
    this.toggleSidebar.emit({flag: 'left'});
  }

  openAlertsMenu() {
    this.isShowAlerts = true;
  }
  setLanguage(language : any) {
    this.selectedLanguage = language;
  }

  fullscreen() {
    if (!this.document.fullscreenElement &&    // alternative standard method
        !this.document.mozFullScreenElement && !this.document.webkitFullscreenElement && !this.document.msFullscreenElement ) 
    {  
        if (this.documentElem.requestFullscreen) {
          this.documentElem.requestFullscreen();
        } else if (this.documentElem.mozRequestFullScreen) {
          /* Firefox */
          this.documentElem.mozRequestFullScreen();
        } else if (this.documentElem.webkitRequestFullscreen) {
          /* Chrome, Safari and Opera */
          this.documentElem.webkitRequestFullscreen();
        } else if (this.documentElem.msRequestFullscreen) {
          /* IE/Edge */
          this.documentElem.msRequestFullscreen();
        }
      }
      else {
        if (this.document.exitFullscreen) {
          this.document.exitFullscreen();
        } else if (this.document.msExitFullscreen) {
          this.document.msExitFullscreen();
        } else if (this.document.mozCancelFullScreen) {
          this.document.mozCancelFullScreen();
        } else if (this.document.webkitExitFullscreen) {
          this.document.webkitExitFullscreen();
        }
      }
  }

  logout() {
    this._promptService.openDialog({title : 'Close', content: "Are you sure want to close this tab?" }, (res:any) =>{
      if(res) {
        this._authService.logout();
      }
    })

  }

}

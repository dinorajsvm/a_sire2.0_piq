import { AfterViewChecked, Component } from '@angular/core';
import { StorageService } from './core/services/storage/storage.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewChecked {
  userDetails: any;
  public constructor(private _storage: StorageService) {}

  ngAfterViewChecked(): void {
    this.userDetails = this._storage.getUserDetails();
    //document.getElementById('favicon')?.setAttribute('href',"data:image/png;base64," +this.userDetails.favPic);
    this.userDetails?.favPic
      ? document
          .getElementById('favicon')
          ?.setAttribute(
            'href',
            'data:image/png;base64,' + this.userDetails.favPic
          )
      : '';
  }
}

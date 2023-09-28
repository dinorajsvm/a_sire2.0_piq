import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from '../../services/utils/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  color:any = 'primary';
  mode:any = 'indeterminate';
  isLoading: Subject<boolean> = this._loaderService.isLoading;
  constructor(private _loaderService:LoaderService) { }

}

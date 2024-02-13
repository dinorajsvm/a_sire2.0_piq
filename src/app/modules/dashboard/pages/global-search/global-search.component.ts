import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css']
})
export class GlobalSearchComponent implements OnInit {
  enteredSearchvalue: string = '';
  isOpen = false;

  constructor(private appServices: AppService,) { }

  ngOnInit(): void {
  }

  @Output()
  searchTextChanged: EventEmitter<string> = new EventEmitter<string>();
  onSearchTextChanged() {
    this.searchTextChanged.emit(this.enteredSearchvalue)
  }

  isSearchActive = false;

  activateSearch() {
    this.isSearchActive = true;
  }

  deactivateSearch() {
    this.enteredSearchvalue = '';
    this.isSearchActive = false;
    this.appServices.setSearch(this.isSearchActive);
  }

  clearSearch() {
    this.enteredSearchvalue = '';
  }

}

import { Component,  EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css']
})
export class GlobalSearchComponent {
  enteredSearchvalue = '';
  isSearchActive = false;

  @Output()
  searchTextChanged: EventEmitter<string> = new EventEmitter<string>();
  onSearchTextChanged() {
    this.searchTextChanged.emit(this.enteredSearchvalue)
  }

  activateSearch() {
    this.isSearchActive = true;
  }

  onEnterKey(event: any) {
    event.preventDefault(); // Prevent the default Enter key behavior
    // You can add additional logic here if needed
  }
  deactivateSearch() {
    this.enteredSearchvalue = '';
    this.isSearchActive = false;
    this.searchTextChanged.emit(this.enteredSearchvalue)
  }

  clearSearch() {
    this.enteredSearchvalue = '';
  }
}

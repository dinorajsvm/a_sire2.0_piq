import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css']
})
export class GlobalSearchComponent implements OnInit {
  enteredSearchvalue: string = '';
  isOpen = false;

  constructor(private BudgetService: BudgetService,) { }

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
    this.BudgetService.setSearch(this.isSearchActive);
  }

  clearSearch() {
    this.enteredSearchvalue = '';
  }

}

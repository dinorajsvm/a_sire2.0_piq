import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ag-grid-toolbar',
  templateUrl: './ag-grid-toolbar.component.html',
  styleUrls: ['./ag-grid-toolbar.component.css']
})
export class AgGridToolbarComponent implements OnInit {

  @Input() agGridToolbar:any;
  constructor() { }

  ngOnInit() {
  }

}

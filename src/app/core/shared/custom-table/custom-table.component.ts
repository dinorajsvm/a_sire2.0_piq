import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css']
})
export class CustomTableComponent implements OnInit {

  @Input() columnDef: any;
  @Input() dataSource: any;
  @Input() rowSize:any;
  displayedColumns: any;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges() {
    this.displayedColumns = this.columnDef.map((c: { columnDef: any; }) => c.columnDef);
    this.dataSource = new MatTableDataSource<object>(this.dataSource);
    // this.ngAfterViewInit();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  isSticky (column: any): boolean {
    return column.isSticky === true ? true : false;
  }
}
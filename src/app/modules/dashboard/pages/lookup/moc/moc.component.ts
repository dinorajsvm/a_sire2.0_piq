import { Component } from '@angular/core';
import 'ag-grid-enterprise';
import { BudgetService } from '../../../services/budget.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AgGridCheckboxComponent } from '../../renderer/ag-grid-checkbox.component';
import { ColDef, LicenseManager } from 'ag-grid-enterprise';
LicenseManager.setLicenseKey(
  'CompanyName=SOLVERMINDS SOLUTIONS AND TECHNOLOGIES PRIVATE LIMITED,LicensedGroup=SVM Solutions & Technologies Pte. Ltd,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=6,AssetReference=AG-033022,SupportServicesEnd=18_November_2023_[v2]_MTcwMDI2NTYwMDAwMA==55aa1a1d8528a024728210e6983fb1ea'
);
@Component({
  selector: 'app-moc',
  templateUrl: './moc.component.html',
  styleUrls: ['./moc.component.css'],
  providers: [DatePipe],
})
export class MocComponent {
  frameworkComponents: any;
  constructor(
    private BudgetService: BudgetService,
    private dialogRef: MatDialogRef<MocComponent>,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.frameworkComponents = {
      checkboxRenderer: AgGridCheckboxComponent,
    };
  }

  columnDefs: ColDef[] = [
    { headerName: 'Ref Id', field: 'mgcreferenceid', flex: 1 },
    { headerName: 'Category Of Change', field: 'categoryofchange', flex: 1 },
    { headerName: 'Rank', field: 'rank', flex: 1 },
    { headerName: 'Orgianted By', field: 'orgiantedby', flex: 1 },
    {
      headerName: '2.5.1.1',
      field: 'q136',
      flex: 1,
      cellRenderer: 'checkboxRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '2.5.1.2',
      field: 'q139',
      flex: 1,
      cellRenderer: 'checkboxRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '2.5.1.3',
      field: 'q142',
      flex: 1,
      cellRenderer: 'checkboxRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '2.5.1.4',
      field: 'q145',
      flex: 1,
      cellRenderer: 'checkboxRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
  ];

  rowData = [];

  gridOptions = {
    onGridReady: (params: any) => {
      params.api.sizeColumnsToFit();
    },
  };

  onBtnClick1(event: any) {}

  applyMocDetails() {
    const response: any = [
      {
        qid: 'Q136',
        value: this.rowData.find((data: any) => data.q136 === true)?.['q136']
          ? true
          : false,
      },
      {
        qid: 'Q139',
        value: this.rowData.find((data: any) => data.q139 === true)?.['q139']
          ? true
          : false,
      },
      {
        qid: 'Q142',
        value: this.rowData.find((data: any) => data.q142 === true)?.['q142']
          ? true
          : false,
      },
      {
        qid: 'Q145',
        value: this.rowData.find((data: any) => data.q145 === true)?.['q145']
          ? true
          : false,
      },
    ];
    this.dialogRef.close(response);
  }
  ngOnInit() {
    this.mocDetails();
  }

  mocDetails() {
    this.BudgetService.getMocDetails().subscribe((data) => {
      data.response.forEach((res: any) => {
        res.q136 = res.q136 === 'NO' ? false : true;
        res.q139 = res.q139 === 'NO' ? false : true;
        res.q142 = res.q142 === 'NO' ? false : true;
        res.q145 = res.q145 === 'NO' ? false : true;
      });
      this.rowData = data.response;
    });
  }
  onDialogClose(): void {
    this.dialogRef.close();
  }
}

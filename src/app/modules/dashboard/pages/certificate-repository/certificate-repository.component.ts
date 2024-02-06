import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import {
  ColDef,
  GridReadyEvent,
  RowGroupingDisplayType,
} from 'ag-grid-community';
import { saveAs } from 'file-saver';
import { LicenseManager } from 'ag-grid-enterprise';
import { IDetailCellRendererParams, IsRowMaster } from 'ag-grid-community';
import { DownloadBtnRendererComponent } from '../renderer/downloadBtn-renderer.component';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { DefaultColDef, colorCodes } from 'src/app/core/constants';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
LicenseManager.setLicenseKey(
  'CompanyName=SOLVERMINDS SOLUTIONS AND TECHNOLOGIES PRIVATE LIMITED,LicensedGroup=SVM Solutions & Technologies Pte. Ltd,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=6,AssetReference=AG-033022,SupportServicesEnd=18_November_2023_[v2]_MTcwMDI2NTYwMDAwMA==55aa1a1d8528a024728210e6983fb1ea'
);
@Component({
  selector: 'app-certificate-repository',
  templateUrl: './certificate-repository.component.html',
  styleUrls: ['./certificate-repository.component.css'],
  providers: [DatePipe],
})
export class CertificateRepositoryComponent implements OnInit {
  dynamicImageURL = `${environment.apiUrl}/`;
  public tooltipShowDelay = 0;
  public isRowMaster: IsRowMaster = (dataItem: any) => {
    return dataItem && dataItem.imagelist && dataItem.imagelist.length > 0;
  };
  public columnDefs: ColDef[] = [
    {
      field: 'certifiactetype',
      headerName: 'OCIMF Certificate Type',
      cellRenderer: 'agGroupCellRenderer',
      cellClass: 'width',
      tooltipField: 'certifiactetype',
      flex: 1,
    },
    {
      field: 'mackcertificatename',
      headerName: 'System Certificate Name',
      tooltipField: 'mackcertificatename',
      flex: 1,
    },
    {
      field: 'certificatenumber',
      headerName: 'Certificate Number',
      tooltipField: 'certificatenumber',
      flex: 1,
    },
    {
      field: 'dateofissue',
      headerName: 'Issue Date',
      tooltipField: 'dateofissue',
      cellStyle: { textAlign: 'right' },
      flex: 1,
    },
    {
      field: 'validfrom',
      headerName: 'Valid From',
      tooltipField: 'validfrom',
      cellStyle: { textAlign: 'right' },
      flex: 1,
    },
    {
      field: 'validto',
      headerName: 'Valid To',
      tooltipField: 'validto',
      cellStyle: { textAlign: 'right' },
      flex: 1,
    },
    {
      field: 'anniversarydate',
      headerName: 'Last Annual',
      tooltipField: 'anniversarydate',
      cellStyle: { textAlign: 'right' },
      flex: 1,
    },
    {
      field: 'categoryname',
      headerName: 'Category Name',
      tooltipField: 'categoryname',
      flex: 1,
    },
    {
      field: 'placeofissue',
      headerName: 'Place Of Issue',
      tooltipField: 'placeofissue',
      flex: 1,
    },
  ];
  defaultColDef = DefaultColDef;
  public groupDisplayType: RowGroupingDisplayType = 'groupRows';
  public detailCellRendererParams: any = {
    detailGridOptions: {
      columnDefs: [
        {
          field: 'docrefno',
          headerName: 'Document No',
          tooltipField: 'docrefno',
          flex: 1,
        },
        {
          field: 'localfilename',
          headerName: 'File Name',
          tooltipField: 'localfilename',
          flex: 1,
        },
        {
          field: 'filesize',
          headerName: 'File Size',
          tooltipField: 'filesize',
          flex: 1,
          valueGetter: (params) => {
            return params.data.sizeinMB
              ? params.data.sizeinMB.toFixed(2) + ' ' + 'MB'
              : '0 MB';
          },
        },
        {
          headerName: 'Certificate Download',
          cellRenderer: DownloadBtnRendererComponent,
          cellRendererParams: {
            onClick: this.downloadFile.bind(this),
          },
          flex: 1,
        },
      ],
    },
    getDetailRowData: function (params) {
      params.successCallback(params.data.imagelist);
    },
  } as IDetailCellRendererParams<any, any>;
  public rowData!: any[];
  gridApi: any;
  totalRowCount = 0;
  constructor(
    private BudgetService: BudgetService,
    private snackBarService: SnackbarService
  ) {}
  ngOnInit(): void {
    this.BudgetService.getCertificateListDetails().subscribe((response) => {
      this.rowData = response && response.length > 0 ? response : [];
      this.totalRowCount =
        this.rowData && this.rowData.length > 0 ? this.rowData.length : 0;
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.addEventListener(
      'filterChanged',
      this.onFilterChanged.bind(this)
    );
  }

  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }

  downloadFile(event: any) {
    const fileUrl = event.rowData.systemfilename;
    this.BudgetService.getServerFileFromStream(fileUrl).subscribe(
      (Blob: Blob) => {
        const filename = event.rowData.localfilename;
        saveAs(Blob, filename);
      },
      (error) => {
        this.snackBarService.loadSnackBar('File Not found.', colorCodes.ERROR);
      }
    );
  }
}

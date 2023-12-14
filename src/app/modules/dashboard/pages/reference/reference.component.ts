import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { GridOptions, RowGroupingDisplayType } from 'ag-grid-community';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { DownloadBtnRendererComponent } from '../renderer/downloadBtn-renderer.component';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { DefaultColDef, colorCodes } from 'src/app/core/constants';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css'],
})
export class ReferenceComponent implements OnInit {
  referenceNumber: any;
  rowSelection = 'single';
  public tooltipShowDelay = 0;
  totalRowCount = 0;
  columnDefs: any[] = [
    {
      field: 'topic',
      headerName: 'Topic',
      tooltipField: 'topic',
      flex: 1,
      cellStyle: { textalign: 'left' },
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      tooltipField: 'remark',
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
    },
    {
      headerName: 'Download',
      floatingFilter: false,
      flex: 1,
      cellRenderer: 'buttonRenderer',
      cellStyle: { textalign: 'center' },
      cellRendererParams: {
        onClick: this.downloadFile.bind(this),
      },
    },
  ];

  frameworkComponents: any;
  rowData: any[] = [];
  userDetails: any;
  private gridApi: any;
  private gridColumnApi: any;
  defaultColDef = DefaultColDef;
  public groupDisplayType: RowGroupingDisplayType = 'groupRows';
  public rowGroupPanelShow: any = 'always';

  public gridOptions: GridOptions = {};
  constructor(
    private BudgetService: BudgetService,
    private _storage: StorageService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService
  ) {
    this.frameworkComponents = {
      buttonRenderer: DownloadBtnRendererComponent,
    };
  }

  ngOnInit(): void {
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    this.userDetails = this._storage.getUserDetails();
    this.getCertificateRepoList();
  }


  downloadFile(event: any) {
    const fileUrl = event.rowData.filepath;
    this.fetchImageBlob(fileUrl).then(
      (blob: any) => {
        const filename = event.rowData.localfilename;
        saveAs(blob, filename);
      },
      (error) => {
        this.snackBarService.loadSnackBar('File Not Found.', colorCodes.ERROR);
      }
    );
  }

  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }
  fetchImageBlob(fileUrl: string): Promise<Blob> {
    return fetch(fileUrl).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      return response.blob();
    });
  }

  getCertificateRepoList() {
    const vesselCode = this.userDetails.userData.mdata.appInfo.vesselCode;
    const companyCode = this.userDetails.companyCode;

    this.BudgetService.getReferenceList(vesselCode, companyCode,this.referenceNumber).subscribe(
      (res: any) => {
        res.response.forEach((element: any) => {
          const output_string = element.filepath.replaceAll(/\\/g, '/');
          (element.filesize = element.fileSize),
            (element.filepath = `${environment.apiUrl}/` + output_string);
        });
        this.rowData = res.response;
        this.totalRowCount =
        this.rowData && this.rowData.length > 0 ? this.rowData.length : 0;
      }
    );
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
}

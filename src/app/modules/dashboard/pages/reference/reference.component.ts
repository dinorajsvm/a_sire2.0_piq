import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { GridOptions } from 'ag-grid-community';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { DownloadBtnRendererComponent } from '../renderer/downloadBtn-renderer.component';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { DefaultColDef } from 'src/app/core/constants';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css'],
})
export class ReferenceComponent implements OnInit {
  rowSelection = 'single';
  public tooltipShowDelay = 0;
  columnDefs: any[] = [
    {
      field: 'topic',
      headerName: 'Topic',
      tooltipField: 'topic',
      flex: 1,
      cellStyle: { textalign: 'left' },
    },
    {
      field: 'remark',
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
        onClick: this.onBtnClick1.bind(this),
      },
    },
  ];

  frameworkComponents: any;
  rowData: any[] = [];
  userDetails: any;
  private gridApi: any;
  private gridColumnApi: any;
  defaultColDef = DefaultColDef;

  public gridOptions: GridOptions = {};
  constructor(
    private BudgetService: BudgetService,
    private _storage: StorageService,
    private http: HttpClient
  ) {
    this.frameworkComponents = {
      buttonRenderer: DownloadBtnRendererComponent,
    };
  }

  ngOnInit(): void {
    this.userDetails = this._storage.getUserDetails();
    this.getCertificateRepoList();
  }

  // Helper function to extract the filename from a URL

  extractFilename(url: string): string {
    const segments = url.split('/');
    return segments[segments.length - 1];
  }

  onBtnClick1(event: any) {
    const fileUrl = event.rowData.filepath;
    this.fetchImageBlob(fileUrl).then((blob: any) => {
      const filename = this.getFilenameFromUrl(fileUrl);
      saveAs(blob, filename);
    });
  }

  getFilenameFromUrl(url: string): string {
    if (!url) {
      return '';
    }
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  }

  fetchImageBlob(fileUrl: string): Promise<Blob> {
    return fetch(fileUrl).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      return response.blob();
    });
  }

  convertFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    const unit = sizes[i];
    return size ? `${size} ${unit}` : '0 KB';
  }

  getCertificateRepoList() {
    const vesselCode = this.userDetails.userData.mdata.appInfo.vesselCode;
    const companyCode = this.userDetails.companyCode;
    this.BudgetService.getReferenceList(vesselCode, companyCode).subscribe(
      (res: any) => {
        res.response.forEach((element: any) => {
          const output_string = element.filepath.replaceAll(/\\/g, '/');
          (element.filesize = this.convertFileSize(element.filesize)),
            (element.filepath = `${environment.apiUrl}/` + output_string);
        });
        this.rowData = res.response;
      }
    );
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
}

import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import {
  ColDef,
  FirstDataRenderedEvent,
  GridOptions,
  GridReadyEvent,
  ICellRendererComp,
  ICellRendererParams,
} from 'ag-grid-community';
import { saveAs } from 'file-saver';
import { LicenseManager } from 'ag-grid-enterprise';
import { HttpClient } from '@angular/common/http';
import { IDetailCellRendererParams, IsRowMaster } from 'ag-grid-community';
import { DownloadBtnRendererComponent } from '../renderer/downloadBtn-renderer.component';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { colorCodes } from 'src/app/core/constants';
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
  certificateCount: any;
  frameworkComponents: any;
  public isRowMaster: IsRowMaster = (dataItem: any) => {
    return dataItem ? dataItem.file.length > 0 : false;
  };
  public columnDefs: ColDef[] = [
    // group cell renderer needed for expand / collapse icons
    // {
    //   field: 'certificatecode',
    //   headerName: 'Certificate Code',
      
    // },
    { field: 'certificatetype', headerName: 'Certificate Type',cellRenderer: 'agGroupCellRenderer',flex: 1, },
    { field: 'certificatename', headerName: 'Certificate Name',flex: 1 },
    { field: 'certificatenumber', headerName: 'Certificate Number',flex: 1},
    // { field: 'mappingcercode', headerName: 'Mapping Code',flex: 1 },
    { field: 'dateofissue', headerName: 'Issue Date',flex: 1 },
    { field: 'validfrom', headerName: 'Expiry Date',flex: 1 },
    { field: 'validto', headerName: 'Last Annual' ,flex: 1},
    { field: 'validto', headerName: 'Last Intermediate',flex: 1 },
    { field: 'validto', headerName: 'Date of Endorsement',flex: 1 },
  ];
  public defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
  };
  public detailCellRendererParams: any = {
    detailGridOptions: {
      columnDefs: [
        { field: 'docrefno', headerName: 'Document No' },
        { field: 'localfilename', headerName: 'File Name' },
        {
          field: 'filesize',
          headerName: 'File Size',
        },
        {
          headerName: 'Certificate Download',
          cellRenderer: DownloadBtnRendererComponent,
          cellRendererParams: {
            onClick: this.onBtnClick1.bind(this),
          },
        },
      ],
      defaultColDef: {
        flex: 1,
        resizable: true,
      },
    },
    getDetailRowData: function (params) {
      params.successCallback(params.data.file);
    },
  } as IDetailCellRendererParams<any, any>;
  public rowData!: any[];
    totalCertificateCount: any;
  constructor(
    private BudgetService: BudgetService,
    private snackBarService: SnackbarService,
    private datePipe: DatePipe
  ) {
    this.frameworkComponents = {
      buttonRenderer: DownloadBtnRendererComponent,
    };
  }

  ngOnInit(): void {}

  onFirstDataRendered(params: FirstDataRenderedEvent) {}

  onGridReady(params: GridReadyEvent) {
    this.BudgetService.getCertificateList().subscribe((res: any) => {
      console.log("###",res.response.piqmappinglist)
      if (res && res.response && res.response.piqmappinglist) {
        res.response.piqmappinglist.forEach((data: any) => {
          if (data.grid === null) {
            data.file = [];
            data.grid = [];
          } else {
            if (data && data.grid) {
              data.file = [];
              let gridResponse = JSON.parse(data.grid);
              data.grid =
                gridResponse.Response === 'No data'
                  ? []
                  : gridResponse.Response;
            }
          }
        });
      }
      res.response.piqmappinglist.forEach((ress: any) => {
        console.log("%%%%", typeof ress.grid )
        ress.grid.forEach((response: any, index: any) => {
          if (index === 0) {
            (ress.certificatenumber = response.certificatenumber),
              (ress.certificatename = response.certificatename),
              (ress.dateofissue = this.datePipe.transform(
                response.dateofissue,
                'dd-MMM-yyyy'
              )),
              (ress.validfrom = this.datePipe.transform(
                response.validfrom,
                'dd-MMM-yyyy'
              )),
              (ress.validto = this.datePipe.transform(
                response.validto,
                'dd-MMM-yyyy'
              ));
          }
          response.imagelist?.forEach((item: any) => {
            const output_string = item.filepath.replaceAll(/\\/g, '/');
            (item.filesize = this.convertFileSize(item.filesize)),
              (item.filepath =
                this.dynamicImageURL + output_string);
            ress.file.push(item);
          });
        });
      });
      this.rowData = res.response.piqmappinglist;
      this.totalCertificateCount=this.rowData.length;
      const mappingCercodeValues = this.rowData.map(item => item.mappingcercode);
      const filteredMappingCode = mappingCercodeValues.filter(value => value !== null);
      this.certificateCount=filteredMappingCode.length
      this.BudgetService.setCertificateGridData(this.totalCertificateCount);
      this.BudgetService.setMappedCertificateData(this.certificateCount);
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
  onBtnClick1(event: any) {
    const fileUrl = event.rowData.filepath;
    this.fetchImageBlob(fileUrl).then(
      (blob: any) => {
        const filename = this.getFilenameFromUrl(fileUrl);
        saveAs(blob, filename);
      },
      (error) => {
        this.snackBarService.loadSnackBar('File Not found.', colorCodes.ERROR);
      } 
    );
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

  onSubmit() {
    // const selectedNodes = this.gridApi.getSelectedNodes();
    // const selectedData = selectedNodes.map((node: any) => node.data);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import {
  ColDef,
  FirstDataRenderedEvent,
  GridReadyEvent,
} from 'ag-grid-community';
import { saveAs } from 'file-saver';
import { LicenseManager } from 'ag-grid-enterprise';
import { IDetailCellRendererParams, IsRowMaster } from 'ag-grid-community';
import { DownloadBtnRendererComponent } from '../renderer/downloadBtn-renderer.component';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { DefaultColDef, colorCodes } from 'src/app/core/constants';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';
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
  referenceNumber: any;
  userDetails: any;
  frameworkComponents: any;
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
      flex: 1,
      valueGetter: (params) => {
        return params.data.dateofissue
          ? this.datePipe.transform(params.data.dateofissue, 'dd-MMM-yyyy')
          : '';
      },
    },
    {
      field: 'validfrom',
      headerName: 'Valid From',
      tooltipField: 'validfrom',
      flex: 1,
      valueGetter: (params) => {
        return params.data.dateofissue
          ? this.datePipe.transform(params.data.dateofissue, 'dd-MMM-yyyy')
          : '';
      },
    },
    {
      field: 'validto',
      headerName: 'Valid To',
      tooltipField: 'validto',
      flex: 1,
      valueGetter: (params) => {
        return params.data.dateofissue
          ? this.datePipe.transform(params.data.dateofissue, 'dd-MMM-yyyy')
          : '';
      },
    },
    {
      field: 'anniversarydate',
      headerName: 'Last Annual',
      tooltipField: 'anniversarydate',
      flex: 1,
      valueGetter: (params) => {
        return params.data.dateofissue
          ? this.datePipe.transform(params.data.dateofissue, 'dd-MMM-yyyy')
          : '';
      },
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
  public detailCellRendererParams: any = {
    detailGridOptions: {
      columnDefs: [
        {
          field: 'docrefno',
          headerName: 'Document No',
          tooltipField: 'docrefno',
        },
        {
          field: 'localfilename',
          headerName: 'File Name',
          tooltipField: 'localfilename',
        },
        {
          field: 'filesize',
          headerName: 'File Size',
          tooltipField: 'filesize',
          valueGetter: (params) => {
            return params.data.filesize
              ? this.convertFileSize(params.data.filesize)
              : '0 Bytes';
          },
        },
        {
          headerName: 'Certificate Download',
          cellRenderer: DownloadBtnRendererComponent,
          cellRendererParams: {
            onClick: this.onBtnClick1.bind(this),
          },
        },
      ],
    },
    getDetailRowData: function (params) {
      params.successCallback(params.data.imagelist);
    },
  } as IDetailCellRendererParams<any, any>;
  public rowData!: any[];
  totalCertificateCount: any;
  getvesselcode: any;
  constructor(
    private BudgetService: BudgetService,
    private snackBarService: SnackbarService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private _storage: StorageService
  ) {
    this.frameworkComponents = {
      buttonRenderer: DownloadBtnRendererComponent,
    };
    this.userDetails = this._storage.getUserDetails();
  }
  ngOnInit(): void {
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
  }
  onFirstDataRendered(params: FirstDataRenderedEvent) {}
  onGridReady(params: GridReadyEvent) {
    this.BudgetService.getVslCodeData().subscribe((res: any) => {
      this.getvesselcode = res;
      this.BudgetService.getCertificateList(
        this.userDetails.companyCode,
        this.getvesselcode,
        this.referenceNumber
      ).subscribe((res: any) => {
        if (res && res.response && res.response.piqmappinglist) {
          res.response.piqmappinglist.forEach((data: any) => {
            data.imagelist =
              data && data.imagelist && data.imagelist.length > 0
                ? data.imagelist
                : [];
          });
        }
        this.rowData = res.response.piqmappinglist;
  
        this.totalCertificateCount = this.rowData.length;
        const mappingCercodeValues = this.rowData.map(
          (item) => item.mackcertificatename
        );
        const filteredMappingCode = mappingCercodeValues.filter(
          (value) => value !== null
        );
        this.certificateCount = filteredMappingCode.length;
        this.BudgetService.setCertificateGridData(this.totalCertificateCount);
        this.BudgetService.setMappedCertificateData(this.certificateCount);
        this.setSaveCertificateAction();
      });
    });    
  }
  setSaveCertificateAction() {
    let payLoad: any[] = [];
    this.rowData.forEach((data) => {
      payLoad.push({
        piqcername: data.certifiactetype ? data.certifiactetype : '',
        macksavedcername: data.mackcertificatename
          ? data.mackcertificatename
          : '',
      });
    });
    const reqestBody = {
      certificatetab: payLoad,
    };
    this.BudgetService.saveMappedCertificateData(reqestBody);
  }

  isString(input: any): input is string {
    return typeof input === 'string';
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
}

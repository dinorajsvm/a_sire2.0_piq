import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgGridCheckboxComponent } from '../../renderer/ag-grid-checkbox.component';
import { ColDef, GridOptions } from 'ag-grid-community';
import { BudgetService } from '../../../services/budget.service';
import { MomentService } from 'src/app/core/services/moment/moment.service';
import { DateRendererComponent } from '../../renderer/date-renderer.component';
import { DDCellRendererComponent } from '../../renderer/dd-renderer.component';
import { DatePipe } from '@angular/common';
import { DefaultColDef } from 'src/app/core/constants';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Component({
  selector: 'app-safety-management',
  templateUrl: './safety-management.component.html',
  styleUrls: ['./safety-management.component.css'],
  providers: [DatePipe],
})
export class SafetyManagementComponent implements OnInit {
  selectedIndex: number = 0;
  frameworkComponents: any;
  gridOptions!: GridOptions;

  columnDefs: ColDef[] = [
    {
      headerName: 'Ref No',
      field: 'ivrid',
      tooltipField: 'ivrid',
      resizable: true,
      pinned: 'left',
      width: 125,
    },
    {
      headerName: 'Incident Title',
      field: 'incidenttitle',
      tooltipField: 'placeofissue',
      resizable: true,
      pinned: 'left',
      width: 125,
    },
    {
      headerName: 'Incident Description',
      field: 'incidentdescription',
      tooltipField: 'placeofissue',
      resizable: true,
      pinned: 'left',
      width: 125,
    },
    {
      headerName: 'Type of Incident',
      field: 'typename',
      tooltipField: 'placeofissue',
      resizable: true,
      pinned: 'left',
      width: 125,
    },

    {
      headerName: 'Date and Time of Incident',
      field: 'incidentdate',
      tooltipField: 'placeofissue',
      resizable: true,
      width: 125,
      pinned: 'left',
      valueGetter: (params) => {
        return params.data.incidentdate === params.data.incidentdate
          ? this.datePipe.transform(
              params.data.incidentdate,
              'dd-MMM-yyyy  HH:mm:ss'
            )
          : '';
      },
    },
    {
      headerName: '5.7.1.1',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.1. Have any of the following Incidents occurred during previous 12 months - A pollution incident that resulted in release to the environment of any substance covered by MARPOL Annex I, II, IV, V and VI in excess of that permitted by the applicable regulations.',
      suppressMenu: true,
      field: 'MQ337',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.2',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.2. Have any of the following Incidents occurred during previous 12 months - An uncontrolled release of LNG/LPG vapour.',
      suppressMenu: true,
      field: 'MQ343',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.3',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.3. Have any of the following Incidents occurred during previous 12 months - An incident where the vessel had been hard aground.',
      suppressMenu: true,
      field: 'MQ349',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.4',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.4. Have any of the following Incidents occurred during previous 12 months - An incident where the vessel had touched bottom.',
      suppressMenu: true,
      field: 'MQ355',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },

    {
      headerName: '5.7.1.5',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.5. Have any of the following Incidents occurred during previous 12 months - An incident where the vessel had been suspected of touching bottom.',
      suppressMenu: true,
      field: 'MQ361',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.6',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.6. Have any of the following Incidents occurred during previous 12 months - A collision/allision with another vessel irrespective of whether damage had been caused to either vessel.',
      suppressMenu: true,
      field: 'MQ367',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },

    {
      headerName: '5.7.1.7',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.7. Have any of the following Incidents occurred during previous 12 months - An allision with a fixed or floating structure or navigation mark irrespective of whether damage had been caused to the vessel or the fixed or floating structure or navigation mark.',
      suppressMenu: true,
      field: 'MQ373',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.8',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.8. Have any of the following Incidents occurred during previous 12 months - An allision with a terminal during a berthing manoeuvre which resulted in damage to either the vessel or the terminal structure.',
      suppressMenu: true,
      field: 'MQ379',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.9',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.9. Have any of the following Incidents occurred during previous 12 months - A breach of the hull plating which did not result in flooding.',
      suppressMenu: true,
      field: 'MQ385',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.10',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.10. Have any of the following Incidents occurred during previous 12 months - Total loss of main propulsion/blackout while navigating in open waters.',
      suppressMenu: true,
      field: 'MQ391',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.11',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.11. Have any of the following Incidents occurred during previous 12 months - Partial loss of main propulsion while navigating in open waters.',
      suppressMenu: true,
      field: 'MQ397',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.12',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.12. Have any of the following Incidents occurred during previous 12 months - Total loss of main propulsion/blackout while navigating in territorial waters or within 12 miles of land.',
      suppressMenu: true,
      field: 'MQ403',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.13',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.13. Have any of the following Incidents occurred during previous 12 months - Partial loss of main propulsion while navigating in territorial waters or within 12 miles of land.',
      suppressMenu: true,
      field: 'MQ409',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.14',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.14. Have any of the following Incidents occurred during previous 12 months - Blackout while at a berth or at anchor.',
      suppressMenu: true,
      field: 'MQ415',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.15',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.15. Have any of the following Incidents occurred during previous 12 months - Total loss, even momentarily, of steering capability at any time while the vessel was underway.',
      suppressMenu: true,
      field: 'MQ421',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.16',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.16. Have any of the following Incidents occurred during previous 12 months - Contained hydrocarbon/chemical spill greater than 1.0m3 anywhere onboard (deck, pumproom, machinery spaces, mooring deck, etc.).',
      suppressMenu: true,
      field: 'MQ427',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.17',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.17. Have any of the following Incidents occurred during previous 12 months - Loss of one or both anchors.',
      suppressMenu: true,
      field: 'MQ433',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.18',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.18. Have any of the following Incidents occurred during previous 12 months - Damage to a windlass restricting the ability to recover an anchor without repairs.',
      suppressMenu: true,
      field: 'MQ439',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.19',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.19. Have any of the following Incidents occurred during previous 12 months - Mooring tail/line (ship supplied) failure while moored at a conventional/CBM berth or while conducting STS operations.',
      suppressMenu: true,
      field: 'MQ445',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.20',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.20. Have any of the following Incidents occurred during previous 12 months - Break out/away from a berth resulting in the vessel being out of the normal operating envelope for the Marine Loading Arms (MLA) or hoses.',
      suppressMenu: true,
      field: 'MQ451',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.21',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.21. Have any of the following Incidents occurred during previous 12 months - Cargo hose crane wire failure while connecting or disconnecting hoses at a terminal.',
      suppressMenu: true,
      field: 'MQ457',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.22',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.22. Have any of the following Incidents occurred during previous 12 months - Accommodation ladder hoisting wire failure.',
      suppressMenu: true,
      field: 'MQ463',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.23',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.23. Have any of the following Incidents occurred during previous 12 months - Notification of an investigation into an alleged violation of international regulations such as MARPOL / COLREGS.',
      suppressMenu: true,
      field: 'MQ469',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.24',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.24. Have any of the following Incidents occurred during previous 12 months - Structural or pipeline system failure causing migration of liquid within or between the cargo, ballast or bunker spaces',
      suppressMenu: true,
      field: 'MQ475',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.25',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.25. Have any of the following Incidents occurred during previous 12 months - Contamination of ballast water by hydraulic oil.',
      suppressMenu: true,
      field: 'MQ481',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.26',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.26. Have any of the following Incidents occurred during previous 12 months - Flooding of any space directly from the sea.',
      suppressMenu: true,
      field: 'MQ487',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.27',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.27. Have any of the following Incidents occurred during previous 12 months - Fire or Explosion anywhere onboard.',
      suppressMenu: true,
      field: 'MQ493',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.28',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.28. Have any of the following Incidents occurred during previous 12 months - A work related lost time injury.',
      suppressMenu: true,
      field: 'MQ499',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      headerName: '5.7.1.29',
      sortable: false,
      filter: false,
      headerTooltip:
        '5.7.1.29. Have any of the following Incidents occurred during previous 12 months - A work related fatality.',
      suppressMenu: true,
      field: 'MQ505',
      width: 60,
      cellRenderer: AgGridCheckboxComponent,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
  ];
  private gridApi: any;
  private gridColumnApi: any;
  selectedColumnDefs: ColDef[] = [
    {
      headerName: 'Ref No',
      field: 'ivrid',
      tooltipField: 'ivrid',
      resizable: true,
      width: 120,
    },
    {
      headerName: 'Incident Title',
      field: 'incidenttitle',
      tooltipField: 'incidenttitle',
      width: 120,
      resizable: true,
    },
    {
      headerName: 'Incident Description',
      field: 'incidentdescription',
      tooltipField: 'incidentdescription',
      resizable: true,
      width: 120,
    },
    {
      headerName: 'Type of Incident',
      field: 'typename',
      tooltipField: 'typename',
      width: 120,
      resizable: true,
    },

    {
      headerName: 'Date and Time of Incident',
      tooltipField: 'incidentdate',
      field: 'incidentdate',
      width: 120,
      resizable: true,
      valueGetter: (params) => {
        return params.data.incidentdate === params.data.incidentdate
          ? this.datePipe.transform(
              params.data.incidentdate,
              'dd-MMM-yyyy  HH:mm:ss'
            )
          : '';
      },
    },
    {
      field: 'dateSelection',
      cellEditor: 'myDateEditor',
      tooltipField: 'dateSelection',
      editable: true,
    },
    { field: 'dropdown', cellRenderer: 'dropdown' },
  ];
  defaultColDef = DefaultColDef;
  rowData: any[] = [];
  selectedRowData: any[] = [];
  userDetails: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SafetyManagementComponent>,
    private BudgetService: BudgetService,
    private _momentService: MomentService,
    private datePipe: DatePipe,
    private _storage: StorageService
  ) {
    this.userDetails = this._storage.getUserDetails();
    this.frameworkComponents = {
      myDateEditor: DateRendererComponent,
      dropdown: DDCellRendererComponent,
      checkboxRenderer: AgGridCheckboxComponent,
    };
    this.gridOptions = {
      onGridReady: this.onGridReady.bind(this), // Bind the event handler to the component context
    };
  }

  ngOnInit() {
    this.safetyManagementDetails();
  }
  getEditFlag(event: any) {
    return true;
  }

  safetyManagementDetails() {
    const vesselCode = this.userDetails.userData.mdata.appInfo.vesselCode;
    this.BudgetService.getLookupDetail(
      this.data.qid,
      vesselCode,
      this.data.questionId,
      this.data.referenceId
    ).subscribe((data) => {
      this.rowData = JSON.parse(data.response);
    });
  }
  onBtnClick1(event?: any) {
    const rowKeys = [
      'MQ337',
      'MQ343',
      'MQ349',
      'MQ355',
      'MQ361',
      'MQ367',
      'MQ373',
      'MQ379',
      'MQ385',
      'MQ391',
      'MQ397',
      'MQ403',
      'MQ409',
      'MQ415',
      'MQ421',
      'MQ427',
      'MQ433',
      'MQ439',
      'MQ445',
      'MQ451',
      'MQ457',
      'MQ463',
      'MQ469',
      'MQ475',
      'MQ481',
      'MQ487',
      'MQ493',
      'MQ499',
      'MQ505',
    ];

    let trueKeys: any = this.rowData.filter((data) =>
      rowKeys.some((key) => data[key] === true)
    );

    if (trueKeys && trueKeys.length > 0) {
      trueKeys.forEach((response: any) => {
        response.datePicker = '';
      });
      this.selectedRowData = trueKeys;
    }
  }
  onDialogClose(): void {
    this.dialogRef.close();
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  onTabChanged(event: any) {
    if (event && event.index === 0) {
      const tempData = this.rowData;
      this.rowData = [];
      setTimeout(() => {
        this.rowData = tempData;
      }, 100);
      this.gridOptions = {
        onGridReady: this.onGridReady.bind(this), // Bind the event handler to the component context
      };
    } else if (event && event.index === 1) {
      const tempSelectedData = this.selectedRowData;
      this.selectedRowData = [];

      setTimeout(() => {
        this.selectedRowData = tempSelectedData;
        this.onBtnClick1();
      }, 100);
    }
  }

  onApply() {
    this.dialogRef.close(this.selectedRowData);
  }
}

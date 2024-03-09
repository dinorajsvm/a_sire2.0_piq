import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { colorCodes } from 'src/app/core/constants';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { AppService } from '../../services/app.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AbstractControl, ValidatorFn } from '@angular/forms';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: ['l'],
  },
  display: {
    dateInput: 'DD-MMM-YYYY', // Change the date input format
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-vessel-selection-dialog',
  templateUrl: './vessel-selection-dialog.component.html',
  styleUrls: ['./vessel-selection-dialog.component.css'],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class VesselSelectionDialogComponent {
  @ViewChild('vesselSelect') vesselSelect!: ElementRef;
  selectedValue: any;
  selectedVslTypeValue: any;
  vesselSelectionForms!: FormGroup;
  userDetails: any;
  compVslCode: any;
  vesselname: any;
  selectedVesselName: any;
  vesselTypeCode: any;
  disableProceed: boolean = true;
  sendFormattedDate: any;
  getWrkFlowId: any;
  toolTipVal: any;
  toolTipValType: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appServices: AppService,
    private _storage: StorageService,
    private _snackBarService: SnackbarService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<VesselSelectionDialogComponent>,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.userDetails = this._storage.getUserDetails();
  }
  ngOnInit(): void {
    this.vesselSelectionForms = this.fb.group({
      vesselName: [''],
      vesselType: [''],
      vesselTypeFilter: [''],
      vesselNameFilter: [''],
      datePick: ['', [this.dateValidator()]],
    });
    this.getworkflowStatus();
    this.getCodes();
    this.getVesselNames();
    this.getvesseltype();
    this.renderer.listen('document', 'click', (event) => {
      const isClickedInside = this.el.nativeElement.contains(event.target);
      if (!isClickedInside) {
        this.clearFilter();
      }
    });
  }

  // Custom validator for DD-MMM-YYYY format
  dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = this.datePipe.transform(control.value, 'dd-MMM-YYYY');
      if (value) {
        const pattern = /^\d{2}-[a-zA-Z]{3}-\d{4}$/;
        if (!pattern.test(value)) {
          return { invalidDate: { value } };
        }
      }
      return null;
    };
  }

  getVesselNames() {
    this.appServices
      .getVesselNames(this.userDetails.companyCode)
      .subscribe((res: any) => {
        this.vesselname = res.response;
      });
  }

  clearFilter() {
    this.vesselSelectionForms.patchValue({
      vesselTypeFilter: '',
      vesselNameFilter: '',
    });
  }

  onKeyChange(event: any): void {
    const value = event.target.value;
    const pattern = /^\d{2}-[a-zA-Z]{3}-\d{4}$/;
    this.disableProceed = !pattern.test(value);
    this.vesselSelectionForms.controls['datePick'].setErrors(
      pattern.test(value) ? null : { invalidDateFormat: true }
    );
    this.sendFormattedDate = this.datePipe.transform(
      event.target.value,
      'yyyy-MM-dd HH:mm:ss'
    );
  }

  getvesseltype() {
    this.appServices.getvesseltypeNameCode().subscribe((res: any) => {
      this.vesselTypeCode = res.response;
    });
  }

  onDateChange(event: any) {
    this.sendFormattedDate = this.datePipe.transform(
      this.vesselSelectionForms.value.datePick,
      'yyyy-MM-dd HH:mm:ss'
    );
    this.enableProceedButton();
  }
  onSelectVessel(event: any): void {
    this.selectedVesselName = event.value;
    this.toolTipVal = event.source.selected.viewValue;
    this.vesselSelectionForms.controls['vesselName'].setValue(event.value);
    this.enableProceedButton();
    this.vesselSelectionForms.patchValue({
      vesselNameFilter: '',
    });
    this.getCodes();
  }
  onSelectVesselType(event: any): void {
    this.selectedVesselName = event.value;
    this.toolTipValType = event.source.selected.viewValue;
    this.vesselSelectionForms.controls['vesselType'].setValue(event.value);
    this.vesselSelectionForms.patchValue({
      vesselTypeFilter: '',
      vesselNameFilter: '',
    });
    this.enableProceedButton();
  }

  enableProceedButton() {
    if (this.userDetails?.cntrlType === 'CNT001') {
      if (
        this.vesselSelectionForms.value.vesselName != null &&
        this.vesselSelectionForms.value.vesselType != null &&
        this.vesselSelectionForms.value.datePick != ''
      ) {
        this.disableProceed = false;
      } else {
        this.disableProceed = true;
      }
    } else if (this.userDetails?.cntrlType === 'CNT002') {
      if (
        this.vesselSelectionForms.value.vesselType != null &&
        this.vesselSelectionForms.value.datePick != ''
      ) {
        this.disableProceed = false;
      } else {
        this.disableProceed = true;
      }
    }
  }

  getCodes() {
    if (this.userDetails?.cntrlType === 'CNT001') {
      this.compVslCode = this.vesselSelectionForms.value.vesselName;
    } else if (this.userDetails?.cntrlType === 'CNT002') {
      this.compVslCode = this.userDetails.userData.mdata.appInfo.vesselCode;
    }
  }

  getNewRef() {
    const payload = {
      locationcode: this.userDetails?.companyCode,
      user: this.userDetails?.userCode,
      vesselcode:
        this.userDetails?.cntrlType === 'CNT001'
          ? this.vesselSelectionForms.value.vesselName
          : this.userDetails.userData.mdata.appInfo.vesselCode,
      planndesubdate: this.sendFormattedDate,
      vesseltype: this.vesselSelectionForms.value.vesselType,
      wfaction: 'INP',
      wfid: this.getWrkFlowId,
      rank: this.userDetails.userData.mdata.appInfo.rankCode,
      remarks: '',
    };
    this.appServices.getNewRefNo(payload).subscribe((res: any) => {
      if (Object.keys(res).length != 0) {
        const getRefNumber = res.response;
        getRefNumber != ''
          ? this.router.navigate(['/sire/piq-report/' + getRefNumber + '/new'])
          : '';
        localStorage.removeItem('getSelectedCheckListID');
      } else {
        this._snackBarService.loadSnackBar(
          res.error.errorMessage,
          colorCodes.ERROR
        );
      }
    });
    this.dialogRef.close();
  }

  closeDialog(event: any) {
    this.dialogRef.close();
    event.preventDefault();
    event.stopPropagation();
  }

  getworkflowStatus() {
    this.appServices.getworkFlowStatus().subscribe((res: any) => {
      let val = res.workflowmaster;
      val.forEach((item: any) => {
        this.getWrkFlowId = item.wfid;
      });
    });
  }

  onProceed(forms: any) {
    this.getNewRef();
  }
}

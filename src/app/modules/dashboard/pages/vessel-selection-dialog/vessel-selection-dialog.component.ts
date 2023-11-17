import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { colorCodes } from 'src/app/core/constants';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { BudgetService } from '../../services/budget.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  selectedValue: any;
  selectedVslTypeValue: any;
  vesselSelectionForms!: FormGroup;
  userDetails: any;
  compVslCode: any;
  getRefNo: any;
  vesselname: any;
  selectedVesselName: any;
  vesselTypeCode: any;
  disableProceed: boolean = true;
  sendFormattedDate: any;

  ngOnInit(): void {
    this.vesselSelectionForms = this.fb.group({
      vesselName: [''],
      vesselType: [''],
      datePick: ['', [this.dateValidator()]],
    });
    this.getCodes();
    this.getVesselNames();
    this.getvesseltype();
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
    this.BudgetService.getVesselNames(this.userDetails.companyCode).subscribe(
      (res: any) => {
        this.vesselname = res.response;
      }
    );
  }

  onKeyChange(event: any): void {
    const value = event.target.value;
    const pattern = /^\d{2}-[a-zA-Z]{3}-\d{4}$/;
    this.disableProceed = !pattern.test(value);
    this.vesselSelectionForms.controls['datePick'].setErrors(
      pattern.test(value) ? null : { invalidDateFormat: true }
    );
  }

  getvesseltype() {
    this.BudgetService.getvesseltypeNameCode().subscribe((res: any) => {
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
    this.vesselSelectionForms.value.vesselType;
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
      this.compVslCode = this.userDetails.companyCode;
    } else if (this.userDetails?.cntrlType === 'CNT002') {
      this.compVslCode = this.userDetails.userData.mdata.appInfo.vesselCode;
    } else {
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private BudgetService: BudgetService,
    private _storage: StorageService,
    private _snackBarService: SnackbarService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<VesselSelectionDialogComponent>
  ) {
    this.userDetails = this._storage.getUserDetails();
  }
  getNewRef() {
    const payload = {
      locationcode: this.compVslCode,
      user: this.userDetails?.userCode,
      vesselcode: this.vesselSelectionForms.value.vesselName,
      planndesubdate: this.sendFormattedDate,
      vesseltype: this.vesselSelectionForms.value.vesselType,
    };
    this.BudgetService.getNewRefNo(payload).subscribe((res: any) => {
      if (Object.keys(res).length != 0) {
        let refNo = res;
        const getRefNumber = res.response;
        this.getRefNo = refNo;
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

  onProceed(forms: any) {
    this.getNewRef();
  }
}

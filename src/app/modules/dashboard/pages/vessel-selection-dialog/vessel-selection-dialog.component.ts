import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { colorCodes } from 'src/app/core/constants';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { BudgetService } from '../../services/budget.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vessel-selection-dialog',
  templateUrl: './vessel-selection-dialog.component.html',
  styleUrls: ['./vessel-selection-dialog.component.css'],
})
export class VesselSelectionDialogComponent {
  selectedValue: any;
  vesselSelectionForms!: FormGroup;
  userDetails: any;
  compVslCode: any;
  getRefNo: any;
  vesselname: any;
  selectedVesselName: any;

  ngOnInit(): void {
    this.vesselSelectionForms = new FormGroup({
      vessel: new FormControl('', Validators.required),
    });
    this.getCodes();
    this.getVesselNames();
  }

getVesselNames(){
  this.BudgetService.getVesselNames(this.userDetails.companyCode).subscribe((res:any)=>{
    this.vesselname=res.response;
  })
}

onSelectVessel(event: any): void {
  this.selectedVesselName = event.value;
  
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
    private router: Router,
    private BudgetService: BudgetService,
    private _storage: StorageService,
    private _snackBarService: SnackbarService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<VesselSelectionDialogComponent>
  ) {
    this.userDetails = this._storage.getUserDetails();
  }
  getNewRef() {
    const payload = {
      locationcode: this.compVslCode,
      user: this.userDetails?.userCode,
      vesselcode:this.selectedVesselName
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
        this.BudgetService.setVslCodeData(this.selectedVesselName);
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

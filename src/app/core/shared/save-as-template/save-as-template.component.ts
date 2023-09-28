import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-save-as-template',
  templateUrl: './save-as-template.component.html',
  styleUrls: ['./save-as-template.component.css']
})
export class SaveAsTemplateComponent implements OnInit {
  saveAsForm!: FormGroup;
  constructor(private fb: FormBuilder,public dialogRef : MatDialogRef<SaveAsTemplateComponent>) { }

  ngOnInit(): void {
    this.saveAsForm = this.fb.group({
      templateName: ['', [Validators.required]],
    });
  }
  dialogClose(optionData:any) {
    const formValue = this.saveAsForm.value;
    if(formValue.templateName && optionData=='true') {
      this.dialogRef.close(formValue.templateName);
    }
    else {
      this.dialogRef.close(null);
    }
  }

}

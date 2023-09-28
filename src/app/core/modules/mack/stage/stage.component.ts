import { Component, OnInit,AfterViewInit, ViewChild, Input } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatStepper, MatStep} from "@angular/material/stepper";

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class StageComponent implements OnInit, AfterViewInit {
  @Input() bpmStageStatus:any;
  isLinear:boolean = true;

  completed: boolean = false;
  state: string = '';
  steps: any;
  
  constructor() { }

  ngOnInit(): void {
    // this.steps = this.bpmStageStatus.result.statusMaster;
    this.steps= [
            {"stagename":"Initiated","stagecode":"INT","stageorder":1, "status": 'completed'},
            {"stagename":"Submitted","stagecode":"SUB","stageorder":2, "status": 'inprogress'},
            {"stagename":"Approved","stagecode":"APR","stageorder":3, "status": 'inprogress'},
            {"stagename":"Verified","stagecode":"VER","stageorder":4, "status": 'inprogress'}
            ]
    
  }
  @ViewChild('stepper')
  stepper!: MatStepper;
  ngAfterViewInit() {

    switch(this.bpmStageStatus) {
      case "submitted":
        this.steps= [
            {"stagename":"Initiated","stagecode":"INT","stageorder":1, "status": 'done'},
            {"stagename":"Submitted","stagecode":"SUB","stageorder":2, "status": 'completed'},
            {"stagename":"Approved","stagecode":"APR","stageorder":3, "status": 'inprogress'},
            {"stagename":"Verified","stagecode":"VER","stageorder":4, "status": 'inprogress'}
            ]
      this.stepper.selectedIndex = 1;

        break;
      case "approved":
        this.steps= [
            {"stagename":"Initiated","stagecode":"INT","stageorder":1, "status": 'done'},
            {"stagename":"Submitted","stagecode":"SUB","stageorder":2, "status": 'done'},
            {"stagename":"Approved","stagecode":"APR","stageorder":3, "status": 'completed'},
            {"stagename":"Verified","stagecode":"VER","stageorder":4, "status": 'inprogress'}
            ]
      this.stepper.selectedIndex = 2;

        break;
      case "verified":
        this.steps= [
            {"stagename":"Initiated","stagecode":"INT","stageorder":1, "status": 'done'},
            {"stagename":"Submitted","stagecode":"SUB","stageorder":2, "status": 'done'},
            {"stagename":"Approved","stagecode":"APR","stageorder":3, "status": 'done'},
            {"stagename":"Verified","stagecode":"VER","stageorder":4, "status": 'inprogress'}
            ]
      this.stepper.selectedIndex = 3;

        break;
      default:
        this.stepper.selectedIndex = 0;

    }
    this.stepper.linear = true;
    this.stepper.disableRipple = true;
  }

}

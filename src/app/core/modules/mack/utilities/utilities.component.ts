import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Component,
  EventEmitter,
  Output,
  Inject,
} from '@angular/core';
import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent, Subject, of as observableOf } from 'rxjs';
// import { map, switchMap, takeUntil } from 'rxjs/operators';
import { distinctUntilChanged, startWith, takeUntil, map, switchMap } from 'rxjs/operators';
import { WorkflowDialogComponent } from './workflow-dialog/workflow-dialog.component';

@Component({
  selector: "app-utilities",
  templateUrl: "./utilities.component.html",
  styleUrls: ["./utilities.component.css"],
})
export class UtilitiesComponent implements OnInit {
  @Input() utilityOption:any;

  isVisible: boolean = false;
  component:any;
  utilities: any = {
    chat: {
      icon: "assets/globalUtility/chat-active.png",
      iconDisabled: "assets/globalUtility/chat-disable.png",
      title: "Chat",
      id: "chat",
      isActive: false,
    },
    tasks: {
      icon: "assets/globalUtility/tasks-active.png",
      iconDisabled: "assets/globalUtility/tasks-disable.png",
      title: "Tasks",
      id: "tasks",
      isActive: false,
    },
    taskLog: {
      title: "Task Log",
      icon: "assets/globalUtility/task-log-active.png",
      iconDisabled: "assets/globalUtility/task-log-disable.png",
      id: "taskLog",
      isActive: false,
    },
    workflow: {
      icon: "assets/globalUtility/workflow-active.png",
      iconDisabled: "assets/globalUtility/workflow-disable.png",
      title: "Workflow",
      id: "workflow",
      action: "toggleWidget('workflow')",
      isActive: true,
    },
    attachment: {
      icon: "assets/globalUtility/attachments-active.png",
      iconDisabled: "assets/globalUtility/attachment-disable.png",
      title: "Attachment",
      id: "attachment",
      isActive: false,
    },
    excel: {
      icon: "assets/globalUtility/excel-active.png",
      iconDisabled: "assets/globalUtility/excel-disable.png",
      title: "Export Excel",
      id: "excel",
      isActive: false,
    },
    pdf: {
      icon: "assets/globalUtility/pdf-active.png",
      iconDisabled: "assets/globalUtility/pdf-disable.png",
      title: "Export Pdf",
      id: "pdf",
      isActive: false,
    },
    like: {
      icon: "assets/globalUtility/msiu-active.png",
      iconDisabled: "assets/globalUtility/msiu-disable.png",
      title: "Management System Improvement Utility",
      id: "like",
      isActive: false,
    },
    share: {
      title: "Sharing Utility",
      icon: "assets/globalUtility/share-active.png",
      iconDisabled: "assets/globalUtility/share-disable.png",
      id: "share",
      isActive: false,
    },
  };

  constructor(public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.utilityOption.map((utility: any) => {
      this.utilities[utility.id] = Object.assign({}, 
                  this.utilities[utility.id], utility);
    });
  }

  toggleUtility(event: Event) {
    event.preventDefault();
    this.isVisible = !this.isVisible;
  }

  toggleWidget(type:any){
    switch(type){
      case 'chat': {
        this.component = ChatDialogComponent;         
        this.openDialog(null);
        break;
      } 
      case 'workflow': {  
        this.component = WorkflowDialogComponent;
        let popupdata = { 
          bpmSerialId : this.utilities['workflow'].bpmSerialId
        }
        this.utilities['workflow'].isActive = false;
        this.openDialog(popupdata);        
        break;
      }
    }
  }

  openDialog(dataItem:any): void {
    let dialogRef = this.dialog.open(this.component, {
      width: '400px',
      minHeight:'350px',
      data: dataItem,
      position: {
        right: '20px',
        bottom: '50px'
      },
      hasBackdrop: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities['workflow'].isActive = true;
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

}
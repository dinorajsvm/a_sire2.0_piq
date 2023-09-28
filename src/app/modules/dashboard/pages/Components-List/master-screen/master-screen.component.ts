import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { AgGridMenuComponent } from 'src/app/core/shared/ag-grid/ag-grid-menu.component';

interface topicNames {
  value: string;
  viewValue: string;
}

interface subTopicNames {
  value: string;
  viewValue: string;
}
interface questionCode {
  value: string;
  viewValue: string;
}
interface questions {
  value: string;
  viewValue: string;
}

interface response {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-master-screen',
  templateUrl: './master-screen.component.html',
  styleUrls: ['./master-screen.component.css']
})
export class MasterScreenComponent implements OnInit {
  @ViewChild('responseInput') responseInput!: ElementRef;

  panelOpenState = false;
  showContent = false;
  public isContentVisible: boolean[] = [];
  selectedValues: string[] = [];
  selectedValue: string = '';
  headings: any;
  values_header: any[] = [];
  QA: any[] = [];
  selectedQuestion: any;
  selectedSubQuestion: any;
  subQValues: any;
  formValues_sub: any;

  // addResponse(responseInput: HTMLInputElement) {
  //   const response = responseInput.value;
  //   if (response.trim() !== '') {
  //     this.selectedValues.push(response);
  //   }
  //   responseInput.value = '';
  // }

  public updateResponse(updatedValue: string, responseInput: HTMLInputElement) {
    
    if (this.selectedValue) {
      const index = this.selectedValues.indexOf(this.selectedValue);
      if (index !== -1) {
        this.selectedValues[index] = updatedValue;
      }
      this.selectedValue = ''; // Clear the selected value
    }
    responseInput.value = ''; // Clear the response input field
    return;
  }

  addResponse(responseInput: HTMLInputElement) {
    
    const response = responseInput.value;
    if (response.trim() !== '') {
      if (this.selectedValue) {
        const index = this.selectedValues.indexOf(this.selectedValue);
        if (index !== -1) {
          this.selectedValues[index] = response;
        }
      } else {
        this.selectedValues.push(response);
      }
      this.selectedValue = ''; // Clear the selected value
    }
    responseInput.value = ''; // Clear the response input field
  }

  // editValue(value: string) {
  //   const newValue = prompt('Edit the selected value:', value);
  //   if (newValue !== null && newValue.trim() !== '') {
  //     const index = this.selectedValues.indexOf(value);
  //     if (index !== -1) {
  //       this.selectedValues[index] = newValue;
  //       this.responseInput.nativeElement.value = newValue; // Update the response field
  //     }
  //   }
    
  // }

  // editValue(value: string) {
  //   
  //   const index = this.selectedValues.indexOf(value);
  //   if (index !== -1) {
  //     const responseInput = this.responseInput.nativeElement as HTMLInputElement;
  //     responseInput.value = value;
  //     responseInput.focus();
  //     responseInput.select();
  //     responseInput.addEventListener('change', () => {
  //       this.selectedValues[index] = responseInput.value;
  //     });
  //   }
  // }

  // editValue(value: string) {
  //   const index = this.selectedValues.indexOf(value);
  //   if (index !== -1) {
  //     const responseInput = this.responseInput.nativeElement as HTMLInputElement;
  //     responseInput.value = value;
  //     responseInput.focus();
  //     responseInput.select();
  //     // Add the updated value to the selectedValues array when the 'Update' button is clicked
  //     const updateResponseHandler = (ev: Event) => {
  //       this.selectedValues[index] = responseInput.value;
  //       responseInput.removeEventListener('change', updateResponseHandler);
  //     };
  //     responseInput.addEventListener('change', updateResponseHandler);
  //   }
  // }

  editValue(value: string) {
    const index = this.selectedValues.indexOf(value);
    if (index !== -1) {
      const responseInput = this.responseInput.nativeElement as HTMLInputElement;
      responseInput.value = value;
      responseInput.focus();
      responseInput.select();
      
      const handleInputChange = () => {
        this.selectedValues[index] = responseInput.value;
      };
      
      responseInput.addEventListener('change', handleInputChange);
      
      const handleInputFocusOut = () => {
        responseInput.removeEventListener('change', handleInputChange);
      };
      responseInput.addEventListener('focusout', handleInputFocusOut);
    }
  }
  
  
  removeValue(value: string) {
    this.selectedValues = this.selectedValues.filter(v => v !== value);
  }

  columnDefs: any[] = [
    {
      field: 'status',
      headerName: 'Action',
      sortable: false,
      filter: false,
      cellRendererFramework: AgGridMenuComponent,
      cellRendererParams: {
        menu: [
          {
            name: "",
            image: "assets/icon-images/view.png",
            link: "",
            tooltip: "Edit",
          },
          {
            name: "",
            image: "assets/icon-images/edit.png",
            link: "",
            tooltip: "Edit",
          },
          {
            name: "",
            image: "assets/icon-images/delete.png",
            link: "",
            tooltip: "Edit",
          }]
      }
    },
    { field: 'topic', headerName: 'Topic' },
    { field: 'subTopic', headerName: 'Sub Topic' },
    { field: 'questionCode', headerName: 'Question Code' },
    { field: 'question', headerName: 'Question' },
    { field: 'response', headerName: 'Response' },
  ];

  public defaultColDef: any = {
    resizable: true,
    filter: "agTextColumnFilter",
    floatingFilter: true,
    enableRowGroup: true,
    sortable: true,
    flex: 1,
    
  };
  public gridOptions: GridOptions = {

  };

  rowData = [
    { topic: 'General Information', subTopic: 'General Information', questionCode: '1.1.1', question: 'Vessel Type', response: 'OBO, Ore-Oil, DP Shuttle(bow loading), Shuttle(bow loading), Bitumen Tanker, Sulphur tanker, Other' },
    { topic: 'Certification and documentation', subTopic: 'Certificate', questionCode: '2.1.3', question: 'Purpose of visit', response: 'Damage survey' },
    { topic: 'Certification and documentation', subTopic: 'Structural Assessment', questionCode: '2.3.3.1.1', question: 'Requirement Frequency of inspection for cargo tank', response: '3,6,12' },
    { topic: 'Certification and documentation', subTopic: 'Structural Assessment', questionCode: '2.3.3.2.1', question: 'Requirement Frequency of inspection for Ballast tank', response: '3,6,12' },
    { topic: 'Certification and documentation', subTopic: 'Structural Assessment', questionCode: '2.3.3.3', question: 'Requirement Frequency of inspection for Void space', response: '3,6,12' },
    { topic: 'Certification and documentation', subTopic: 'Structural Assessment', questionCode: '2.3.5.1.2', question: 'CAP rating for hull structure', response: '1,2,3' },
    { topic: 'Certification and documentation', subTopic: 'Structural Assessment', questionCode: '2.3.5.1.3', question: 'CAP rating for propulsion and auxiliary systems', response: '1,2,3' },
    { topic: 'Certification and documentation', subTopic: 'Structural Assessment', questionCode: '2.3.5.1.4', question: 'CAP rating for cargo equipment and systems', response: '1,2,3' },
    { topic: 'Certification and documentation', subTopic: 'Structural Assessment', questionCode: '2.3.5.1.5', question: 'CAP rating for cargo containment systems (for LPG an LNG Carriers)', response: '1,2,3' },
    { topic: 'Certification and documentation', subTopic: 'Structural Assessment', questionCode: '2.3.5.1.6', question: 'CAP rating for machinery and cargo systems combined', response: '1,2,3' },
    { topic: 'Certification and documentation', subTopic: 'Structural Assessment', questionCode: '2.3.5.1.7', question: 'CAP rating for bridge, navigation and radio equipment.', response: '1,2,3' },
    { topic: 'Certification and documentation', subTopic: 'Structural Assessment', questionCode: '2.3.5.1.9', question: 'Overall rating where provided', response: '1,2,3' },
    { topic: 'Certification and documentation', subTopic: 'Classification Society', questionCode: '', question: '', response: 'China Classification Society, Bureau Colombo, DNV GL, Indian Register of Shipping, Nippon Kaiji Kyokai, Registro Brasileiro de Navios e Aeronaves, Registru Naval Roman, Taiwan Register, Yugoslav Register, Biro Klasifikasi Indonesia, Bureau veritas, Deutsche Schiffs- Revision Und Klassn, Korean Register, The Peoples Republic of China Register of Shipping, Registro CubanaDe Buques, Rinave Portugesa, Turk Loydu, Other (Please Specify)' },
  ];


  topics: topicNames[] = [
    { value: 'generalInformation ', viewValue: 'General Information' },
    { value: 'certificationAndDocumentation', viewValue: 'Certification And Documentation' },
    { value: 'crewManagement', viewValue: 'Crew Management' },
    { value: 'navigationAndCommunication', viewValue: 'Navigation and Communication' },
    { value: 'safetyManagement', viewValue: 'Safety Management' },
  ];

  subTopics: subTopicNames[] = [
    { value: 'certification', viewValue: 'Certification' },
    { value: 'managementOversight', viewValue: 'Management Oversight' },
    { value: 'structuralAssessment', viewValue: 'Structural Assessment' },
    { value: 'managementOfChange', viewValue: 'Management of Change' },
    { value: 'statutoryManagementPlans', viewValue: 'Statutory Management Plans' },
  ];

  questionCode: questionCode[] = [
    { value: '2.1.1', viewValue: '2.1.1' },
    { value: '2.2.1', viewValue: '2.2.1' },
    { value: '2.3.3.1', viewValue: '2.3.3.1' },
    { value: '2.5.1.1', viewValue: '2.5.1.1' },
    { value: '2.6.2', viewValue: '2.6.2' },
  ];

  questions: questions[] = [
    { value: 'question 2.1.1', viewValue: 'What was the date of last visit by a Classification Society surveyor?' },
    { value: 'question 2.2.1', viewValue: 'Has a Technical Superintendent with a senior marine engineer, naval architect or mechanical engineering background attended the vessel and completed a full inspection of the vessel during the preceding eighteen months' },
    { value: 'question 2.3.3.1', viewValue: 'What is the required frequency of inspection for cargo tanks?' },
    { value: 'question 2.5.1.1', viewValue: 'Have any structural changes been made to the vessel and/or its fittings during the preceding twelve months?' },
    { value: 'question 2.6.2', viewValue: 'Is the vessel provided with a Volatile Organic Compounds (VOC) Management Plan?' },
  ];

  response: response[] = [
    { value: 'OBO', viewValue: 'OBO' },
    { value: 'OreOil', viewValue: 'Ore-Oil' },
    { value: 'dpShuttle', viewValue: 'DP Shuttle' },
    { value: '123', viewValue: '1,2,3' },
    { value: '369', viewValue: '3,6,9' },
  ];

  

  constructor() { }

  ngOnInit(): void {
  }

}

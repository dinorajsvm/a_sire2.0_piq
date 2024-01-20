import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  // private globalUrl = "https://procdemo.solverminds.net";
  // private globalUrl = "https://macktesting.solverminds.net"
  // private globalUrl = "http://70.205.1.4:8080"
  // private globalUrl = "http://70.205.1.5:8080"
  // private globalUrl = document.location.protocol + '//' + document.location.hostname;
  private globalUrl = environment.apiUrl;

  currencyValue: any = 'BaseCurrency';
  vesselCode: any;
  apikey: any;
  private getAllPreviousPresetData = new BehaviorSubject<any>(0);
  private getSummaryGridDataList = new Subject<any>();
  private getFormStatus = new Subject<any>();
  private getViewMode = new Subject<any>();
  private getVeslTypeData = new Subject<any>();
  private getPhotoRepGridData = new Subject<any>();
  private getSearchStatus = new Subject<any>();
  private getCertificateGridDataList = new BehaviorSubject<any>(0);
  private getMappedCertificateGridDataList = new BehaviorSubject<any>(0);
  private saveMappedCertificate = new Subject<any>();
  private getImageCount = new BehaviorSubject<any>(0);
  private getPhotoRepList = new Subject<any>();
  private exceptionList = new Subject<any>();
  private guidelineList = new Subject<any>();
  private exceptionReset = new Subject<any>();
  private getVslCode = new Subject<any>();
  private getTabIndexCount = new Subject<any>();
  private hideEditButton = new Subject<any>();
  private enableDisableButtons = new Subject<any>();
  private setPiqQuestion = new Subject<any>();
  private setDeleteBtn = new Subject<any>();
  private getExcepData = new Subject<any>();
  private setUnSave = new BehaviorSubject<any>(false);
  constructor(private client: HttpClient) {}

  setEnableBtn(message: any) {
    this.enableDisableButtons.next(message);
  }

  getEnableBtn() {
    return this.enableDisableButtons.asObservable();
  }
  setStatus(message: any) {
    this.getFormStatus.next(message);
  }

  setExceptionRowData(message: any) {
    this.getExcepData.next(message);
  }
  getExceptionRowData() {
    return this.getExcepData.asObservable();
  }

  getStatus() {
    return this.getFormStatus.asObservable();
  }

  setGridSummary(message: any) {
    this.getSummaryGridDataList.next(message);
  }

  getGridSummary() {
    return this.getSummaryGridDataList.asObservable();
  }

  setUnSaveAction(message: any) {
    this.setUnSave.next(message);
  }

  getUnSaveAction() {
    return this.setUnSave.asObservable();
  }

  setDeleteAction(message: any) {
    this.setDeleteBtn.next(message);
  }

  getDeleteAction() {
    return this.setDeleteBtn.asObservable();
  }

  setPiqQuestionData(message: any) {
    this.setPiqQuestion.next(message);
  }

  getPiqQuestionData() {
    return this.setPiqQuestion.asObservable();
  }
  setEnableViewMode(message: any) {
    this.getViewMode.next(message);
  }

  getEnableViewMode() {
    return this.getViewMode.asObservable();
  }
  setImgCount(message: any) {
    this.getImageCount.next(message);
  }

  getImgCount() {
    return this.getImageCount.asObservable();
  }

  setEditVisible(message: any) {
    this.hideEditButton.next(message);
  }

  getEditVisible() {
    return this.hideEditButton.asObservable();
  }
  setSearch(message: any) {
    this.getSearchStatus.next(message);
  }

  getSearch() {
    return this.getSearchStatus.asObservable();
  }

  setVesselTypeData(message: any) {
    this.getVeslTypeData.next(message);
  }
  getVesselTypeData() {
    return this.getVeslTypeData.asObservable();
  }

  getPiqQuestAns(payload: any) {
    let qa = this.client.post<any>(
      `${this.globalUrl}/PIQ/event/MasterData`,
      payload
    );
    return qa;
  }

  getPhotoRepGridList(payload: any) {
    let ba = this.client.post<any>(
      `${this.globalUrl}/PIQ/event/getPIQChecklist`,
      payload
    );
    return ba;
  }

  getPhotoRepGridListImg(payload: any) {
    let ba = this.client.post<any>(
      `${this.globalUrl}/PIQ/event/getPIQchecklistimages`,
      payload
    );
    return ba;
  }
  getNewRefNo(payload: any) {
    let ba = this.client.post<any>(
      `${this.globalUrl}/PIQ/event/createnew`,
      payload
    );
    return ba;
  }

  getSaveValues(payload: any) {
    let ba = this.client.post<any>(
      `${this.globalUrl}/PIQ/event/saveanswer`,
      payload
    );
    return ba;
  }

  getPIQLndPgDatas(payload: any) {
    let ba = this.client.post<any>(
      `${this.globalUrl}/PIQ/event/getPIQlandingpage`,
      payload
    );
    return ba;
  }

  deleteRow(payload: any) {
    let ba = this.client.post<any>(
      `${this.globalUrl}/PIQ/event/deletereference`,
      payload
    );
    return ba;
  }


  getRefnImport(userCode: any) {
    return this.client.get<any>(
      `${this.globalUrl}/PIQ/event/getrefnotoimport?usercode=${userCode}`
    );
  }
  getworkFlowStatus() {
    return this.client.get<any>(
      `${this.globalUrl}/PIQ/event/getpiqworkflowmaster`
    );
  }

  getworkflowaction(payload: any) {
    let ba = this.client.post<any>(
      `${this.globalUrl}/PIQ/event/submitworkflowaction`,
      payload
    );
    return ba;
  }

  getWorkFlowSummary(refno: any) {
    let ba = this.client
      .get<any>(
        `${this.globalUrl}/PIQ/event/getworkflowhistory?instanceid=${refno}`
      )
      .pipe(map((res: any) => res));
    return ba;
  }

  getRefnImportAnswer(refno: any) {
    return this.client.get<any>(
      `${this.globalUrl}/PIQ/event/getimportanswer?instanceid=${refno}`
    );
  }
  saveQuickNotes(payload: any) {
    return this.client.post<any>(
      `${this.globalUrl}/PIQ/event/savequicknotes`,
      payload
    );
  }

  getVesselNames(companycode: any) {
    return this.client.get<any>(
      `${this.globalUrl}/PIQ/event/getvesselbycompany?companycode=${companycode}`
    );
  }

  setVslCodeData(message: any) {
    this.getVslCode.next(message);
  }

  getVslCodeData() {
    return this.getVslCode.asObservable();
  }
  setPreviousPresetData(message: any) {
    this.getAllPreviousPresetData.next(message);
  }

  getPreviousPresetData() {
    return this.getAllPreviousPresetData.asObservable();
  }
  setPrGridData(message: any) {
    this.getPhotoRepGridData.next(message);
  }

  getPrGridData() {
    return this.getPhotoRepGridData.asObservable();
  }

  setCertificateGridData(message: any) {
    this.getCertificateGridDataList.next(message);
  }
  getCertificateGridData() {
    return this.getCertificateGridDataList.asObservable();
  }

  setMappedCertificateData(message: any) {
    this.getMappedCertificateGridDataList.next(message);
  }
  getMappedCertificateData() {
    return this.getMappedCertificateGridDataList.asObservable();
  }

  saveMappedCertificateData(message: any) {
    this.saveMappedCertificate.next(message);
  }
  getSavedMappedCertificateData() {
    return this.saveMappedCertificate.asObservable();
  }

  setTabChangeData(message: any) {
    this.getTabIndexCount.next(message);
  }
  getTabChangeData() {
    return this.getTabIndexCount.asObservable();
  }

  setPhotoRepData(message: any) {
    this.getPhotoRepList.next(message);
  }
  getPhotoRepData() {
    return this.getPhotoRepList.asObservable();
  }
  getLookupVisitData(location: any, instanceId: any, questionId: any) {
    return this.client.get<any>(
      `${this.globalUrl}/PIQ/event/getpiqshipvisitdata?location=${location}&instanceid=${instanceId}&questionid=${questionId}`
    );
  }
  getPMSLookupVisitData(
    companycode: any,
    vesselCode: any,
    instanceId: any,
    questionId: any
  ) {
    return this.client.get<any>(
      `${this.globalUrl}/PIQ/event/getpmslookup?companycode=${companycode}&vesselcode=${vesselCode}&instanceid=${instanceId}&questionid=${questionId}`
    );
  }

  getCertificateList(companycode: any, vesselcode: any, instanceId: any) {
    return this.client.get<any>(
      `${this.globalUrl}/PIQ/event/getcertificatemapping?companycode=${companycode}&vesselcode=${vesselcode}&instanceid=${instanceId}`
    );
  }

  getReferenceList(vesselcode: any, companycode: any, instanceid: any) {
    return this.client.get<any>(
      `${this.globalUrl}/PIQ/event/getreferncetab?vesselcode=${vesselcode}&companycode=${companycode}&instanceid=${instanceid}`
    );
  }

  setExceptionData(message: any) {
    this.exceptionList.next(message);
  }
  getExceptionData() {
    return this.exceptionList.asObservable();
  }

  setGuidelineData(message: any) {
    this.guidelineList.next(message);
  }
  getGuidelineData() {
    return this.guidelineList.asObservable();
  }

  setExceptionResetData(message: any) {
    this.exceptionReset.next(message);
  }
  getExceptionResetData() {
    return this.exceptionReset.asObservable();
  }

  getTopBarData(instanceid: any) {
    let ba = this.client
      .get<any>(
        `${this.globalUrl}/PIQ/event/getvesseldetails?instanceid=${instanceid}`
      )
      .pipe(map((res: any) => res));
    return ba;
  }

  getPRImagename(companycode: any, instanceid: any) {
    return this.client
      .get<any>(
        `${this.globalUrl}/PIQ/event/getimagename?companycode=${companycode}&instanceid=${instanceid}`
      )
      .pipe(map((res: any) => res));
  }
  getDefaultImageTemplate() {
    let ba = this.client
      .get<any>(`${this.globalUrl}/PIQ/event/getstaticimagetemplate`)
      .pipe(map((res: any) => res));
    return ba;
  }


  getServerFileFromStream(fileName: any) {
    return this.client.get(
      `${this.globalUrl}/PIQ/event/getdocument?filename=${fileName}`,{responseType: 'blob'}
    );
  }

  getvesseltypeNameCode() {
    return this.client.get<any>(`${this.globalUrl}/PIQ/event/getvessel`);
  }

  getUploadData(payload: any) {
    return this.client.post<any>(
      `${this.globalUrl}/PIQ/event/getuploaddata`,
      payload
    );
  }
  savePhotoRep(payload: any) {
    return this.client.post<any>(
      `${this.globalUrl}/PIQ/event/savePIQPhotorepo`,
      payload
    );
  }

  getSavedPRData(instanceId: any) {
    return this.client
      .get<any>(
        `${this.globalUrl}/PIQ/event/getsavedphotorepo?instanceid=${instanceId}`
      )
      .pipe(map((res: any) => res));
  }

  getMocDetails(locationCode: any, instanceId: any, questionId: any) {
    return this.client
      .get<any>(
        `${this.globalUrl}/PIQ/event/getmocdata?location=${locationCode}&instanceid=${instanceId}&questionid=${questionId}`
      )
      .pipe(map((res: any) => res));
  }

  getPscDetails(locationCode: any, instanceId: any, questionId: any) {
    return this.client
      .get<any>(
        `${this.globalUrl}/PIQ/event/getextdata?location=${locationCode}&instanceid=${instanceId}&questionid=${questionId}`
      )
      .pipe(map((res: any) => res));
  }

  getVesselCertificateLookup(location: any) {
    return this.client
      .get<any>(
        `${this.globalUrl}/PIQ/event/getPIQvesselcertificate?location=${location}`
      )
      .pipe(map((res: any) => res));
  }
  getLookupDetail(id: any, location: any, questionId: any, instanceId: any) {
    return this.client
      .get<any>(
        `${this.globalUrl}/PIQ/event/getlookup?lookupid=${id}&location=${location}&questionid=${questionId}&instanceid=${instanceId}`
      )
      .pipe(map((res: any) => res));
  }

  saveLookUp(payload: any) {
    return this.client.post<any>(
      `${this.globalUrl}/PIQ/event/savelookupmapping`,
      payload
    );
  }
}

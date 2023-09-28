export enum AppTitle {
    MANAGEMENTDB_TITLE =  "MANAGEMENT DASHBOARD"
}

export enum Roles {
    SHIP = 'CNT002',
    SHORE = 'CNT001'
}

export enum UserRoles {
    MASTER = "MAS",
    DECK_OFFICER = "CHF_OFF",
    VESSEL_MANAGER = "VSL_MGR",
    NYK_MARINE_GROUP = "MRNGRP",
    CREW_MEMBER = "CREW"
}

export enum Endpoints {
    LOGIN = '/user/login',
    LOGOUT = '/logout',
    VALIDATE_TOKEN = '/validate/token/',
    USER_PROFILE = '/user/profile',
    ROLE_IDENTITY = '/identity/role',
    GET_GETNOTIFICATION = '/getNotification',
    GET_ALERTS_NOTIFICATION = '/getAlerts',
    UPDATE_READ_STATUS = '/updateReadStatusByUser',
    NOTIFICATION_REDIRECT = '/report/details',
    GET_CATEGORY = '/category',
    GET_COMPANY = '/company',
    GET_DEPARTMENT = '/department',
    GET_VESSEL = '/report/vessel',
    GET_CHANGE_HISTORY = '/report/moc',
    GET_WORKFLOW_HISTORY = '/report/workflowhistory',
    OVERVIEW = '/dashboard/overview',
    CATEGORY = '/dashboard/category',
    TEMPORARY_MOC = '/dashboard/temporaryMocExpiryDate',
    TARGET_COMPLETION = '/dashboard/targetCompletionDate',
    GET_TEMPLATE = '/smgrid/get',
    CREATE_TEMPLATE = '/grid/save',
    UPDATE_TEMPLATE = '/smgrid/update',
    DELETE_TEMPLATE = '/smgrid/delete',

    //get inTrasitReport Details
    GET_SUMMARY_DONUT_INFO = '/getSummaryData',
    GET_SUMMARY_BAR_INFO = '/getBarchartData',
    GET_SUMMARY_GRID_INFO = '/getGridData',
    GET_POPTABLE_INFO = '/getSummaryDetailData',
    GET_GRIDTABLE_INFO='/getGridDetailData',
    GET_BARCHART_GRID_INFO ='/getBarchartDetailData',
    GET_FILTER_RESULTINFO = '/report/vessel',
    GET_FILTER_REPORTLIST = '/PROCWebServices/procapi/getData/filters', // header filter
    GET_STATE_INFO = '/PROCWebServices/procapi/getData/requisitionstate',
    GET_ADVANCE_SEARCH_INFO = '/change_management_bridge/api/v1/cmb/getData/advancesearch',
    GET_DASHBOARD_COMMON_WIDGET = '/GDashboard/api/service/getwgtdata', // griddata
    GET_DASHBOARD_COMMON_GRID_DETAIL = '/GDashboard/api/service/loadWidgetNavg',
    GET_DASHBOARD_EXTERNAL_WIDGET = '/QueryService-war/services/query/generic', //vds
    GET_AGING_INFO_DETAILS = '/PROCWebServices/procapi/getData/ageingpopup',
    GET_BUDGET_WIDGET_APIKEY='/getbudgetpluginstatus',
  }

export const ROLE_MAPPING = {
    MAS: 'Master',
    CHF_OFF: 'Chief Officer',
    VSL_MGR: 'Vessel Manager',
    MRNGRP: 'HSEQ Manager',
    CREW: 'Chief Engineer'
  };

export const colors = ['#A259DF', '#00EDEF','#5A7CFA','#FF3D58','#9CB7CD','#27D085','#440a67'];
export const DETAIL_PLAN_COLORS = ['#5A7CFA','#A259DF','#00EDEF'];

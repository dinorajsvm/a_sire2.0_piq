import { agGridTooltipComponent } from '../modules/dashboard/pages/renderer/ag-grid-tooltip.component';

export enum ApiMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  DOWNLOAD = 'DOWNLOAD',
  GETPARAMS = 'GETPARAMS',
  DOWNLOAD_PARAMS = 'DOWNLOAD_PARAMS',
  DOWNLOAD_BLOB = 'DOWNLOAD_BLOB',
  POST_WITH_HEADER = 'POST_W_HEADER',
  GET_WITH_HEADER = 'GET_W_HEADER',
}

export enum EFormMode {
  NEW = 'new',
  EDIT = 'edit',
  VIEW = 'view',
}

export enum Pattern {
  NUMBER = '^[0-9]*$',
  NUMBER_DOT = '^[0-9]+[.][0-9]{1,20}$',
}

export enum AmChartLicense {
  CHART_LICENSE = 'CH259581991',
  MAP_LICENSE = '',
}
export enum SuccessCodes {
  HTTP_200_OK = 200,
  HTTP_201_CREATED = 201,
  HTTP_202_ACCEPTED = 202,
}

export enum ErrorCodes {
  HTTP_400_BAD_REQUEST = 400,
  HTTP_401_UNAUTHORIZED = 401,
  HTTP_403_FORBIDDEN = 403,
  HTTP_404_NOT_FOUND = 404,
  HTTP_500_ERROR = 500,
  HTTP_CONN_REFUSED = 0,
}

export enum colorCodes {
  SUCCESS = 'Success',
  WARNING = 'Warning',
  ERROR = 'Error',
  INFO = 'Info',
}

export enum ErrorMessage {
  SESSION_EXPIRED = 'Session Expired',
  UNKNOWN_ERROR_CODE = 'Unknown Error Code',
  SERVER_UNAVAILABLE = 'Server is unavailable',
  INTERNAL_SERVER_ERROR = 'Something went wrong. Please try again',
  REFRESH_TOKEN_EXPIRY = 'Token is invalid or expired',
  NETWORK_ERROR = 'Network error. Please try again',
}

export const CKEDITOR_CONFIG = {
  link: {
    addTargetToExternalLinks: true,
  },
  toolbar: {
    items: [
      'bold',
      'italic',
      'underline',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'imageUpload',
      'blockQuote',
      'insertTable',
      'undo',
      'redo',
    ],
  },
  image: {
    toolbar: [
      'imageStyle:full',
      'imageStyle:side',
      '|',
      'imageTextAlternative',
    ],
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
  // This value must be kept in sync with the language defined in webpack.config.js.
  language: 'en',
};

export const DefaultColDef: any = {
  resizable: true,
  filter: 'agTextColumnFilter',
  floatingFilter: true,
  suppressMovable: true,
  sortable: true,
  tooltipComponent: agGridTooltipComponent,
  cellStyle: (params: any) => {
    const value = params.value;
    // if (typeof value === 'number') {
    //   return { textAlign: 'right' };
    // } else if (value instanceof Date || Date.parse(value)) {
    //   return { textAlign: 'right' };
    // } else if (typeof value === 'string') {
    //   return { textAlign: 'left' };
    // } else {
    //   return { textAlign: 'left' };
    // }
    if (!isNaN(Number(value))) {
      return { textAlign: 'right' };
    } else if (value instanceof Date && !isNaN(value.getTime())) {
      return { textAlign: 'right' };
    } else if (typeof value === 'string' && !isNaN(Number(value))) {
      return { textAlign: 'left' };
    } else {
      return { textAlign: 'left' };
    }
  },
};

export const CellStatus = (params: any) => {
  const status = params.value;
  if (status === 'Submitted') {
    return {
      backgroundColor: '#ff7c25',
      color: 'white',
      textAlign: 'center',
      borderRight: '5px solid white',
      borderLeft: '5px solid white',
      borderBottom: '1px solid white',
      borderTop: '1px solid white',
    };
  } else if (status === 'Inprogress') {
    return {
      backgroundColor: '#39b7cd',
      color: 'white',
      textAlign: 'center',
      borderRight: '5px solid white',
      borderLeft: '5px solid white',
      borderBottom: '1px solid white',
      borderTop: '1px solid white',
    };
  } else if (status === 'Reassigned') {
    return {
      backgroundColor: '#0e2350',
      color: 'white',
      textAlign: 'center',
      borderRight: '5px solid white',
      borderLeft: '5px solid white',
      borderBottom: '1px solid white',
      borderTop: '1px solid white',
    };
  } else if (status === 'Approved') {
    return {
      backgroundColor: '#00a65a',
      color: 'white',
      textAlign: 'center',
      borderRight: '5px solid white',
      borderLeft: '5px solid white',
      borderBottom: '1px solid white',
      borderTop: '1px solid white',
    };
  }

  return null;
};

export const valuesToCheckDD = [
  'Q341',
  'Q347',
  'Q353',
  'Q359',
  'Q365',
  'Q371',
  'Q377',
  'Q383',
  'Q389',
  'Q395',
  'Q401',
  'Q407',
  'Q413',
  'Q419',
  'Q425',
  'Q431',
  'Q437',
  'Q443',
  'Q449',
  'Q455',
  'Q461',
  'Q467',
  'Q473',
  'Q479',
  'Q485',
  'Q491',
  'Q497',
  'Q503',
  'Q509',
];

export const valuesToCheckDate = [
  'Q342',
  'Q348',
  'Q354',
  'Q360',
  'Q366',
  'Q372',
  'Q378',
  'Q384',
  'Q390',
  'Q396',
  'Q402',
  'Q408',
  'Q414',
  'Q420',
  'Q426',
  'Q432',
  'Q438',
  'Q444',
  'Q450',
  'Q456',
  'Q462',
  'Q468',
  'Q474',
  'Q480',
  'Q486',
  'Q492',
  'Q498',
  'Q504',
  'Q510',
];

export const safetyRowData = [
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

export const questionValue = {
  OTHER: 'Other',
  YES: 'Yes',
};

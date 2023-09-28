export enum ApiMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    DOWNLOAD = "DOWNLOAD",
    GETPARAMS = "GETPARAMS",
    DOWNLOAD_PARAMS = "DOWNLOAD_PARAMS",
    DOWNLOAD_BLOB = "DOWNLOAD_BLOB",
    POST_WITH_HEADER = "POST_W_HEADER",
    GET_WITH_HEADER = "GET_W_HEADER"
}

export enum EFormMode {
  NEW = 'new',
  EDIT = 'edit',
  VIEW = 'view',
}

export enum Pattern {
  NUMBER = '^[0-9]*$',
  NUMBER_DOT = "^[0-9]+[.][0-9]{1,20}$",
}

export enum AmChartLicense {
  CHART_LICENSE = 'CH259581991',
  MAP_LICENSE = ''
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
    SUCCESS = "Success",
    WARNING = "Warning",
    ERROR = "Error",
    INFO = "Info"
}


export enum ErrorMessage  {
    SESSION_EXPIRED=  "Session Expired",
    UNKNOWN_ERROR_CODE =  'Unknown Error Code',
    SERVER_UNAVAILABLE = "Server is unavailable",
    INTERNAL_SERVER_ERROR ="Something went wrong. Please try again",
    REFRESH_TOKEN_EXPIRY = "Token is invalid or expired",
    NETWORK_ERROR = "Network error. Please try again"
}

export const CKEDITOR_CONFIG = {
    link: {
      addTargetToExternalLinks: true
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
      ]
    },
    image: {
      toolbar: [
        'imageStyle:full',
        'imageStyle:side',
        '|',
        'imageTextAlternative'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: 'en'
};


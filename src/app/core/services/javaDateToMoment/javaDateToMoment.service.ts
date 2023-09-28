import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class javaDateToMomentService {

  javaDateFormats:any = {};

  javaFormatMapping = {
    d: 'D',
    dd: 'DD',
    y: 'YYYY',
    yy: 'YY',
    yyy: 'YYYY',
    yyyy: 'YYYY',
    a: 'a',
    A: 'A',
    M: 'M',
    MM: 'MM',
    MMM: 'MMM',
    MMMM: 'MMMM',
    h: 'h',
    hh: 'hh',
    H: 'H',
    HH: 'HH',
    m: 'm',
    mm: 'mm',
    s: 's',
    ss: 'ss',
    S: 'SSS',
    SS: 'SSS',
    SSS: 'SSS',
    E: 'ddd',
    EE: 'ddd',
    EEE: 'ddd',
    EEEE: 'dddd',
    EEEEE: 'dddd',
    EEEEEE: 'dddd',
    D: 'DDD',
    w: 'W',
    ww: 'WW',
    z: 'ZZ',
    zzzz: 'Z',
    Z: 'ZZ',
    X: 'ZZ',
    XX: 'ZZ',
    XXX: 'Z',
    u: 'E'
  };

constructor() { }

  translateFormat(formatString:string, mapping:object) {
    var len = formatString.length;
    var i = 0;
    var startIndex = -1;
    var lastChar = null;
    var currentChar = "";
    var resultString = "";

    for (; i < len; i++) {
      currentChar = formatString.charAt(i);

      if (lastChar === null || lastChar !== currentChar) {
        // change detected
        resultString = this._appendMappedString(formatString, mapping, startIndex, i, resultString);

        startIndex = i;
      }

      lastChar = currentChar;
    }

    return this._appendMappedString(formatString, mapping, startIndex, i, resultString);
  }

 _appendMappedString (formatString:string, mapping:any, startIndex:number, currentIndex:number, resultString:string) {
   if (startIndex !== -1) {
     var tempString = formatString.substring(startIndex, currentIndex);

     // check if the temporary string has a known mapping
     if (mapping[tempString]) {
       tempString = mapping[tempString];
     }

     resultString += tempString;
   }

   return resultString;
 }
 
toMomentFormatString(formatString:any) {
  if (!this.javaDateFormats[formatString]) {
    var mapped = "";
    var regexp = /[^']+|('[^']*')/g;
    var part:any = '';

    while ((part = regexp.exec(formatString))) {
      part = part[0];

      if (part.match(/'(.*?)'/)) {
        mapped += "[" + part.substring(1, part.length - 1) + "]";
      } else {
        mapped += this.translateFormat(part, this.javaFormatMapping);
      }
    }

    this.javaDateFormats[formatString] = mapped;
  }

  return this.javaDateFormats[formatString];
  };

}

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'fileSize'})
export class FileSizeFormatPipe implements PipeTransform {
    transform(bytes: any) {
        if (bytes == 0 || !bytes) return '0 Bytes';
        const k = 1024;
        const dm = 2 < 0 ? 0 : 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      }
}

import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";


@Pipe({name: 'textSearchPipe'})
export class TextSearchPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if(!value)return null;
        if(!args)return value;
        args = args.toLowerCase();
        return value.filter(function(item:any){
            return JSON.stringify(item).toLowerCase().includes(args);
        });
    }
}
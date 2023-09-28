import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDateFormatPipe, DateTimeUTCFormatPipe } from './date.pipe';
import { FileSizeFormatPipe } from './sizeFormat.pipe';
import { DateTimeFormatPipe } from './dateTimeFormat.pipe';
import { TextSearchPipe } from './search.pipe';
import { RoundToDecimalPipe } from './roundToDecimal.pipe'

@NgModule({
  declarations: [	CustomDateFormatPipe,
    FileSizeFormatPipe,
      DateTimeFormatPipe,
      TextSearchPipe,
      RoundToDecimalPipe,
      DateTimeUTCFormatPipe
   ],
  imports: [
    CommonModule,
  ],
  exports: [CustomDateFormatPipe,
    DateTimeFormatPipe,
    FileSizeFormatPipe,
    TextSearchPipe,
    RoundToDecimalPipe,
    DateTimeUTCFormatPipe
  ]
})
export class PipesModule { }

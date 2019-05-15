import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService extends MatPaginatorIntl {
  constructor() {
    super();
    this.translateLabels();
  }

  getRangeLabel = function (page, pageSize, length) {
    const of = 'de';
    if (length === 0 || pageSize === 0) {
      return '0 ' + of + ' ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' ' + of + ' ' + length;
  };

  translateLabels() {
    this.itemsPerPageLabel = 'Elementos por página';
    this.nextPageLabel = 'Siguiente';
    this.previousPageLabel = 'Anterior';

    this.changes.next();
  }
}

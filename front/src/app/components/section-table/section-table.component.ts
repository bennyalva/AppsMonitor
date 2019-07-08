import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-section-table',
  templateUrl: './section-table.component.html',
  styleUrls: ['./section-table.component.css']
})
export class SectionTableComponent implements OnInit {
  @Input() items: any[] = [];
  @Output() addItem = new EventEmitter();
  @Output() editItem = new EventEmitter();
  @Output() deleteItem = new EventEmitter();

  displayedColumns = ['name', 'actions'];

  constructor(private _router: Router) { }

  ngOnInit() {

  }

  add(element?) {
    this.addItem.emit(element);
  }

  delete(element) {
    this.deleteItem.emit(element);
  }
}

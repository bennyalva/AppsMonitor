import { Component, OnInit, Injectable, Input } from '@angular/core';
import { Client } from 'src/app/model/rest.model';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
})
export class TreeComponent implements OnInit {
  @Input() clients: Client[];

  constructor() {
  }

  ngOnInit() {

  }
}

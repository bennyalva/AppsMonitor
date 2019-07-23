import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { AffectedClient } from 'src/app/model/rest.model';

interface Node {
  name: string;
  level: number;
  tooltip?: string;
  icon?: string;
  children?: Node[];
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
})
export class TreeComponent implements OnInit {
  @Input() clients: AffectedClient[];

  treeControl = new NestedTreeControl<Node>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Node>();

  hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;

  constructor() {
  }

  ngOnInit() {
    this.dataSource.data = this.clients.map(x => {
      return <Node>{
        name: x.client,
        level: 0,
        children: x.applications.map(y => {
          return <Node>{
            name: y.name,
            level: 1,
            children: y.events.map(e => {
              return {
                name: e.name,
                tooltip: e.status_response,
                icon: this.getIconForType(e.type),
                level: 2
              };
            })
          };
        })
      };
    });
  }

  getIconForType(type): string {
    switch (type) {
      case 'sites':
        return 'site';
      case 'databases':
        return 'database';
      case 'services':
        return 'service';
      case 'servicebus':
        return 'servicebus';
      default:
        return '';
    }
  }

  getNodeClass(node: Node) {
    switch (node.level) {
      case 1:
        return 'node-app';
      case 2:
        return 'node-cat';
      default:
        return '';
    }
  }
}

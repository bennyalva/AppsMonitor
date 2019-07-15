import { Component, OnInit, Input } from '@angular/core';
import { Client } from 'src/app/model/rest.model';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
import { Subject } from 'rxjs';

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
  clients = new Subject<Client[]>();

  treeControl = new NestedTreeControl<Node>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Node>();

  hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;

  constructor() {
  }

  ngOnInit() {
    this.clients.subscribe(cli => {
      if (cli) {
        this.dataSource.data = cli.filter(x => x.applications.map(y => y.events.length).reduce((a, b) => a + b, 0) > 0).map(x => {
          return <Node>{
            name: x._id.client,
            level: 0,
            children: x.applications.map(y => {
              return <Node>{
                name: y.application.application,
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

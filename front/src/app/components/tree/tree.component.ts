import { Component, OnInit, Input } from '@angular/core';
import { Client } from 'src/app/model/rest.model';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
import { Subject } from 'rxjs';

interface Node {
  name: string;
  level: number;
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
        this.dataSource.data = cli.map(x => {
          return <Node>{
            name: x._id.client,
            level: 0,
            children: x.applications.map(y => {
              return <Node>{
                name: y.application,
                level: 1,
                children: [
                  { name: 'Sitio', level: 2 },
                  { name: 'Base de datos', level: 2 },
                ]
              };
            })
          };
        });
        console.log(this.dataSource.data);
      }
    });
  }

  getNodeClass(node: Node) {
    console.log(node);
    switch (node.level) {
      case 1:
        return 'node-app';
      case 2:
        return 'node-cat';
      default:
        return '';
    }
  }

  getNodeTooltip(node: Node) {
    if (node.level === 2) {
      return 'ERROR';
    }
  }
}

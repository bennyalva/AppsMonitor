import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { DialogField, DialogFormComponent, FieldType } from 'src/app/components/dialog-form/dialog-form.component';
import { Client } from 'src/app/model/rest.model';
import { ConsumeService } from 'src/app/services/consume.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clientsData = new MatTableDataSource<Client>();
  clients: Client[] = [];
  resultsLength = 0;

  displayedColumns = ['name', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _dataService: DataService, private _consumeService: ConsumeService,
    private _router: Router, private _dialog: MatDialog) { }

  ngOnInit() {
    this._consumeService.getClientsApps().subscribe(x => {
      this.clients = x.data;
    });
  }

  add() {
    const title = 'Agregar apartado';
    const fields: DialogField[] = [
      {
        name: 'name',
        placeholder: 'Nombre',
        type: FieldType.input,
        validators: [Validators.required]
      }
    ];

    const dialogRef = this._dialog.open(DialogFormComponent, {
      panelClass: ['card-dialog'],
      width: '384px',
      data: {
        fields: fields,
        title: title
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this._router.navigate(['application'], {
          queryParams: {
            cli: value.name
          }
        });
      }
    });
  }
}

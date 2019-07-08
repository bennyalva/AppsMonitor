import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { DialogField, DialogFormComponent, FieldType } from 'src/app/components/dialog-form/dialog-form.component';
import { Client, Pagination } from 'src/app/model/rest.model';
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
    this._consumeService.getClients().subscribe(x => {
      this.clients = x.data;
    });
  }

  // setupPaginator() {
  //   this.paginator.pageSize = 10;

  //   this._dataService.setIsLoadingEvent(true);
  //   this.paginator.page
  //     .pipe(
  //       startWith({}),
  //       switchMap(() => {
  //         const pagination = new Pagination();
  //         pagination.page = this.paginator.pageIndex;
  //         pagination.items = this.paginator.pageSize;
  //         return this._consumeService.getClients(pagination);
  //       }),
  //       map(res => {
  //         this.resultsLength = res.data.total;
  //         return res.data.items;
  //       }),
  //       catchError((error) => {
  //         return throwError(error);
  //       })
  //     ).subscribe(data => {
  //       this.clientsData.data = data;
  //       this.clients = data;
  //       this._dataService.setIsLoadingEvent(false);
  //     }, err => {
  //       this._dataService.setIsLoadingEvent(false);
  //       this._dataService.setGeneralNotificationMessage(err);
  //     });
  // }

  // add(item?: any) {
  //   const title = item ? 'Editar cliente' : 'Agregar cliente';
  //   const fields: DialogField[] = [
  //     {
  //       name: 'name',
  //       placeholder: 'Nombre',
  //       type: FieldType.input,
  //       validators: [Validators.required]
  //     }
  //   ];

  //   const dialogRef = this._dialog.open(DialogFormComponent, {
  //     panelClass: ['card-dialog'],
  //     width: '384px',
  //     data: {
  //       fields: fields,
  //       title: title,
  //       item: item
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(value => {
  //     if (value) {
  //       const client = new Client();
  //       if (item) {
  //         client._id = item._id;
  //         client.name = value.name;
  //       } else {
  //         client.name = value.name;
  //       }

  //       this._dataService.setIsLoadingEvent(true);
  //       this._consumeService.saveClient(client).subscribe(res => {
  //         this._dataService.setIsLoadingEvent(false);
  //         this._dataService.setGeneralNotificationMessage(res.message);
  //         this.paginator.page.emit();
  //       }, err => {
  //         this._dataService.setIsLoadingEvent(false);
  //         this._dataService.setGeneralNotificationMessage(err);
  //       });
  //     }
  //   });
  // }

  // delete(element: Client) {
  //   this._dataService.setIsLoadingEvent(true);
  //   this._consumeService.deleteClient(element._id.$oid).subscribe(res => {
  //     this._dataService.setIsLoadingEvent(false);
  //     this._dataService.setGeneralNotificationMessage(res.message);
  //     this.paginator.page.emit();
  //   }, err => {
  //     this._dataService.setIsLoadingEvent(false);
  //     this._dataService.setGeneralNotificationMessage(err);
  //   });
  // }
}

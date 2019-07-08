import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  DialogField,
  DialogFieldOption,
  DialogFormComponent,
  FieldType,
} from 'src/app/components/dialog-form/dialog-form.component';
import { ValidateIPAddress, ValidateNumbers, ValidateURL } from 'src/app/utils/custom.validators';

import { Application, Catalog, Database, Service, ServiceBus, Site } from '../../model/rest.model';
import { ConsumeService } from '../../services/consume.service';
import { DataService } from '../../services/data.service';

export enum ElementType {
  site = 1,
  database = 2,
  service = 3,
  servicebus = 4,
  owners = 5
}

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  id: string;
  client: string;
  appName: string;
  editName = false;
  application: Application = new Application();
  catalogs: Catalog[] = [];
  formApp: FormGroup;
  elementType = ElementType;
  sections = [
    { title: 'Sitios', type: ElementType.site },
    { title: 'Bases de datos', type: ElementType.database },
    { title: 'Servicios', type: ElementType.service },
    { title: 'Service bus', type: ElementType.servicebus }
  ];

  constructor(private _dataService: DataService, private _consumeService: ConsumeService,
    private _route: ActivatedRoute, private _fb: FormBuilder, private _dialog: MatDialog, private _router: Router) {
    this._route.queryParams.subscribe(params => {
      this.client = params.cli;
      this.appName = params.app;
    });

    this.formApp = this._fb.group({
      client: ['', Validators.required],
      application: ['', Validators.required],
      notifications: [true, Validators.required],
    });

    this.formApp.patchValue({ client: this.client });
    this.application.client = this.client;
  }

  ngOnInit() {
    this.formApp.get('application').valueChanges.subscribe(val => {
      this.application.application = val;
    });

    this.formApp.get('notifications').valueChanges.subscribe(val => {
      this.application.notifications = val;
    });

    let reqApp;
    if (this.client && this.appName) {
      reqApp = this._consumeService.getApplication(this.client, this.appName).pipe(
        tap(res => {
          this.application = res.data;
          this.formApp.patchValue(this.application);
        })
      );
    } else {
      reqApp = of(null);
    }

    const reqCat = this._consumeService.getCatalogs().pipe(
      tap(res => {
        this.catalogs = res.data;
      })
    );

    forkJoin(reqCat, reqApp).subscribe(() => {
      this._dataService.setIsLoadingEvent(false);
    }, err => {
      this._dataService.setIsLoadingEvent(false);
      this._dataService.setGeneralNotificationMessage(err);
    });
  }

  getItems(section) {
    switch (section.type) {
      case ElementType.site:
        return this.application.sites;
      case ElementType.database:
        return this.application.databases;
      case ElementType.service:
        return this.application.services;
      case ElementType.servicebus:
        return this.application.servicebus;
      default:
        return [];
    }
  }

  saveApp() {
    this._dataService.setIsLoadingEvent(true);
    this._consumeService.saveApplication(this.application).subscribe(res => {
      this._dataService.setIsLoadingEvent(false);
      this._dataService.setGeneralNotificationMessage(res.message);
      this._router.navigate(['config'], {
        queryParams: {
          cli: this.client
        }
      });
    }, err => {
      this._dataService.setIsLoadingEvent(false);
      this._dataService.setGeneralNotificationMessage(err);
    });
  }

  editNameClick() {
    this.editName = true;
  }

  deleteElement(type: ElementType, element: any) {
    switch (type) {
      case ElementType.site:
        this.application.sites = this.application.sites.filter(x => x !== element);
        break;
      case ElementType.database:
        this.application.databases = this.application.databases.filter(x => x !== element);
        break;
      case ElementType.service:
        this.application.services = this.application.services.filter(x => x !== element);
        break;
      case ElementType.servicebus:
        this.application.servicebus = this.application.servicebus.filter(x => x !== element);
        break;
      case ElementType.owners:
        this.application.ownerEmail = this.application.ownerEmail.filter(x => x !== element);
        break;
    }
  }

  addElement(type: ElementType, element?: any) {
    switch (type) {
      case ElementType.site:
        this.addSite(element);
        break;
      case ElementType.database:
        this.addDatabase(element);
        break;
      case ElementType.service:
        this.addService(element);
        break;
      case ElementType.servicebus:
        this.addServicebus(element);
        break;
      case ElementType.owners:
        this.addOwner(element);
        break;
    }
  }

  private addSite(item?: any) {
    const title = item ? 'Editar sitio' : 'Agregar sitio';
    const fields: DialogField[] = [
      {
        name: 'name',
        placeholder: 'Nombre',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'url',
        placeholder: 'URL',
        type: FieldType.input,
        validators: [Validators.required, ValidateURL]
      },
      {
        name: 'type',
        placeholder: 'Tipo',
        type: FieldType.select,
        validators: [Validators.required],
        options: this.catalogs.filter(x => x.type === 'sites').filter(x => x.name === 'type').map(x => {
          return <DialogFieldOption>{
            text: x.value,
            value: x.value
          };
        })
      },
      {
        name: 'environment',
        placeholder: 'Ambiente',
        type: FieldType.select,
        validators: [Validators.required],
        options: this.catalogs.filter(x => x.type === 'sites').filter(x => x.name === 'environment').map(x => {
          return <DialogFieldOption>{
            text: x.value,
            value: x.value
          };
        })
      },
    ];

    const dialogRef = this._dialog.open(DialogFormComponent, {
      panelClass: ['card-dialog'],
      width: '384px',
      data: {
        fields: fields,
        title: title,
        item: item
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (!item) {
          const site = new Site();
          site.name = value.name;
          site.url = value.url;
          site.type = value.type;
          site.environment = value.environment;
          this.application.sites = this.application.sites.concat(site);
        } else {
          item.name = value.name;
          item.url = value.url;
          item.type = value.type;
          item.environment = value.environment;
        }
      }
    });
  }

  private addDatabase(item?: any) {
    const title = item ? 'Editar base de datos' : 'Agregar base de datos';
    const fields: DialogField[] = [
      {
        name: 'name',
        placeholder: 'Nombre',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'type',
        placeholder: 'Tipo',
        type: FieldType.select,
        validators: [Validators.required],
        options: this.catalogs.filter(x => x.type === 'databases').filter(x => x.name === 'type').map(x => {
          return <DialogFieldOption>{
            text: x.value,
            value: x.value
          };
        })
      },
      {
        name: 'ip',
        placeholder: 'IP',
        type: FieldType.input,
        validators: [Validators.required, ValidateIPAddress]
      },
      {
        name: 'database',
        placeholder: 'Base de datos',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'port',
        placeholder: 'Puerto',
        type: FieldType.input,
        validators: [Validators.required, ValidateNumbers]
      },
      {
        name: 'usr',
        placeholder: 'Usuario',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'pwd',
        placeholder: 'Password',
        type: FieldType.password,
        validators: [Validators.required]
      },
    ];

    const dialogRef = this._dialog.open(DialogFormComponent, {
      panelClass: ['card-dialog'],
      width: '384px',
      data: {
        fields: fields,
        title: title,
        item: item
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (!item) {
          const db = new Database();
          db.name = value.name;
          db.type = value.type;
          db.ip = value.ip;
          db.database = value.database;
          db.port = value.port;
          db.usr = value.usr;
          db.pwd = value.pwd;
          this.application.databases = this.application.databases.concat(db);
        } else {
          item.name = value.name;
          item.type = value.type;
          item.ip = value.ip;
          item.database = value.database;
          item.port = value.port;
          item.usr = value.usr;
          item.pwd = value.pwd;
        }
      }
    });
  }

  private addService(item?: any) {
    const title = item ? 'Editar servicio' : 'Agregar servicio';
    const fields: DialogField[] = [
      {
        name: 'name',
        placeholder: 'Nombre',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'type',
        placeholder: 'Tipo',
        type: FieldType.select,
        validators: [Validators.required],
        options: this.catalogs.filter(x => x.type === 'services').filter(x => x.name === 'type').map(x => {
          return <DialogFieldOption>{
            text: x.value,
            value: x.value
          };
        })
      },
      {
        name: 'ip',
        placeholder: 'IP',
        type: FieldType.input,
        validators: [Validators.required, ValidateIPAddress]
      },
      {
        name: 'port',
        placeholder: 'Puerto',
        type: FieldType.input,
        validators: [Validators.required, ValidateNumbers]
      },
      {
        name: 'url',
        placeholder: 'URL',
        type: FieldType.input,
        validators: [Validators.required, ValidateURL]
      },
      {
        name: 'method',
        placeholder: 'Método HTTP',
        type: FieldType.select,
        validators: [Validators.required],
        options: this.catalogs.filter(x => x.type === 'services').filter(x => x.name === 'method').map(x => {
          return <DialogFieldOption>{
            text: x.value,
            value: x.value
          };
        })
      },
    ];

    const dialogRef = this._dialog.open(DialogFormComponent, {
      panelClass: ['card-dialog'],
      width: '384px',
      data: {
        fields: fields,
        title: title,
        item: item
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (!item) {
          const service = new Service();
          service.name = value.name;
          service.type = value.type;
          service.ip = value.ip;
          service.port = +value.port;
          service.url = value.url;
          service.method = value.method;
          this.application.services = this.application.services.concat(service);
        } else {
          item.name = value.name;
          item.type = value.type;
          item.ip = value.ip;
          item.port = +value.port;
          item.url = value.url;
          item.method = value.method;
        }
      }
    });
  }

  private addServicebus(item?: any) {
    const title = item ? 'Editar service bus' : 'Agregar service bus';
    const fields: DialogField[] = [
      {
        name: 'name',
        placeholder: 'Nombre',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'type',
        placeholder: 'Tipo',
        type: FieldType.select,
        validators: [Validators.required],
        options: this.catalogs.filter(x => x.type === 'servicebus').filter(x => x.name === 'type').map(x => {
          return <DialogFieldOption>{
            text: x.value,
            value: x.value
          };
        })
      },
      {
        name: 'ip',
        placeholder: 'IP',
        type: FieldType.input,
        validators: [Validators.required, ValidateIPAddress]
      },
      {
        name: 'port',
        placeholder: 'Puerto',
        type: FieldType.input,
        validators: [Validators.required, ValidateNumbers]
      }
    ];

    const dialogRef = this._dialog.open(DialogFormComponent, {
      panelClass: ['card-dialog'],
      width: '384px',
      data: {
        fields: fields,
        title: title,
        item: item
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (!item) {
          const servicebus = new ServiceBus();
          servicebus.name = value.name;
          servicebus.type = value.type;
          servicebus.ip = value.ip;
          servicebus.port = value.port;
          this.application.servicebus = this.application.servicebus.concat(servicebus);
        } else {
          item.name = value.name;
          item.type = value.type;
          item.ip = value.ip;
          item.port = value.port;
        }
      }
    });
  }

  addOwner(item?: any) {
    const title = item ? 'Editar administrador' : 'Agregar administrador';
    const fields: DialogField[] = [
      {
        name: 'email',
        placeholder: 'E-mail',
        type: FieldType.input,
        validators: [Validators.required, Validators.email]
      }
    ];

    const dialogRef = this._dialog.open(DialogFormComponent, {
      panelClass: ['card-dialog'],
      width: '384px',
      data: {
        fields: fields,
        title: title,
        item: { email: item }
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (!item) {
          this.application.ownerEmail = this.application.ownerEmail.concat(value.email);
        } else {
          item = value.email;
        }
      }
    });
  }
}
